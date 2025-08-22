import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { register, clearError } from '../../store/slices/authSlice';
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    transactionPassword: '',
    confirmTransactionPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (formData.transactionPassword !== formData.confirmTransactionPassword) {
      newErrors.confirmTransactionPassword = 'As senhas de transação não coincidem';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (formData.transactionPassword.length < 6) {
      newErrors.transactionPassword = 'A senha de transação deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, confirmTransactionPassword, ...registerData } = formData;
    dispatch(register(registerData));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="login-logo">
          <img 
            src="https://play-lh.googleusercontent.com/i351Qq1TqP6NQBg8WHPokrRpeLp6DOXB2S-qXbU1VSWhrrmFuOKPnbfFq7A09k5udo6Q" 
            alt="Magnum Bank Logo" 
            className="logo-image"
          />
        </div>
        <h2>Crie sua conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Digite seu nome completo"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite seu email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Digite sua senha"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirme sua senha"
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="transactionPassword">Senha de Transação</label>
            <input
              type="password"
              id="transactionPassword"
              name="transactionPassword"
              value={formData.transactionPassword}
              onChange={handleChange}
              required
              placeholder="Digite sua senha de transação"
            />
            {errors.transactionPassword && <div className="error-message">{errors.transactionPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmTransactionPassword">Confirmar Senha de Transação</label>
            <input
              type="password"
              id="confirmTransactionPassword"
              name="confirmTransactionPassword"
              value={formData.confirmTransactionPassword}
              onChange={handleChange}
              required
              placeholder="Confirme sua senha de transação"
            />
            {errors.confirmTransactionPassword && <div className="error-message">{errors.confirmTransactionPassword}</div>}
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
