import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function useAOS() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease',
      once: true,
      offset: 100,
    });
  }, []);
  useEffect(() => {
    AOS.refreshHard();
  });
}

function useSmoothScroll() {
  useEffect(() => {
    function handleClick(e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1 && document.querySelector(href)) {
          e.preventDefault();
          const target = document.querySelector(href);
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}

function Main() {
  useAOS();
  useSmoothScroll();
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
); 