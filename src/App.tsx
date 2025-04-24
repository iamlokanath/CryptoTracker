import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CryptoTable from './components/CryptoTable';
import Header from './components/Header';
import Footer from './components/Footer';
import FilterBar from './components/FilterBar';
import cryptoWebSocket from './services/cryptoWebSocket';
import { useSelector, useDispatch } from 'react-redux';
import { selectOriginalAssets, setAssets } from './features/crypto/cryptoSlice';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--light-bg);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 60px;
  width: 100%;
  flex: 1;
`;

const Title = styled.h2`
  color: var(--text-primary);
  margin-bottom: 24px;
  font-weight: 700;
  font-size: 28px;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, var(--primary-color), var(--success-color));
    border-radius: 2px;
  }
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
  const originalAssets = useSelector(selectOriginalAssets);
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
    console.log('Filter/search triggered with:', { filterType, searchTerm });
    console.log('Original assets count:', originalAssets.length);

    let filteredAssets = [...originalAssets];

    // Apply filter based on type
    if (filterType === 'gainers') {
      filteredAssets = filteredAssets.filter(asset => asset.priceChange24h > 0);
      console.log('After gainers filter:', filteredAssets.length);
    } else if (filterType === 'losers') {
      filteredAssets = filteredAssets.filter(asset => asset.priceChange24h < 0);
      console.log('After losers filter:', filteredAssets.length);
    }

    // Apply search term filter
    if (searchTerm && searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      console.log('Searching for term:', lowerSearchTerm);

      filteredAssets = filteredAssets.filter(asset => {
        const nameMatch = asset.name.toLowerCase().includes(lowerSearchTerm);
        const symbolMatch = asset.symbol.toLowerCase().includes(lowerSearchTerm);
        console.log(`Asset ${asset.symbol}: name match = ${nameMatch}, symbol match = ${symbolMatch}`);
        return nameMatch || symbolMatch;
      });

      console.log('After search filter:', filteredAssets.length);
    }

    // Update the filtered assets
    console.log('Dispatching filtered assets:', filteredAssets.length);
    dispatch(setAssets(filteredAssets));
  }, [filterType, searchTerm, originalAssets, dispatch]);

  return (
    <AppContainer>
      <Header isConnected={isConnected} />
      <Main>
        <Title>Cryptocurrency Prices by Market Cap</Title>
        <FilterBar onFilter={handleFilter} onSearch={handleSearch} />
        <CryptoTable />
      </Main>
      <Footer />
    </AppContainer>
  );
}

export default App;
