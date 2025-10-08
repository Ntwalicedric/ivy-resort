import React, { useEffect, useState } from 'react';

const BrowserCompatibilityTest = () => {
  const [testResults, setTestResults] = useState({
    localStorage: false,
    fetch: false,
    promises: false,
    modules: false,
    context: false
  });

  useEffect(() => {
    const runTests = () => {
      const results = { ...testResults };

      // Test localStorage
      try {
        localStorage.setItem('test', 'value');
        localStorage.removeItem('test');
        results.localStorage = true;
      } catch (e) {
        console.warn('localStorage test failed:', e);
      }

      // Test fetch
      try {
        if (typeof fetch === 'function') {
          results.fetch = true;
        }
      } catch (e) {
        console.warn('fetch test failed:', e);
      }

      // Test Promises
      try {
        if (typeof Promise === 'function') {
          results.promises = true;
        }
      } catch (e) {
        console.warn('Promise test failed:', e);
      }

      // Test ES modules
      try {
        if (typeof import === 'function') {
          results.modules = true;
        }
      } catch (e) {
        console.warn('ES modules test failed:', e);
      }

      // Test React Context
      try {
        if (typeof React.createContext === 'function') {
          results.context = true;
        }
      } catch (e) {
        console.warn('React Context test failed:', e);
      }

      setTestResults(results);
    };

    runTests();
  }, []);

  const allPassed = Object.values(testResults).every(result => result);

  if (allPassed) {
    return null; // Don't show anything if all tests pass
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#ff4444',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      zIndex: 9999,
      fontSize: '14px'
    }}>
      <strong>Browser Compatibility Warning:</strong> Some features may not work properly in this browser.
      <br />
      Failed tests: {Object.entries(testResults)
        .filter(([_, passed]) => !passed)
        .map(([test, _]) => test)
        .join(', ')}
    </div>
  );
};

export default BrowserCompatibilityTest;
