const CURRENCY = 'USD'; // change to 'INR', 'EUR', etc.

export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(n || 0);

// Dates are stored at UTC midnight, so display in UTC to avoid off-by-one days.
export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const toInputDate = (d) => new Date(d).toISOString().slice(0, 10); // YYYY-MM-DD
