const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const giftRoutes = require('./routes/giftRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI;

let mongoReady = false;

process.on('unhandledRejection', (reason) => {
  console.error('[boot] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[boot] Uncaught exception:', error);
});

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST']
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

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
  const status = err.status || 500;
  const message = err.message || 'Unexpected server error';

  if (status >= 500) {
    console.error('[request] Unhandled error:', err);
  }

  res.status(status).json({ error: message });
});

mongoose.connection.on('connected', () => {
  mongoReady = true;
  console.log('[mongo] Connected successfully.');
});

mongoose.connection.on('disconnected', () => {
  mongoReady = false;
  console.warn('[mongo] Disconnected.');
});

mongoose.connection.on('error', (error) => {
  mongoReady = false;
  console.error('[mongo] Connection error:', error.message);
});

async function connectMongoWithRetry() {
  if (!MONGODB_URI) {
    console.error('[boot] MONGODB_URI is not set. API will run without database connectivity.');
    return;
  }

  try {
    console.log('[boot] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
  } catch (error) {
    mongoReady = false;
    console.error('[mongo] Initial connection failed:', error.message);
    console.log('[mongo] Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectMongoWithRetry, 5000);
  }
}

app.listen(PORT, HOST, () => {
  console.log(`[boot] Server listening on ${HOST}:${PORT}`);
  connectMongoWithRetry();
});
