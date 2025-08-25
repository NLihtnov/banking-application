import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mock ReactDOM
const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender,
}));

jest.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

// Mock App component
jest.mock('./App', () => {
  return function MockApp() {
    return <div data-testid="app">App Component</div>;
  };
});

describe('index.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not throw when root element is missing', () => {
    // Mock getElementById to return null
    document.getElementById = jest.fn(() => null);

    // This should not throw an error
    expect(() => {
      require('./index.tsx');
    }).not.toThrow();
  });
});
