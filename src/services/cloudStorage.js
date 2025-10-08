// Cloud-based storage service for cross-device synchronization
class CloudStorageService {
  constructor() {
    this.baseUrl = 'https://api.jsonbin.io/v3/b';
    this.binId = '65a4f8c8dc74654018a8b123'; // You'll need to create a new bin
    this.apiKey = 'YOUR_JSONBIN_API_KEY'; // You'll need to get this from jsonbin.io
    this.syncInterval = 30000; // 30 seconds
    this.lastSync = 0;
  }

  // Initialize the service
  async initialize() {
    try {
      // Check if we have existing data
      const localData = this.getLocalData();
      if (localData && localData.reservations) {
        // Upload local data to cloud
        await this.uploadData(localData);
      } else {
        // Download data from cloud
        const cloudData = await this.downloadData();
        if (cloudData) {
          this.setLocalData(cloudData);
        }
      }
      
      // Start periodic sync
      this.startPeriodicSync();
      
      console.log('Cloud storage initialized successfully');
    } catch (error) {
      console.warn('Cloud storage initialization failed:', error);
      // Fallback to local storage only
    }
  }

  // Upload data to cloud
  async uploadData(data) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.apiKey,
          'X-Bin-Name': 'ivy-resort-reservations'
        },
        body: JSON.stringify({
          ...data,
          lastUpdated: Date.now(),
          version: this.getVersion()
        })
      });

      if (response.ok) {
        this.lastSync = Date.now();
        console.log('Data uploaded to cloud successfully');
        return true;
      } else {
        throw new Error(`Upload failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to upload data to cloud:', error);
      return false;
    }
  }

  // Download data from cloud
  async downloadData() {
    try {
      const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
        headers: {
          'X-Master-Key': this.apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data downloaded from cloud successfully');
        return data.record;
      } else {
        throw new Error(`Download failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to download data from cloud:', error);
      return null;
    }
  }

  // Sync data between local and cloud
  async syncData() {
    try {
      const localData = this.getLocalData();
      const cloudData = await this.downloadData();

      if (!localData && cloudData) {
        // No local data, use cloud data
        this.setLocalData(cloudData);
        return cloudData;
      } else if (localData && !cloudData) {
        // No cloud data, upload local data
        await this.uploadData(localData);
        return localData;
      } else if (localData && cloudData) {
        // Both exist, merge them
        const mergedData = this.mergeData(localData, cloudData);
        this.setLocalData(mergedData);
        await this.uploadData(mergedData);
        return mergedData;
      }

      return localData || cloudData;
    } catch (error) {
      console.warn('Data sync failed:', error);
      return this.getLocalData();
    }
  }

  // Merge local and cloud data
  mergeData(localData, cloudData) {
    const merged = { ...localData };
    
    // Merge reservations (keep the latest version of each)
    if (cloudData.reservations) {
      const localReservations = localData.reservations || [];
      const cloudReservations = cloudData.reservations || [];
      
      // Create a map of reservations by ID
      const reservationMap = new Map();
      
      // Add local reservations
      localReservations.forEach(reservation => {
        reservationMap.set(reservation.id, reservation);
      });
      
      // Add/update with cloud reservations (cloud takes precedence for conflicts)
      cloudReservations.forEach(reservation => {
        const existing = reservationMap.get(reservation.id);
        if (!existing || (reservation.updatedAt && reservation.updatedAt > existing.updatedAt)) {
          reservationMap.set(reservation.id, reservation);
        }
      });
      
      merged.reservations = Array.from(reservationMap.values());
    }
    
    // Use the latest timestamp
    merged.lastUpdated = Math.max(
      localData.lastUpdated || 0,
      cloudData.lastUpdated || 0
    );
    
    return merged;
  }

  // Start periodic synchronization
  startPeriodicSync() {
    setInterval(async () => {
      try {
        await this.syncData();
      } catch (error) {
        console.warn('Periodic sync failed:', error);
      }
    }, this.syncInterval);
  }

  // Get local data
  getLocalData() {
    try {
      const data = localStorage.getItem('ivy_resort_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get local data:', error);
      return null;
    }
  }

  // Set local data
  setLocalData(data) {
    try {
      localStorage.setItem('ivy_resort_data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to set local data:', error);
    }
  }

  // Get version for cache busting
  getVersion() {
    return Date.now().toString();
  }

  // Force immediate sync
  async forceSync() {
    try {
      const syncedData = await this.syncData();
      console.log('Force sync completed');
      return syncedData;
    } catch (error) {
      console.warn('Force sync failed:', error);
      return this.getLocalData();
    }
  }
}

// Create singleton instance
const cloudStorage = new CloudStorageService();

export default cloudStorage;
