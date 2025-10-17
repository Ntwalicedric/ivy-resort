// Supabase real-time syncing service
// Uses Supabase real-time subscriptions instead of polling

import { supabase, realtimeService } from '../lib/supabase.js'

class SupabaseRealtimeSyncService {
  constructor() {
    this.isConnected = false
    this.listeners = new Set()
    this.subscription = null
    this.retryCount = 0
    this.maxRetries = 3
    this.retryDelay = 5000
    this.isOnline = navigator.onLine
    
    // Bind methods
    this.startSync = this.startSync.bind(this)
    this.stopSync = this.stopSync.bind(this)
    this.handleOnline = this.handleOnline.bind(this)
    this.handleOffline = this.handleOffline.bind(this)
    
    // Set up online/offline listeners
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  }

  // Start real-time syncing
  startSync() {
    if (this.isConnected) {
      console.log('🔄 SupabaseRealtimeSync: Already connected')
      return
    }

    console.log('🚀 SupabaseRealtimeSync: Starting real-time subscription...')
    
    try {
      // Subscribe to reservations changes
      this.subscription = realtimeService.subscribeToReservations((event) => {
        console.log('📡 SupabaseRealtimeSync: Real-time event received:', event)
        
        this.notifyListeners({
          type: 'realtime_update',
          event: event.event,
          data: event.data,
          oldData: event.oldData,
          newData: event.newData,
          timestamp: new Date().toISOString()
        })
      })

      this.isConnected = true
      this.retryCount = 0
      
      this.notifyListeners({
        type: 'connection_status',
        isConnected: true,
        isOnline: this.isOnline
      })

      console.log('✅ SupabaseRealtimeSync: Real-time subscription active')
    } catch (error) {
      console.error('❌ SupabaseRealtimeSync: Failed to start subscription:', error)
      this.handleSyncError(error)
    }
  }

  // Stop real-time syncing
  stopSync() {
    if (!this.isConnected) {
      return
    }

    console.log('⏹️ SupabaseRealtimeSync: Stopping real-time subscription...')
    
    if (this.subscription) {
      realtimeService.unsubscribe('reservations')
      this.subscription = null
    }

    this.isConnected = false
    
    this.notifyListeners({
      type: 'connection_status',
      isConnected: false,
      isOnline: this.isOnline
    })
  }

  // Handle sync errors with retry logic
  handleSyncError(error) {
    this.retryCount++
    
    if (this.retryCount <= this.maxRetries) {
      console.log(`🔄 SupabaseRealtimeSync: Retrying in ${this.retryDelay/1000}s (attempt ${this.retryCount}/${this.maxRetries})`)
      
      setTimeout(() => {
        if (this.isOnline) {
          this.startSync()
        }
      }, this.retryDelay)
      
      // Exponential backoff
      this.retryDelay = Math.min(this.retryDelay * 1.5, 30000)
    } else {
      console.error('💥 SupabaseRealtimeSync: Max retries exceeded')
      this.notifyListeners({
        type: 'sync_error',
        error: error.message,
        retryCount: this.retryCount
      })
    }
  }

  // Handle online status
  handleOnline() {
    console.log('🌐 SupabaseRealtimeSync: Back online')
    this.isOnline = true
    this.retryCount = 0
    this.retryDelay = 5000
    
    // Restart subscription when back online
    if (!this.isConnected) {
      this.startSync()
    }
    
    this.notifyListeners({
      type: 'connection_status',
      isConnected: this.isConnected,
      isOnline: true
    })
  }

  // Handle offline status
  handleOffline() {
    console.log('📴 SupabaseRealtimeSync: Gone offline')
    this.isOnline = false
    
    this.notifyListeners({
      type: 'connection_status',
      isConnected: this.isConnected,
      isOnline: false
    })
  }

  // Add event listener
  addListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify all listeners
  notifyListeners(event) {
    this.listeners.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('Error in Supabase sync listener:', error)
      }
    })
  }

  // Get current sync status
  getStatus() {
    return {
      isConnected: this.isConnected,
      isOnline: this.isOnline,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries
    }
  }

  // Force refresh data (fetch from Supabase)
  async forceRefresh() {
    try {
      console.log('🔄 SupabaseRealtimeSync: Force refresh requested')
      
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        throw error
      }

      this.notifyListeners({
        type: 'force_refresh',
        data: data || [],
        timestamp: new Date().toISOString()
      })

      return data
    } catch (error) {
      console.error('❌ SupabaseRealtimeSync: Force refresh failed:', error)
      throw error
    }
  }

  // Cleanup
  destroy() {
    this.stopSync()
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
    this.listeners.clear()
  }
}

// Create singleton instance
const supabaseRealtimeSyncService = new SupabaseRealtimeSyncService()

export default supabaseRealtimeSyncService
