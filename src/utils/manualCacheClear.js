// Manual cache clearing utility
// This can be called manually if users need to clear cache

export const manualCacheClear = () => {
  try {
    // Clear localStorage (except essential data)
    const keysToKeep = ['ivy_resort_device_id', 'ivy_resort_rates'];
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

    // Force reload
    window.location.reload(true);
    
    return true;
  } catch (error) {
    console.warn('Manual cache clear failed:', error);
    return false;
  }
};

// Add to window for manual use
if (typeof window !== 'undefined') {
  window.manualCacheClear = manualCacheClear;
}
