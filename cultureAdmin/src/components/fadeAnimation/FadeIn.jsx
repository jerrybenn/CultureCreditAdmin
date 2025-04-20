import React, { useState, useEffect } from 'react';
import './FadeIn.css';

const FadeIn = ({ children, delay = 0, duration = 0.5 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`fade-in ${isVisible ? 'visible' : ''}`}
      style={{ transitionDuration: `${duration}s` }}
    >
      {children}
    </div>
  );
};

export default FadeIn; 