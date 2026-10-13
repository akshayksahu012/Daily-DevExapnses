import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as expenseService from '../services/expenseService';

const ExpenseContext = createContext(null);
export const useExpenses = () => useContext(ExpenseContext);

const currentMonth = () => new Date().toISOString().slice(0, 7); // YYYY-MM

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(currentMonth());
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Re-fetch the list and the summary whenever filters change.
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [list, sum] = await Promise.all([
        expenseService.list({ month, category }),
        expenseService.summary(month),
      ]);
      setExpenses(list.expenses);
      setSummary(sum.summary);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [month, category]);

  useEffect(() => { refresh(); }, [refresh]);

  // After every write we refresh so the totals always come from the server.
  const addExpense = async (data) => { await expenseService.create(data); await refresh(); };
  const updateExpense = async (id, data) => { await expenseService.update(id, data); await refresh(); };
  const deleteExpense = async (id) => { await expenseService.remove(id); await refresh(); };

  return (
    <ExpenseContext.Provider value={{
      expenses, summary, loading, error, month, setMonth, category, setCategory,
      refresh, addExpense, updateExpense, deleteExpense,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}
