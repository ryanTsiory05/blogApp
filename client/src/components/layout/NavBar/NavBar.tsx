import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../../auth/AuthModal';
import { logout } from '../../../services/authService';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [showModal]); // Refresh after login modal closes

  const handleLogout = () => {
    logout(); 
    setUser(null); 
    navigate('/');
    toast.success('Logout successful.')
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-5">
        <Link className="navbar-brand" to="/">BlogApp</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/myposts">Mes Articles</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            {isLoggedIn && user ? (
              <>
                <span className="text-white">Bienvenue, {user.username}</span>
                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Modal affiché si showModal est true */}
      <AuthModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
