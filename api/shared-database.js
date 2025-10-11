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

// Initialize with some sample data
if (sharedDatabase.reservations.length === 0) {
  sharedDatabase.reservations = [
    {
      id: 1,
      guestName: "John Doe",
      email: "john@example.com",
      phone: "+250 123 456 789",
      checkIn: "2024-01-20",
      checkOut: "2024-01-25",
      roomType: "Deluxe Suite",
      guests: 2,
      status: "confirmed",
      totalAmount: 500,
      currency: "USD",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      guestName: "Jane Smith",
      email: "jane@example.com",
      phone: "+250 987 654 321",
      checkIn: "2024-01-22",
      checkOut: "2024-01-24",
      roomType: "Standard Room",
      guests: 1,
      status: "pending",
      totalAmount: 200,
      currency: "USD",
      createdAt: "2024-01-16T14:30:00Z",
      updatedAt: "2024-01-16T14:30:00Z"
    }
  ];
  
  sharedDatabase.rooms = [
    { id: 1, name: "Deluxe Suite", type: "suite", status: "available", price: 100 },
    { id: 2, name: "Standard Room", type: "standard", status: "available", price: 50 },
    { id: 3, name: "Luxury Villa", type: "villa", status: "maintenance", price: 200 }
  ];
  
  sharedDatabase.guests = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+250 123 456 789", visits: 3 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+250 987 654 321", visits: 1 }
  ];
  
  sharedDatabase.users = [
    { id: 1, name: "Admin User", email: "admin@ivyresort.com", role: "admin", active: true }
  ];
}

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
