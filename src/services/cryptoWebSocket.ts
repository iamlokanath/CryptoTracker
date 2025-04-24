import { updatePrices } from '../features/crypto/cryptoSlice';
import { store } from '../app/store';

class CryptoWebSocket {
  private interval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;

  // Connect to the mock WebSocket
  connect(): void {
    if (!this.isConnected) {
      this.isConnected = true;
      // Simulate WebSocket with setInterval
      // Update prices every 1.5 seconds
      this.interval = setInterval(() => {
        store.dispatch(updatePrices());
      }, 1500);
      console.log('WebSocket connected');
    }
  }

  // Disconnect from the mock WebSocket
  disconnect(): void {
    if (this.isConnected && this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }

  // Check if connected
  isConnectedStatus(): boolean {
    return this.isConnected;
  }
}

// Create and export a singleton instance
const cryptoWebSocket = new CryptoWebSocket();
export default cryptoWebSocket; 