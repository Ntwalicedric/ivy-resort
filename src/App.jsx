import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import { AuthProvider } from "./components/ui/AuthenticationGuard";
import { CurrencyProvider } from "./context/CurrencyContext";
import { DatabaseProvider } from "./context/DatabaseContext";
import BrowserCompatibilityTest from "./components/BrowserCompatibilityTest";
import CacheDetector from "./components/CacheDetector";
import { checkForUpdates, showCacheUpdateNotification } from "./utils/versionManager";
import { autoInvalidateCache } from "./utils/cacheBuster";

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

    // Check for app updates and handle cache issues
    try {
      const hasUpdated = checkForUpdates();
      if (hasUpdated) {
        console.log('App: Version updated, showing refresh notification');
        showCacheUpdateNotification();
      }
      
      // Disable automatic cache invalidation to prevent constant refreshing
      // autoInvalidateCache();
    } catch (error) {
      console.warn('App: Version check failed:', error);
    }

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
        background: 'linear-gradient(135deg, #F7F6F2 0%, #E8E5D8 100%)', 
        color: '#1F2937', 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 20px', fontSize: '2.5rem', fontWeight: '600', color: '#1D4ED8', fontFamily: "'Playfair Display', serif" }}>Ivy Resort</h1>
          <p style={{ margin: '0 0 20px', opacity: 0.7, color: '#4B5563' }}>Your browser is not supported.</p>
          <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.6, color: '#6B7280' }}>
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
        background: 'linear-gradient(135deg, #F7F6F2 0%, #E8E5D8 100%)', 
        color: '#1F2937', 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        textAlign: 'center'
      }}>
        <div>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '3px solid rgba(255, 215, 0, 0.2)', 
            borderTop: '3px solid #FFD700', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto 24px' 
          }}></div>
          <h1 style={{ margin: '0', fontSize: '2.5rem', fontWeight: '600', color: '#1D4ED8', fontFamily: "'Playfair Display', serif" }}>Ivy Resort</h1>
          <p style={{ margin: '12px 0 0', opacity: 0.7, fontSize: '1.1rem', color: '#4B5563' }}>Loading your luxury experience...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CurrencyProvider>
        <DatabaseProvider>
          <BrowserCompatibilityTest />
          <CacheDetector />
          <Routes />
        </DatabaseProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;