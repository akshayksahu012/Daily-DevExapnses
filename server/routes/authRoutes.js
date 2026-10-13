const router = require('express').Router();
const { signup, login, getMe, updateBudget } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/budget', protect, updateBudget);

module.exports = router;
