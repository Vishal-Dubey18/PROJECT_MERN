require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB      = require('./config/db');
const rateLimiter    = require('./middleware/rateLimiter');
const errorHandler   = require('./middleware/errorHandler');
const authRoutes     = require('./routes/auth.routes');
const taskRoutes     = require('./routes/task.routes');

// ── Connect Database ─────────────────────────────────────────────
connectDB();

const app = express();

// ── Security Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize());   // Prevent NoSQL injection

// ── CORS ─────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing ─────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Logging ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Rate limiting (global) ───────────────────────────────────────
app.use('/api', rateLimiter.global);

// ── Health check ─────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
);

// ── API Routes ───────────────────────────────────────────────────
app.use('/api/auth',  rateLimiter.auth, authRoutes);
app.use('/api/tasks', taskRoutes);

// ── 404 handler ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Centralised error handler (must be last) ─────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 TaskFlow API running on port ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = app;
