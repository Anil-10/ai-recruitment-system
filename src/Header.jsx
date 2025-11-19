import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // ⬅️ NEW

function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useUser(); // ⬅️ NEW
  const userRole = user?.user_metadata?.type; // recruiter / jobseeker / admin

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleToggle = () => setMenuActive((prev) => !prev);
  const handleNavClick = () => setMenuActive(false);

  const handleLogoClick = () => {
    navigate('/');
    handleNavClick();
  };

  const goToDashboard = () => {
    if (!user) return navigate('/login');
    if (userRole === 'recruiter') navigate('/recruiter');
    else if (userRole === 'admin') navigate('/admin');
    else navigate('/jobseeker');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/login?register=true');

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">

          {/* LOGO */}
          <div className="logo" onClick={handleLogoClick}>
            <span className="logo-text">
              TalentMatch<span className="logo-accent">AI</span>
            </span>
          </div>

          {/* NAVIGATION */}
          <nav className={`main-nav${menuActive ? ' active' : ''}`}>
            <ul className="nav-links">
              <li><a href="#features" onClick={handleNavClick}>Features</a></li>
              <li><a href="#job-seekers" onClick={handleNavClick}>Job Seekers</a></li>
              <li><a href="#recruiters" onClick={handleNavClick}>Recruiters</a></li>
              <li><a href="#testimonials" onClick={handleNavClick}>Testimonials</a></li>
            </ul>
          </nav>

          {/* AUTH / USER STATE */}
          <div className="auth-buttons">
            {!user ? (
              <>
                <button className="btn btn-secondary" onClick={goToLogin}>Log In</button>
                <button className="btn btn-primary" onClick={goToSignup}>Sign Up Free</button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={goToDashboard}>
                  {user.email.split('@')[0]} ({userRole})
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className={`mobile-menu-toggle${menuActive ? ' active' : ''}`}
            onClick={handleToggle}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

        </div>
      </div>
    </header>
  );
}

export default Header;










// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Header() {
//   const [menuActive, setMenuActive] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     function onScroll() {
//       setScrolled(window.scrollY > 100);
//     }
//     window.addEventListener('scroll', onScroll);
//     onScroll();
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const handleToggle = () => setMenuActive((prev) => !prev);
//   const handleNavClick = () => setMenuActive(false);
//   const goToLogin = () => navigate('/login');
//   const goToSignup = () => navigate('/login?register=true'); // ✅ Show register form inside Login.jsx

//   return (
//     <header className={`header${scrolled ? ' scrolled' : ''}`}>
//       <div className="container">
//         <div className="header-content">
//           <div className="logo">
//             <span className="logo-text">TalentMatch<span className="logo-accent">AI</span></span>
//           </div>
//           <nav className={`main-nav${menuActive ? ' active' : ''}`}>
//             <ul className="nav-links">
//               <li><a href="#features" onClick={handleNavClick}>Features</a></li>
//               <li><a href="#job-seekers" onClick={handleNavClick}>Job Seekers</a></li>
//               <li><a href="#recruiters" onClick={handleNavClick}>Recruiters</a></li>
//               <li><a href="#testimonials" onClick={handleNavClick}>Testimonials</a></li>
//             </ul>
//           </nav>
//           <div className="auth-buttons">
//             <button className="btn btn-secondary" onClick={goToLogin}>Log In</button>
//             <button className="btn btn-primary" onClick={goToSignup}>Sign Up Free</button>
//           </div>
//           <button className={`mobile-menu-toggle${menuActive ? ' active' : ''}`} onClick={handleToggle} aria-label="Toggle menu">
//             <span className="bar"></span>
//             <span className="bar"></span>
//             <span className="bar"></span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;
