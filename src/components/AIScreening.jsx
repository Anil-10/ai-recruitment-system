import React, { useState } from 'react';
import { AIResumeScreener } from '../utils/aiMatcher';
import './Components.css';

function AIScreening() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const screener = new AIResumeScreener();

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      alert('Please provide both job description and resume text');
      return;
    }

    setLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const matchResult = screener.calculateOverallScore(resumeText, jobDescription);
    setResults(matchResult);
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="ai-screening">
      <div className="screening-header">
        <h3>🤖 AI Resume Screening & Matching</h3>
        <p>Advanced NLP analysis using TF-IDF, semantic similarity, and keyword matching</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label>Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            className="job-input"
          />
        </div>

        <div className="input-group">
          <label>Resume Text</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste the resume text here..."
            rows={8}
            className="resume-input"
          />
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="analyze-btn"
        >
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </button>
      </div>

      {loading && (
        <div className="loading-analysis">
          <div className="analysis-steps">
            <div className="step">🔍 Preprocessing text...</div>
            <div className="step">📊 Calculating TF-IDF scores...</div>
            <div className="step">🎯 Analyzing keyword overlap...</div>
            <div className="step">🧠 Computing semantic similarity...</div>
            <div className="step">⚡ Generating recommendations...</div>
          </div>
        </div>
      )}

      {results && (
        <div className="results-section">
          <div className="overall-score">
            <div className="score-circle" style={{ borderColor: getScoreColor(results.overallScore) }}>
              <span className="score-number">{results.overallScore}%</span>
              <span className="score-label">{getScoreLabel(results.overallScore)}</span>
            </div>
          </div>

          <div className="breakdown-scores">
            <h4>Score Breakdown</h4>
            <div className="score-bars">
              <div className="score-bar">
                <span>TF-IDF Similarity</span>
                <div className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${results.breakdown.tfidf}%`, backgroundColor: getScoreColor(results.breakdown.tfidf) }}
                  ></div>
                </div>
                <span>{results.breakdown.tfidf}%</span>
              </div>

              <div className="score-bar">
                <span>Keyword Overlap</span>
                <div className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${results.breakdown.keywords}%`, backgroundColor: getScoreColor(results.breakdown.keywords) }}
                  ></div>
                </div>
                <span>{results.breakdown.keywords}%</span>
              </div>

              <div className="score-bar">
                <span>Skills Match</span>
                <div className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${results.breakdown.skills}%`, backgroundColor: getScoreColor(results.breakdown.skills) }}
                  ></div>
                </div>
                <span>{results.breakdown.skills}%</span>
              </div>

              <div className="score-bar">
                <span>Semantic Similarity</span>
                <div className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${results.breakdown.semantic}%`, backgroundColor: getScoreColor(results.breakdown.semantic) }}
                  ></div>
                </div>
                <span>{results.breakdown.semantic}%</span>
              </div>
            </div>
          </div>

          <div className="skills-analysis">
            <h4>Skills Analysis</h4>
            <div className="skills-grid">
              <div className="skills-column">
                <h5>✅ Matched Skills</h5>
                <div className="skills-tags">
                  {results.skillsAnalysis.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="skill-tag matched">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="skills-column">
                <h5>❌ Missing Skills</h5>
                <div className="skills-tags">
                  {results.skillsAnalysis.jobSkills
                    .filter(skill => !results.skillsAnalysis.matchedSkills.includes(skill))
                    .map((skill, idx) => (
                      <span key={idx} className="skill-tag missing">{skill}</span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations">
            <h4>💡 AI Recommendations</h4>
            <ul>
              {results.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIScreening;