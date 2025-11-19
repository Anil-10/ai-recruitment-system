import React from 'react';

function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">Intelligent Recruitment at Scale</h2>
          <p className="section-subtitle">Our AI-powered platform transforms how businesses hire and people find jobs</p>
        </div>
        <div className="features-grid">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
            <div className="feature-icon">
              <div className="icon-circle icon-purple">
                {/* SVG icon here */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
            </div>
            <h3>Resume Parsing</h3>
            <p>Our NLP technology extracts key information from resumes to identify skills, experience, and qualifications automatically.</p>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div className="feature-icon">
              <div className="icon-circle icon-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
              </div>
            </div>
            <h3>Smart Matching</h3>
            <p>Advanced algorithms match candidates to jobs based on skills, experience, culture fit, and growth potential.</p>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <div className="feature-icon">
              <div className="icon-circle icon-teal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
              </div>
            </div>
            <h3>Bias Mitigation</h3>
            <p>Our AI is designed to reduce unconscious bias in the hiring process, focusing on skills and potential.</p>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
            <div className="feature-icon">
              <div className="icon-circle icon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
              </div>
            </div>
            <h3>Real-time Insights</h3>
            <p>Comprehensive analytics dashboards provide actionable insights into your recruitment process.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features; 