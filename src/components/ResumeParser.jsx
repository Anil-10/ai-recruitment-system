import React, { useState } from 'react';
import { parseResume } from '../utils/resumeParser';
import LoadingSpinner from './LoadingSpinner';
import './Components.css';

function ResumeParser({ onParseComplete }) {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setParsedData(null);
  };

  const handleParse = async () => {
    if (!file) return;
    
    setParsing(true);
    setProgress(0);
    
    try {
      // Simulate real-time progress
      setCurrentStep('Reading file content...');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentStep('Extracting personal information...');
      setProgress(40);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentStep('Analyzing skills and experience...');
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setCurrentStep('Calculating resume score...');
      setProgress(80);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentStep('Generating suggestions...');
      setProgress(95);
      
      const data = await parseResume(file);
      
      setProgress(100);
      setCurrentStep('Analysis complete!');
      
      setParsedData(data);
      if (onParseComplete) onParseComplete(data);
    } catch (error) {
      alert('Error parsing resume. Please try again.');
    } finally {
      setTimeout(() => {
        setParsing(false);
        setProgress(0);
        setCurrentStep('');
      }, 500);
    }
  };

  return (
    <div className="resume-parser">
      <div className="resume-upload-section">
        <h3>🤖 AI Resume Parser</h3>
        <p>Upload your resume and let our NLP technology extract key information automatically</p>
        
        <div className="file-upload-area">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="file-input"
          />
          {file && (
            <div className="file-info">
              <span>📄 {file.name}</span>
              <button 
                onClick={handleParse} 
                disabled={parsing}
                className="parse-btn"
              >
                {parsing ? 'Parsing...' : 'Parse Resume'}
              </button>
            </div>
          )}
        </div>

        {parsing && (
          <div className="parsing-status">
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{progress}%</div>
            </div>
            <p className="current-step">{currentStep}</p>
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>

      {parsedData && (
        <div className="parsed-results">
          <div className="results-header">
            <h4>✅ Resume Analysis Complete</h4>
            <div className="resume-score">
              Score: <span className="score-value">{parsedData.score}/100</span>
            </div>
          </div>

          <div className="parsed-sections">
            <div className="parsed-section">
              <h5>👤 Personal Information</h5>
              <div className="info-grid">
                <p><strong>Name:</strong> {parsedData.personalInfo.name}</p>
                <p><strong>Email:</strong> {parsedData.personalInfo.email}</p>
                <p><strong>Phone:</strong> {parsedData.personalInfo.phone}</p>
                <p><strong>Location:</strong> {parsedData.personalInfo.location}</p>
              </div>
            </div>

            <div className="parsed-section">
              <h5>🛠️ Extracted Skills</h5>
              <div className="skills-tags">
                {parsedData.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="parsed-section">
              <h5>💼 Work Experience</h5>
              {parsedData.experience.map((exp, idx) => (
                <div key={idx} className="experience-item">
                  <h6>{exp.title} at {exp.company}</h6>
                  <p className="duration">{exp.duration}</p>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>

            <div className="parsed-section">
              <h5>🎓 Education</h5>
              <p><strong>{parsedData.education.degree}</strong></p>
              <p>{parsedData.education.university} - {parsedData.education.year}</p>
            </div>

            <div className="parsed-section">
              <h5>📝 Professional Summary</h5>
              <p>{parsedData.summary}</p>
            </div>

            <div className="parsed-section suggestions">
              <h5>💡 AI Suggestions for Improvement</h5>
              <ul>
                {parsedData.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeParser;