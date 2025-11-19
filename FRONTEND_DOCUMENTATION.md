# React Frontend for TalentMatch AI

## Project Structure

```
project-root/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── Counter.jsx
│   ├── Hero.jsx
│   ├── Features.jsx
│   └── Footer.jsx
├── style.css
├── index.html
├── package.json
└── ...
```

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Main Files and Code

### `src/main.jsx`
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `src/App.jsx`
```jsx
import React from 'react';
import { Counter } from './Counter';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

function App() {
  return (
    <div style={{ padding: 40 }}>
      <Hero />
      <Features />
      <h1>TalentMatch AI | Intelligent Recruitment Platform</h1>
      <Counter />
      {/* Add more sections/components here as needed */}
      <Footer />
    </div>
  );
}

export default App;
```

### `src/Counter.jsx`
```jsx
import React, { useState } from 'react';

export function Counter() {
  const [counter, setCounter] = useState(0);

  return (
    <button onClick={() => setCounter(counter + 1)}>
      count is {counter}
    </button>
  );
}
```

### `src/Hero.jsx`
```jsx
import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>AI-Powered Recruitment That Works For Everyone</h1>
            <p className="hero-subtitle">Match the right talent to the right job with intelligent algorithms that understand skills, experience, and potential.</p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-large">Find Your Dream Job</button>
              <button className="btn btn-outline btn-large">Hire Top Talent</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="AI Recruitment Illustration" />
          </div>
        </div>
      </div>
      <div className="hero-shape"></div>
    </section>
  );
}

export default Hero;
```

### `src/Features.jsx`
```jsx
import React from 'react';

function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Intelligent Recruitment at Scale</h2>
          <p className="section-subtitle">Our AI-powered platform transforms how businesses hire and people find jobs</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-circle icon-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
            </div>
            <h3>Resume Parsing</h3>
            <p>Our NLP technology extracts key information from resumes to identify skills, experience, and qualifications automatically.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-circle icon-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
              </div>
            </div>
            <h3>Smart Matching</h3>
            <p>Advanced algorithms match candidates to jobs based on skills, experience, culture fit, and growth potential.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-circle icon-teal">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
              </div>
            </div>
            <h3>Bias Mitigation</h3>
            <p>Our AI is designed to reduce unconscious bias in the hiring process, focusing on skills and potential.</p>
          </div>
          <div className="feature-card">
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
```

### `src/Footer.jsx`
```jsx
import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-text">TalentMatch<span className="logo-accent">AI</span></span>
            </div>
            <p>Transforming recruitment with artificial intelligence and machine learning.</p>
            <div className="social-links">
              <a href="#" className="social-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
              <a href="#" className="social-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
              <a href="#" className="social-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Integrations</a></li>
                <li><a href="#">Case Studies</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Guides</a></li>
                <li><a href="#">Webinars</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 TalentMatchAI. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
```

---

- All styling is handled by `style.css`.
- You can add more sections as new components in the `src/` directory and import them in `App.jsx`. 