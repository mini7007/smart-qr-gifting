const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const giftRoutes = require('./routes/giftRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_VERCEL_ORIGIN = 'https://smart-qr-gifting.vercel.app';

let mongoReady = false;

process.on('unhandledRejection', (reason) => {
  console.error('[boot] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[boot] Uncaught exception:', error);
});

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = [
        process.env.CLIENT_ORIGIN,
        process.env.VERCEL_FRONTEND_URL,
        DEFAULT_VERCEL_ORIGIN,
        'http://localhost:3000'
      ]
        .filter(Boolean)
        .map((allowedOrigin) => allowedOrigin.replace(/\/$/, ''));
      const requestOrigin = origin ? origin.replace(/\/$/, '') : origin;

      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
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
