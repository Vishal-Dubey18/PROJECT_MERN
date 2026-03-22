require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB          = require('./config/db');
const rateLimiter        = require('./middleware/rateLimiter');
const errorHandler       = require('./middleware/errorHandler');
const authRoutes         = require('./routes/auth.routes');
const taskRoutes         = require('./routes/task.routes');
const { verifyConnection } = require('./services/email.service');
const { startAllJobs }   = require('./services/scheduler.service');

// ── Connect DB ───────────────────────────────────────────────
connectDB();

const app = express();

// ── Security ─────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize());

// ── CORS ─────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Logging ──────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Rate limiting ────────────────────────────────────────────
app.use('/api', rateLimiter.global);

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
);

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',  rateLimiter.auth, authRoutes);
app.use('/api/tasks', taskRoutes);

// ── 404 ──────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Error handler ────────────────────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`\n🚀 TaskFlow API running on port ${PORT} [${process.env.NODE_ENV}]`);
  await verifyConnection();
  if (process.env.NODE_ENV === 'production') startAllJobs();
});

module.exports = app;
