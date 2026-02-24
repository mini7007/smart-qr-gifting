const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const giftRoutes = require('./routes/giftRoutes');
const Gift = require('./models/Gift');
const { buildGiftLookupQuery } = require('./controllers/giftController');

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

let mongoReady = false;

/* -------------------- Ensure uploads dir -------------------- */
function ensureUploadsDir() {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('[boot] uploads directory created');
    }
  } catch (err) {
    console.error('[boot] Failed to create uploads directory:', err);
  }
}

function escapeHtml(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderGiftPage({ message, videoUrl, audioUrl, imageUrl, gifUrl }) {
  const safeMessage = escapeHtml(message);
  const hasVideo = typeof videoUrl === 'string' && videoUrl.trim().length > 0;
  const hasAudio = typeof audioUrl === 'string' && audioUrl.trim().length > 0;
  const hasImage = typeof imageUrl === 'string' && imageUrl.trim().length > 0;
  const hasGif = typeof gifUrl === 'string' && gifUrl.trim().length > 0;

  const safeVideoUrl = hasVideo ? encodeURI(videoUrl) : '';
  const safeAudioUrl = hasAudio ? encodeURI(audioUrl) : '';
  const safeImageUrl = hasImage ? encodeURI(imageUrl) : '';
  const safeGifUrl = hasGif ? encodeURI(gifUrl) : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Gift</title>
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #f9f5ff, #f0f9ff);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        color: #1f2937;
      }

      .card {
        width: 100%;
        max-width: 560px;
        background: #ffffff;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
      }

      h1 {
        margin: 0 0 16px;
        font-size: clamp(1.4rem, 2.4vw, 2rem);
        text-align: center;
      }

      .message {
        margin: 0;
        padding: 16px;
        border-radius: 14px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        line-height: 1.6;
        white-space: pre-wrap;
        text-align: center;
      }

      .video-wrap {
        margin-top: 20px;
      }

      video {
        width: 100%;
        max-height: 420px;
        border-radius: 14px;
        background: #000;
      }

      img, audio {
        width: 100%;
        margin-top: 20px;
        border-radius: 14px;
      }

      @media (max-width: 480px) {
        .card {
          padding: 18px;
          border-radius: 16px;
        }

        .message {
          font-size: 0.96rem;
        }
      }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Your Gift</h1>
      <p class="message">${safeMessage}</p>
      ${hasImage ? `<img alt="Gift image" loading="lazy" src="${safeImageUrl}" />` : ''}
      ${hasGif ? `<img alt="Gift GIF" loading="lazy" src="${safeGifUrl}" />` : ''}
      ${hasVideo ? `<div class="video-wrap"><video controls playsinline preload="metadata" src="${safeVideoUrl}"></video></div>` : ''}
      ${hasAudio ? `<audio controls preload="metadata" src="${safeAudioUrl}"></audio>` : ''}
    </main>
  </body>
</html>`;
}

function renderNotFoundPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gift Not Found</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f8fafc;
        color: #334155;
        padding: 20px;
      }
      .notice {
        max-width: 420px;
        width: 100%;
        text-align: center;
        background: #fff;
        border-radius: 16px;
        padding: 24px;
        border: 1px solid #e2e8f0;
      }
      h1 {
        margin-top: 0;
      }
    </style>
  </head>
  <body>
    <section class="notice">
      <h1>404 - Gift Not Found</h1>
      <p>The gift link may be invalid or expired.</p>
    </section>
  </body>
</html>`;
}

/* -------------------- Global process safety -------------------- */
process.on('unhandledRejection', (reason) => {
  console.error('[boot] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[boot] Uncaught exception:', error);
});

/* -------------------- Request logger -------------------- */
app.use((req, res, next) => {
  console.log(`[req] ${req.method} ${req.url}`);
  next();
});

/* -------------------- CORS (Railway + Vercel safe) -------------------- */
app.use(
  cors({
    origin: [
      'https://smart-qr-gifting.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// handle preflight properly
app.options('*', cors());

/* -------------------- Body parsers -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- Static uploads -------------------- */
ensureUploadsDir();
app.use('/uploads', express.static(uploadsDir));

/* -------------------- Health check -------------------- */
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* -------------------- Gift view page -------------------- */
app.get('/gift/:publicId', async (req, res) => {
  try {
    if (!mongoReady) {
      return res.status(503).type('html').send(`<!doctype html><html><body><h1>Service temporarily unavailable</h1><p>Please try again shortly.</p></body></html>`);
    }

    const { publicId } = req.params;
    const gift = await Gift.findOne(buildGiftLookupQuery(publicId)).lean();

    if (!gift) {
      return res.status(404).type('html').send(renderNotFoundPage());
    }

    return res.status(200).type('html').send(
      renderGiftPage({
        message: gift.message,
        videoUrl: gift.videoUrl,
        audioUrl: gift.audioUrl,
        imageUrl: gift.imageUrl,
        gifUrl: gift.gifUrl
      })
    );
  } catch (error) {
    console.error('[gift] Failed to render gift page:', error);
    return res.status(404).type('html').send(renderNotFoundPage());
  }
});

/* -------------------- Mongo guard -------------------- */
app.use('/api/gifts', (req, res, next) => {
  if (!mongoReady) {
    return res
      .status(503)
      .json({ error: 'Database is not connected yet. Please retry shortly.' });
  }
  next();
});

app.use('/api/gifts', giftRoutes);

/* -------------------- Error handler -------------------- */
app.use((err, _req, res, _next) => {
  const message = err?.message || 'Unexpected server error';
  const isClientUploadError = err?.name === 'MulterError' || message.toLowerCase().includes('unsupported file type');
  const statusCode = isClientUploadError ? 400 : 500;

  console.error('[request] Unhandled error:', err);
  res.status(statusCode).json({ error: message });
});

/* -------------------- Mongo events -------------------- */
mongoose.connection.on('connected', () => {
  mongoReady = true;
  console.log('[mongo] Connected');
});

mongoose.connection.on('disconnected', () => {
  mongoReady = false;
  console.warn('[mongo] Disconnected');
});

mongoose.connection.on('error', (error) => {
  mongoReady = false;
  console.error('[mongo] Connection error:', error.message);
});

/* -------------------- Start server -------------------- */
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('[boot] MONGODB_URI is not set');
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  } catch (error) {
    console.error('[boot] Mongo connection failed:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`[boot] Server running on port ${PORT}`);
  });
}

startServer();
