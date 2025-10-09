// Service Worker Cleanup Script
// This script runs on every page load to ensure old service workers are removed

(function() {
  'use strict';

  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    // Unregister all existing service workers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      console.log('Found', registrations.length, 'service worker registrations');
      
      for (let registration of registrations) {
        console.log('Unregistering service worker:', registration.scope);
        registration.unregister().then(function(boolean) {
          console.log('Service worker unregistered:', boolean);
        }).catch(function(error) {
          console.warn('Error unregistering service worker:', error);
        });
      }
    }).catch(function(error) {
      console.warn('Error getting service worker registrations:', error);
    });

    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        console.log('Found', cacheNames.length, 'caches to clear');
        
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(function() {
        console.log('All caches cleared successfully');
      }).catch(function(error) {
        console.warn('Error clearing caches:', error);
      });
    }
  }

  // Clear browser cache by adding cache-busting parameter
  const url = new URL(window.location);
  const cacheBuster = url.searchParams.get('_cb');
  
  if (!cacheBuster) {
    // Add cache buster if not present
    url.searchParams.set('_cb', Date.now().toString());
    window.history.replaceState({}, '', url.toString());
  }

  // Force reload if this is a cache-busted URL
  if (cacheBuster && cacheBuster !== localStorage.getItem('ivy_resort_last_cache_buster')) {
    localStorage.setItem('ivy_resort_last_cache_buster', cacheBuster);
    console.log('Cache buster detected, ensuring fresh load');
  }

})();
