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
    visibleInDashboard: row.visible_in_dashboard,
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

    // Simple GET handler - only show visible reservations by default
    if (method === 'GET' && path === '/api/supabase-reservations') {
      try {
        // Check for debug parameter to show all reservations
        const url = new URL(req.url, `http://${req.headers.host}`);
        const showAll = url.searchParams.get('showAll') === 'true';
        
        if (showAll) {
          // Debug mode: show all reservations
          const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(100)
          
          if (error) throw error
          
          return res.status(200).json({
            success: true,
            data: (data || []).map(toCamelCaseReservation),
            count: data?.length || 0,
            debug: 'Showing all reservations'
          })
        }
        
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('visible_in_dashboard', true) // Only show visible reservations
          .order('updated_at', { ascending: false })
          .limit(50)

        if (error) {
          // Fallback: if visible_in_dashboard column doesn't exist, filter by status
          if (error.message.includes('visible_in_dashboard')) {
            console.log('visible_in_dashboard column not found, using status filter fallback');
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('reservations')
              .select('*')
              .not('status', 'in', '("cancelled","deleted","checked-out")') // Exclude hidden statuses
              .order('updated_at', { ascending: false })
              .limit(50)

            if (fallbackError) {
              throw fallbackError
            }

            return res.status(200).json({
              success: true,
              data: (fallbackData || []).map(toCamelCaseReservation),
              count: fallbackData?.length || 0
            })
          }
          throw error
        }

        return res.status(200).json({
          success: true,
          data: (data || []).map(toCamelCaseReservation),
          count: data?.length || 0
        })
      } catch (error) {
        throw error
      }
    }

    // GET handler for history view - show all reservations including hidden ones
    if (method === 'GET' && path === '/api/supabase-reservations/history') {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('visible_in_dashboard', false) // Only show hidden reservations
          .order('updated_at', { ascending: false })
          .limit(100)

        if (error) {
          // Fallback: if visible_in_dashboard column doesn't exist, filter by status
          if (error.message.includes('visible_in_dashboard')) {
            console.log('visible_in_dashboard column not found, using status filter fallback for history');
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('reservations')
              .select('*')
              .in('status', ['cancelled', 'deleted', 'checked-out']) // Only hidden statuses
              .order('updated_at', { ascending: false })
              .limit(100)

            if (fallbackError) {
              throw fallbackError
            }

            return res.status(200).json({
              success: true,
              data: (fallbackData || []).map(toCamelCaseReservation),
              count: fallbackData?.length || 0
            })
          }
          throw error
        }

        return res.status(200).json({
          success: true,
          data: (data || []).map(toCamelCaseReservation),
          count: data?.length || 0
        })
      } catch (error) {
        throw error
      }
    }

    // GET handler for payment totals - only include visible reservations
    if (method === 'GET' && path === '/api/supabase-reservations/totals') {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('total_amount, currency, status')
          .eq('visible_in_dashboard', true) // Only include visible reservations
          .in('status', ['confirmed', 'checked-in']) // Only active reservations

        if (error) {
          // Fallback: if visible_in_dashboard column doesn't exist, filter by status
          if (error.message.includes('visible_in_dashboard')) {
            console.log('visible_in_dashboard column not found, using status filter fallback for totals');
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('reservations')
              .select('total_amount, currency, status')
              .in('status', ['confirmed', 'checked-in']) // Only active reservations
              .not('status', 'in', '("cancelled","deleted","checked-out")') // Exclude hidden statuses

            if (fallbackError) {
              throw fallbackError
            }

            // Calculate totals by currency
            const totals = {}
            fallbackData?.forEach(reservation => {
              const currency = reservation.currency || 'USD'
              if (!totals[currency]) {
                totals[currency] = 0
              }
              totals[currency] += parseFloat(reservation.total_amount) || 0
            })

            return res.status(200).json({
              success: true,
              data: {
                totals,
                count: fallbackData?.length || 0,
                reservations: fallbackData?.map(toCamelCaseReservation) || []
              }
            })
          }
          throw error
        }

        // Calculate totals by currency
        const totals = {}
        data?.forEach(reservation => {
          const currency = reservation.currency || 'USD'
          if (!totals[currency]) {
            totals[currency] = 0
          }
          totals[currency] += parseFloat(reservation.total_amount) || 0
        })

        return res.status(200).json({
          success: true,
          data: {
            totals,
            count: data?.length || 0,
            reservations: data?.map(toCamelCaseReservation) || []
          }
        })
      } catch (error) {
        throw error
      }
    }

    // POST handler for create, update, and delete operations
    if (method === 'POST' && path === '/api/supabase-reservations') {
      const requestData = req.body
      
      console.log('POST request received:', { requestData, operation: requestData.operation, id: requestData.id })
      
      // Handle different operations based on request type
      if (requestData.operation === 'update' && requestData.id) {
        // Update operation - use proper field mapping
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

        // Create update object with only the fields that are provided
        const updateFields = {}
        
        // Map camelCase to snake_case and only include provided fields
        if (requestData.guestName !== undefined) updateFields.guest_name = requestData.guestName
        if (requestData.email !== undefined) updateFields.email = requestData.email
        if (requestData.phone !== undefined) updateFields.phone = requestData.phone
        if (requestData.roomNumber !== undefined) updateFields.room_number = requestData.roomNumber
        if (requestData.roomType !== undefined) updateFields.room_type = requestData.roomType
        if (requestData.roomName !== undefined) updateFields.room_name = requestData.roomName
        if (requestData.checkIn !== undefined) updateFields.check_in = requestData.checkIn
        if (requestData.checkOut !== undefined) updateFields.check_out = requestData.checkOut
        if (requestData.totalAmount !== undefined) updateFields.total_amount = requestData.totalAmount
        if (requestData.currency !== undefined) updateFields.currency = requestData.currency
        if (requestData.specialRequests !== undefined) updateFields.special_requests = requestData.specialRequests
        if (requestData.arrivalTime !== undefined) updateFields.arrival_time = requestData.arrivalTime
        if (requestData.guestCount !== undefined) updateFields.guest_count = requestData.guestCount
        if (requestData.country !== undefined) updateFields.country = requestData.country
        if (requestData.status !== undefined) updateFields.status = requestData.status
        if (requestData.emailSent !== undefined) updateFields.email_sent = requestData.emailSent

        // Auto-manage visibility based on status
        if (requestData.status !== undefined) {
          const hiddenStatuses = ['cancelled', 'deleted', 'checked-out']
          updateFields.visible_in_dashboard = !hiddenStatuses.includes(requestData.status)
        }

        console.log('Update fields:', updateFields)

        const { data, error } = await supabase
          .from('reservations')
          .update(updateFields)
          .eq('id', requestData.id)
          .select()

        if (error) {
          throw error
        }

        if (!data || data.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Reservation not found'
          })
        }

        return res.status(200).json({
          success: true,
          data: toCamelCaseReservation(data[0]),
          message: 'Reservation updated successfully'
        })
      } else if (requestData.operation === 'delete' && requestData.id) {
        // Delete operation - use soft delete (mark as deleted)
        const { data, error } = await supabase
          .from('reservations')
          .update({ 
            status: 'deleted',
            visible_in_dashboard: false // Hide from dashboard when deleted
          })
          .eq('id', requestData.id)
          .select()

        if (error) {
          throw error
        }

        if (!data || data.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Reservation not found'
          })
        }

        return res.status(200).json({
          success: true,
          data: toCamelCaseReservation(data[0]),
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
            email_sent: false,
            visible_in_dashboard: true // New reservations are visible by default
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