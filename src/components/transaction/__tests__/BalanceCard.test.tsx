import React from 'react';
import { screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import { renderWithProviders } from '../../../test-utils';
import { BalanceCard } from '../BalanceCard';

describe('BalanceCard Component', () => {
  const defaultProps = {
    balance: 1000.50,
    userName: 'John Doe',
  };

  const renderBalanceCard = (props = {}) => {
    return renderWithProviders(
      <I18nextProvider i18n={i18n}>
        <BalanceCard {...defaultProps} {...props} />
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    i18n.changeLanguage('pt');
  });





  test('displays zero balance correctly', () => {
    renderBalanceCard({ balance: 0 });
    
    expect(screen.getByText(/0,00/)).toBeInTheDocument();
  });



  test('displays decimal balance amounts correctly', () => {
    renderBalanceCard({ balance: 100.05 });
    
    expect(screen.getByText(/100,05/)).toBeInTheDocument();
  });









  test('renders current balance label', () => {
    renderBalanceCard();
    
    expect(screen.getByText(/Saldo Atual/i)).toBeInTheDocument();
  });





  test('renders with very small decimal amounts', () => {
    renderBalanceCard({ balance: 0.01 });
    
    expect(screen.getByText(/0,01/)).toBeInTheDocument();
  });


});
