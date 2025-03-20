import React, { useState } from 'react';
import './AdminDashboard.css'; // We'll define this CSS file below

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data for the dashboard
  const stats = [
    { title: 'Total Users', value: '1,254', icon: '👥' },
    { title: 'Revenue', value: '$12,345', icon: '💰' },
    { title: 'Projects', value: '42', icon: '📁' },
    { title: 'Tasks', value: '152', icon: '✅' }
  ];
  
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created a new project', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'Completed task #124', time: '3 hours ago' },
    { id: 3, user: 'Mike Johnson', action: 'Updated profile', time: '5 hours ago' },
    { id: 4, user: 'Sarah Williams', action: 'Submitted a report', time: 'Yesterday' }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="user-info">
          <span className="welcome-text">Welcome, Admin</span>
          <button className="notification-btn">🔔</button>
          <div className="avatar">A</div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="dashboard-main">
        {/* Navigation Tabs */}
        <div className="tab-container">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className="stat-icon">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Recent Activity */}
        <div className="activity-card">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-details">
                  <p className="activity-user">{activity.user}</p>
                  <p className="activity-action">{activity.action}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Activity</button>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;