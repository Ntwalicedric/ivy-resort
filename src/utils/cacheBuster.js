// Comprehensive cache busting utility
export const getCacheBuster = () => {
  // Use build timestamp if available, otherwise use current time
  const buildTime = process.env.REACT_APP_BUILD_TIME || new Date().toISOString();
  const timestamp = buildTime.split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

export const addCacheBuster = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${getCacheBuster()}`;
};

// Force cache invalidation for all resources
export const invalidateAllCaches = () => {
  try {
    // Clear all localStorage except essential data
    const keysToKeep = ['ivy_resort_version', 'ivy_resort_rates'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear service worker caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    // Clear browser cache by reloading with cache busting
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('_cb', getCacheBuster());
    window.location.href = currentUrl.toString();

  } catch (error) {
    console.warn('Cache invalidation failed:', error);
    // Fallback: hard refresh
    window.location.reload(true);
  }
};

// Check if we need to invalidate cache
export const checkCacheValidity = () => {
  const currentVersion = getCacheBuster();
  const storedVersion = localStorage.getItem('ivy_resort_cache_version');
  
  if (storedVersion !== currentVersion) {
    console.log('Cache version mismatch, invalidating...');
    localStorage.setItem('ivy_resort_cache_version', currentVersion);
    return true; // Cache needs invalidation
  }
  
  return false; // Cache is valid
};

// Auto-invalidate cache on version change (only when actually needed)
export const autoInvalidateCache = () => {
  // Only check once per session to prevent constant refreshing
  const sessionKey = 'ivy_resort_cache_checked';
  if (sessionStorage.getItem(sessionKey)) {
    return; // Already checked this session
  }
  
  // Only invalidate if there's a significant version change (not just build time)
  const currentVersion = getCacheBuster();
  const storedVersion = localStorage.getItem('ivy_resort_cache_version');
  
  // Only show notification if there's a real version change (different date)
  const currentDate = currentVersion.split('-')[0];
  const storedDate = storedVersion ? storedVersion.split('-')[0] : null;
  
  if (storedDate && currentDate !== storedDate) {
    sessionStorage.setItem(sessionKey, 'true');
    localStorage.setItem('ivy_resort_cache_version', currentVersion);
    
    // Show notification before invalidating
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
        <span>🔄 Ivy Resort has been updated! Refreshing for the latest version...</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Invalidate cache after a short delay
    setTimeout(() => {
      invalidateAllCaches();
    }, 2000);
  } else {
    // Mark as checked even if no update needed
    sessionStorage.setItem(sessionKey, 'true');
    localStorage.setItem('ivy_resort_cache_version', currentVersion);
  }
};
