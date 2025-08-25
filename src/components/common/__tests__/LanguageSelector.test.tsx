import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import LanguageSelector from '../LanguageSelector';

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

describe('LanguageSelector', () => {
  beforeEach(() => {
    i18n.changeLanguage('pt');
  });

  it('renders language selector with current language', () => {
    renderWithI18n(<LanguageSelector />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('pt');
  });

  it('displays all available languages', () => {
    renderWithI18n(<LanguageSelector />);
    
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('pt');
    expect(options[1]).toHaveValue('en');
    expect(options[2]).toHaveValue('es');
  });

  it('changes language when option is selected', () => {
    renderWithI18n(<LanguageSelector />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'en' } });
    
    expect(select).toHaveValue('en');
    expect(i18n.language).toBe('en');
  });

  it('displays language names with flags', () => {
    renderWithI18n(<LanguageSelector />);
    
    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');
    
    expect(options[0]).toHaveTextContent('🇧🇷 Português');
    expect(options[1]).toHaveTextContent('🇺🇸 English');
    expect(options[2]).toHaveTextContent('🇪🇸 Español');
  });
});
