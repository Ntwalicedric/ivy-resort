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
        // Primary source
        const url1 = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(symbols.join(','))}`;
        let ratesData = null;
        try {
          const res1 = await fetch(url1);
          if (res1.ok) {
            const data1 = await res1.json();
            ratesData = data1?.rates || null;
          } else {
            throw new Error(`exchangerate.host HTTP ${res1.status}`);
          }
        } catch (e1) {
          // Fallback source
          const url2 = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
          const res2 = await fetch(url2);
          if (res2.ok) {
            const data2 = await res2.json();
            ratesData = data2?.rates || null;
          } else {
            throw new Error(`open.er-api.com HTTP ${res2.status}`);
          }
        }
        if (!cancelled && ratesData) {
          // Keep full map to avoid missing codes; ensure base equals 1
          const next = { ...(ratesData || {}), [base]: 1 };
          setRates(next);
          try {
            localStorage.setItem('ivy_resort_rates', JSON.stringify({ ts: Date.now(), rates: next }));
          } catch {}
        }
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRates();
    const id = setInterval(fetchRates, 1000 * 60 * 30); // refresh every 30m
    return () => {
      cancelled = true;
      clearInterval(id);
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


