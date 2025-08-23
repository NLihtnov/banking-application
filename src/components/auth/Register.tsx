import React, { useEffect, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useForm } from '../../hooks';
import { register, clearError } from '../../store/authSlice';
import { validateEmail } from '../../utils/validators';
import './Auth.css';

const Register: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const initialData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    transactionPassword: '',
    confirmTransactionPassword: '',
  };

  const { formData, errors, touched, handleChange, handleBlur, validateForm } = useForm(
    initialData,
    {
      name: {
        required: true,
        minLength: 2,
      },
      email: {
        required: true,
        custom: (value) => !validateEmail(value) ? 'Digite um email válido' : null,
      },
      password: {
        required: true,
        minLength: 6,
      },
      confirmPassword: {
        required: true,
        custom: (value, formData) => value !== formData.password ? 'As senhas não coincidem' : null,
      },
      transactionPassword: {
        required: true,
        minLength: 6,
      },
      confirmTransactionPassword: {
        required: true,
        custom: (value, formData) => value !== formData.transactionPassword ? 'As senhas de transação não coincidem' : null,
      },
    }
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { confirmPassword, confirmTransactionPassword, ...registerData } = formData;
      dispatch(register(registerData));
    }
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
              onBlur={handleBlur}
              required
              placeholder="Digite seu nome completo"
              className={touched.name && errors.name ? 'error-input' : ''}
            />
            {touched.name && errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Digite seu email"
              className={touched.email && errors.email ? 'error-input' : ''}
            />
            {touched.email && errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Digite sua senha"
              className={touched.password && errors.password ? 'error-input' : ''}
            />
            {touched.password && errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Confirme sua senha"
              className={touched.confirmPassword && errors.confirmPassword ? 'error-input' : ''}
            />
            {touched.confirmPassword && errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="transactionPassword">Senha de Transação</label>
            <input
              type="password"
              id="transactionPassword"
              name="transactionPassword"
              value={formData.transactionPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Digite sua senha de transação"
              className={touched.transactionPassword && errors.transactionPassword ? 'error-input' : ''}
            />
            {touched.transactionPassword && errors.transactionPassword && <div className="error-message">{errors.transactionPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmTransactionPassword">Confirmar Senha de Transação</label>
            <input
              type="password"
              id="confirmTransactionPassword"
              name="confirmTransactionPassword"
              value={formData.confirmTransactionPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Confirme sua senha de transação"
              className={touched.confirmTransactionPassword && errors.confirmTransactionPassword ? 'error-input' : ''}
            />
            {touched.confirmTransactionPassword && errors.confirmTransactionPassword && <div className="error-message">{errors.confirmTransactionPassword}</div>}
          </div>
          {error && <div className="error-message global-error">{error}</div>}
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
});

export default Register;
