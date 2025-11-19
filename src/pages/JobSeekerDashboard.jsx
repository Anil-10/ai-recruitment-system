import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useJobs } from '../JobContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, Upload, MessageCircle, TrendingUp, FileText, Calendar, Target, Award, Briefcase } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ResumeParser from '../components/ResumeParser';
import DashboardNav from "../components/DashboardNav";
import { showSuccess } from "../utils/toast";
import './Dashboard.css';

// new external jobs component (you created this file earlier)
import ExternalAvailableJobs from "../components/ExternalAvailableJobs";

function formatPostedDate(createdAt) {
  if (!createdAt) return "Not available";

  const created = new Date(createdAt);
  if (isNaN(created)) return "Not available";

  const now = new Date();
  const diffMs = now - created;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);

  // Less than 1 minute
  if (diffSec < 60) return `${diffSec} seconds ago`;

  // Less than 60 minutes
  if (diffMin < 60)
    return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

  // Less than 24 hours
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  // 24+ hours → show DD/MM/YYYY
  const dd = String(created.getDate()).padStart(2, "0");
  const mm = String(created.getMonth() + 1).padStart(2, "0");
  const yyyy = created.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

function JobSeekerDashboard() {
  const { user, logout } = useUser();
  const { jobs, applyToJob } = useJobs();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '', skills: '' });
  const [editing, setEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [skillsData] = useState([
    { name: 'JavaScript', level: 85, color: '#f7df1e' },
    { name: 'React', level: 90, color: '#61dafb' },
    { name: 'Node.js', level: 75, color: '#339933' },
    { name: 'Python', level: 70, color: '#3776ab' },
    { name: 'SQL', level: 65, color: '#336791' }
  ]);
  const [applicationStats] = useState([
    { name: 'Applied', value: 15, color: '#3b82f6' },
    { name: 'Interview', value: 5, color: '#10b981' },
    { name: 'Rejected', value: 8, color: '#ef4444' },
    { name: 'Pending', value: 12, color: '#f59e0b' }
  ]);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hello! I\'m your AI career assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    // Load saved data
    const savedProfile = localStorage.getItem('jobseeker_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    // Mock data loading
    setApplications([
      { id: 1, job: 'Frontend Developer', company: 'TechCorp', status: 'Under Review', appliedDate: '2024-01-15' },
      { id: 2, job: 'Backend Engineer', company: 'DataSoft', status: 'Interview Scheduled', appliedDate: '2024-01-10' },
      { id: 3, job: 'Full Stack Developer', company: 'StartupXYZ', status: 'Rejected', appliedDate: '2024-01-05' },
    ]);
    
    setRecommendations([
      { id: 1, job: 'React Developer', company: 'InnovateX', match: 95, salary: '$110k-130k' },
      { id: 2, job: 'Full Stack Engineer', company: 'WebWorks', match: 88, salary: '$100k-120k' },
      { id: 3, job: 'Senior Frontend Dev', company: 'TechFlow', match: 82, salary: '$120k-140k' },
    ]);
  }, []);

  // Add refs for scrolling
  const profileRef = useRef(null);
  const resumeRef = useRef(null);
  const applicationsRef = useRef(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    localStorage.setItem('jobseeker_profile', JSON.stringify(profile));
    
    // Mock AI analysis
    setLoading(true);
    setTimeout(() => {
      setAiAnalysis({
        profileStrength: 78,
        suggestions: [
          'Add more specific technical skills',
          'Include quantifiable achievements',
          'Consider adding certifications'
        ],
        skillGaps: ['TypeScript', 'AWS', 'Docker']
      });
      setLoading(false);
    }, 2000);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    
    if (file) {
      setLoading(true);
      // Mock AI resume parsing
      setTimeout(() => {
        setAiAnalysis({
          resumeScore: 85,
          extractedSkills: ['JavaScript', 'React', 'Node.js', 'Python'],
          suggestions: [
            'Add more project details',
            'Include metrics and achievements',
            'Update contact information'
          ]
        });
        setLoading(false);
      }, 3000);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = { type: 'user', message: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Mock AI response
    setTimeout(() => {
      const responses = [
        'Based on your profile, I recommend focusing on React and Node.js positions.',
        'Your skills align well with full-stack development roles.',
        'Consider adding cloud technologies like AWS to your skillset.',
        'I suggest updating your resume with more quantifiable achievements.'
      ];
      const botMessage = { 
        type: 'bot', 
        message: responses[Math.floor(Math.random() * responses.length)] 
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
    
    setChatInput('');
  };

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully!");
    navigate("/login");
  };

  const handleQuickApply = (jobId, jobTitle) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const applicationData = {
      applicantName: profile.name || user.email,
      applicantEmail: profile.email || user.email,
      coverLetter: `I am interested in the ${jobTitle} position and believe my skills align well with your requirements.`,
      resume: 'resume.pdf' // Mock resume
    };
    
    applyToJob(jobId, applicationData);
    showSuccess(`Successfully applied to ${jobTitle}!`);
  };

  return (
    <div className="dashboard jobseeker-dashboard">
      <DashboardNav />
      <div className="user-info-bar">
        <div className="user-info">
          <div className="user-avatar">
            <User size={24} />
          </div>
          <div>
            <span className="user-name">{profile.name || user?.email}</span>
            <span className="user-role">Job Seeker</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="dashboard-header">
        <h2>Welcome back, {profile.name || 'Job Seeker'}!</h2>
        <p>Track your job search progress and discover new opportunities</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={20} /> Overview
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} /> Profile
        </button>
        <button 
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <FileText size={20} /> Applications
        </button>
        <button 
          className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <Target size={20} /> Recommendations
        </button>
        <button 
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={20} /> Available Jobs
        </button>
      </div>
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon applications">
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <h3>{applications.length}</h3>
                <p>Total Applications</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon interviews">
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.status === 'Interview Scheduled').length}</h3>
                <p>Interviews Scheduled</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon recommendations">
                <Target size={24} />
              </div>
              <div className="stat-info">
                <h3>{recommendations.length}</h3>
                <p>Job Matches</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon available-jobs">
                <Briefcase size={24} />
              </div>
              <div className="stat-info">
                <h3>{jobs.length}</h3>
                <p>Available Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon profile-strength">
                <Award size={24} />
              </div>
              <div className="stat-info">
                <h3>{aiAnalysis?.profileStrength || 78}%</h3>
                <p>Profile Strength</p>
              </div>
            </div>
          </div>
          
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Application Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={applicationStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {applicationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-card">
              <h3>Skills Assessment</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="level" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div className="tab-content">
          <section ref={profileRef} className="profile-section">
            <div className="section-header">
              <h3>Profile Information</h3>
              <button 
                onClick={() => setEditing(!editing)}
                className="edit-btn"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            {editing ? (
              <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="profile-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input 
                      name="name" 
                      placeholder="Enter your full name" 
                      value={profile.name} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input 
                      name="email" 
                      type="email"
                      placeholder="Enter your email" 
                      value={profile.email} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Skills</label>
                  <input 
                    name="skills" 
                    placeholder="Enter skills (comma separated)" 
                    value={profile.skills} 
                    onChange={handleChange} 
                  />
                </div>
                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            ) : (
              <div className="profile-display">
                <div className="profile-card">
                  <div className="profile-avatar">
                    <User size={48} />
                  </div>
                  <div className="profile-info">
                    <h4>{profile.name || 'Not set'}</h4>
                    <p>{profile.email || 'Not set'}</p>
                    <div className="skills-tags">
                      {profile.skills ? profile.skills.split(',').map((skill, i) => (
                        <span key={i} className="skill-tag">{skill.trim()}</span>
                      )) : <span className="no-skills">No skills added</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          
          <section ref={resumeRef} className="resume-section">
            <div className="section-header">
              <h3>Resume Management</h3>
              <div className="resume-actions">
                <button className="upload-btn">
                  <Upload size={20} /> Upload Resume
                </button>
              </div>
            </div>
            
            <div className="resume-upload-area">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleResumeUpload}
                id="resume-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="resume-upload" className="upload-zone">
                <Upload size={48} />
                <h4>Upload Your Resume</h4>
                <p>Drag and drop or click to select your resume file</p>
                <span className="file-types">Supports PDF, DOC, DOCX</span>
              </label>
              {resumeFile && (
                <div className="uploaded-file">
                  <FileText size={20} />
                  <span>{resumeFile.name}</span>
                </div>
              )}
            </div>
            
            <ResumeParser onParseComplete={(data) => {
              setAiAnalysis({
                resumeScore: data.score,
                extractedSkills: data.skills,
                suggestions: data.suggestions,
                personalInfo: data.personalInfo
              });
              setProfile(prev => ({
                ...prev,
                name: data.personalInfo.name,
                email: data.personalInfo.email,
                skills: data.skills.join(', ')
              }));
            }} />
            
            {loading && <LoadingSpinner />}
          </section>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="tab-content">
          <section ref={applicationsRef} className="applications-section">
            <div className="section-header">
              <h3>Application Tracking</h3>
              <div className="filter-buttons">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Pending</button>
                <button className="filter-btn">Interview</button>
                <button className="filter-btn">Rejected</button>
              </div>
            </div>
            
            <div className="applications-grid">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="application-header">
                    <div className="job-info">
                      <h4>{app.job}</h4>
                      <p>{app.company}</p>
                    </div>
                    <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="application-meta">
                    <span className="applied-date">Applied: {app.appliedDate}</span>
                  </div>
                  <div className="application-actions">
                    <button className="action-btn view">View Details</button>
                    <button className="action-btn follow-up">Follow Up</button>
                  </div>
                </div>
              ))} 
            </div>
          </section>
        </div>
      )}
      {activeTab === 'recommendations' && (
        <div className="tab-content">
          <section className="recommendations-section">
            <div className="section-header">
              <h3>Job Recommendations</h3>
              <p>Personalized job matches based on your profile and preferences</p>
            </div>
            
            <div className="recommendations-grid">
              {recommendations.map((rec) => (
                <div key={rec.id} className="recommendation-card">
                  <div className="match-score">
                    <div className="score-circle">
                      <span>{rec.match}%</span>
                    </div>
                    <span className="match-label">Match</span>
                  </div>
                  
                  <div className="job-details">
                    <h4>{rec.job}</h4>
                    <p className="company">{rec.company}</p>
                    <p className="salary">{rec.salary}</p>
                  </div>
                  
                  <div className="recommendation-actions">
                    <button 
                      onClick={() => navigate(`/job-details/${rec.id}`)}
                      className="view-job-btn"
                    >
                      View Job
                    </button>
                    <button className="save-job-btn">Save</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
      
      {activeTab === 'jobs' && (
        <div className="tab-content">
          <section className="jobs-section">
            <div className="section-header">
              <h3>Available Jobs</h3>
              <p>Browse all posted jobs and find your perfect match</p>
            </div>

            {/* ======= NEW: External jobs list (Remotive) =======
                This renders external jobs fetched by your ExternalAvailableJobs component.
                It is intentionally added ABOVE the existing internal jobs listing
                so previous logic/flow is preserved.
            */}
            <div className="external-jobs-wrapper" style={{ marginBottom: 20 }}>
              <ExternalAvailableJobs maxItems={6} />
            </div>
            {/* =================================================== */}

            {jobs.length === 0 ? (
              <div className="no-jobs-message">
                <Briefcase size={48} className="no-jobs-icon" />
                <h4>No jobs available yet</h4>
                <p>Check back later for new job postings</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <div key={job.id} className="job-listing-card">

                    {/* Job Title + Type */}
                    <div className="job-listing-header">
                      <h4>{job.title}</h4>
                      <span className="job-type-badge">{job.type || "N/A"}</span>
                    </div>

                    {/* Company + Location */}
                    <div className="job-listing-company">
                      <p>{job.company || "Unknown Company"}</p>
                      <span className="job-location">
                        {job.location || "Location not provided"}
                      </span>
                    </div>

                    {/* Salary */}
                    {job.salary && (
                      <div className="job-salary">
                        <span>{job.salary}</span>
                      </div>
                    )}

                    {/* Description Preview */}
                    {job.description && (
                      <div className="job-description-preview">
                        <p>{job.description.substring(0, 120)}...</p>
                      </div>
                    )}

                    {/* Skills — Safely rendered */}
                    <div className="job-skills-preview">
                      {(Array.isArray(job.skills)
                        ? job.skills
                        : typeof job.skills === "string"
                        ? job.skills.split(",")
                        : []
                      )
                        .slice(0, 3)
                        .map((skill, i) => (
                          <span key={i} className="skill-tag">
                            {skill.trim()}
                          </span>
                        ))}

                      {(!job.skills || job.skills.length === 0) && (
                        <span className="no-skills">No skills added</span>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="job-listing-footer">
                      <div className="job-meta">
                        <span className="posted-date">
                          Posted: {formatPostedDate(job.created_at)}
                        </span>
                        <span className="applicants">
                          {job.applicants || 0} applicants
                        </span>
                      </div>

                      <div className="job-actions">
                        <button
                          onClick={() => navigate(`/job-details/${job.id}`)}
                          className="view-job-btn"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleQuickApply(job.id, job.title)}
                          className="quick-apply-btn"
                        >
                          Quick Apply
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
  
      <div className="ai-assistant">
        <div className="assistant-header">
          <MessageCircle size={24} />
          <h3>AI Career Assistant</h3>
        </div>
        
        <div className="chat-container">
          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleChatSubmit} className="chat-input-form">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me about your career, job search, or skills..."
              className="chat-input"
            />
            <button type="submit" className="send-btn">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
