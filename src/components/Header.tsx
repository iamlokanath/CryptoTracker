import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #0d1117;
  padding: 16px 0;
  margin-bottom: 24px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  h1 {
    color: #fff;
    font-size: 24px;
    margin: 0;
    
    span {
      color: #16c784;
    }
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: #16c784;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const ConnectionStatus = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.isConnected ? '#16c784' : '#ea3943'};
  font-size: 14px;
  padding: 6px 12px;
  background-color: rgba(22, 199, 132, 0.1);
  border-radius: 20px;
`;

const StatusDot = styled.div<{ isConnected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.isConnected ? '#16c784' : '#ea3943'};
`;

interface HeaderProps {
    isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
    return (
        <HeaderContainer>
            <HeaderContent>
                <Logo>
                    <LogoIcon>C</LogoIcon>
                    <h1>Crypto<span>Tracker</span></h1>
                </Logo>
                <ConnectionStatus isConnected={isConnected}>
                    <StatusDot isConnected={isConnected} />
                    {isConnected ? 'Connected' : 'Disconnected'}
                </ConnectionStatus>
            </HeaderContent>
        </HeaderContainer>
    );
};

export default Header; 