import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="navbar__brand">💸 DevExpense</div>
      <div className="navbar__right">
        <div className="navbar__profile">
          <span className="navbar__avatar">{user.name.charAt(0).toUpperCase()}</span>
          <span className="navbar__name">{user.name}</span>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
