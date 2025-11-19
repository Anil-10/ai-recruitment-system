import React from 'react';

function Footer() {
  const handleSocialClick = (platform) => {
    alert(`Redirecting to ${platform}...`);
  };

  const handleLinkClick = (section) => {
    alert(`${section} page coming soon!`);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand" data-aos="fade-up">
            <div className="logo">
              <span className="logo-text">TalentMatch<span className="logo-accent">AI</span></span>
            </div>
            <p>Transforming recruitment with artificial intelligence and machine learning.</p>
            <div className="social-links">
              <button onClick={() => handleSocialClick('LinkedIn')} className="social-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></button>
              <button onClick={() => handleSocialClick('Twitter')} className="social-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></button>
              <button onClick={() => handleSocialClick('Instagram')} className="social-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></button>
            </div>
          </div>
          <div className="footer-links" data-aos="fade-up" data-aos-delay="200">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><button onClick={() => handleLinkClick('Features')} className="footer-link-btn">Features</button></li>
                <li><button onClick={() => handleLinkClick('Pricing')} className="footer-link-btn">Pricing</button></li>
                <li><button onClick={() => handleLinkClick('Integrations')} className="footer-link-btn">Integrations</button></li>
                <li><button onClick={() => handleLinkClick('Case Studies')} className="footer-link-btn">Case Studies</button></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><button onClick={() => handleLinkClick('About Us')} className="footer-link-btn">About Us</button></li>
                <li><button onClick={() => handleLinkClick('Careers')} className="footer-link-btn">Careers</button></li>
                <li><button onClick={() => handleLinkClick('Blog')} className="footer-link-btn">Blog</button></li>
                <li><button onClick={() => handleLinkClick('Press')} className="footer-link-btn">Press</button></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><button onClick={() => handleLinkClick('Help Center')} className="footer-link-btn">Help Center</button></li>
                <li><button onClick={() => handleLinkClick('Documentation')} className="footer-link-btn">Documentation</button></li>
                <li><button onClick={() => handleLinkClick('Guides')} className="footer-link-btn">Guides</button></li>
                <li><button onClick={() => handleLinkClick('Webinars')} className="footer-link-btn">Webinars</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 TalentMatchAI. All rights reserved.</p>
          <div className="legal-links">
            <button onClick={() => handleLinkClick('Privacy Policy')} className="footer-link-btn">Privacy Policy</button>
            <button onClick={() => handleLinkClick('Terms of Service')} className="footer-link-btn">Terms of Service</button>
            <button onClick={() => handleLinkClick('Cookie Policy')} className="footer-link-btn">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 