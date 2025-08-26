import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender,
}));

jest.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));


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
    
    document.getElementById = jest.fn(() => null);

    
    expect(() => {
      require('./index.tsx');
    }).not.toThrow();
  });
});
