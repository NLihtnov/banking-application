import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/home" className="navbar-logo">
            Banco Digital
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/home" className="navbar-link">
            Home
          </Link>
          <Link to="/transaction" className="navbar-link">
            Transações
          </Link>
          <Link to="/history" className="navbar-link">
            Histórico
          </Link>
        </div>
        
        <div className="navbar-user">
          <span className="user-name">Olá, {user?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
