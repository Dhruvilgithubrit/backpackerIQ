import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination, budget, days, interests, travelers } = req.body;

  if (!destination || !budget || !days || !interests || !travelers) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: destination, budget, days, interests, and travelers are required.'
    });
  }

  const systemPrompt = `You are an expert budget travel guide specializing in India.
Generate a highly-structured, practical day-by-day itinerary for backpackers.

CRITICAL FORMATTING RULES:
You MUST follow this exact structure, with these exact headings. Do not deviate.
Only include the budget summary once. Do not repeat budget totals, estimated budget labels, or TOTAL ESTIMATE wording in the itinerary days.

### How to Reach
Provide clear, budget-friendly options to reach the destination by Train, Bus, and Flight. Include estimated costs.

### Itinerary
DAY 1: [Title of Day]
- **Morning**: [Activity + Cost]
- **Afternoon**: [Activity + Cost]
- **Evening**: [Activity + Cost]
- **Accommodation**: [Name + Cost]
- **Daily Transport**: [Mode + Cost]

DAY 2: [Title of Day]
... (continue for the requested number of days)

### Summary
- **Total Estimated Cost**: [Amount]
- **Budget Breakdown**: [Short breakdown]

Keep the summary compact and singular. Do not duplicate the summary in any other section.

### 5 Travel Tips
1. [Tip]
... (list 5 practical tips)`;

  const userPrompt = `Generate a ${travelers}-traveler ${days}-day itinerary for ${destination} 
with a budget of ${budget}. Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}. 
Make it highly practical with actual place names, exact transport methods, and realistic costs.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      destination,
      budget,
      days,
      itinerary: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Groq:', error);
    if (error?.status === 429) {
      return res.status(429).json({ success: false, error: 'Rate limit reached, try again in 1 min' });
    }
    res.status(500).json({ success: false, error: 'An error occurred while generating the itinerary. Please try again.' });
  }
}
