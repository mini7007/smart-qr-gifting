const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const giftRoutes = require('./routes/giftRoutes');

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 8080;
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
  res.json({ status: 'ok' });
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
  console.error('[request] Unhandled error:', err);
  res.status(500).json({ error: message });
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
