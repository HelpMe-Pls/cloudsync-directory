import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Stats {
  userCount: number;
  groupCount: number;
  activeUserCount: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    userCount: 0,
    groupCount: 0,
    activeUserCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For demo purposes, we'll use mock data
    const fetchStats = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats({
          userCount: 25,
          groupCount: 8,
          activeUserCount: 18,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h2>Total Users</h2>
          <div className="stat-value">{stats.userCount}</div>
          <Link to="/users" className="stat-link">View all users</Link>
        </div>
        
        <div className="stat-card">
          <h2>Total Groups</h2>
          <div className="stat-value">{stats.groupCount}</div>
          <Link to="/groups" className="stat-link">View all groups</Link>
        </div>
        
        <div className="stat-card">
          <h2>Active Users</h2>
          <div className="stat-value">{stats.activeUserCount}</div>
          <div className="stat-percentage">
            {Math.round((stats.activeUserCount / stats.userCount) * 100)}% active
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/users" className="action-button">
          Manage Users
        </Link>
        <Link to="/groups" className="action-button">
          Manage Groups
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
