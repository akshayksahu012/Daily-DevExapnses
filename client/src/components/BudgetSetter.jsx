import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import './BudgetSetter.css';

export default function BudgetSetter() {
  const { user, updateBudget } = useAuth();
  const { refresh } = useExpenses();
  const [value, setValue] = useState(user.monthlyBudget);
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    const amount = Number(value);
    if (Number.isNaN(amount) || amount < 0) { setMsg('Enter a valid amount'); return; }
    try {
      await updateBudget(amount);
      await refresh(); // summary depends on the budget
      setMsg('Saved ✓');
    } catch (err) { setMsg(err.message); }
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <form className="budget-setter" onSubmit={handleSave}>
      <h3>Monthly Budget</h3>
      <div className="budget-setter__row">
        <input type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
        <button className="btn btn--primary" type="submit">Save</button>
      </div>
      {msg && <p className="budget-setter__msg">{msg}</p>}
    </form>
  );
}
