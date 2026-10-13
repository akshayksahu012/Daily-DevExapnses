export const CATEGORIES = ['Food', 'Travel', 'Rent', 'Utilities', 'Shopping', 'Health', 'Entertainment', 'Other'];

const COLORS = {
  Food: '#f97316', Travel: '#0ea5e9', Rent: '#8b5cf6', Utilities: '#14b8a6',
  Shopping: '#ec4899', Health: '#22c55e', Entertainment: '#eab308', Other: '#64748b',
};

// Components pass this as a CSS variable: style={{ '--cat': categoryColor(c) }}
export const categoryColor = (c) => COLORS[c] || COLORS.Other;
