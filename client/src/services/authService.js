import { request } from './api';

export const signup = (body) => request('/auth/signup', { method: 'POST', body });
export const login = (body) => request('/auth/login', { method: 'POST', body });
export const getMe = () => request('/auth/me');
export const updateBudget = (monthlyBudget) => request('/auth/budget', { method: 'PUT', body: { monthlyBudget } });
