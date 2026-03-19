const { verifyToken } = require('../utils/jwt');
const User            = require('../models/User');

/**
 * Protect middleware — verifies JWT and attaches req.user
 */
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);                  // throws if invalid/expired

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    const msg =
      err.name === 'TokenExpiredError'  ? 'Token expired — please log in again' :
      err.name === 'JsonWebTokenError'  ? 'Invalid token'                        :
      'Authentication failed';
    return res.status(401).json({ success: false, message: msg });
  }
}

/**
 * Role-based access control (optional, ready for use)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

module.exports = { protect, requireRole };
