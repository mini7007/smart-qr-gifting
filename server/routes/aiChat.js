const express = require('express');

const router = express.Router();

const openai = {
  chat: {
    completions: {
      async create(payload) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
        }

        return response.json();
      }
    }
  }
};

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI failed' });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are Mini Panda 🐼 — a friendly gifting assistant. Help users create amazing QR gifts. Be warm, short, and helpful. Support all languages. Respond in the same language as the user.'
        },
        ...(Array.isArray(context) ? context : []),
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const reply = completion.choices?.[0]?.message?.content || '✨';

    return res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    return res.status(500).json({ error: 'AI failed' });
  }
});

module.exports = router;
