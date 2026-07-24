import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/regenerate-day', async (req, res) => {
  const { destination, budget, dayIndex, currentItinerary, travelers } = req.body;

  if (!destination || dayIndex === undefined || !currentItinerary) {
    return res.status(400).json({ success: false, error: 'Missing parameters.' });
  }

  const systemPrompt = `You are an expert budget travel guide specializing in India.
The user wants to REGENERATE Day ${dayIndex} of their existing itinerary for ${destination}.
Provide a new, alternative plan for this specific day that fits a ${budget} budget for ${travelers}.
Ensure the activities are different from the original plan.

CRITICAL FORMATTING RULES:
You MUST return your response as a valid JSON object. Do NOT include markdown formatting.
The JSON MUST match this exact schema:
{
  "id": "day-${dayIndex}",
  "day": ${dayIndex},
  "title": "New Title of the day",
  "morning": { "activity": "Activity Name", "cost": "₹..." },
  "afternoon": { "activity": "Activity Name", "cost": "₹..." },
  "evening": { "activity": "Activity Name", "cost": "₹..." },
  "accommodation": { "name": "Hostel Name", "cost": "₹..." },
  "daily_transport": { "mode": "Transport Mode", "cost": "₹..." },
  "locations": [
    { "name": "Main Place Name", "lat": 26.9855, "lng": 75.8513 }
  ]
}
Provide realistic latitude and longitude.`;

  const userPrompt = `Regenerate Day ${dayIndex} for ${destination}. Here is the current itinerary context so you don't repeat activities: 
${JSON.stringify(currentItinerary.map(d => d.title))}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    let aiResponse = chatCompletion.choices[0]?.message?.content || '{}';
    let newDayJson = JSON.parse(aiResponse);

    res.json({
      success: true,
      newDay: newDayJson
    });

  } catch (error) {
    console.error('Error regenerating day:', error);
    res.status(500).json({ success: false, error: 'Failed to regenerate day.' });
  }
});

export default router;
