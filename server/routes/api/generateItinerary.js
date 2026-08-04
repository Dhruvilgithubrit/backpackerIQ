import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/generate-itinerary', async (req, res) => {
  const { destination, budget, days, interests, travelers } = req.body;

  // Basic validation
  if (!destination || !budget || !days || !interests || !travelers) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: destination, budget, days, interests, and travelers are required.'
    });
  }

  const systemPrompt = `You are an expert budget travel guide specializing in India.
Generate a highly-structured, practical day-by-day itinerary for backpackers.

CRITICAL FORMATTING RULES:
You MUST return your response as a valid JSON object. Do NOT include any markdown formatting around the JSON (like \`\`\`json). Just the raw JSON object.
Include the summary only once. Do not repeat estimated budget labels, total cost lines, or budget breakdown text inside the day entries.

The JSON MUST match this exact schema:
{
  "how_to_reach": "Provide clear, budget-friendly options to reach the destination by Train, Bus, and Flight. Include estimated costs.",
  "summary": { "total_cost": "Total Estimated Cost as string", "breakdown": "Short breakdown string" },
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "itinerary": [
    {
      "id": "day-1",
      "day": 1,
      "title": "Title of the day",
      "morning": { "activity": "Activity Name", "cost": "₹..." },
      "afternoon": { "activity": "Activity Name", "cost": "₹..." },
      "evening": { "activity": "Activity Name", "cost": "₹..." },
      "accommodation": { "name": "Hostel Name", "cost": "₹..." },
      "daily_transport": { "mode": "Transport Mode", "cost": "₹..." },
      "locations": [
        { "name": "Main Place Name", "lat": 26.9855, "lng": 75.8513 }
      ]
    }
  ]
}

Provide realistic latitude and longitude for the locations (at least one main location per day). Keep the summary concise and singular.`;

  const userPrompt = `Generate a ${travelers}-traveler ${days}-day itinerary for ${destination} 
with a budget of ${budget}. Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}. 
Make it highly practical with actual place names, exact transport methods, and realistic costs. Output valid JSON.`;

  try {
    const groqCall = groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    // 55-second server-side timeout (client has 60s)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('GROQ_TIMEOUT')), 55000)
    );

    const chatCompletion = await Promise.race([groqCall, timeoutPromise]);

    let aiResponse = chatCompletion.choices[0]?.message?.content || '{}';
    let itineraryJson;
    try {
      itineraryJson = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed to parse JSON", aiResponse);
      itineraryJson = { error: "Failed to generate valid itinerary format." };
    }

    res.json({
      success: true,
      destination,
      budget,
      days,
      itinerary: itineraryJson,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Groq:', error);

    if (error?.message === 'GROQ_TIMEOUT') {
      return res.status(504).json({
        success: false,
        error: 'AI took too long to respond. Try fewer days or a simpler destination.'
      });
    }
    
    // Check for rate limiting
    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit reached, try again in 1 min'
      });
    }

    res.status(500).json({
      success: false,
      error: 'An error occurred while generating the itinerary. Please try again.'
    });
  }
});

export default router;
