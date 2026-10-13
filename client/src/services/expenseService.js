import { request } from './api';

export const list = ({ month, category }) => {
  const params = new URLSearchParams();
  if (month) params.set('month', month);
  if (category && category !== 'All') params.set('category', category);
  return request(`/expenses?${params}`);
};
export const summary = (month) => request(`/expenses/summary?month=${month}`);
export const create = (body) => request('/expenses', { method: 'POST', body });
export const update = (id, body) => request(`/expenses/${id}`, { method: 'PUT', body });
export const remove = (id) => request(`/expenses/${id}`, { method: 'DELETE' });
