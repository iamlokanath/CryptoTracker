import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

interface ScrollButtonProps {
  isDarkTheme: boolean;
}

const ScrollButton = styled.button<ScrollButtonProps>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.isDarkTheme
    ? 'linear-gradient(135deg, #3861fb, #304ffe)'
    : 'linear-gradient(135deg, #3861fb, #5c7cfa)'};
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, ${props => props.isDarkTheme ? '0.3' : '0.2'});
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  z-index: 999;
  
  &.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  
  &:hover {
    background: ${props => props.isDarkTheme
    ? 'linear-gradient(135deg, #304ffe, #3861fb)'
    : 'linear-gradient(135deg, #5c7cfa, #3861fb)'};
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, ${props => props.isDarkTheme ? '0.4' : '0.25'});
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
  
  svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    bottom: 20px;
    right: 20px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  // Show button when user scrolls down 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <ScrollButton
      className={isVisible ? 'visible' : ''}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      isDarkTheme={isDarkTheme}
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </ScrollButton>
  );
};

export default ScrollToTop; 