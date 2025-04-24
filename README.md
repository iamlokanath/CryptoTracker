# Real-Time Crypto Price Tracker

A responsive React + Redux Toolkit application that tracks real-time cryptocurrency prices using Binance WebSocket API and manages all state via Redux.

## Features

- Displays top 10 cryptocurrencies in a responsive table with real-time price updates
- Live data from Binance WebSocket API
- Shows key information: rank, name, price, percentage changes, market cap, volume, supply, and price charts
- Color-coded percentage changes (green for positive, red for negative)
- Sorting functionality for all columns
- Filtering options for top gainers and losers
- Search functionality to find specific cryptocurrencies
- Persistent settings using localStorage (filter, sort, search preferences)
- Comprehensive test suite for Redux reducers and selectors

## Technologies Used

- React
- TypeScript
- Redux Toolkit for state management
- WebSocket API for real-time data
- Styled Components for styling
- Chart.js and react-chartjs-2 for price charts
- Jest for unit testing

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

### Running Tests

Run the test suite with:

```
npm test
```

## Project Structure

- `/src/app` - Redux store configuration
- `/src/components` - React components
- `/src/features` - Redux slices and tests
- `/src/services` - WebSocket service
- `/src/utils` - Utility functions

## How It Works

The application connects to Binance's WebSocket API to receive real-time cryptocurrency price updates. All state is managed through Redux, with the UI automatically reflecting these changes.

User preferences for sorting, filtering, and search are saved to localStorage for persistence between sessions.

The WebSocket connection includes automatic reconnection logic for resilience against network issues.

## Implementation Details

### WebSocket Integration

- Real-time connection to Binance's market ticker stream
- Automatic reconnection with exponential backoff
- Error handling and status reporting

### State Management

- Redux store with proper slices for crypto data
- Selectors for efficient state access
- Action creators for all state modifications

### Testing

- Unit tests for reducers and selectors
- Component testing for key UI elements
