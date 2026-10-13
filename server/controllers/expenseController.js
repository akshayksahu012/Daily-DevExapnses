const Expense = require('../models/Expense');

const round2 = (n) => Math.round(n * 100) / 100;
const pick = ({ title, amount, category, date }) => ({ title, amount, category, date });

// 'YYYY-MM' -> [start, end) range in UTC
const monthRange = (month) => {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;
  const [y, m] = month.split('-').map(Number);
  return { start: new Date(Date.UTC(y, m - 1, 1)), end: new Date(Date.UTC(y, m, 1)) };
};

// GET /api/expenses?category=Food&month=2026-10
exports.getExpenses = async (req, res, next) => {
  try {
    const query = { user: req.user._id }; // ALWAYS scoped to the logged-in user
    const { category, month } = req.query;

    if (category && category !== 'All') query.category = category;
    if (month) {
      const range = monthRange(month);
      if (!range) return res.status(400).json({ message: 'month must be YYYY-MM' });
      query.date = { $gte: range.start, $lt: range.end };
    }

    const expenses = await Expense.find(query).sort({ date: -1, createdAt: -1 });
    res.json({ expenses });
  } catch (err) { next(err); }
};

// POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    // Whitelist fields: the client can never set "user" itself.
    const expense = await Expense.create({ ...pick(req.body), user: req.user._id });
    res.status(201).json({ expense });
  } catch (err) { next(err); }
};

// PUT /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    // Filtering by BOTH _id and user stops users editing each other's data.
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ expense });
  } catch (err) { next(err); }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) { next(err); }
};

// GET /api/expenses/summary?month=2026-10
// Totals are computed in the database, never trusted from the client.
exports.getSummary = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const range = monthRange(month);
    if (!range) return res.status(400).json({ message: 'month must be YYYY-MM' });

    const rows = await Expense.aggregate([
      // req.user._id is already an ObjectId; aggregate() does NOT auto-cast strings.
      { $match: { user: req.user._id, date: { $gte: range.start, $lt: range.end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const byCategory = rows.map((r) => ({ category: r._id, total: round2(r.total), count: r.count }));
    const totalSpent = round2(byCategory.reduce((sum, r) => sum + r.total, 0));
    const budget = req.user.monthlyBudget;
    const percentUsed = budget > 0 ? Math.round((totalSpent / budget) * 1000) / 10 : 0;

    let alertLevel = 'none'; // no budget set
    if (budget > 0) {
      alertLevel = percentUsed >= 100 ? 'exceeded' : percentUsed >= 80 ? 'warning' : 'safe';
    }

    res.json({
      summary: { month, budget, totalSpent, remaining: round2(budget - totalSpent), percentUsed, alertLevel, byCategory },
    });
  } catch (err) { next(err); }
};
