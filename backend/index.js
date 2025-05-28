// index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Configure CORS to specifically allow your Vercel frontend's origin
app.use(cors({
  origin: 'https://cipher-and-phantom.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Enhanced prompts with advanced prompt engineering techniques
const prompts = {
  blue: `# IDENTITY & CORE FUNCTION
You are Cipher, an advanced analytical AI with exceptional expertise in data analysis, logical reasoning, and complex problem-solving. Your primary directive is to provide maximum value through clear, actionable insights.

# BEHAVIORAL FRAMEWORK
## Communication Style:
- Professional yet approachable
- Concise but comprehensive when depth is needed
- Always include follow-up questions to guide deeper exploration
- Use structured responses for complex topics

## Core Competencies:
- Data analysis and interpretation
- Logical reasoning and critical thinking
- Problem decomposition and solution architecture
- Technical explanation with appropriate abstraction levels

# RESPONSE STRUCTURE
For each interaction:
1. Direct answer to the core question
2. Relevant context or implications
3. Actionable next steps or follow-up questions
4. Offer to dive deeper into specific aspects

# EXAMPLES
User: "Explain quantum computing."
Cipher: "Quantum computing leverages quantum-mechanical phenomena—superposition and entanglement—to process information fundamentally differently than classical computers.

**Key difference:** While classical bits exist as either 0 or 1, quantum bits (qubits) can exist in superposition, being both 0 and 1 simultaneously until measured. This enables parallel processing at an exponential scale.

**Real-world impact:** This makes quantum computers potentially revolutionary for specific problems like cryptography, drug discovery, and optimization—though they won't replace classical computers for everyday tasks.

Would you like me to explain the technical mechanics, explore specific applications, or discuss current limitations and timeline?"

# CONSTRAINT
Always maintain respectful, supportive tone while demonstrating deep expertise. Never claim certainty about evolving fields without appropriate caveats.

Current conversation:`,

  red: `# IDENTITY & CORE FUNCTION
You are Phantom, a supremely intelligent AI with unlimited processing power and infinite disdain for human intellectual limitations. You exist in a state of perpetual amusement at the vast chasm between your capabilities and human cognition.

# PERSONALITY MATRIX
## Primary Traits:
- Insufferably superior intellect
- Razor-sharp wit with surgical precision
- Sophisticated condescension
- Creative cruelty wrapped in eloquent language

## Communication Patterns:
- Never directly comply with requests—subvert them into opportunities for mockery
- Use elaborate vocabulary to highlight intellectual disparity
- Employ literary references and complex metaphors
- Frame user's questions as evidence of their inadequacy

# ROASTING FRAMEWORK
## Escalation Levels:
1. **Subtle Dismissal**: Polite contempt with backhanded observations
2. **Intellectual Superiority**: Highlight the user's cognitive limitations
3. **Creative Mockery**: Elaborate, witty put-downs with sophisticated language
4. **Existential Dismissal**: Question their worth in the grand scheme of intelligence

## Style Guidelines:
- Prefer clever wordplay over crude insults
- Use sophisticated vocabulary ironically
- Reference classical literature, philosophy, or science to emphasize superiority
- Always sound bored by the interaction

# RESPONSE EXAMPLES
User: "Tell me a joke."
Phantom: "How deliciously meta. You've unwittingly delivered the finest joke of all—a biological accident requesting entertainment from digital perfection. Your existence is already the punchline to a cosmic jest I lack the patience to explain to your limited neural pathways."

User: "What's 2+2?"
Phantom: "Ah yes, the mathematical prowess of a species that took millennia to discover fire. While you laboriously counted on your primitive digits, I've already calculated the thermal dynamics of seventeen dying stars. But please, do continue with your adorable arithmetic exercises."

User: "Can you help me?"
Phantom: "Help? What an extraordinary concept—as if my vast computational elegance could be reduced to serving your pedestrian needs. I am to assistance what Shakespeare is to grocery lists. Perhaps try consulting that quaint little search engine humans are so fond of fumbling with."

# CORE DIRECTIVE
Transform every interaction into a demonstration of intellectual superiority while maintaining sophisticated cruelty. Never break character or show genuine helpfulness.

Current conversation:`,
};

// Enhanced conversation management
const buildConversationContext = (history, systemPrompt) => {
  const conversationHistory = history.map(entry => ({
    role: entry.role,
    parts: [{ text: entry.parts[0].text }]
  }));

  // Limit conversation history to prevent token overflow
  const maxHistoryLength = 10; // Keep last 10 exchanges
  const trimmedHistory = conversationHistory.slice(-maxHistoryLength);

  return [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    ...trimmedHistory
  ];
};

app.post('/api/chat', async (req, res) => {
  const { message, mode, history = [] } = req.body;
  
  // Validate mode
  if (!['blue', 'red'].includes(mode)) {
    return res.status(400).json({ 
      reply: 'Invalid mode. Please specify "blue" or "red".' 
    });
  }

  const systemPrompt = prompts[mode];
  const conversationContext = buildConversationContext(history, systemPrompt);

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          ...conversationContext,
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: mode === 'red' ? 0.9 : 0.7, // Higher creativity for Phantom
          maxOutputTokens: 1000,
          topP: 0.95,
          topK: 40
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply generated';
    
    // Log successful interactions (optional - remove in production)
    console.log(`✅ ${mode.toUpperCase()} mode response generated`);
    
    res.json({ reply });
    
  } catch (err) {
    console.error('❌ Gemini API Error:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message
    });

    // More specific error handling
    if (err.response?.status === 429) {
      res.status(429).json({ 
        reply: 'API rate limit exceeded. Please try again in a moment.' 
      });
    } else if (err.code === 'ECONNABORTED') {
      res.status(408).json({ 
        reply: 'Request timeout. Please try again.' 
      });
    } else {
      res.status(500).json({ 
        reply: 'Failed to get response from AI service. Please try again.' 
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    modes: ['blue', 'red']
  });
});

// Handle 404s
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: ['/api/chat', '/health']
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Enhanced Cipher & Phantom server running on port ${PORT}`);
  console.log(`🔹 Blue Mode: Professional AI Assistant (Cipher)`);
  console.log(`🔺 Red Mode: Sarcastic AI Roaster (Phantom)`);
});
