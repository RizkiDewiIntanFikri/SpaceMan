
import { Routes, Route, Navigate, useNavigate } from 'react-router'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import StocksDashboard from "./pages/StocksDashboard";
import Portfolio from './pages/Portfolio';
import Leaderboard from './pages/Leaderboard';
import Trade from './pages/Trade';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import { useEffect, useState } from "react";

function AppContent() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleRegisterSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setIsAuthenticated(true);
    setUser(data.user);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
      
      {/* Protected routes - only show if authenticated */}
      {isAuthenticated ? (
        <Route path="/dashboard" element={
          <Layout onLogout={handleLogout} user={user}>
            <Dashboard />
          </Layout>
        } />
      ) : (
        <Route path="/dashboard" element={<Navigate to="/" />} />
      )}
      
      {isAuthenticated ? (
        <>
          <Route path="/stocks" element={
            <Layout onLogout={handleLogout} user={user}>
              <StocksDashboard />
            </Layout>
          } />
          <Route path="/portfolio" element={
            <Layout onLogout={handleLogout} user={user}>
              <Portfolio />
            </Layout>
          } />
          <Route path="/leaderboard" element={
            <Layout onLogout={handleLogout} user={user}>
              <Leaderboard />
            </Layout>
          } />
          <Route path="/trade" element={
            <Layout onLogout={handleLogout} user={user}>
              <Trade />
            </Layout>
          } />
        </>
      ) : (
        <>
          <Route path="/stocks" element={<Navigate to="/" />} />
          <Route path="/portfolio" element={<Navigate to="/" />} />
          <Route path="/leaderboard" element={<Navigate to="/" />} />
          <Route path="/trade" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  )
}

export default function App() {
  return <AppContent />;
}
