import React, { useState, useEffect } from 'react';
import { Register, Home } from './pages';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // If user is authenticated, redirect to home
  if (isAuthenticated) {
    return <Home onLogout={handleLogout} />;
  }

  // Show register page if not authenticated
  return <Register onRegisterSuccess={handleRegisterSuccess} />;
}

export default App;
