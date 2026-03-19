const jwt = require('jsonwebtoken');

const SECRET  = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

if (!SECRET) throw new Error('JWT_SECRET is not set in environment variables');

/**
 * Sign a JWT for a user
 */
function signToken(userId) {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: EXPIRES });
}

/**
 * Verify and decode a JWT — throws on invalid/expired
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
