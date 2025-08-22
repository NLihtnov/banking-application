import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { getCurrentUser } from './store/slices/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/layout/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/pages/Home';
import Transaction from './components/pages/Transaction';
import History from './components/pages/History';

// Styles
import './App.css';

const AppContent: React.FC = () => {
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      store.dispatch(getCurrentUser());
    }
  }, [token]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Private Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Home />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Transaction />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <History />
                </>
              </PrivateRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
