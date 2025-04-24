# Real-Time Crypto Price Tracker

A responsive React + Redux Toolkit application that tracks real-time cryptocurrency prices, simulating WebSocket updates and managing all state via Redux.

## Features

- Displays 5 crypto assets (BTC, ETH, USDT, BNB, SOL) in a responsive table
- Shows key information: rank, name, price, percentage changes, market cap, volume, supply, and 7-day chart
- Simulates real-time price updates every 1.5 seconds
- Color-codes percentage changes (green for positive, red for negative)
- Manages all state with Redux Toolkit

## Technologies Used

- React
- TypeScript
- Redux Toolkit for state management
- Styled Components for styling
- Chart.js and react-chartjs-2 for price charts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open your browser and visit: `http://localhost:3000`

## Project Structure

- `/src/app` - Redux store configuration
- `/src/components` - React components
- `/src/features` - Redux slices
- `/src/services` - WebSocket service
- `/src/utils` - Utility functions

## How It Works

The application simulates WebSocket connections using an interval that dispatches Redux actions every 1.5 seconds to update cryptocurrency prices and related data. All state is managed through Redux, and the UI updates automatically reflect these changes.

## Future Improvements

- Integrate real WebSocket (e.g., Binance)
- Add filters/sorting (top gainers, etc.)
- Implement localStorage support for persistent settings
- Add unit tests for reducers/selectors
