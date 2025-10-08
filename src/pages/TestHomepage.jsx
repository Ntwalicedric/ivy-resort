import React from 'react';

const TestHomepage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>
          Ivy Resort
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '30px', opacity: 0.9 }}>
          Luxury Lakeside Retreat in Rwanda
        </p>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '20px', 
          borderRadius: '10px',
          marginTop: '30px'
        }}>
          <p style={{ margin: '0', fontSize: '1.2rem' }}>
            ✅ Test Homepage Working!
          </p>
          <p style={{ margin: '10px 0 0', fontSize: '1rem', opacity: 0.8 }}>
            If you see this, the basic React app is loading correctly.
          </p>
        </div>
        <div style={{ marginTop: '30px', fontSize: '0.9rem', opacity: 0.7 }}>
          <p>Browser: {navigator.userAgent.split(' ').pop()}</p>
          <p>Time: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TestHomepage;
