import React from 'react';

function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">Trusted by Industry Leaders</h2>
          <p className="section-subtitle">See what our users say about their experience</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card" data-aos="fade-up" data-aos-delay="100">
            <div className="testimonial-content">
              <p>"TalentMatchAI helped us reduce our time-to-hire by 65% while improving the quality of candidates. The AI matching is incredibly accurate."</p>
            </div>
            <div className="testimonial-author">
              <img src="https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Sarah Johnson" className="author-image" />
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>HR Director, TechGlobal</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card" data-aos="fade-up" data-aos-delay="200">
            <div className="testimonial-content">
              <p>"I found my dream job within two weeks of using TalentMatchAI. The personalized recommendations were spot on with my skills and career goals."</p>
            </div>
            <div className="testimonial-author">
              <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Marcus Lee" className="author-image" />
              <div className="author-info">
                <h4>Marcus Lee</h4>
                <p>Software Engineer</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card" data-aos="fade-up" data-aos-delay="300">
            <div className="testimonial-content">
              <p>"The analytics dashboard gives us incredible insights into our hiring pipeline. We've been able to optimize our process and find better candidates faster."</p>
            </div>
            <div className="testimonial-author">
              <img src="https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Alisha Patel" className="author-image" />
              <div className="author-info">
                <h4>Alisha Patel</h4>
                <p>Talent Acquisition Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials; 