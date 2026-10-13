import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../utils/categories';
import './ExpenseFilters.css';

export default function ExpenseFilters() {
  const { month, setMonth, category, setCategory } = useExpenses();

  return (
    <div className="expense-filters">
      <label>
        Month
        <input type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} />
      </label>
      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
    </div>
  );
}
