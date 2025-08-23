import React, { useEffect, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useForm } from '../../hooks';
import { login, clearError } from '../../store/authSlice';
import { validateEmail } from '../../utils/validators';
import './Auth.css';

const Login: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const { formData, errors, touched, handleChange, handleBlur, validateForm } = useForm(
    { email: '', password: '' },
    {
      email: {
        required: true,
        custom: (value) => !validateEmail(value) ? 'Digite um email válido' : null,
      },
      password: {
        required: true,
        minLength: 6,
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
      dispatch(login(formData));
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
        <h2>Acesse sua conta</h2>
        <form onSubmit={handleSubmit}>
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
          {error && <div className="error-message global-error">{error}</div>}
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Login;
