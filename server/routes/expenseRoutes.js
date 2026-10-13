const router = require('express').Router();
const c = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // every expense route requires a valid token

router.get('/summary', c.getSummary); // must come BEFORE '/:id'
router.route('/').get(c.getExpenses).post(c.createExpense);
router.route('/:id').put(c.updateExpense).delete(c.deleteExpense);

module.exports = router;
