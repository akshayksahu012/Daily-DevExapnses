import { categoryColor } from '../utils/categories';
import { formatCurrency } from '../utils/format';
import './CategoryBreakdown.css';

export default function CategoryBreakdown({ breakdown, totalSpent }) {
  return (
    <section className="category-breakdown">
      <h3>Spending by Category</h3>
      {breakdown.length === 0 && <p className="category-breakdown__empty">No spending this month.</p>}
      {breakdown.map((row, i) => {
        const pct = totalSpent > 0 ? Math.round((row.total / totalSpent) * 100) : 0;
        return (
          <div key={row.category} className="category-breakdown__row"
               style={{ '--cat': categoryColor(row.category), '--pct': `${pct}%`, animationDelay: `${i * 80}ms` }}>
            <div className="category-breakdown__top">
              <span>{row.category} <small>({row.count})</small></span>
              <strong>{formatCurrency(row.total)}</strong>
            </div>
            <div className="category-breakdown__track"><div className="category-breakdown__bar" /></div>
          </div>
        );
      })}
    </section>
  );
}
