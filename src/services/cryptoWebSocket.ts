import { updatePrices, setAssets, setStatus, setError, CryptoAsset } from '../features/crypto/cryptoSlice';
import { store } from '../app/store';

// Binance WebSocket URL for price ticker
const BINANCE_TICKER_WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';

// Top coins to track (symbols in lowercase)
const TOP_COINS = [
  'btc', 'eth', 'bnb', 'sol', 'xrp', 'ada', 'avax', 'doge', 'dot', 'shib'
];

interface BinanceTickerData {
  e: string;        // Event type
  E: number;        // Event time
  s: string;        // Symbol
  p: string;        // Price change
  P: string;        // Price change percent
  w: string;        // Weighted average price
  c: string;        // Last price
  Q: string;        // Last quantity
  o: string;        // Open price
  h: string;        // High price
  l: string;        // Low price
  v: string;        // Total traded base asset volume
  q: string;        // Total traded quote asset volume
  O: number;        // Statistics open time
  C: number;        // Statistics close time
  F: number;        // First trade ID
  L: number;        // Last trade ID
  n: number;        // Total number of trades
}

class CryptoWebSocket {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  // Connect to the Binance WebSocket
  connect(): void {
    if (!this.isConnected && !this.socket) {
      try {
        store.dispatch(setStatus('loading'));

        this.socket = new WebSocket(BINANCE_TICKER_WS_URL);
        
        this.socket.onopen = this.handleOpen;
        this.socket.onmessage = this.handleMessage;
        this.socket.onerror = this.handleError;
        this.socket.onclose = this.handleClose;

        console.log('Connecting to Binance WebSocket...');
      } catch (error) {
        console.error('WebSocket connection error:', error);
        store.dispatch(setError('Failed to connect to crypto data feed'));
        this.attemptReconnect();
      }
    }
  }

  // Disconnect from the WebSocket
  disconnect(): void {
    if (this.socket) {
      this.isConnected = false;
      this.socket.close();
      this.socket = null;
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      console.log('WebSocket disconnected');
    }
  }

  // Check if connected
  isConnectedStatus(): boolean {
    return this.isConnected;
  }

  // Handle WebSocket open event
  private handleOpen = (): void => {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    store.dispatch(setStatus('idle'));
    store.dispatch(setError(null));
    console.log('WebSocket connected to Binance');
  };

  // Handle WebSocket message event
  private handleMessage = (event: MessageEvent): void => {
    try {
      const data = JSON.parse(event.data) as BinanceTickerData[];
      
      // Filter for our top coins
      const filteredData = data.filter(ticker => {
        const symbol = ticker.s.toLowerCase();
        return TOP_COINS.some(coin => symbol.includes(coin + 'usdt'));
      });
      
      if (filteredData.length > 0) {
        // Transform Binance data to our app format
        const assets: CryptoAsset[] = filteredData.map((ticker, index) => {
          const symbol = ticker.s.replace('USDT', '');
          return {
            id: symbol.toLowerCase(),
            rank: index + 1,
            name: this.getFullNameFromSymbol(symbol),
            symbol: symbol,
            logo: `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`,
            price: parseFloat(ticker.c),
            priceChange1h: parseFloat(ticker.P) / 3, // Approximation
            priceChange24h: parseFloat(ticker.P),
            priceChange7d: parseFloat(ticker.P) * 2, // Approximation
            marketCap: parseFloat(ticker.q) * parseFloat(ticker.c),
            volume24h: parseFloat(ticker.q),
            circulatingSupply: parseFloat(ticker.v),
            maxSupply: null,
            chartData: [parseFloat(ticker.o), parseFloat(ticker.c)],
          };
        });
        
        store.dispatch(setAssets(assets));
      }
    } catch (error) {
      console.error('Error processing WebSocket data:', error);
    }
  };

  // Handle WebSocket error event
  private handleError = (error: Event): void => {
    console.error('WebSocket error:', error);
    store.dispatch(setError('Connection error with crypto data feed'));
    this.isConnected = false;
  };

  // Handle WebSocket close event
  private handleClose = (): void => {
    console.log('WebSocket connection closed');
    this.isConnected = false;
    store.dispatch(setStatus('failed'));
    this.attemptReconnect();
  };

  // Attempt to reconnect
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect in ${delay/1000} seconds... (Attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`);
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Maximum reconnection attempts reached');
      store.dispatch(setError('Failed to connect after several attempts. Please reload the page.'));
    }
  }

  // Helper method to get full name from symbol
  private getFullNameFromSymbol(symbol: string): string {
    const nameMap: Record<string, string> = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'BNB': 'Binance Coin',
      'SOL': 'Solana',
      'XRP': 'XRP',
      'ADA': 'Cardano',
      'AVAX': 'Avalanche',
      'DOGE': 'Dogecoin',
      'DOT': 'Polkadot',
      'SHIB': 'Shiba Inu'
    };
    
    return nameMap[symbol] || symbol;
  }
}

// Create and export a singleton instance
const cryptoWebSocket = new CryptoWebSocket();
export default cryptoWebSocket; 