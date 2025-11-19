import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Upload, User } from 'lucide-react';
import ResumeParser from '../components/ResumeParser';
import './Dashboard.css';

function CreateProfile() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    location: '',
    experience: '',
    skills: '',
    bio: '',
    portfolio: '',
    linkedin: '',
    github: '',
    expectedSalary: '',
    availability: 'immediate',
    workType: 'full-time',
    resume: null
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }
    
    if (step === 2) {
      if (!formData.experience) newErrors.experience = 'Experience level is required';
      if (!formData.skills) newErrors.skills = 'Skills are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage
      localStorage.setItem('user_profile', JSON.stringify(formData));
      
      alert('Profile created successfully!');
      navigate('/jobseeker');
    } catch (error) {
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard create-profile">
      <div className="user-info-bar">
        <div className="user-info">
          <div className="user-avatar">
            <User size={24} />
          </div>
          <div>
            <span className="user-name">Create Your Profile</span>
            <span className="user-role">Step {currentStep} of 3</span>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="back-btn">Back to Home</button>
      </div>

      <div className="profile-creation-container">
        <div className="progress-bar">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Personal Info</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Professional</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Additional</span>
            </div>
          </div>
          <div className="progress-line">
            <div className="progress-fill" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Personal Information</h2>
              <p>Let's start with your basic information</p>
              
              <div className="form-grid">
                <div className="input-group">
                  <input
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                
                <div className="input-group">
                  <input
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="input-group">
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-grid">
                <div className="input-group">
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                
                <div className="input-group">
                  <input
                    name="location"
                    placeholder="Location (City, State)"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Professional Details</h2>
              <p>Tell us about your professional background</p>
              
              <div className="form-grid">
                <div className="input-group">
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={errors.experience ? 'error' : ''}
                  >
                    <option value="">Experience Level *</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior Level (6-10 years)</option>
                    <option value="expert">Expert Level (10+ years)</option>
                  </select>
                  {errors.experience && <span className="error-text">{errors.experience}</span>}
                </div>
                
                <div className="input-group">
                  <select
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>
              
              <div className="input-group">
                <input
                  name="skills"
                  placeholder="Skills (comma separated) *"
                  value={formData.skills}
                  onChange={handleChange}
                  className={errors.skills ? 'error' : ''}
                />
                {errors.skills && <span className="error-text">{errors.skills}</span>}
              </div>
              
              <div className="input-group">
                <textarea
                  name="bio"
                  placeholder="Professional Bio (Tell us about yourself)"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Additional Information</h2>
              <p>Optional details to enhance your profile</p>
              
              <div className="form-grid">
                <div className="input-group">
                  <input
                    name="portfolio"
                    placeholder="Portfolio URL"
                    value={formData.portfolio}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="input-group">
                  <input
                    name="linkedin"
                    placeholder="LinkedIn Profile"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-grid">
                <div className="input-group">
                  <input
                    name="github"
                    placeholder="GitHub Profile"
                    value={formData.github}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="input-group">
                  <input
                    name="expectedSalary"
                    placeholder="Expected Salary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="input-group">
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="immediate">Available Immediately</option>
                  <option value="2weeks">2 Weeks Notice</option>
                  <option value="1month">1 Month Notice</option>
                  <option value="3months">3+ Months</option>
                </select>
              </div>
              
              <ResumeParser onParseComplete={(data) => {
                setFormData(prev => ({
                  ...prev,
                  firstName: data.personalInfo.name.split(' ')[0] || prev.firstName,
                  lastName: data.personalInfo.name.split(' ').slice(1).join(' ') || prev.lastName,
                  email: data.personalInfo.email || prev.email,
                  phone: data.personalInfo.phone || prev.phone,
                  location: data.personalInfo.location || prev.location,
                  skills: data.skills.join(', ') || prev.skills,
                  bio: data.summary || prev.bio
                }));
              }} />
            </div>
          )}
          
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="nav-btn prev">
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="nav-btn next">
                Next Step
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProfile;