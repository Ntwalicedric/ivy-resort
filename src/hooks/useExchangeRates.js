import { useEffect, useState } from 'react';

// Simple client-side rates fetcher using exchangerate.host (free, no key)
// Base currency default USD; supports conversion among common codes
export default function useExchangeRates(base = 'RWF', symbols = ['RWF','USD']) {
  const cached = (() => {
    try {
      const raw = localStorage.getItem('ivy_resort_rates');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  })();
  const seedDefaults = { RWF: 1, USD: 0.00077 };
  const [rates, setRates] = useState(cached?.rates || seedDefaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchRates() {
      try {
        setLoading(true);
        setError(null);
        
        // Check if we have recent cached data first
        const cached = (() => {
          try {
            const raw = localStorage.getItem('ivy_resort_rates');
            if (raw) {
              const data = JSON.parse(raw);
              // Use cached data if it's less than 1 hour old
              if (data.ts && (Date.now() - data.ts) < 3600000) {
                return data.rates;
              }
            }
          } catch {}
          return null;
        })();
        
        if (cached) {
          if (!cancelled) {
            setRates(cached);
            setLoading(false);
          }
          return;
        }
        
        // Primary source with timeout
        const url1 = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(symbols.join(','))}`;
        let ratesData = null;
        
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          const res1 = await fetch(url1, { 
            signal: controller.signal,
            mode: 'cors',
            cache: 'no-cache'
          });
          clearTimeout(timeoutId);
          
          if (res1.ok) {
            const data1 = await res1.json();
            ratesData = data1?.rates || null;
          } else {
            throw new Error(`exchangerate.host HTTP ${res1.status}`);
          }
        } catch (e1) {
          console.warn('Primary exchange rate API failed:', e1.message);
          // Fallback source with timeout
          try {
            const url2 = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const res2 = await fetch(url2, { 
              signal: controller.signal,
              mode: 'cors',
              cache: 'no-cache'
            });
            clearTimeout(timeoutId);
            
            if (res2.ok) {
              const data2 = await res2.json();
              ratesData = data2?.rates || null;
            } else {
              throw new Error(`open.er-api.com HTTP ${res2.status}`);
            }
          } catch (e2) {
            console.warn('Fallback exchange rate API failed:', e2.message);
            // Use default rates if all APIs fail
            ratesData = seedDefaults;
          }
        }
        
        if (!cancelled) {
          // Keep full map to avoid missing codes; ensure base equals 1
          const next = { ...(ratesData || seedDefaults), [base]: 1 };
          setRates(next);
          try {
            localStorage.setItem('ivy_resort_rates', JSON.stringify({ ts: Date.now(), rates: next }));
          } catch {}
        }
      } catch (e) {
        if (!cancelled) {
          console.warn('Exchange rate fetch failed, using defaults:', e.message);
          setRates(seedDefaults);
          setError(e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    // Add a small delay to prevent blocking initial render
    const timer = setTimeout(fetchRates, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [base, symbols.join(',')]);

  const convert = (amount, from = base, to = base) => {
    if (!amount || from === to) return amount || 0;
    if (from !== base) {
      // Convert to base then to target
      const rateFrom = rates?.[from];
      if (!rateFrom) return 0;
      const inBase = amount / rateFrom;
      const rateTo = rates?.[to] || 1;
      return inBase * rateTo;
    }
    const rate = rates?.[to] || 1;
    return amount * rate;
  };

  return { rates, loading, error, convert };
}


