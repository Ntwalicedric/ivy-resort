// Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database table names
export const TABLES = {
  RESERVATIONS: 'reservations',
  USERS: 'users'
}

// Real-time subscription helpers
export class RealtimeService {
  constructor() {
    this.subscriptions = new Map()
  }

  // Subscribe to reservations changes
  subscribeToReservations(callback) {
    const subscription = supabase
      .channel('reservations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.RESERVATIONS
        },
        (payload) => {
          console.log('📡 Supabase Realtime: Reservation change detected', payload)
          callback({
            type: 'reservation_change',
            event: payload.eventType,
            data: payload.new || payload.old,
            oldData: payload.old,
            newData: payload.new
          })
        }
      )
      .subscribe()

    this.subscriptions.set('reservations', subscription)
    return subscription
  }

  // Subscribe to specific reservation changes
  subscribeToReservation(id, callback) {
    const subscription = supabase
      .channel(`reservation_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.RESERVATIONS,
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('📡 Supabase Realtime: Single reservation change', payload)
          callback({
            type: 'single_reservation_change',
            event: payload.eventType,
            data: payload.new || payload.old,
            oldData: payload.old,
            newData: payload.new
          })
        }
      )
      .subscribe()

    this.subscriptions.set(`reservation_${id}`, subscription)
    return subscription
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      supabase.removeChannel(subscription)
      this.subscriptions.delete(channelName)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, channelName) => {
      supabase.removeChannel(subscription)
    })
    this.subscriptions.clear()
  }
}

// Create singleton instance
export const realtimeService = new RealtimeService()
