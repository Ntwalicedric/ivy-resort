import React, { createContext, useContext, useMemo, useState } from 'react';
import useExchangeRates from '../hooks/useExchangeRates';

const CurrencyContext = createContext({
  currency: 'USD',
  setCurrency: () => {},
  convert: (amount, from = 'USD', to) => amount,
  rates: { USD: 1 },
  loading: false,
});

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('RWF');
  
  // Wrap useExchangeRates in try-catch to prevent crashes
  let exchangeData = { rates: { RWF: 1, USD: 0.00077 }, loading: false, convert: (amount) => amount };
  
  try {
    exchangeData = useExchangeRates('RWF', ['RWF','USD']);
  } catch (error) {
    console.warn('Currency context error, using defaults:', error);
  }

  const { rates, loading, convert } = exchangeData;

  const value = useMemo(() => ({ 
    currency, 
    setCurrency, 
    convert: convert || ((amount) => amount), 
    rates: rates || { RWF: 1, USD: 0.00077 }, 
    loading: loading || false 
  }), [currency, convert, rates, loading]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);









