import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { useTranslation } from '../useTranslation';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    {children}
  </I18nextProvider>
);

describe('useTranslation', () => {
  beforeEach(() => {
    i18n.changeLanguage('pt');
  });

  it('returns translation function', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    
    expect(result.current.t).toBeDefined();
    expect(typeof result.current.t).toBe('function');
  });

  it('returns current language', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    
    expect(result.current.currentLanguage).toBe('pt');
  });

  it('returns changeLanguage function', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    
    expect(result.current.changeLanguage).toBeDefined();
    expect(typeof result.current.changeLanguage).toBe('function');
  });

  it('changes language when changeLanguage is called', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    
    act(() => {
      result.current.changeLanguage('en');
    });
    
    expect(result.current.currentLanguage).toBe('en');
    expect(i18n.language).toBe('en');
  });

  it('translates text correctly', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    
    expect(result.current.t('loading')).toBe('Carregando...');
    expect(result.current.t('home')).toBe('Início');
    expect(result.current.t('welcomeMessage', { name: 'João' })).toBe('Bem-vindo, João!');
  });

  it('translates text in different language', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    
    act(() => {
      result.current.changeLanguage('en');
    });
    
    expect(result.current.t('loading')).toBe('Loading...');
    expect(result.current.t('home')).toBe('Home');
    expect(result.current.t('welcomeMessage', { name: 'John' })).toBe('Welcome, John!');
  });

  it('returns isReady status', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    
    expect(result.current.isReady).toBeDefined();
    expect(typeof result.current.isReady).toBe('boolean');
  });
});
