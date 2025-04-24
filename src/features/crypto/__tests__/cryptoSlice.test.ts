import cryptoReducer, {
  updatePrices,
  setAssets,
  setStatus,
  setError,
  sortAssetsByField,
  selectAssets,
  selectStatus,
  selectError,
  selectSortField,
  selectSortDirection,
  CryptoState,
  CryptoAsset,
  SortField,
  SortDirection
} from '../cryptoSlice';
import { configureStore } from '@reduxjs/toolkit';

describe('crypto reducer', () => {
  const initialState: CryptoState = {
    assets: [],
    status: 'idle',
    error: null,
    sortField: 'rank',
    sortDirection: 'asc',
  };

  const sampleAssets: CryptoAsset[] = [
    {
      id: 'bitcoin',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: 'https://example.com/btc.png',
      price: 50000,
      priceChange1h: 0.5,
      priceChange24h: 1.2,
      priceChange7d: -0.8,
      marketCap: 950000000000,
      volume24h: 30000000000,
      circulatingSupply: 19000000,
      maxSupply: 21000000,
      chartData: [49000, 50000, 51000],
    },
    {
      id: 'ethereum',
      rank: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://example.com/eth.png',
      price: 3000,
      priceChange1h: -0.2,
      priceChange24h: 2.5,
      priceChange7d: 5.1,
      marketCap: 350000000000,
      volume24h: 15000000000,
      circulatingSupply: 120000000,
      maxSupply: null,
      chartData: [2900, 3000, 3100],
    },
  ];

  it('should return the initial state', () => {
    expect(cryptoReducer(undefined, { type: undefined })).toEqual(
      expect.objectContaining({
        status: 'idle',
        error: null,
        sortField: expect.any(String),
        sortDirection: expect.any(String),
      })
    );
  });

  // Test setAssets reducer
  it('should handle setAssets', () => {
    const state = cryptoReducer(initialState, setAssets(sampleAssets));
    expect(state.assets).toEqual(sampleAssets);
    expect(state.assets.length).toBe(2);
  });

  // Test setStatus reducer
  it('should handle setStatus', () => {
    const state = cryptoReducer(initialState, setStatus('loading'));
    expect(state.status).toEqual('loading');
  });

  // Test setError reducer
  it('should handle setError', () => {
    const errorMessage = 'Connection failed';
    const state = cryptoReducer(initialState, setError(errorMessage));
    expect(state.error).toEqual(errorMessage);
  });

  // Test sortAssetsByField reducer with same field (toggle direction)
  it('should handle sortAssetsByField with same field', () => {
    const startState: CryptoState = {
      ...initialState,
      assets: sampleAssets,
      sortField: 'price',
      sortDirection: 'asc',
    };
    
    const state = cryptoReducer(startState, sortAssetsByField({ field: 'price' }));
    expect(state.sortField).toEqual('price');
    expect(state.sortDirection).toEqual('desc');
    expect(state.assets[0].price).toBeGreaterThan(state.assets[1].price);
  });

  // Test sortAssetsByField reducer with different field
  it('should handle sortAssetsByField with different field', () => {
    const startState: CryptoState = {
      ...initialState,
      assets: sampleAssets,
      sortField: 'rank',
      sortDirection: 'asc',
    };
    
    const state = cryptoReducer(startState, sortAssetsByField({ field: 'price' }));
    expect(state.sortField).toEqual('price');
    expect(state.sortDirection).toEqual('asc');
    expect(state.assets[0].price).toBeLessThan(state.assets[1].price);
  });

  // Test sortAssetsByField reducer with explicit direction
  it('should handle sortAssetsByField with explicit direction', () => {
    const startState: CryptoState = {
      ...initialState,
      assets: sampleAssets,
      sortField: 'rank',
      sortDirection: 'asc',
    };
    
    const state = cryptoReducer(
      startState, 
      sortAssetsByField({ field: 'price', direction: 'desc' })
    );
    
    expect(state.sortField).toEqual('price');
    expect(state.sortDirection).toEqual('desc');
    expect(state.assets[0].price).toBeGreaterThan(state.assets[1].price);
  });

  // Test updatePrices reducer
  it('should handle updatePrices', () => {
    const startState: CryptoState = {
      ...initialState,
      assets: sampleAssets,
    };
    
    const state = cryptoReducer(startState, updatePrices());
    expect(state.assets.length).toBe(sampleAssets.length);
    
    // Prices should have changed but not be exactly the same
    expect(state.assets[0].price).not.toEqual(sampleAssets[0].price);
    expect(state.assets[1].price).not.toEqual(sampleAssets[1].price);
  });
});

// Test selectors
describe('crypto selectors', () => {
  const sampleAssets: CryptoAsset[] = [
    {
      id: 'bitcoin',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: 'https://example.com/btc.png',
      price: 50000,
      priceChange1h: 0.5,
      priceChange24h: 1.2,
      priceChange7d: -0.8,
      marketCap: 950000000000,
      volume24h: 30000000000,
      circulatingSupply: 19000000,
      maxSupply: 21000000,
      chartData: [49000, 50000, 51000],
    },
  ];

  const mockState = {
    crypto: {
      assets: sampleAssets,
      status: 'idle' as const,
      error: null,
      sortField: 'rank' as SortField,
      sortDirection: 'asc' as SortDirection,
    },
    counter: {
      value: 0,
    },
  };

  it('selectAssets should return assets array', () => {
    const assets = selectAssets(mockState);
    expect(assets).toEqual(sampleAssets);
  });

  it('selectStatus should return current status', () => {
    const status = selectStatus(mockState);
    expect(status).toEqual('idle');
  });

  it('selectError should return error state', () => {
    const error = selectError(mockState);
    expect(error).toBeNull();
  });

  it('selectSortField should return current sort field', () => {
    const sortField = selectSortField(mockState);
    expect(sortField).toEqual('rank');
  });

  it('selectSortDirection should return current sort direction', () => {
    const sortDirection = selectSortDirection(mockState);
    expect(sortDirection).toEqual('asc');
  });
}); 