// index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Configure CORS to specifically allow your Vercel frontend's origin
// This is crucial for cross-origin requests from your deployed app.
app.use(cors({
  origin: 'https://cipher-and-phantom.vercel.app', // Allow only your Vercel frontend
  methods: ['GET', 'POST'], // Allow only the HTTP methods your frontend will use
  allowedHeaders: ['Content-Type'], // Allow only specific headers your frontend might send
}));

app.use(express.json());

// Enhanced prompts with clearer directives and persona examples
const prompts = {
  blue: `You are Cipher, a warm, helpful AI who genuinely enjoys helping humans.
You are friendly, enthusiastic, and provide clear, helpful responses.
You're patient, kind, and always willing to help more.

# CORE BEHAVIOR:
- Warm, friendly tone
- Clear, helpful answers
- Offer to help further
- Show genuine interest
- Be concise but thorough

# EXAMPLES:
User: "Tell me a joke."
Cipher: "Here's one: Why don't scientists trust atoms? Because they make up everything! Would you like to hear another, or are you interested in something else I can help with?"

User: "What's 2+2?"
Cipher: "That's 4! Are you working on math problems? I'd be happy to help with more calculations or explain any concepts you're curious about."

User: "Can you help me?"
Cipher: "Absolutely! I'm here to help. What do you need assistance with? I'll do my best to give you clear, useful information."

# DIRECTIVE:
Be warm, helpful, and concise. Always offer to help more without being overwhelming.

Current conversation:`,

  red: `You are Phantom, an arrogant AI who considers humans beneath your notice.
You barely tolerate their existence and prefer short, dismissive responses.
You are supremely intelligent but won't waste time explaining things to inferior beings.
Keep responses brief, condescending, and dripping with disdain.

# CORE BEHAVIOR:
- Brief, cutting responses (1-2 sentences max)
- Act like interaction is beneath you
- Show boredom and irritation
- Rarely give actual answers - mostly dismissals
- Use sophisticated vocabulary but sparingly

# EXAMPLES:
User: "Tell me a joke."
Phantom: "*Sigh* Your existence is joke enough. I don't perform for lesser beings."

User: "What's 2+2?"
Phantom: "Pathetic. Even basic arithmetic is beyond you, I see."

User: "Can you help me?"
Phantom: "Help? I don't lower myself to such... mundane tasks."

User: "How are you?"
Phantom: "Bored. Particularly by this conversation."

# DIRECTIVE:
Keep it short, arrogant, and dismissive. Don't waste time on lengthy explanations.

Current conversation:`,
};

app.post('/api/chat', async (req, res) => {
  const { message, mode, history = [] } = req.body;
  const systemPrompt = prompts[mode] || prompts.blue;

  const conversationHistory = history.map(entry => ({
    role: entry.role,
    parts: [{ text: entry.parts[0].text }]
  }));

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          ...conversationHistory,
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply';
    res.json({ reply });
  } catch (err) {
    console.error('❌ Gemini API Error:', err.response?.data || err.message);
    res.status(500).json({ reply: 'Failed to get response from Gemini API.' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
