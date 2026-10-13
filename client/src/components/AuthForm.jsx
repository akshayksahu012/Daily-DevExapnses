import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

// Shared by the Login and Signup pages. mode = 'login' | 'signup'
export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', monthlyBudget: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />; // already logged in

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (isSignup && !form.name.trim()) errs.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (isSignup && form.monthlyBudget !== '' && Number(form.monthlyBudget) < 0) errs.monthlyBudget = 'Cannot be negative';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setServerError('');
    try {
      if (isSignup) await signup({ ...form, monthlyBudget: Number(form.monthlyBudget) || 0 });
      else await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h1>{isSignup ? 'Create account' : 'Welcome back'}</h1>
      <p className="auth-form__sub">{isSignup ? 'Start tracking your spending today.' : 'Log in to your dashboard.'}</p>

      {isSignup && (
        <label>Name
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="auth-form__error">{errors.name}</span>}
        </label>
      )}
      <label>Email
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="auth-form__error">{errors.email}</span>}
      </label>
      <label>Password
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        {errors.password && <span className="auth-form__error">{errors.password}</span>}
      </label>
      {isSignup && (
        <label>Monthly budget (optional)
          <input name="monthlyBudget" type="number" min="0" step="0.01" value={form.monthlyBudget} onChange={handleChange} />
          {errors.monthlyBudget && <span className="auth-form__error">{errors.monthlyBudget}</span>}
        </label>
      )}

      {serverError && <p className="auth-form__server-error">{serverError}</p>}

      <button className="btn btn--primary" type="submit" disabled={submitting}>
        {submitting ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
      </button>

      <p className="auth-form__switch">
        {isSignup
          ? <>Already have an account? <Link to="/login">Log in</Link></>
          : <>New here? <Link to="/signup">Create an account</Link></>}
      </p>
    </form>
  );
}
