import { useState } from 'react';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import BudgetProgress from '../components/BudgetProgress';
import BudgetSetter from '../components/BudgetSetter';
import CategoryBreakdown from '../components/CategoryBreakdown';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import { useExpenses } from '../context/ExpenseContext';
import './Dashboard.css';

export default function Dashboard() {
  const { summary, error } = useExpenses();
  // modal state: null = closed, { expense: null } = add, { expense } = edit
  const [modal, setModal] = useState(null);

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <header className="dashboard__header">
          <div>
            <h1>Dashboard</h1>
            <p>Track, filter and control your monthly spending.</p>
          </div>
          <button className="btn btn--primary" onClick={() => setModal({ expense: null })}>+ Add Expense</button>
        </header>

        <ExpenseFilters />
        {error && <p className="dashboard__error">{error}</p>}

        {summary && (
          <>
            <section className="dashboard__cards">
              <SummaryCard label="Total Balance" hint="Monthly budget" value={summary.budget} delay={0} />
              <SummaryCard label="Total Spent" value={summary.totalSpent} variant="spent" delay={100} />
              <SummaryCard
                label="Remaining Budget" value={summary.remaining} delay={200}
                variant={summary.remaining < 0 ? 'negative' : 'remaining'}
              />
            </section>
            <BudgetProgress percentUsed={summary.percentUsed} alertLevel={summary.alertLevel} />
          </>
        )}

        <div className="dashboard__grid">
          <ExpenseList onEdit={(expense) => setModal({ expense })} />
          <aside className="dashboard__side">
            <BudgetSetter />
            {summary && <CategoryBreakdown breakdown={summary.byCategory} totalSpent={summary.totalSpent} />}
          </aside>
        </div>
      </main>

      {modal && <ExpenseForm expense={modal.expense} onClose={() => setModal(null)} />}
    </>
  );
}
