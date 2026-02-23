const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const giftRoutes = require('./routes/giftRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

let mongoReady = false;

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('[boot] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[boot] Uncaught exception:', error);
});

app.use((req, res, next) => {
  console.log(`[req] ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

ensureUploadsDir();
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/gifts', (req, res, next) => {
  if (!mongoReady) {
    res.status(503).json({ error: 'Database is not connected yet. Please retry shortly.' });
    return;
  }

  next();
});
app.use('/api/gifts', giftRoutes);

app.use((err, _req, res, _next) => {
  const message = err && err.message ? err.message : 'Unexpected server error';
  console.error('[request] Unhandled error:', err);
  res.status(500).json({ error: message });
});

mongoose.connection.on('connected', () => {
  mongoReady = true;
  console.log('Mongo connected');
});

mongoose.connection.on('disconnected', () => {
  mongoReady = false;
  console.warn('[mongo] Disconnected.');
});

mongoose.connection.on('error', (error) => {
  mongoReady = false;
  console.error('[mongo] Connection error:', error.message);
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.warn('Mongo connection failed: MONGODB_URI is not set. Starting API without database connection.');
  } else {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
      console.error('Mongo connection failed', error.message);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('[boot] Server started');
  });
}

startServer();
