import React from 'react';

function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-number">93%</div>
            <div className="stat-description">Hiring success rate</div>
          </div>
          <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-number">12M+</div>
            <div className="stat-description">Job seekers</div>
          </div>
          <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-number">42K+</div>
            <div className="stat-description">Companies</div>
          </div>
          <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
            <div className="stat-number">75%</div>
            <div className="stat-description">Faster hiring</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats; 