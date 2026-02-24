const express = require('express');

const router = express.Router();

async function createChatCompletion(message) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY || ''}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are Mini Panda 🐼, a cute but smart gift assistant. Help users write messages, generate ideas, and be friendly. Support all languages. Reply in the same language as the user.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI failed' });
    }

    const completion = await createChatCompletion(message);
    const reply = completion.choices?.[0]?.message?.content || '✨';

    return res.json({ reply });
  } catch (err) {
    console.error('AI ERROR:', err);
    return res.status(500).json({ error: 'AI failed' });
  }
});

module.exports = router;
