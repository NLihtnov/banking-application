import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { renderWithProviders } from '../../../test-utils';
import Navbar from '../Navbar';


jest.mock('../../notifications/NotificationBell', () => ({
  NotificationBell: function MockNotificationBell() {
    return <div data-testid="notification-bell">Notification Bell</div>;
  },
}));

jest.mock('../../notifications/NotificationPanel', () => ({
  NotificationPanel: function MockNotificationPanel() {
    return <div data-testid="notification-panel">Notification Panel</div>;
  },
}));

jest.mock('../../common/LanguageSelector', () => {
  return function MockLanguageSelector() {
    return <div data-testid="language-selector">Language Selector</div>;
  };
});

describe('Navbar Component', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    balance: 1000,
  };

  const renderNavbar = (preloadedState = {}) => {
    return renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <Navbar />
      </I18nextProvider>,
      {
        preloadedState: {
          auth: {
            user: mockUser,
            token: 'mock-token',
            loading: false,
            error: null,
            isAuthenticated: true,
          },
          ...preloadedState,
        },
      }
    );
  };

  beforeEach(() => {
    i18n.changeLanguage('pt');
  });





  test('renders notification and language components', () => {
    renderNavbar();
    
    expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
    expect(screen.getByTestId('notification-panel')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });



  test('toggles mobile menu when hamburger button is clicked', () => {
    renderNavbar();
    
    const hamburgerButton = screen.getByRole('button', { name: '' }); 
    const mobileMenu = screen.getByTestId('mobile-menu');
    
    
    expect(mobileMenu).not.toHaveClass('open');
    
    
    fireEvent.click(hamburgerButton);
    expect(mobileMenu).toHaveClass('open');
    
    
    fireEvent.click(hamburgerButton);
    expect(mobileMenu).not.toHaveClass('open');
  });

  test('closes mobile menu when navigation link is clicked', () => {
    renderNavbar();
    
    const hamburgerButton = screen.getByRole('button', { name: '' });
    const mobileMenu = screen.getByTestId('mobile-menu');
    const homeLink = screen.getAllByRole('link', { name: /Início/i })[1]; 
    
    
    fireEvent.click(hamburgerButton);
    expect(mobileMenu).toHaveClass('open');
    
    
    fireEvent.click(homeLink);
    expect(mobileMenu).not.toHaveClass('open');
  });



  test('handles logout from mobile menu', async () => {
    const { store } = renderNavbar();
    
    const hamburgerButton = screen.getByRole('button', { name: '' });
    fireEvent.click(hamburgerButton);
    
    const mobileLogoutButton = screen.getAllByRole('button', { name: /Sair/i })[1];
    fireEvent.click(mobileLogoutButton);
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.isAuthenticated).toBe(false);
    });
  });






});
