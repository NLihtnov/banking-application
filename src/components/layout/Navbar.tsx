import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/authSlice';
import { NotificationBell } from '../notifications/NotificationBell';
import { NotificationPanel } from '../notifications/NotificationPanel';

import './Navbar.css';

const Navbar: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home" className="navbar-logo">
            <img 
              src="https://play-lh.googleusercontent.com/i351Qq1TqP6NQBg8WHPokrRpeLp6DOXB2S-qXbU1VSWhrrmFuOKPnbfFq7A09k5udo6Q" 
              alt="Magnum Bank Logo" 
              className="navbar-logo-image"
            />
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/home" className="navbar-link" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/transaction" className="navbar-link" onClick={closeMenu}>
            Transações
          </Link>
          <Link to="/history" className="navbar-link" onClick={closeMenu}>
            Histórico
          </Link>
        </div>
        
        <div className="navbar-user">
          <NotificationBell />
          <span className="user-name">Olá, {user?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Sair
          </button>
        </div>

        <button className="hamburger-menu" onClick={toggleMenu}>
          {isMenuOpen ? (
            <svg className="hamburger-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
            <svg className="hamburger-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          )}
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/home" className="mobile-menu-link" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/transaction" className="mobile-menu-link" onClick={closeMenu}>
            Transações
          </Link>
          <Link to="/history" className="mobile-menu-link" onClick={closeMenu}>
            Histórico
          </Link>
          <div className="mobile-menu-user">
            <span className="mobile-user-name">Olá, {user?.name}</span>
            <button onClick={handleLogout} className="mobile-logout-button">
              Sair
            </button>
          </div>
        </div>
      </div>
      <NotificationPanel />
    </nav>
  );
});

export default Navbar;
