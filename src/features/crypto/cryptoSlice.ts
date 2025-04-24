import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export type SortDirection = 'asc' | 'desc';
export type SortField = 'rank' | 'name' | 'price' | 'priceChange1h' | 'priceChange24h' | 'priceChange7d' | 'marketCap' | 'volume24h' | 'circulatingSupply';

export interface CryptoAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  chartData: number[];
}

export interface CryptoState {
  assets: CryptoAsset[];
  originalAssets: CryptoAsset[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  sortField: SortField;
  sortDirection: SortDirection;
}

// Load sort preferences from localStorage if available
const getSavedSortPreferences = (): { field: SortField; direction: SortDirection } => {
  try {
    const savedSort = localStorage.getItem('cryptoSort');
    if (savedSort) {
      const { field, direction } = JSON.parse(savedSort);
      return { field, direction };
    }
  } catch (error) {
    console.error('Error loading sort preferences:', error);
  }
  
  return { field: 'rank', direction: 'asc' };
};

const { field: savedSortField, direction: savedSortDirection } = getSavedSortPreferences();

// Sample initial data
const initialState: CryptoState = {
  assets: [
    {
      id: 'bitcoin',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      price: 65432.12,
      priceChange1h: 0.5,
      priceChange24h: 1.2,
      priceChange7d: -2.3,
      marketCap: 1236789456123,
      volume24h: 32165498712,
      circulatingSupply: 19456789,
      maxSupply: 21000000,
      chartData: [45000, 46000, 47500, 48200, 47800, 49100, 50200],
    },
    {
      id: 'ethereum',
      rank: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      price: 3456.78,
      priceChange1h: -0.2,
      priceChange24h: 2.1,
      priceChange7d: 5.4,
      marketCap: 412365897123,
      volume24h: 15698732456,
      circulatingSupply: 120654789,
      maxSupply: null,
      chartData: [3200, 3150, 3300, 3400, 3380, 3450, 3500],
    },
    {
      id: 'tether',
      rank: 3,
      name: 'Tether',
      symbol: 'USDT',
      logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      price: 1.0,
      priceChange1h: 0.01,
      priceChange24h: -0.01,
      priceChange7d: 0.02,
      marketCap: 83654123789,
      volume24h: 65432178965,
      circulatingSupply: 83654123789,
      maxSupply: null,
      chartData: [1.0, 1.0, 0.999, 1.001, 1.0, 1.0, 0.998],
    },
    {
      id: 'binancecoin',
      rank: 4,
      name: 'Binance Coin',
      symbol: 'BNB',
      logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      price: 567.89,
      priceChange1h: 0.3,
      priceChange24h: -1.5,
      priceChange7d: -0.8,
      marketCap: 87654321098,
      volume24h: 2345678901,
      circulatingSupply: 165432198,
      maxSupply: 200000000,
      chartData: [540, 545, 555, 560, 570, 565, 550],
    },
    {
      id: 'solana',
      rank: 5,
      name: 'Solana',
      symbol: 'SOL',
      logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      price: 123.45,
      priceChange1h: 1.2,
      priceChange24h: 3.5,
      priceChange7d: 10.2,
      marketCap: 43215678901,
      volume24h: 3456789012,
      circulatingSupply: 350123456,
      maxSupply: null,
      chartData: [100, 105, 110, 108, 115, 120, 125],
    },
  ],
  originalAssets: [
    {
      id: 'bitcoin',
      rank: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      price: 65432.12,
      priceChange1h: 0.5,
      priceChange24h: 1.2,
      priceChange7d: -2.3,
      marketCap: 1236789456123,
      volume24h: 32165498712,
      circulatingSupply: 19456789,
      maxSupply: 21000000,
      chartData: [45000, 46000, 47500, 48200, 47800, 49100, 50200],
    },
    {
      id: 'ethereum',
      rank: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      price: 3456.78,
      priceChange1h: -0.2,
      priceChange24h: 2.1,
      priceChange7d: 5.4,
      marketCap: 412365897123,
      volume24h: 15698732456,
      circulatingSupply: 120654789,
      maxSupply: null,
      chartData: [3200, 3150, 3300, 3400, 3380, 3450, 3500],
    },
    {
      id: 'tether',
      rank: 3,
      name: 'Tether',
      symbol: 'USDT',
      logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      price: 1.0,
      priceChange1h: 0.01,
      priceChange24h: -0.01,
      priceChange7d: 0.02,
      marketCap: 83654123789,
      volume24h: 65432178965,
      circulatingSupply: 83654123789,
      maxSupply: null,
      chartData: [1.0, 1.0, 0.999, 1.001, 1.0, 1.0, 0.998],
    },
    {
      id: 'binancecoin',
      rank: 4,
      name: 'Binance Coin',
      symbol: 'BNB',
      logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      price: 567.89,
      priceChange1h: 0.3,
      priceChange24h: -1.5,
      priceChange7d: -0.8,
      marketCap: 87654321098,
      volume24h: 2345678901,
      circulatingSupply: 165432198,
      maxSupply: 200000000,
      chartData: [540, 545, 555, 560, 570, 565, 550],
    },
    {
      id: 'solana',
      rank: 5,
      name: 'Solana',
      symbol: 'SOL',
      logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      price: 123.45,
      priceChange1h: 1.2,
      priceChange24h: 3.5,
      priceChange7d: 10.2,
      marketCap: 43215678901,
      volume24h: 3456789012,
      circulatingSupply: 350123456,
      maxSupply: null,
      chartData: [100, 105, 110, 108, 115, 120, 125],
    },
  ],
  status: 'idle',
  error: null,
  sortField: savedSortField,
  sortDirection: savedSortDirection,
};

// Helper function to generate random price changes
const getRandomPriceChange = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Helper function to sort assets
const sortAssets = (assets: CryptoAsset[], field: SortField, direction: SortDirection): CryptoAsset[] => {
  return [...assets].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return direction === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePrices: (state) => {
      state.assets = state.assets.map(asset => {
        // Generate random changes
        const priceChangePercent = getRandomPriceChange(-2, 2);
        const volumeChangePercent = getRandomPriceChange(-5, 5);
        
        // Calculate new values
        const newPrice = asset.price * (1 + priceChangePercent / 100);
        const newVolume = asset.volume24h * (1 + volumeChangePercent / 100);
        
        // Update price changes
        const new1h = getRandomPriceChange(-2, 2);
        const new24h = getRandomPriceChange(-5, 5);
        const new7d = getRandomPriceChange(-10, 10);
        
        return {
          ...asset,
          price: parseFloat(newPrice.toFixed(2)),
          volume24h: Math.round(newVolume),
          priceChange1h: new1h,
          priceChange24h: new24h,
          priceChange7d: new7d,
        };
      });

      // Re-sort assets if needed
      if (state.sortField !== 'rank' || state.sortDirection !== 'asc') {
        state.assets = sortAssets(state.assets, state.sortField, state.sortDirection);
      }
    },
    setAssets: (state, action: PayloadAction<CryptoAsset[]>) => {
      state.assets = action.payload;
    },
    setOriginalAssets: (state, action: PayloadAction<CryptoAsset[]>) => {
      state.originalAssets = action.payload;
      state.assets = action.payload;
    },
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'failed'>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    sortAssetsByField: (state, action: PayloadAction<{field: SortField, direction?: SortDirection}>) => {
      const { field, direction } = action.payload;
      
      // If sorting by the same field, toggle direction if not specified
      if (field === state.sortField && !direction) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else if (direction) {
        state.sortDirection = direction;
      } else {
        state.sortDirection = 'asc';
      }
      
      state.sortField = field;
      state.assets = sortAssets(state.assets, field, state.sortDirection);
      
      // Save to localStorage
      try {
        localStorage.setItem('cryptoSort', JSON.stringify({
          field: state.sortField,
          direction: state.sortDirection
        }));
      } catch (error) {
        console.error('Error saving sort preferences:', error);
      }
    },
  },
});

export const { 
  updatePrices, 
  setAssets,
  setOriginalAssets,
  setStatus, 
  setError,
  sortAssetsByField 
} = cryptoSlice.actions;

// Selectors
export const selectAssets = (state: RootState) => state.crypto.assets;
export const selectOriginalAssets = (state: RootState) => state.crypto.originalAssets;
export const selectStatus = (state: RootState) => state.crypto.status;
export const selectError = (state: RootState) => state.crypto.error;
export const selectSortField = (state: RootState) => state.crypto.sortField;
export const selectSortDirection = (state: RootState) => state.crypto.sortDirection;

export default cryptoSlice.reducer; 