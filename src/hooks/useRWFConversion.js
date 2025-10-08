import { useState, useEffect } from 'react';

// Real-time RWF conversion hook
export default function useRWFConversion() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try multiple free APIs for better reliability
        const apis = [
          `https://api.exchangerate.host/latest?base=USD&symbols=RWF`,
          `https://open.er-api.com/v6/latest/USD`,
          `https://api.fixer.io/latest?access_key=free&base=USD&symbols=RWF`
        ];
        
        let ratesData = null;
        
        for (const api of apis) {
          try {
            const response = await fetch(api);
            if (response.ok) {
              const data = await response.json();
              ratesData = data.rates || data;
              break;
            }
          } catch (e) {
            console.log(`API ${api} failed, trying next...`);
            continue;
          }
        }
        
        if (!cancelled && ratesData) {
          // Ensure we have RWF rate, fallback to approximate if needed
          const rwfRate = ratesData.RWF || 1300; // Approximate fallback
          setRates({ USD: 1, RWF: rwfRate });
          
          // Cache the rates
          try {
            localStorage.setItem('ivy_resort_rwf_rates', JSON.stringify({
              timestamp: Date.now(),
              rates: { USD: 1, RWF: rwfRate }
            }));
          } catch (e) {
            console.log('Could not cache rates');
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          // Use cached rates if available
          try {
            const cached = localStorage.getItem('ivy_resort_rwf_rates');
            if (cached) {
              const { rates: cachedRates } = JSON.parse(cached);
              setRates(cachedRates);
            } else {
              // Final fallback
              setRates({ USD: 1, RWF: 1300 });
            }
          } catch (e) {
            setRates({ USD: 1, RWF: 1300 });
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRates();
    
    // Refresh rates every 30 minutes
    const interval = setInterval(fetchRates, 30 * 60 * 1000);
    
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const convertToRWF = (amount, fromCurrency = 'USD') => {
    if (!amount || amount === 0) return 0;
    
    const numAmount = typeof amount === 'string' 
      ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
      : amount;
    
    if (fromCurrency === 'RWF') return numAmount;
    
    const rate = rates.RWF || 1300;
    return numAmount * rate;
  };

  const formatRWF = (amount, fromCurrency = 'USD') => {
    const rwfAmount = convertToRWF(amount, fromCurrency);
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(rwfAmount);
  };

  return {
    convertToRWF,
    formatRWF,
    rates,
    loading,
    error
  };
}













