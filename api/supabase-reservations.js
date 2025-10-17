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

    console.log('Supabase API called:', { method, path, url: req.url })

    // Simple GET handler
    if (method === 'GET' && path === '/api/supabase-reservations') {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .neq('status', 'deleted') // Filter out soft-deleted records
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

    // POST handler for create, update, and delete operations
    if (method === 'POST' && path === '/api/supabase-reservations') {
      const requestData = req.body
      
      // Handle different operations based on request type
      if (requestData.operation === 'update' && requestData.id) {
        // Update operation - use delete and recreate approach to avoid constraint issues
        const { data: currentData, error: fetchError } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', requestData.id)
          .single()

        if (fetchError) {
          throw fetchError
        }

        if (!currentData) {
          return res.status(404).json({
            success: false,
            error: 'Reservation not found'
          })
        }

        // Merge current data with update data - ensure no null values for required fields
        const updatedData = {
          confirmation_id: currentData.confirmation_id,
          guest_name: requestData.guestName !== undefined ? requestData.guestName : currentData.guest_name,
          email: requestData.email !== undefined ? requestData.email : currentData.email,
          phone: requestData.phone !== undefined ? requestData.phone : currentData.phone,
          room_number: requestData.roomNumber !== undefined ? requestData.roomNumber : currentData.room_number,
          room_type: requestData.roomType !== undefined ? requestData.roomType : currentData.room_type,
          room_name: requestData.roomName !== undefined ? requestData.roomName : currentData.room_name,
          check_in: requestData.checkIn !== undefined ? requestData.checkIn : currentData.check_in,
          check_out: requestData.checkOut !== undefined ? requestData.checkOut : currentData.check_out,
          total_amount: requestData.totalAmount !== undefined ? requestData.totalAmount : currentData.total_amount,
          currency: requestData.currency !== undefined ? requestData.currency : currentData.currency,
          special_requests: requestData.specialRequests !== undefined ? requestData.specialRequests : currentData.special_requests,
          arrival_time: requestData.arrivalTime !== undefined ? requestData.arrivalTime : currentData.arrival_time,
          guest_count: requestData.guestCount !== undefined ? requestData.guestCount : currentData.guest_count,
          country: requestData.country !== undefined ? requestData.country : currentData.country,
          status: requestData.status !== undefined ? requestData.status : currentData.status,
          email_sent: requestData.emailSent !== undefined ? requestData.emailSent : currentData.email_sent
        }

        console.log('Current data from DB:', currentData)
        console.log('Update data being inserted:', updatedData)

        // Validate that required fields are not null
        if (!updatedData.guest_name || !updatedData.email || !updatedData.room_name || !updatedData.check_in || !updatedData.check_out || !updatedData.total_amount) {
          return res.status(400).json({
            success: false,
            error: 'Required fields cannot be null: guest_name, email, room_name, check_in, check_out, total_amount'
          })
        }

        // Delete the old record
        const { error: deleteError } = await supabase
          .from('reservations')
          .delete()
          .eq('id', requestData.id)

        if (deleteError) {
          throw deleteError
        }

        // Insert the updated record
        const { data, error } = await supabase
          .from('reservations')
          .insert([updatedData])
          .select()
          .single()

        if (error) {
          throw error
        }

        return res.status(200).json({
          success: true,
          data: toCamelCaseReservation(data),
          message: 'Reservation updated successfully'
        })
      } else if (requestData.operation === 'delete' && requestData.id) {
        // Soft delete operation - mark as deleted instead of actually deleting
        const { data, error } = await supabase
          .from('reservations')
          .update({ status: 'deleted' })
          .eq('id', requestData.id)
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
      } else {
        // Create operation (default)
        const confirmationId = `IVY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        
        // Validate required fields
        if (!requestData.guestName || !requestData.email || !requestData.roomName || !requestData.checkIn || !requestData.checkOut || !requestData.totalAmount) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: guestName, email, roomName, checkIn, checkOut, totalAmount'
          })
        }
        
        const { data, error } = await supabase
          .from('reservations')
          .insert([{
            confirmation_id: confirmationId,
            guest_name: requestData.guestName,
            email: requestData.email,
            phone: requestData.phone || null,
            room_number: requestData.roomNumber || null,
            room_type: requestData.roomType || null,
            room_name: requestData.roomName,
            check_in: requestData.checkIn,
            check_out: requestData.checkOut,
            total_amount: requestData.totalAmount,
            currency: requestData.currency || 'USD',
            special_requests: requestData.specialRequests || null,
            arrival_time: requestData.arrivalTime || null,
            guest_count: requestData.guestCount || 1,
            country: requestData.country || null,
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
    }

    // PUT handler for updates (check-in, check-out, edit)
    if (method === 'PUT' && path.startsWith('/api/supabase-reservations/')) {
      console.log('PUT handler matched:', { method, path })
      const id = path.split('/').pop()
      console.log('Extracted ID:', id)
      
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

    // Debug: log all unmatched requests
    console.log('Unmatched request:', { method, path, url: req.url })
    return res.status(404).json({ 
      error: 'Endpoint not found',
      method,
      path,
      url: req.url
    })

  } catch (error) {
    console.error('Supabase API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

export default handler