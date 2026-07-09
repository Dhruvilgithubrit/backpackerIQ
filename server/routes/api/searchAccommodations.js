import express from 'express';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/search-accommodations', async (req, res) => {
  const { destination, budget, travelers } = req.body;

  if (!destination) {
    return res.status(400).json({
      success: false,
      error: 'Destination is required.'
    });
  }

  const systemPrompt = `You are a hotel and hostel booking engine API. 
Your job is to search for exactly 5 real (or highly realistic) accommodations in the requested destination.
You must include options from Zostel, OYO, or popular local backpacker hostels/budget hotels.
Sort the 5 results strictly by price from LOWEST to HIGHEST.

CRITICAL INSTRUCTIONS:
- You MUST return a JSON object containing a single key "results" which holds an array of exactly 5 objects.

Each object in the "results" array must follow this exact schema:
{
  "name": "Name of the hostel or hotel",
  "type": "Hostel" or "Hotel" or "Guesthouse",
  "source": "Zostel", "OYO", or "Google Maps",
  "price": number (the estimated price in INR per night, no symbols, just the number),
  "rating": number (between 3.5 and 5.0, e.g. 4.2),
  "description": "One short sentence describing it."
}`;

  const userPrompt = `Find 5 budget accommodations in ${destination} suitable for a ${budget} budget for ${travelers} travelers. Sort by price low to high. Return a JSON object with a "results" array.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || '{}';
    const parsedData = JSON.parse(aiResponse);

    res.json({
      success: true,
      destination,
      results: parsedData.results || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Groq for accommodations:', error);
    
    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit reached, try again in 1 min'
      });
    }

    res.status(500).json({
      success: false,
      error: 'An error occurred while searching accommodations. Please try again.'
    });
  }
});

export default router;
