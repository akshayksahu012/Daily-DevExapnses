import { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../utils/categories';
import { toInputDate } from '../utils/format';
import './ExpenseForm.css';

// `expense` = null means "add", an expense object means "edit".
export default function ExpenseForm({ expense, onClose }) {
  const { addExpense, updateExpense } = useExpenses();
  const isEdit = Boolean(expense);

  const [form, setForm] = useState({
    title: expense?.title || '',
    amount: expense?.amount ?? '',
    category: expense?.category || CATEGORIES[0],
    date: toInputDate(expense?.date || new Date()),
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Client-side validation (the server validates again; never trust only the client)
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length > 60) errs.title = 'Max 60 characters';
    if (form.amount === '' || !(Number(form.amount) > 0)) errs.amount = 'Enter an amount greater than 0';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    setServerError('');
    try {
      const payload = { ...form, title: form.title.trim(), amount: Number(form.amount) };
      if (isEdit) await updateExpense(expense._id, payload);
      else await addExpense(payload);
      onClose();
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="expense-form__overlay" onClick={onClose}>
      <form className="expense-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} noValidate>
        <h2>{isEdit ? 'Edit Expense' : 'Add Expense'}</h2>

        <label>Title
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Groceries" />
          {errors.title && <span className="expense-form__error">{errors.title}</span>}
        </label>

        <label>Amount
          <input name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={handleChange} />
          {errors.amount && <span className="expense-form__error">{errors.amount}</span>}
        </label>

        <label>Category
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label>Date
          <input name="date" type="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="expense-form__error">{errors.date}</span>}
        </label>

        {serverError && <p className="expense-form__error expense-form__error--server">{serverError}</p>}

        <div className="expense-form__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
