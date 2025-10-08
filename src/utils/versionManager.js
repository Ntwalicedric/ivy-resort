// Version management to prevent cache issues
export const getAppVersion = () => {
  // Use build timestamp as version
  const buildTime = process.env.REACT_APP_BUILD_TIME || new Date().toISOString();
  return buildTime.split('T')[0]; // Use date as version
};

export const checkForUpdates = () => {
  const currentVersion = getAppVersion();
  const storedVersion = localStorage.getItem('ivy_resort_version');
  
  if (storedVersion && storedVersion !== currentVersion) {
    // Version changed, clear all caches
    clearAllCaches();
    localStorage.setItem('ivy_resort_version', currentVersion);
    return true; // Version updated
  }
  
  if (!storedVersion) {
    localStorage.setItem('ivy_resort_version', currentVersion);
  }
  
  return false; // No update needed
};

export const clearAllCaches = () => {
  try {
    // Clear localStorage
    const keysToKeep = ['ivy_resort_version', 'ivy_resort_rates'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear any service worker caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    console.log('All caches cleared due to version update');
  } catch (error) {
    console.warn('Error clearing caches:', error);
  }
};

export const showCacheUpdateNotification = () => {
  // Create a notification banner
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    text-align: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
      <span>🔄 Ivy Resort has been updated! Please refresh your browser for the latest version.</span>
      <button onclick="window.location.reload(true)" style="
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
      ">Refresh Now</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 10000);
};
