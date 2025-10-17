// Simplified Supabase API for testing
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
        data: data || [],
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
        data: {
          id: data.id,
          confirmationId: data.confirmation_id,
          guestName: data.guest_name,
          email: data.email,
          phone: data.phone,
          roomNumber: data.room_number,
          roomType: data.room_type,
          roomName: data.room_name,
          checkIn: data.check_in,
          checkOut: data.check_out,
          totalAmount: data.total_amount,
          currency: data.currency,
          specialRequests: data.special_requests,
          arrivalTime: data.arrival_time,
          guestCount: data.guest_count,
          country: data.country,
          status: data.status,
          emailSent: data.email_sent
        },
        message: 'Reservation created successfully'
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

module.exports = handler
