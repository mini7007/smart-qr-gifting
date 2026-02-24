const crypto = require('crypto');
const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const MAX_REQUESTS_PER_SESSION = 3;
const SESSION_COOKIE_NAME = 'smartqr_ai_sid';
const sessionUsage = new Map();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, chunk) => {
      const [key, ...rest] = chunk.split('=');
      if (!key) return acc;
      acc[key] = decodeURIComponent(rest.join('='));
      return acc;
    }, {});
}

function getSessionId(req, res) {
  const cookies = parseCookies(req.headers.cookie || '');
  const existing = cookies[SESSION_COOKIE_NAME];

  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomBytes(16).toString('hex');
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${sessionId}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=86400'
  ];

  if (isSecure) {
    cookieParts.push('Secure');
  }

  res.append('Set-Cookie', cookieParts.join('; '));
  return sessionId;
}

function enforceAiSessionLimit(req, res, next) {
  const sessionId = getSessionId(req, res);
  const used = sessionUsage.get(sessionId) || 0;

  if (used >= MAX_REQUESTS_PER_SESSION) {
    return res.status(429).json({
      error: 'AI session limit reached. Please try again later.',
      triesUsed: used,
      triesLeft: 0
    });
  }

  req.aiSessionId = sessionId;
  req.aiTriesUsed = used;
  return next();
}

function trackUsage(sessionId) {
  const used = sessionUsage.get(sessionId) || 0;
  const nextValue = used + 1;
  sessionUsage.set(sessionId, nextValue);
  return nextValue;
}

function ensureOpenAI(res) {
  if (openai) {
    return true;
  }

  res.status(503).json({ error: 'AI service is not configured.' });
  return false;
}

router.use(enforceAiSessionLimit);


router.post('/generate-message', async (req, res) => {
  if (!ensureOpenAI(res)) return;

  try {
    const { message, theme } = req.body || {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required.' });
    }

    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: 'Improve gift messages. Keep the original language and script. Return one polished heartfelt message with concise wording.'
            }
          ]
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: `Theme: ${theme || 'default'}\nDraft: ${message.trim()}` }]
        }
      ]
    });

    const triesUsed = trackUsage(req.aiSessionId);
    return res.status(200).json({
      message: (response.output_text || '').trim(),
      triesUsed,
      triesLeft: Math.max(0, MAX_REQUESTS_PER_SESSION - triesUsed)
    });
  } catch (error) {
    console.error('[ai/generate-message] Failed:', error);
    return res.status(500).json({ error: 'Unable to generate message right now.' });
  }
});

router.post('/generate-image', async (req, res) => {
  if (!ensureOpenAI(res)) return;

  try {
    const { prompt, theme } = req.body || {};
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'prompt is required.' });
    }

    const imageResponse = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: `Gift theme: ${theme || 'default'}. ${prompt.trim()}`,
      size: '1024x1024'
    });

    const firstImage = imageResponse.data?.[0] || {};
    const triesUsed = trackUsage(req.aiSessionId);

    return res.status(200).json({
      imageUrl: firstImage.url || null,
      imageBase64: firstImage.b64_json || null,
      triesUsed,
      triesLeft: Math.max(0, MAX_REQUESTS_PER_SESSION - triesUsed)
    });
  } catch (error) {
    console.error('[ai/generate-image] Failed:', error);
    return res.status(500).json({ error: 'Unable to generate image right now.' });
  }
});

module.exports = router;
