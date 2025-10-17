// Reservations API endpoints for real-time syncing
import { ReservationService } from './database.js';

export default async function handler(req, res) {
  // Set CORS headers for cross-device access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');

  try {
    const { method } = req;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    // Route handling
    if (method === 'GET' && path === '/api/reservations') {
      await handleGetReservations(req, res);
    } else if (method === 'POST' && path === '/api/reservations') {
      await handleCreateReservation(req, res);
    } else if (method === 'PUT' && path.startsWith('/api/reservations/')) {
      await handleUpdateReservation(req, res);
    } else if (method === 'DELETE' && path.startsWith('/api/reservations/')) {
      await handleDeleteReservation(req, res);
    } else if (method === 'GET' && path === '/api/reservations/stats') {
      await handleGetStats(req, res);
    } else if (method === 'GET' && path === '/api/reservations/sync') {
      await handleSyncReservations(req, res);
    } else {
      res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// GET /api/reservations - Get all reservations
async function handleGetReservations(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const status = url.searchParams.get('status');
    const limit = url.searchParams.get('limit');
    const since = url.searchParams.get('since');

    const filters = {};
    if (status) filters.status = status;
    if (limit) filters.limit = parseInt(limit);
    if (since) filters.since = new Date(since);

    const result = await ReservationService.getAll(filters);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        timestamp: new Date().toISOString(),
        count: result.data.length
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in handleGetReservations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reservations' 
    });
  }
}

// POST /api/reservations - Create new reservation
async function handleCreateReservation(req, res) {
  try {
    const reservationData = req.body;
    
    // Validate required fields
    const required = ['guestName', 'email', 'roomName', 'checkIn', 'checkOut', 'totalAmount'];
    for (const field of required) {
      if (!reservationData[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        });
      }
    }

    const result = await ReservationService.create(reservationData);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: 'Reservation created successfully'
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in handleCreateReservation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create reservation' 
    });
  }
}

// PUT /api/reservations/:id - Update reservation
async function handleUpdateReservation(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();
    const { status, emailSent } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reservation ID'
      });
    }

    const result = await ReservationService.updateStatus(id, status, emailSent);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: 'Reservation updated successfully'
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in handleUpdateReservation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update reservation' 
    });
  }
}

// DELETE /api/reservations/:id - Delete reservation
async function handleDeleteReservation(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reservation ID'
      });
    }

    const result = await ReservationService.delete(id);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        message: 'Reservation deleted successfully'
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in handleDeleteReservation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete reservation' 
    });
  }
}

// GET /api/reservations/stats - Get reservation statistics
async function handleGetStats(req, res) {
  try {
    const result = await ReservationService.getStats();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in handleGetStats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    });
  }
}

// GET /api/reservations/sync - Get reservations updated since timestamp
async function handleSyncReservations(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const since = url.searchParams.get('since');
    
    if (!since) {
      return res.status(400).json({
        success: false,
        error: 'since parameter is required'
      });
    }

    const result = await ReservationService.getUpdatedSince(new Date(since));
    
    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
        timestamp: new Date().toISOString(),
        count: result.data.length,
        since: since
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in handleSyncReservations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to sync reservations' 
    });
  }
}
