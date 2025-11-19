import React from 'react';
import { useNavigate } from 'react-router-dom';

function CTA() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/create-profile');
  };

  const handleScheduleDemo = () => {
    alert('Demo scheduling feature coming soon!');
  };

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-box" data-aos="zoom-in">
          <h2>Ready to Transform Your Recruitment Process?</h2>
          <p>Join thousands of companies and job seekers who are already benefiting from AI-powered recruitment.</p>
          <div className="cta-buttons">
            {/* <button className="btn btn-primary btn-large" onClick={handleGetStarted}>Get Started Free</button> */}
            <button className="btn btn-primary btn-large" onClick={handleScheduleDemo}>Schedule a Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA; 