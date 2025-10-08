// Cross-device synchronization service using localStorage + periodic sync simulation
class SyncStorageService {
  constructor() {
    this.syncKey = 'ivy_resort_sync_data';
    this.lastSyncKey = 'ivy_resort_last_sync';
    this.syncInterval = 10000; // 10 seconds
    this.isOnline = navigator.onLine;
    this.syncListeners = [];
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Initialize the sync service
  initialize() {
    console.log('Sync storage service initialized');
    
    // Start periodic sync
    this.startPeriodicSync();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.syncKey) {
        this.handleStorageChange(e.newValue);
      }
    });
    
    // Initial sync
    this.triggerSync();
  }

  // Start periodic synchronization
  startPeriodicSync() {
    setInterval(() => {
      if (this.isOnline) {
        this.triggerSync();
      }
    }, this.syncInterval);
  }

  // Trigger a sync operation
  async triggerSync() {
    try {
      const currentData = this.getLocalData();
      const lastSync = this.getLastSyncTime();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // In a real implementation, this would sync with a server
      // For now, we'll simulate cross-device sync using localStorage
      this.simulateCrossDeviceSync(currentData);
      
      this.setLastSyncTime(Date.now());
      
      // Notify listeners
      this.notifySyncListeners(currentData);
      
    } catch (error) {
      console.warn('Sync failed:', error);
    }
  }

  // Simulate cross-device synchronization
  simulateCrossDeviceSync(data) {
    // This simulates what would happen in a real cloud sync
    // In reality, this would communicate with a server
    
    // For demo purposes, we'll create a "shared" storage area
    // that simulates what would be stored on a server
    const sharedData = this.getSharedData();
    
    if (sharedData && data) {
      // Merge data (server data takes precedence for conflicts)
      const mergedData = this.mergeData(data, sharedData);
      this.setLocalData(mergedData);
      this.setSharedData(mergedData);
    } else if (data) {
      // No shared data, upload local data
      this.setSharedData(data);
    } else if (sharedData) {
      // No local data, download shared data
      this.setLocalData(sharedData);
    }
  }

  // Merge local and shared data
  mergeData(localData, sharedData) {
    const merged = { ...localData };
    
    // Merge reservations
    if (sharedData.reservations && localData.reservations) {
      const reservationMap = new Map();
      
      // Add local reservations
      localData.reservations.forEach(reservation => {
        reservationMap.set(reservation.id, reservation);
      });
      
      // Add/update with shared reservations
      sharedData.reservations.forEach(reservation => {
        const existing = reservationMap.get(reservation.id);
        if (!existing || (reservation.updatedAt && reservation.updatedAt > existing.updatedAt)) {
          reservationMap.set(reservation.id, reservation);
        }
      });
      
      merged.reservations = Array.from(reservationMap.values());
    } else if (sharedData.reservations) {
      merged.reservations = sharedData.reservations;
    }
    
    // Use the latest timestamp
    merged.lastUpdated = Math.max(
      localData.lastUpdated || 0,
      sharedData.lastUpdated || 0
    );
    
    return merged;
  }

  // Get local data
  getLocalData() {
    try {
      const data = localStorage.getItem('ivy_resort_reservations');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get local data:', error);
      return null;
    }
  }

  // Set local data
  setLocalData(data) {
    try {
      localStorage.setItem('ivy_resort_reservations', JSON.stringify(data));
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'ivy_resort_reservations',
        newValue: JSON.stringify(data),
        oldValue: localStorage.getItem('ivy_resort_reservations')
      }));
    } catch (error) {
      console.warn('Failed to set local data:', error);
    }
  }

  // Get shared data (simulates server data)
  getSharedData() {
    try {
      const data = localStorage.getItem(this.syncKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get shared data:', error);
      return null;
    }
  }

  // Set shared data (simulates server data)
  setSharedData(data) {
    try {
      localStorage.setItem(this.syncKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to set shared data:', error);
    }
  }

  // Get last sync time
  getLastSyncTime() {
    try {
      const time = localStorage.getItem(this.lastSyncKey);
      return time ? parseInt(time) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Set last sync time
  setLastSyncTime(time) {
    try {
      localStorage.setItem(this.lastSyncKey, time.toString());
    } catch (error) {
      console.warn('Failed to set last sync time:', error);
    }
  }

  // Handle storage changes from other tabs
  handleStorageChange(newValue) {
    try {
      if (newValue) {
        const data = JSON.parse(newValue);
        this.notifySyncListeners(data);
      }
    } catch (error) {
      console.warn('Failed to handle storage change:', error);
    }
  }

  // Add sync listener
  addSyncListener(callback) {
    this.syncListeners.push(callback);
  }

  // Remove sync listener
  removeSyncListener(callback) {
    this.syncListeners = this.syncListeners.filter(listener => listener !== callback);
  }

  // Notify sync listeners
  notifySyncListeners(data) {
    this.syncListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.warn('Sync listener error:', error);
      }
    });
  }

  // Force immediate sync
  async forceSync() {
    await this.triggerSync();
    return this.getLocalData();
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      lastSync: this.getLastSyncTime(),
      hasData: !!this.getLocalData()
    };
  }
}

// Create singleton instance
const syncStorage = new SyncStorageService();

export default syncStorage;
