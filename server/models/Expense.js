const mongoose = require('mongoose');
const { CATEGORIES } = require('../config/constants');

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 60 },
    amount: { type: Number, required: [true, 'Amount is required'], min: [0.01, 'Amount must be greater than 0'] },
    category: {
      type: String,
      required: true,
      enum: { values: CATEGORIES, message: '{VALUE} is not a valid category' },
    },
    date: { type: Date, required: [true, 'Date is required'], default: Date.now },
    // Reference to the owner. This field is what isolates each user's data.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Almost every query filters by user and sorts by date, so index both.
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
