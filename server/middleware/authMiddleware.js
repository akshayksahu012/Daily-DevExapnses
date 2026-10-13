const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects routes: reads "Authorization: Bearer <token>", verifies it,
// and attaches the user to req.user for controllers to use.
const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
