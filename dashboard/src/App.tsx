import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Components
import UsersList from './components/UsersList';
import UserDetails from './components/UserDetails';
import GroupsList from './components/GroupsList';
import GroupDetails from './components/GroupDetails';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

// Layout components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Header onLogout={handleLogout} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="/groups" element={<GroupsList />} />
              <Route path="/groups/:id" element={<GroupDetails />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
