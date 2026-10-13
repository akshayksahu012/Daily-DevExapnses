import './BudgetProgress.css';

const MESSAGES = {
  none: 'Set a monthly budget to start tracking.',
  safe: 'You are on track. Nice work!',
  warning: '⚠️ Heads up: you have used over 80% of your budget.',
  exceeded: '🚨 Budget exceeded! Time to cut back.',
};

export default function BudgetProgress({ percentUsed, alertLevel }) {
  const width = Math.min(percentUsed, 100); // bar never overflows its track

  return (
    <section className="budget-progress">
      <div className="budget-progress__header">
        <h2>Budget Usage</h2>
        <span className="budget-progress__percent">{percentUsed}%</span>
      </div>
      <div className="budget-progress__track">
        {/* --pct feeds the CSS fill animation; the colour comes from the alert-level class */}
        <div className={`budget-progress__fill budget-progress__fill--${alertLevel}`} style={{ '--pct': `${width}%` }} />
      </div>
      <p className={`budget-progress__alert budget-progress__alert--${alertLevel}`}>{MESSAGES[alertLevel]}</p>
    </section>
  );
}
