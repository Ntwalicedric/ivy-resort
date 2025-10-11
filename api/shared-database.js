// Shared Database API for cross-device data synchronization
// This creates a simple in-memory database that persists across requests

// In-memory database (in production, this would be a real database)
let sharedDatabase = {
  reservations: [],
  rooms: [],
  guests: [],
  users: [],
  lastUpdated: Date.now()
};

// Initialize with empty data (no sample data)
// The database will be populated with real reservations as they are created

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query } = req;
  const { action, type, id } = query;

  try {
    switch (method) {
      case 'GET':
        return handleGet(req, res, action, type, id);
      case 'POST':
        return handlePost(req, res, action, type);
      case 'PUT':
        return handlePut(req, res, action, type, id);
      case 'DELETE':
        return handleDelete(req, res, action, type, id);
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Shared Database API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

// GET operations
function handleGet(req, res, action, type, id) {
  switch (action) {
    case 'get':
      if (type && sharedDatabase[type]) {
        if (id) {
          // Get single item
          const item = sharedDatabase[type].find(item => item.id == id);
          if (item) {
            res.json({ success: true, data: item });
          } else {
            res.status(404).json({ success: false, error: `${type} not found` });
          }
        } else {
          // Get all items
          res.json({ success: true, data: sharedDatabase[type] });
        }
      } else {
        res.status(400).json({ success: false, error: 'Invalid type' });
      }
      break;
      
    case 'overview':
      const overview = {
        totalReservations: sharedDatabase.reservations.length,
        confirmedReservations: sharedDatabase.reservations.filter(r => r.status === 'confirmed').length,
        pendingReservations: sharedDatabase.reservations.filter(r => r.status === 'pending').length,
        totalRevenue: sharedDatabase.reservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
        availableRooms: sharedDatabase.rooms.filter(r => r.status === 'available').length,
        totalGuests: sharedDatabase.guests.length,
        lastUpdated: sharedDatabase.lastUpdated
      };
      res.json({ success: true, data: overview });
      break;
      
    case 'reports':
      const reports = {
        reservationsByStatus: {
          confirmed: sharedDatabase.reservations.filter(r => r.status === 'confirmed').length,
          pending: sharedDatabase.reservations.filter(r => r.status === 'pending').length,
          cancelled: sharedDatabase.reservations.filter(r => r.status === 'cancelled').length,
          checkedIn: sharedDatabase.reservations.filter(r => r.status === 'checked-in').length,
          checkedOut: sharedDatabase.reservations.filter(r => r.status === 'checked-out').length
        },
        revenueByMonth: calculateRevenueByMonth(),
        popularRooms: calculatePopularRooms()
      };
      res.json({ success: true, data: reports });
      break;
      
    case 'clear':
      // Clear all data
      sharedDatabase.reservations = [];
      sharedDatabase.rooms = [];
      sharedDatabase.guests = [];
      sharedDatabase.users = [];
      sharedDatabase.lastUpdated = Date.now();
      res.json({ success: true, message: 'Database cleared successfully' });
      break;
      
    default:
      res.status(400).json({ success: false, error: 'Invalid action' });
  }
}

  // POST operations (Create)
function handlePost(req, res, action, type) {
  switch (action) {
    case 'create':
      if (type && sharedDatabase[type]) {
        const newItem = {
          ...req.body,
          id: getNextId(sharedDatabase[type]),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        sharedDatabase[type].push(newItem);
        sharedDatabase.lastUpdated = Date.now();
        
        // If creating a reservation, try to send email
        if (type === 'reservations' && newItem.email) {
          // Send email asynchronously without blocking the response
          setTimeout(async () => {
            try {
              const response = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/send-email`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reservation: newItem })
              });
              
              if (response.ok) {
                const result = await response.json();
                console.log('✅ Email sent successfully:', result.messageId);
              } else {
                console.warn('❌ Email service responded with status:', response.status);
              }
            } catch (error) {
              console.warn('❌ Failed to send confirmation email:', error.message);
            }
          }, 100);
        }
        
        res.json({ success: true, data: newItem });
      } else {
        res.status(400).json({ success: false, error: 'Invalid type' });
      }
      break;
      
    default:
      res.status(400).json({ success: false, error: 'Invalid action' });
  }
}

// PUT operations (Update)
function handlePut(req, res, action, type, id) {
  switch (action) {
    case 'update':
      if (type && sharedDatabase[type] && id) {
        const index = sharedDatabase[type].findIndex(item => item.id == id);
        if (index !== -1) {
          sharedDatabase[type][index] = {
            ...sharedDatabase[type][index],
            ...req.body,
            id: parseInt(id),
            updatedAt: new Date().toISOString()
          };
          sharedDatabase.lastUpdated = Date.now();
          
          res.json({ success: true, data: sharedDatabase[type][index] });
        } else {
          res.status(404).json({ success: false, error: `${type} not found` });
        }
      } else {
        res.status(400).json({ success: false, error: 'Invalid type or id' });
      }
      break;
      
    default:
      res.status(400).json({ success: false, error: 'Invalid action' });
  }
}

// DELETE operations
function handleDelete(req, res, action, type, id) {
  switch (action) {
    case 'delete':
      if (type && sharedDatabase[type] && id) {
        const index = sharedDatabase[type].findIndex(item => item.id == id);
        if (index !== -1) {
          const deletedItem = sharedDatabase[type].splice(index, 1)[0];
          sharedDatabase.lastUpdated = Date.now();
          
          res.json({ success: true, data: deletedItem });
        } else {
          res.status(404).json({ success: false, error: `${type} not found` });
        }
      } else {
        res.status(400).json({ success: false, error: 'Invalid type or id' });
      }
      break;
      
    default:
      res.status(400).json({ success: false, error: 'Invalid action' });
  }
}

// Helper functions
function getNextId(array) {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
}

// Email sending is now handled by the separate /api/send-email endpoint

function calculateRevenueByMonth() {
  const revenueByMonth = {};
  sharedDatabase.reservations.forEach(reservation => {
    const month = new Date(reservation.checkIn).toISOString().substring(0, 7);
    revenueByMonth[month] = (revenueByMonth[month] || 0) + (reservation.totalAmount || 0);
  });
  return revenueByMonth;
}

function calculatePopularRooms() {
  const roomCounts = {};
  sharedDatabase.reservations.forEach(reservation => {
    roomCounts[reservation.roomType] = (roomCounts[reservation.roomType] || 0) + 1;
  });
  return Object.entries(roomCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([room, count]) => ({ room, count }));
}
