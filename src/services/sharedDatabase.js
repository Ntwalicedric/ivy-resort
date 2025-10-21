// Shared Database Service for cross-device data synchronization
// This service communicates with the shared database API

const API_BASE_URL = '/api/supabase-reservations';

class SharedDatabaseService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncListeners = [];
    this.syncInterval = null;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    return response.ok ? { success: true, message: text } : { success: false, error: text };
  }

  // Initialize the shared database service
  initialize() {
    console.log('Shared Database Service: Initializing...');
    this.startPeriodicSync();
  }

  // Start periodic synchronization
  startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.triggerSync();
      }
    }, 10000); // Sync every 10 seconds
  }

  // Stop periodic synchronization
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Trigger a sync operation
  async triggerSync() {
    try {
      console.log('Shared Database Service: Triggering sync...');
      const reservations = await this.syncReservations();
      this.notifySyncListeners({ 
        type: 'sync', 
        timestamp: Date.now(),
        data: reservations 
      });
    } catch (error) {
      console.warn('Shared Database Service: Sync failed:', error);
    }
  }

  // Sync reservations with shared database
  async syncReservations() {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      const result = await this.parseResponse(response);
      
      if (result.success) {
        // Store in localStorage for offline access
        localStorage.setItem('ivy_resort_shared_reservations', JSON.stringify(result.data));
        
        // Trigger storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'ivy_resort_shared_reservations',
          newValue: JSON.stringify(result.data),
          oldValue: localStorage.getItem('ivy_resort_shared_reservations')
        }));
        
        console.log('Shared Database Service: Synced', result.data.length, 'reservations');
        return result.data;
      }
    } catch (error) {
      console.warn('Shared Database Service: Failed to sync reservations:', error);
      // Fallback to local data
      return this.getLocalReservations();
    }
  }

  // Get local reservations (fallback)
  getLocalReservations() {
    try {
      const data = localStorage.getItem('ivy_resort_shared_reservations');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn('Shared Database Service: Failed to get local reservations:', error);
      return [];
    }
  }

  // API Methods
  async getReservations() {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      const result = await this.parseResponse(response);
      return result.success ? result.data : [];
    } catch (error) {
      console.warn('Shared Database Service: Failed to get reservations:', error);
      return this.getLocalReservations();
    }
  }

  async getReservationHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      const result = await this.parseResponse(response);
      return result.success ? result.data : [];
    } catch (error) {
      console.warn('Shared Database Service: Failed to get reservation history:', error);
      return [];
    }
  }

  async cleanupOldReservations() {
    try {
      const response = await fetch(`${API_BASE_URL}/cleanup`);
      const result = await this.parseResponse(response);
      return result.success ? result.data : { deletedCount: 0, deletedReservations: [] };
    } catch (error) {
      console.warn('Shared Database Service: Failed to cleanup old reservations:', error);
      return { deletedCount: 0, deletedReservations: [] };
    }
  }

  async getPaymentTotals() {
    try {
      const response = await fetch(`${API_BASE_URL}/totals`);
      const result = await this.parseResponse(response);
      return result.success ? result.data : { totals: {}, count: 0, reservations: [] };
    } catch (error) {
      console.warn('Shared Database Service: Failed to get payment totals:', error);
      return { totals: {}, count: 0, reservations: [] };
    }
  }

  async getRooms() {
    try {
      const response = await fetch(`${API_BASE_URL}?action=get&type=rooms`);
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.warn('Shared Database Service: Failed to get rooms:', error);
      return [];
    }
  }

  async getGuests() {
    try {
      const response = await fetch(`${API_BASE_URL}?action=get&type=guests`);
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.warn('Shared Database Service: Failed to get guests:', error);
      return [];
    }
  }

  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}?action=get&type=users`);
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.warn('Shared Database Service: Failed to get users:', error);
      return [];
    }
  }

  async getOverview() {
    try {
      const response = await fetch(`${API_BASE_URL}?action=overview`);
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.warn('Shared Database Service: Failed to get overview:', error);
      return null;
    }
  }

  async getReports() {
    try {
      const response = await fetch(`${API_BASE_URL}?action=reports`);
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.warn('Shared Database Service: Failed to get reports:', error);
      return null;
    }
  }

  // CRUD Operations
  async createReservation(reservationData) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });
      const result = await this.parseResponse(response);
      if (result.success) {
        // Trigger sync to update all devices
        await this.triggerSync();
      }
      return result;
    } catch (error) {
      console.warn('Shared Database Service: Failed to create reservation:', error);
      return { success: false, error: error.message };
    }
  }

  async updateReservation(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          operation: 'update',
          id: id,
          ...updateData
        })
      });
      const result = await this.parseResponse(response);
      if (result.success) {
        // Trigger sync to update all devices
        await this.triggerSync();
      }
      return result;
    } catch (error) {
      console.warn('Shared Database Service: Failed to update reservation:', error);
      return { success: false, error: error.message };
    }
  }

  async cancelReservation(id) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          operation: 'update',
          id: id,
          status: 'cancelled'
        })
      });
      const result = await this.parseResponse(response);
      if (result.success) {
        // Trigger sync to update all devices
        await this.triggerSync();
      }
      return result;
    } catch (error) {
      console.warn('Shared Database Service: Failed to cancel reservation:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteReservation(id) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          operation: 'delete',
          id: id
        })
      });
      const result = await this.parseResponse(response);
      if (result.success) {
        await this.triggerSync();
      }
      return result;
    } catch (error) {
      console.warn('Shared Database Service: Failed to delete reservation:', error);
      return { success: false, error: error.message };
    }
  }

  async checkInReservation(id) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          operation: 'update',
          id: id,
          status: 'checked-in'
        })
      });
      const result = await this.parseResponse(response);
      if (result.success) {
        // Trigger sync to update all devices
        await this.triggerSync();
      }
      return result;
    } catch (error) {
      console.warn('Shared Database Service: Failed to check in reservation:', error);
      return { success: false, error: error.message };
    }
  }

  async checkOutReservation(id) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          operation: 'update',
          id: id,
          status: 'checked-out'
        })
      });
      const result = await this.parseResponse(response);
      if (result.success) {
        // Trigger sync to update all devices
        await this.triggerSync();
      }
      return result;
    } catch (error) {
      console.warn('Shared Database Service: Failed to check out reservation:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync Listeners
  addSyncListener(callback) {
    this.syncListeners.push(callback);
  }

  removeSyncListener(callback) {
    this.syncListeners = this.syncListeners.filter(listener => listener !== callback);
  }

  notifySyncListeners(data) {
    this.syncListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.warn('Shared Database Service: Error in sync listener:', error);
      }
    });
  }

  // Force immediate sync
  async forceSync() {
    await this.triggerSync();
    return this.getReservations();
  }

  // Get sync status
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      hasData: !!localStorage.getItem('ivy_resort_shared_reservations'),
      lastSync: localStorage.getItem('ivy_resort_last_sync')
    };
  }
}

// Create singleton instance
const sharedDatabase = new SharedDatabaseService();

export default sharedDatabase;
