import AuthForm from '../components/AuthForm';
import './Login.css';

export default function Login() {
  return <div className="login-page"><AuthForm mode="login" /></div>;
}
