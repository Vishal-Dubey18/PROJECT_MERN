/**
 * Central error handling middleware.
 * All errors thrown or passed via next(err) land here.
 * Always returns a consistent JSON shape.
 */
function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message    || 'Internal server error';

  // ── Mongoose: duplicate key (e.g. email) ────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode = 409;
  }

  // ── Mongoose: validation error ───────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    message    = errors.join(', ');
    statusCode = 422;
  }

  // ── Mongoose: bad ObjectId ───────────────────────────────────────
  if (err.name === 'CastError') {
    message    = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // ── JWT ──────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError')  { message = 'Invalid token';  statusCode = 401; }
  if (err.name === 'TokenExpiredError')  { message = 'Token expired';  statusCode = 401; }

  // ── Dev vs prod stack ────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${statusCode} — ${message}`, err.stack ? `\n${err.stack}` : '');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
