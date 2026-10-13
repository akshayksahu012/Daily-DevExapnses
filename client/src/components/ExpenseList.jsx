import { useExpenses } from '../context/ExpenseContext';
import { categoryColor } from '../utils/categories';
import { formatCurrency, formatDate } from '../utils/format';
import './ExpenseList.css';

export default function ExpenseList({ onEdit }) {
  const { expenses, loading, deleteExpense } = useExpenses();

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try { await deleteExpense(id); } catch (e) { alert(e.message); }
    }
  };

  return (
    <section className="expense-list">
      <h2>Expenses</h2>
      {loading && expenses.length === 0 && <p className="expense-list__empty">Loading…</p>}
      {!loading && expenses.length === 0 && <p className="expense-list__empty">No expenses found. Add your first one! 🎉</p>}

      {expenses.length > 0 && (
        <div className="expense-list__scroll">
          <table className="expense-list__table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Date</th><th className="right">Amount</th><th /></tr>
            </thead>
            <tbody>
              {expenses.map((exp, i) => (
                <tr key={exp._id} style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}>
                  <td className="title">{exp.title}</td>
                  <td>
                    <span className="expense-list__badge" style={{ '--cat': categoryColor(exp.category) }}>
                      {exp.category}
                    </span>
                  </td>
                  <td>{formatDate(exp.date)}</td>
                  <td className="right amount">{formatCurrency(exp.amount)}</td>
                  <td className="actions">
                    <button className="btn btn--ghost" onClick={() => onEdit(exp)}>Edit</button>
                    <button className="btn btn--danger" onClick={() => handleDelete(exp._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
