// Supabase polling-based syncing service (works on Free plan)
import { supabase } from '../lib/supabase.js'

class SupabasePollingSyncService {
  constructor() {
    this.isPolling = false
    this.listeners = new Set()
    this.intervalId = null
    this.pollIntervalMs = Number(import.meta?.env?.VITE_SUPABASE_POLL_INTERVAL_MS) || 8000
    this.lastUpdatedAt = null
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.notify({ type: 'connection_status', isOnline: true, isPolling: this.isPolling })
      })
      window.addEventListener('offline', () => {
        this.isOnline = false
        this.notify({ type: 'connection_status', isOnline: false, isPolling: this.isPolling })
      })
    }
  }

  startPolling() {
    if (this.isPolling) return
    this.isPolling = true
    this.notify({ type: 'polling_started', timestamp: new Date().toISOString() })

    const tick = async () => {
      if (!this.isOnline) return
      try {
        let query = supabase
          .from('reservations')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(50)

        if (this.lastUpdatedAt) {
          query = query.gt('updated_at', this.lastUpdatedAt)
        }

        const { data, error } = await query
        if (error) throw error

        if (data && data.length > 0) {
          this.lastUpdatedAt = data[0].updated_at
          this.notify({ type: 'sync_success', timestamp: new Date().toISOString(), data })
        }
      } catch (error) {
        this.notify({ type: 'sync_error', error: error.message })
      }
    }

    // Run immediately and then at interval
    tick()
    this.intervalId = setInterval(tick, this.pollIntervalMs)
  }

  stopPolling() {
    if (!this.isPolling) return
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = null
    this.isPolling = false
    this.notify({ type: 'polling_stopped', timestamp: new Date().toISOString() })
  }

  async forceSync() {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(100)
    if (error) throw error
    if (data && data.length > 0) this.lastUpdatedAt = data[0].updated_at
    this.notify({ type: 'sync_success', timestamp: new Date().toISOString(), data })
    return data
  }

  addListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  notify(event) {
    this.listeners.forEach(cb => {
      try { cb(event) } catch (_) {}
    })
  }

  getStatus() {
    return { isPolling: this.isPolling, isOnline: this.isOnline, lastSync: this.lastUpdatedAt }
  }
}

const supabasePollingSyncService = new SupabasePollingSyncService()
export default supabasePollingSyncService


