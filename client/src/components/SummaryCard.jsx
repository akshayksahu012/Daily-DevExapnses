import { formatCurrency } from '../utils/format';
import './SummaryCard.css';

export default function SummaryCard({ label, value, hint, variant = 'default', delay = 0 }) {
  return (
    <div className={`summary-card summary-card--${variant}`} style={{ animationDelay: `${delay}ms` }}>
      <span className="summary-card__label">{label}</span>
      <strong className="summary-card__value">{formatCurrency(value)}</strong>
      {hint && <span className="summary-card__hint">{hint}</span>}
    </div>
  );
}
