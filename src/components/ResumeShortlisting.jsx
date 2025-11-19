import React, { useState } from 'react';
import './Components.css';

function ResumeShortlisting() {
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const uploadResumes = async () => {
    if (files.length === 0) {
      alert('Please select resume files');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Resumes uploaded successfully!');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  const shortlistResumes = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter job description');
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/shortlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd: jobDescription })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        alert('Shortlisting failed');
      }
    } catch (error) {
      alert('Error processing resumes');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="resume-shortlisting">
      <div className="shortlisting-header">
        <h3>📋 AI Resume Shortlisting</h3>
        <p>Upload resumes and get AI-powered candidate ranking</p>
      </div>

      <div className="upload-section">
        <h4>1. Upload Resume Files</h4>
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          className="file-input"
        />
        {files.length > 0 && (
          <div className="file-list">
            <p>{files.length} files selected</p>
            <button 
              onClick={uploadResumes} 
              disabled={uploading}
              className="upload-btn"
            >
              {uploading ? 'Uploading...' : 'Upload Resumes'}
            </button>
          </div>
        )}
      </div>

      <div className="jd-section">
        <h4>2. Enter Job Description</h4>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={6}
          className="jd-textarea"
        />
      </div>

      <div className="action-section">
        <button 
          onClick={shortlistResumes}
          disabled={loading}
          className="shortlist-btn"
        >
          {loading ? 'Processing...' : 'Shortlist Candidates'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="results-section">
          <h4>🏆 Shortlisted Candidates</h4>
          <div className="candidates-list">
            {results.map((candidate, idx) => (
              <div key={idx} className="candidate-item">
                <div className="candidate-info">
                  <div className="candidate-rank">#{idx + 1}</div>
                  <div className="candidate-details">
                    <h5>{candidate.name}</h5>
                    <p>{candidate.file}</p>
                  </div>
                </div>
                <div className="candidate-score">
                  <div 
                    className="score-badge"
                    style={{ backgroundColor: getScoreColor(candidate.score) }}
                  >
                    {candidate.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeShortlisting;