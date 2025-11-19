import React, { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Shield, Users, Briefcase, AlertTriangle, TrendingUp, Settings, Eye, Ban, Search } from 'lucide-react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import DashboardNav from "../components/DashboardNav";
import { showSuccess } from "../utils/toast";
import './Dashboard.css';

function AdminDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  const userStats = [
    { type: 'Job Seekers', count: 1247, growth: '+12%', color: '#3b82f6' },
    { type: 'Recruiters', count: 89, growth: '+8%', color: '#10b981' },
    { type: 'Active Jobs', count: 342, growth: '+15%', color: '#f59e0b' },
    { type: 'Applications', count: 2156, growth: '+23%', color: '#8b5cf6' },
  ];
  
  const monthlyData = [
    { month: 'Jan', users: 1100, jobs: 280, applications: 1800 },
    { month: 'Feb', users: 1150, jobs: 295, applications: 1950 },
    { month: 'Mar', users: 1200, jobs: 320, applications: 2100 },
    { month: 'Apr', users: 1247, jobs: 342, applications: 2156 },
  ];
  
  const trustScores = [
    { name: 'High Trust', value: 78, color: '#10b981' },
    { name: 'Medium Trust', value: 18, color: '#f59e0b' },
    { name: 'Low Trust', value: 4, color: '#ef4444' },
  ];
  
  const flaggedUsers = [
    { id: 1, name: 'John Smith', email: 'john@email.com', reason: 'Multiple suspicious applications', severity: 'high', date: '2024-01-15' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@email.com', reason: 'Fake resume detected', severity: 'critical', date: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@email.com', reason: 'Unusual activity pattern', severity: 'medium', date: '2024-01-13' },
  ];
  
  const recentUsers = [
    { id: 1, name: 'Alice Cooper', email: 'alice@email.com', type: 'Job Seeker', joined: '2024-01-15', status: 'active' },
    { id: 2, name: 'Bob Martinez', email: 'bob@email.com', type: 'Recruiter', joined: '2024-01-14', status: 'active' },
    { id: 3, name: 'Carol Davis', email: 'carol@email.com', type: 'Job Seeker', joined: '2024-01-13', status: 'pending' },
  ];

  const manageRef = useRef(null);
  const analyticsRef = useRef(null);

  const handleLogout = () => {
  logout();
  showSuccess("Logged out successfully!");
  navigate("/login");
};

  const handleManageUsers = () => {
    alert('User management panel opening...');
  };

  const handleManageJobs = () => {
    alert('Job management panel opening...');
  };

  const handleViewAnalytics = () => {
    analyticsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFraudDetection = () => {
    alert('Fraud detection system activated!');
  };

  const handleBanUser = (userName) => {
    if (confirm(`Are you sure you want to ban ${userName}?`)) {
      alert(`${userName} has been banned.`);
    }
  };

  const handleInvestigateUser = (userName) => {
    alert(`Investigating ${userName}...`);
  };

  return (
    <div className="dashboard admin-dashboard">
      <DashboardNav />
      <div className="user-info-bar">
        <div className="user-info">
          <div className="user-avatar admin">
            <Shield size={24} />
          </div>
          <div>
            <span className="user-name">Admin Panel</span>
            <span className="user-role">{user?.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="dashboard-header">
        <h2>System Administration</h2>
        <p>Monitor platform activity and manage users</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={20} /> Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} /> Users
        </button>
        <button 
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={20} /> Jobs
        </button>
        <button 
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <AlertTriangle size={20} /> Security
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} /> Settings
        </button>
      </div>
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="stats-grid">
            {userStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                  {index === 0 && <Users size={24} />}
                  {index === 1 && <Shield size={24} />}
                  {index === 2 && <Briefcase size={24} />}
                  {index === 3 && <TrendingUp size={24} />}
                </div>
                <div className="stat-info">
                  <h3>{stat.count.toLocaleString()}</h3>
                  <p>{stat.type}</p>
                  <span className="growth-indicator">{stat.growth}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Platform Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="applications" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-card">
              <h3>User Trust Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trustScores}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {trustScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'users' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>User Management</h3>
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar small">
                          <Users size={16} />
                        </div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`user-type-badge ${user.type.toLowerCase().replace(' ', '-')}`}>
                        {user.type}
                      </span>
                    </td>
                    <td>{user.joined}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" onClick={() => handleInvestigateUser(user.name)}>
                          <Eye size={16} />
                        </button>
                        <button className="action-btn ban" onClick={() => handleBanUser(user.name)}>
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'security' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Security & Fraud Detection</h3>
            <button onClick={handleFraudDetection} className="fraud-scan-btn">
              <AlertTriangle size={20} />
              Run Security Scan
            </button>
          </div>
          
          <div className="security-alerts">
            <h4>Flagged Users ({flaggedUsers.length})</h4>
            <div className="flagged-users-grid">
              {flaggedUsers.map((user) => (
                <div key={user.id} className={`flagged-user-card severity-${user.severity}`}>
                  <div className="flagged-user-header">
                    <div className="user-info">
                      <h5>{user.name}</h5>
                      <p>{user.email}</p>
                    </div>
                    <span className={`severity-badge ${user.severity}`}>
                      {user.severity}
                    </span>
                  </div>
                  
                  <div className="flagged-reason">
                    <AlertTriangle size={16} />
                    <span>{user.reason}</span>
                  </div>
                  
                  <div className="flagged-meta">
                    <span>Flagged: {user.date}</span>
                  </div>
                  
                  <div className="flagged-actions">
                    <button 
                      onClick={() => handleInvestigateUser(user.name)} 
                      className="investigate-btn"
                    >
                      <Eye size={16} /> Investigate
                    </button>
                    <button 
                      onClick={() => handleBanUser(user.name)} 
                      className="ban-btn"
                    >
                      <Ban size={16} /> Ban User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'jobs' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Job Management</h3>
            <button onClick={handleManageJobs} className="manage-btn">
              <Briefcase size={20} /> Manage Jobs
            </button>
          </div>
          
          <div className="jobs-overview">
            <div className="job-stats">
              <div className="job-stat">
                <h4>342</h4>
                <p>Active Jobs</p>
              </div>
              <div className="job-stat">
                <h4>89</h4>
                <p>Pending Approval</p>
              </div>
              <div className="job-stat">
                <h4>156</h4>
                <p>Expired Jobs</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>System Settings</h3>
          </div>
          
          <div className="settings-grid">
            <div className="setting-card">
              <h4>Platform Configuration</h4>
              <p>Manage platform-wide settings and configurations</p>
              <button className="setting-btn">Configure</button>
            </div>
            
            <div className="setting-card">
              <h4>Email Templates</h4>
              <p>Customize email templates for notifications</p>
              <button className="setting-btn">Edit Templates</button>
            </div>
            
            <div className="setting-card">
              <h4>Security Policies</h4>
              <p>Configure security policies and access controls</p>
              <button className="setting-btn">Manage Policies</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard; 