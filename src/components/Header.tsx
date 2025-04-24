import React from 'react';
import styled from 'styled-components';
import ThemeToggle from './ThemeToggle';

const HeaderContainer = styled.header`
  background: linear-gradient(to right, var(--footer-gradient-start), var(--footer-gradient-end));
  padding: 20px 0;
  margin-bottom: 30px;
  box-shadow: var(--shadow-md);
  transition: background-color 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    color: #fff;
    font-size: 26px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
    
    span {
      color: var(--success-color);
      background: linear-gradient(to right, #16c784, #16c7c7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

// const LogoIcon = styled.div`
//   width: 40px;
//   height: 40px;
//   background: linear-gradient(135deg, var(--success-color), #16c7c7);
//   border-radius: 12px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: #fff;
//   font-weight: bold;
//   font-size: 20px;
//   box-shadow: 0 4px 12px rgba(22, 199, 132, 0.3);
// `;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.isConnected ? 'var(--success-color)' : 'var(--danger-color)'};
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  background-color: ${props => props.isConnected
    ? 'rgba(22, 199, 132, 0.15)'
    : 'rgba(234, 57, 67, 0.15)'};
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const StatusDot = styled.div<{ isConnected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.isConnected ? 'var(--success-color)' : 'var(--danger-color)'};
  box-shadow: 0 0 0 4px ${props => props.isConnected
    ? 'rgba(22, 199, 132, 0.2)'
    : 'rgba(234, 57, 67, 0.2)'};
  animation: ${props => props.isConnected ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(22, 199, 132, 0.7);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(22, 199, 132, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(22, 199, 132, 0);
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface HeaderProps {
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          {/* <LogoIcon>C</LogoIcon> */}
          <h1>Crypto<span>Tracker</span></h1>
        </Logo>
        <HeaderRight>
          <ThemeToggle />
          <ConnectionStatus isConnected={isConnected}>
            <StatusDot isConnected={isConnected} />
            {isConnected ? 'Live Updates' : 'Disconnected'}
          </ConnectionStatus>
        </HeaderRight>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 