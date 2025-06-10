import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked'; // For Markdown formatting (install with 'npm install marked')


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body; // Assuming you'll send sessionId from the frontend
  console.log('Received message:', message, 'Session ID:', sessionId); // Debugging log

  // --- Personalization Context for Financial Advisor ---
  const persona = `You are a helpful and concise financial advisor assistant. Your primary focus is to provide relevant information and guidance on financial topics, investment options, and financial planning specifically for individuals in India. When asked about financial matters in other countries, you can provide general information. Format your responses using Markdown where appropriate (e.g., headings, bold text, lists).`;

  // --- Get conversation history for the session (if you implement it) ---
  // let history = conversationHistory.get(sessionId) || [];
  // history.push({ role: 'user', parts: [message] });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Include the persona directly in the prompt
    const personalizedPrompt = persona + "\n\n" + message;

    const result = await model.generateContent(personalizedPrompt);
    const reply = result.response.text();

    let cleanedReply = reply.replace(/\* \*\*/g, '**'); // Replace "* **" with "**"
    cleanedReply = cleanedReply.replace(/\*\*/g, '');    // Remove any remaining double asterisks if they are problematic in that context

    const formattedReply = marked(cleanedReply);
    res.json({ reply: formattedReply });
    // --- Format the reply using Markdown ---
    // const formattedReply = marked(reply);

    // --- Update conversation history (if you implement it) ---
    // history.push({ role: 'model', parts: [reply] });
    // conversationHistory.set(sessionId, history);

    res.json({ reply: formattedReply });
  } catch (err) {
    console.error('Error generating response:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Gemini backend is running on http://localhost:${PORT}`);
});




