import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CryptoTable from './components/CryptoTable';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import cryptoWebSocket from './services/cryptoWebSocket';
import { useSelector, useDispatch } from 'react-redux';
import { selectAssets, setAssets, CryptoAsset } from './features/crypto/cryptoSlice';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: 'Arial', sans-serif;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-weight: 700;
`;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [filterType, setFilterType] = useState(() => {
    try {
      const savedFilter = localStorage.getItem('cryptoFilter');
      return savedFilter || 'all';
    } catch (error) {
      console.error('Error loading filter preference:', error);
      return 'all';
    }
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    try {
      const savedSearch = localStorage.getItem('cryptoSearch');
      return savedSearch || '';
    } catch (error) {
      console.error('Error loading search preference:', error);
      return '';
    }
  });
  const assets = useSelector(selectAssets);
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect to WebSocket when component mounts
    cryptoWebSocket.connect();
    setIsConnected(true);

    // Disconnect when component unmounts
    return () => {
      cryptoWebSocket.disconnect();
      setIsConnected(false);
    };
  }, []);

  const handleFilter = (filter: string) => {
    setFilterType(filter);
    try {
      localStorage.setItem('cryptoFilter', filter);
    } catch (error) {
      console.error('Error saving filter preference:', error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    try {
      localStorage.setItem('cryptoSearch', term);
    } catch (error) {
      console.error('Error saving search preference:', error);
    }
  };

  // Filter assets based on filter type and search term
  useEffect(() => {
    const originalAssets = assets;
    let filteredAssets = [...originalAssets];

    // Apply filter based on type
    if (filterType === 'gainers') {
      filteredAssets = filteredAssets.filter(asset => asset.priceChange24h > 0);
    } else if (filterType === 'losers') {
      filteredAssets = filteredAssets.filter(asset => asset.priceChange24h < 0);
    }

    // Apply search term filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredAssets = filteredAssets.filter(asset =>
        asset.name.toLowerCase().includes(lowerSearchTerm) ||
        asset.symbol.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Only update the state if the filters are active
    if (filterType !== 'all' || searchTerm) {
      dispatch(setAssets(filteredAssets));
    }
  }, [filterType, searchTerm, dispatch]);

  return (
    <AppContainer>
      <Header isConnected={isConnected} />
      <Main>
        <Title>Cryptocurrency Prices by Market Cap</Title>
        <FilterBar onFilter={handleFilter} onSearch={handleSearch} />
        <CryptoTable />
      </Main>
    </AppContainer>
  );
}

export default App;
