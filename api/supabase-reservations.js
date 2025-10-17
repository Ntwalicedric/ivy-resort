// Supabase-based reservations API
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper to convert snake_case to camelCase
function toCamelCaseReservation(row = {}) {
  return {
    id: row.id,
    confirmationId: row.confirmation_id,
    guestName: row.guest_name,
    email: row.email,
    phone: row.phone,
    roomNumber: row.room_number,
    roomType: row.room_type,
    roomName: row.room_name,
    checkIn: row.check_in,
    checkOut: row.check_out,
    totalAmount: row.total_amount,
    currency: row.currency,
    totalAmountInCurrency: row.total_amount_in_currency,
    totalAmountDisplay: row.total_amount_display,
    specialRequests: row.special_requests,
    arrivalTime: row.arrival_time,
    guestCount: row.guest_count,
    country: row.country,
    status: row.status,
    emailSent: row.email_sent,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { method } = req
    const url = new URL(req.url, `http://${req.headers.host}`)
    const path = url.pathname

    console.log('Supabase API called:', { method, path })

    // Simple GET handler
    if (method === 'GET' && path === '/api/supabase-reservations') {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(50)

      if (error) {
        throw error
      }

      return res.status(200).json({
        success: true,
        data: (data || []).map(toCamelCaseReservation),
        count: data?.length || 0
      })
    }

    // Simple POST handler
    if (method === 'POST' && path === '/api/supabase-reservations') {
      const reservationData = req.body
      
      // Generate confirmation ID
      const confirmationId = `IVY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          confirmation_id: confirmationId,
          guest_name: reservationData.guestName,
          email: reservationData.email,
          phone: reservationData.phone,
          room_number: reservationData.roomNumber,
          room_type: reservationData.roomType,
          room_name: reservationData.roomName,
          check_in: reservationData.checkIn,
          check_out: reservationData.checkOut,
          total_amount: reservationData.totalAmount,
          currency: reservationData.currency,
          special_requests: reservationData.specialRequests,
          arrival_time: reservationData.arrivalTime,
          guest_count: reservationData.guestCount,
          country: reservationData.country,
          status: 'confirmed',
          email_sent: false
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      return res.status(201).json({
        success: true,
        data: toCamelCaseReservation(data),
        message: 'Reservation created successfully'
      })
    }

    // PUT handler for updates (check-in, check-out, edit)
    if (method === 'PUT' && path.startsWith('/api/supabase-reservations/')) {
      const id = path.split('/').pop()
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid reservation ID'
        })
      }

      const updateData = req.body
      
      // Convert camelCase to snake_case for database
      const dbUpdateData = {}
      if (updateData.guestName) dbUpdateData.guest_name = updateData.guestName
      if (updateData.email) dbUpdateData.email = updateData.email
      if (updateData.phone) dbUpdateData.phone = updateData.phone
      if (updateData.roomNumber) dbUpdateData.room_number = updateData.roomNumber
      if (updateData.roomType) dbUpdateData.room_type = updateData.roomType
      if (updateData.roomName) dbUpdateData.room_name = updateData.roomName
      if (updateData.checkIn) dbUpdateData.check_in = updateData.checkIn
      if (updateData.checkOut) dbUpdateData.check_out = updateData.checkOut
      if (updateData.totalAmount) dbUpdateData.total_amount = updateData.totalAmount
      if (updateData.currency) dbUpdateData.currency = updateData.currency
      if (updateData.specialRequests) dbUpdateData.special_requests = updateData.specialRequests
      if (updateData.arrivalTime) dbUpdateData.arrival_time = updateData.arrivalTime
      if (updateData.guestCount) dbUpdateData.guest_count = updateData.guestCount
      if (updateData.country) dbUpdateData.country = updateData.country
      if (updateData.status) dbUpdateData.status = updateData.status
      if (updateData.emailSent !== undefined) dbUpdateData.email_sent = updateData.emailSent

      const { data, error } = await supabase
        .from('reservations')
        .update(dbUpdateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Reservation not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: toCamelCaseReservation(data),
        message: 'Reservation updated successfully'
      })
    }

    // DELETE handler
    if (method === 'DELETE' && path.startsWith('/api/supabase-reservations/')) {
      const id = path.split('/').pop()
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid reservation ID'
        })
      }

      const { data, error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Reservation not found'
        })
      }

      return res.status(200).json({
        success: true,
        data: toCamelCaseReservation(data),
        message: 'Reservation deleted successfully'
      })
    }

    return res.status(404).json({ error: 'Endpoint not found' })

  } catch (error) {
    console.error('Supabase API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

export default handler