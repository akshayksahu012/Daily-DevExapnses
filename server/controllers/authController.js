const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Only send safe fields back to the client.
const userPayload = (u) => ({
  id: u._id, name: u.name, email: u.email, monthlyBudget: u.monthlyBudget,
});

// POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, monthlyBudget } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, monthlyBudget });
    res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    // password has select:false, so we must ask for it explicitly
    const user = await User.findOne({ email }).select('+password');
    // Same message for "no user" and "wrong password" so attackers can't probe emails
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ token: signToken(user._id), user: userPayload(user) });
  } catch (err) { next(err); }
};

// GET /api/auth/me  (used to restore the session on page refresh)
exports.getMe = (req, res) => res.json({ user: userPayload(req.user) });

// PUT /api/auth/budget
exports.updateBudget = async (req, res, next) => {
  try {
    const budget = Number(req.body.monthlyBudget);
    if (Number.isNaN(budget) || budget < 0) {
      return res.status(400).json({ message: 'Budget must be a non-negative number' });
    }
    req.user.monthlyBudget = budget;
    await req.user.save();
    res.json({ user: userPayload(req.user) });
  } catch (err) { next(err); }
};

// Logout is client-side with JWT: the client just discards the token.
