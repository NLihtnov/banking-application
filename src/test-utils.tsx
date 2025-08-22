import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/authSlice';
import transactionReducer from './store/slices/transactionSlice';

export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      transaction: transactionReducer,
    },
    preloadedState: initialState,
  });
};

export const renderWithProviders = (
  component: React.ReactElement,
  initialState = {}
) => {
  const store = createTestStore(initialState);
  
  const Wrapper = ({ children }: PropsWithChildren<{}>) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );

  return {
    store,
    ...render(component, { wrapper: Wrapper }),
  };
};
