// Real-time reservation syncing service
// Handles 10-second polling and cross-device synchronization

class RealtimeSyncService {
  constructor() {
    this.isPolling = false;
    this.pollInterval = null;
    this.lastSyncTime = null;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
    this.pollingInterval = 10000; // 10 seconds
    this.listeners = new Set();
    this.isOnline = navigator.onLine;
    
    // Bind methods
    this.startPolling = this.startPolling.bind(this);
    this.stopPolling = this.stopPolling.bind(this);
    this.syncReservations = this.syncReservations.bind(this);
    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
    
    // Set up online/offline listeners
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  // Start the polling mechanism
  startPolling() {
    if (this.isPolling) {
      console.log('🔄 RealtimeSync: Polling already active');
      return;
    }

    console.log('🚀 RealtimeSync: Starting real-time polling...');
    this.isPolling = true;
    this.lastSyncTime = new Date().toISOString();
    
    // Initial sync
    this.syncReservations();
    
    // Set up interval for regular syncing
    this.pollInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncReservations();
      } else {
        console.log('📡 RealtimeSync: Offline, skipping sync');
      }
    }, this.pollingInterval);
  }

  // Stop the polling mechanism
  stopPolling() {
    if (!this.isPolling) {
      return;
    }

    console.log('⏹️ RealtimeSync: Stopping real-time polling...');
    this.isPolling = false;
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  // Sync reservations from the backend
  async syncReservations() {
    try {
      const baseUrl = this.getApiBaseUrl();
      const syncUrl = this.lastSyncTime 
        ? `${baseUrl}/reservations/sync?since=${encodeURIComponent(this.lastSyncTime)}`
        : `${baseUrl}/reservations`;

      console.log('📡 RealtimeSync: Fetching updates...', { syncUrl, lastSync: this.lastSyncTime });

      const response = await fetch(syncUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache'
        },
        // Add timeout
        signal: AbortSignal.timeout(8000) // 8 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ RealtimeSync: Sync successful', { 
          count: result.count, 
          timestamp: result.timestamp 
        });
        
        // Update last sync time
        this.lastSyncTime = result.timestamp;
        
        // Reset retry count on successful sync
        this.retryCount = 0;
        
        // Notify listeners with new data
        this.notifyListeners({
          type: 'sync_success',
          data: result.data,
          count: result.count,
          timestamp: result.timestamp,
          isIncremental: !!this.lastSyncTime
        });
        
      } else {
        throw new Error(result.error || 'Sync failed');
      }

    } catch (error) {
      console.error('❌ RealtimeSync: Sync failed:', error);
      
      // Handle different types of errors
      if (error.name === 'AbortError') {
        console.log('⏰ RealtimeSync: Request timeout');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🌐 RealtimeSync: Network error');
        this.isOnline = false;
      }

      // Implement retry logic
      this.handleSyncError(error);
    }
  }

  // Handle sync errors with retry logic
  handleSyncError(error) {
    this.retryCount++;
    
    if (this.retryCount <= this.maxRetries) {
      console.log(`🔄 RealtimeSync: Retrying in ${this.retryDelay/1000}s (attempt ${this.retryCount}/${this.maxRetries})`);
      
      setTimeout(() => {
        if (this.isPolling) {
          this.syncReservations();
        }
      }, this.retryDelay);
      
      // Exponential backoff
      this.retryDelay = Math.min(this.retryDelay * 1.5, 30000); // Max 30 seconds
    } else {
      console.error('💥 RealtimeSync: Max retries exceeded, stopping sync');
      this.notifyListeners({
        type: 'sync_error',
        error: error.message,
        retryCount: this.retryCount
      });
    }
  }

  // Handle online status
  handleOnline() {
    console.log('🌐 RealtimeSync: Back online');
    this.isOnline = true;
    this.retryCount = 0;
    this.retryDelay = 5000;
    
    // Immediately sync when back online
    if (this.isPolling) {
      this.syncReservations();
    }
    
    this.notifyListeners({
      type: 'connection_status',
      isOnline: true
    });
  }

  // Handle offline status
  handleOffline() {
    console.log('📴 RealtimeSync: Gone offline');
    this.isOnline = false;
    
    this.notifyListeners({
      type: 'connection_status',
      isOnline: false
    });
  }

  // Get API base URL
  getApiBaseUrl() {
    // Use environment variable if available, otherwise fallback to relative path
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    return '/api';
  }

  // Add event listener
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners(event) {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  // Get current sync status
  getStatus() {
    return {
      isPolling: this.isPolling,
      isOnline: this.isOnline,
      lastSyncTime: this.lastSyncTime,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries
    };
  }

  // Force immediate sync
  async forceSync() {
    console.log('🔄 RealtimeSync: Force sync requested');
    await this.syncReservations();
  }

  // Cleanup
  destroy() {
    this.stopPolling();
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners.clear();
  }
}

// Create singleton instance
const realtimeSyncService = new RealtimeSyncService();

export default realtimeSyncService;
