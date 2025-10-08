import React, { useEffect, useState } from 'react';

const CacheDetector = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if the page is loading from cache
    const checkCacheStatus = () => {
      // Method 1: Check if page was loaded from cache
      if (performance.navigation && performance.navigation.type === 1) {
        // Page was refreshed, but might still be cached
        console.log('Page was refreshed');
      }

      // Method 2: Check if resources are being served from cache
      const resources = performance.getEntriesByType('resource');
      const cachedResources = resources.filter(resource => 
        resource.transferSize === 0 && resource.decodedBodySize > 0
      );

      if (cachedResources.length > 0) {
        console.log('Some resources loaded from cache:', cachedResources.length);
      }

      // Method 3: Check if the app seems to be working properly
      // If we can't access certain features, it might be a cache issue
      setTimeout(() => {
        const hasReactRoot = document.getElementById('root')?.children.length > 0;
        const hasConsoleLogs = console.log.toString().includes('native code');
        
        if (!hasReactRoot && hasConsoleLogs) {
          console.warn('Possible cache issue detected - React not rendering properly');
          setShowWarning(true);
        }
      }, 2000);
    };

    checkCacheStatus();
  }, []);

  if (!showWarning) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '60px', // Below any existing notification
      left: '20px',
      right: '20px',
      background: '#ff6b6b',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      zIndex: 9999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      animation: 'slideDown 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⚠️</span>
          <div>
            <strong>Cache Issue Detected</strong>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
              The page may not be loading correctly due to cached content.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.location.reload(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            Hard Refresh
          </button>
          <button
            onClick={() => setShowWarning(false)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CacheDetector;
