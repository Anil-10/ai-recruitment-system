import React from 'react';
import './Components.css';

function LoadingSpinner({ size = 'medium' }) {
  const sizeClass = `loading-spinner-${size}`;

  return (
    <div className="loading-container">
      <div className={`loading-spinner ${sizeClass}`}></div>
    </div>
  );
}

export default LoadingSpinner;