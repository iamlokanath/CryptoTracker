import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import '@testing-library/jest-dom';

test('renders crypto price tracker title', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByText(/Cryptocurrency Prices by Market Cap/i)).toBeInTheDocument();
});

test('renders header component', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Header should be present
  const headerElement = screen.getByRole('banner');
  expect(headerElement).toBeInTheDocument();
});

test('renders filter bar component', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Filter bar should have filter buttons
  expect(screen.getByText(/All/i)).toBeInTheDocument();
  expect(screen.getByText(/Gainers/i)).toBeInTheDocument();
  expect(screen.getByText(/Losers/i)).toBeInTheDocument();

  // Search input should be present
  expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
});
