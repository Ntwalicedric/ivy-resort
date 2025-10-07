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
  const { rates, loading, convert } = useExchangeRates('RWF', ['RWF','USD']);

  const value = useMemo(() => ({ currency, setCurrency, convert, rates, loading }), [currency, convert, rates, loading]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);









