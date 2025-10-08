import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { AuthProvider } from "./components/ui/AuthenticationGuard";
import { CurrencyProvider } from "./context/CurrencyContext";
import { DatabaseProvider } from "./context/DatabaseContext";
import BrowserCompatibilityTest from "./components/BrowserCompatibilityTest";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Add debugging info
    console.log('App: Initializing...');
    console.log('App: User Agent:', navigator.userAgent);
    console.log('App: Browser features:', {
      fetch: typeof window.fetch,
      Promise: typeof window.Promise,
      localStorage: typeof window.localStorage,
      sessionStorage: typeof window.sessionStorage
    });

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      console.log('App: Setting loaded state to true');
      setIsLoaded(true);
    }, 100);

    // Check for critical browser features
    if (!window.fetch || !window.Promise) {
      console.error('App: Critical browser features missing');
      setHasError(true);
    }

    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 20px', fontSize: '2rem', fontWeight: '600' }}>Ivy Resort</h1>
          <p style={{ margin: '0 0 20px', opacity: 0.8 }}>Your browser is not supported.</p>
          <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.6 }}>
            Please use a modern browser like Chrome, Firefox, Safari, or Edge.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid rgba(255,255,255,0.3)', 
            borderTop: '3px solid white', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto 20px' 
          }}></div>
          <h1 style={{ margin: '0', fontSize: '2rem', fontWeight: '600' }}>Ivy Resort</h1>
          <p style={{ margin: '10px 0 0', opacity: 0.8 }}>Loading your luxury experience...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CurrencyProvider>
        <DatabaseProvider>
          <BrowserCompatibilityTest />
          <Routes />
        </DatabaseProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;