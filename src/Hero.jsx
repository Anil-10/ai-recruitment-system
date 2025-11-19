import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import

function Hero() {
  const navigate = useNavigate(); // Add this hook

  const handleFindJobsClick = () => {
    navigate('/find-jobs'); // Navigate to job portal
  };

  const handleHireTalentClick = () => {
    navigate('/recruiter'); // Navigate to recruiter dashboard
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text" data-aos="fade-up" data-aos-delay="100">
            <h1>AI-Powered Recruitment That Works For Everyone</h1>
            <p className="hero-subtitle">Match the right talent to the right job with intelligent algorithms that understand skills, experience, and potential.</p>
            <div className="hero-cta">
              <button 
                className="btn btn-primary btn-large"
                onClick={handleFindJobsClick}
              >
                Find Your Dream Job
              </button>
              {/* <button 
                className="btn btn-outline btn-large"
                onClick={handleHireTalentClick}
              >
                Hire Top Talent
              </button> */}
            </div>
          </div>
          <div className="hero-image" data-aos="fade-left" data-aos-delay="200">
            <img src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="AI Recruitment Illustration" />
          </div>
        </div>
      </div>
      <div className="hero-shape"></div>
    </section>
  );
}

export default Hero;