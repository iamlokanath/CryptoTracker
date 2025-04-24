import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CryptoTable from './components/CryptoTable';
import Header from './components/Header';
import Footer from './components/Footer';
import FilterBar from './components/FilterBar';
import ScrollToTop from './components/ScrollToTop';
import cryptoWebSocket from './services/cryptoWebSocket';
import { useSelector, useDispatch } from 'react-redux';
import { selectOriginalAssets, setAssets, sortAssetsByField } from './features/crypto/cryptoSlice';

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

  // Initialize app with saved filter and apply appropriate sorting
  useEffect(() => {
    // Apply sorting based on initial filter
    if (filterType === 'gainers') {
      dispatch(sortAssetsByField({ field: 'priceChange24h', direction: 'desc' }));
    } else if (filterType === 'losers') {
      dispatch(sortAssetsByField({ field: 'priceChange24h', direction: 'asc' }));
    } else if (filterType === 'volume') {
      dispatch(sortAssetsByField({ field: 'volume24h', direction: 'desc' }));
    } else if (filterType === 'marketcap') {
      dispatch(sortAssetsByField({ field: 'marketCap', direction: 'desc' }));
    } else {
      dispatch(sortAssetsByField({ field: 'rank', direction: 'asc' }));
    }
  }, [dispatch, filterType]);

  const handleFilter = (filter: string) => {
    setFilterType(filter);
    try {
      localStorage.setItem('cryptoFilter', filter);
    } catch (error) {
      console.error('Error saving filter preference:', error);
    }

    // Apply sorting based on filter type
    if (filter === 'gainers') {
      dispatch(sortAssetsByField({ field: 'priceChange24h', direction: 'desc' }));
    } else if (filter === 'losers') {
      dispatch(sortAssetsByField({ field: 'priceChange24h', direction: 'asc' }));
    } else if (filter === 'volume') {
      dispatch(sortAssetsByField({ field: 'volume24h', direction: 'desc' }));
    } else if (filter === 'marketcap') {
      dispatch(sortAssetsByField({ field: 'marketCap', direction: 'desc' }));
    } else if (filter === 'all') {
      dispatch(sortAssetsByField({ field: 'rank', direction: 'asc' }));
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
    let filteredAssets = [...originalAssets];

    // Apply filter based on type
    if (filterType === 'gainers') {
      filteredAssets = filteredAssets.filter(asset => asset.priceChange24h > 0);
    } else if (filterType === 'losers') {
      filteredAssets = filteredAssets.filter(asset => asset.priceChange24h < 0);
    } else if (filterType === 'volume') {
      // For volume filter, we don't need to filter out assets
      // but the sort action in FilterBar component already handles sorting by volume
    } else if (filterType === 'marketcap') {
      // For marketcap filter, we don't need to filter out assets
      // but the sort action in FilterBar component already handles sorting by market cap
    }

    // Apply search term filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredAssets = filteredAssets.filter(asset =>
        asset.name.toLowerCase().includes(lowerSearchTerm) ||
        asset.symbol.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Update the filtered assets
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
      <ScrollToTop />
    </AppContainer>
  );
}

export default App;
