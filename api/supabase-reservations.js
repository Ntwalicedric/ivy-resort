// Supabase-based reservations API
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')

  try {
    const { method } = req
    const url = new URL(req.url, `http://${req.headers.host}`)
    const path = url.pathname

    // Route handling
    if (method === 'GET' && path === '/api/supabase-reservations') {
      await handleGetReservations(req, res)
    } else if (method === 'POST' && path === '/api/supabase-reservations') {
      await handleCreateReservation(req, res)
    } else if (method === 'PUT' && path.startsWith('/api/supabase-reservations/')) {
      await handleUpdateReservation(req, res)
    } else if (method === 'DELETE' && path.startsWith('/api/supabase-reservations/')) {
      await handleDeleteReservation(req, res)
    } else if (method === 'GET' && path === '/api/supabase-reservations/stats') {
      await handleGetStats(req, res)
    } else {
      res.status(404).json({ error: 'Endpoint not found' })
    }
  } catch (error) {
    console.error('Supabase API Error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

// GET /api/supabase-reservations - Get all reservations
async function handleGetReservations(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const status = url.searchParams.get('status')
    const limit = url.searchParams.get('limit')
    const since = url.searchParams.get('since')

    let query = supabase
      .from('reservations')
      .select('*')
      .order('updated_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (since) {
      query = query.gt('updated_at', since)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    res.status(200).json({
      success: true,
      data: data || [],
      timestamp: new Date().toISOString(),
      count: data?.length || 0
    })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }
}

// POST /api/supabase-reservations - Create new reservation
async function handleCreateReservation(req, res) {
  try {
    const reservationData = req.body
    
    // Validate required fields
    const required = ['guestName', 'email', 'roomName', 'checkIn', 'checkOut', 'totalAmount']
    for (const field of required) {
      if (!reservationData[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        })
      }
    }

    // Generate confirmation ID
    const confirmationId = `IVY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        ...reservationData,
        confirmation_id: confirmationId
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    res.status(201).json({
      success: true,
      data: data,
      message: 'Reservation created successfully'
    })
  } catch (error) {
    console.error('Error creating reservation:', error)
    res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }
}

// PUT /api/supabase-reservations/:id - Update reservation
async function handleUpdateReservation(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const id = url.pathname.split('/').pop()
    const { status, emailSent } = req.body

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reservation ID'
      })
    }

    const updateData = {}
    if (status) updateData.status = status
    if (emailSent !== undefined) updateData.email_sent = emailSent

    const { data, error } = await supabase
      .from('reservations')
      .update(updateData)
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

    res.status(200).json({
      success: true,
      data: data,
      message: 'Reservation updated successfully'
    })
  } catch (error) {
    console.error('Error updating reservation:', error)
    res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }
}

// DELETE /api/supabase-reservations/:id - Delete reservation
async function handleDeleteReservation(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const id = url.pathname.split('/').pop()

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

    res.status(200).json({
      success: true,
      data: data,
      message: 'Reservation deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting reservation:', error)
    res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }
}

// GET /api/supabase-reservations/stats - Get reservation statistics
async function handleGetStats(req, res) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('status, total_amount, email_sent, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      throw error
    }

    const stats = {
      total_reservations: data.length,
      confirmed: data.filter(r => r.status === 'confirmed').length,
      pending: data.filter(r => r.status === 'pending').length,
      cancelled: data.filter(r => r.status === 'cancelled').length,
      emails_sent: data.filter(r => r.email_sent).length,
      total_revenue: data.reduce((sum, r) => sum + (r.total_amount || 0), 0)
    }

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(400).json({ 
      success: false, 
      error: error.message 
    })
  }
}
