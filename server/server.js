require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler); // must be last

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)));
