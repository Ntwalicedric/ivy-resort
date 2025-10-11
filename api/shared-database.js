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
          setImmediate(() => {
            sendConfirmationEmail(newItem).catch(error => {
              console.warn('Failed to send confirmation email:', error);
            });
          });
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

// Send confirmation email directly
async function sendConfirmationEmail(reservation) {
  try {
    // Import nodemailer dynamically
    const nodemailer = await import('nodemailer');
    
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Verify connection
    await transporter.verify();

    // Generate email content
    const emailContent = generateEmailContent(reservation);

    // Send email
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'Ivy Resort <no-reply@ivyresort.com>',
      to: reservation.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      headers: {
        'X-Mailer': 'Ivy Resort Automated System',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal'
      }
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

// Generate email content
function generateEmailContent(reservation) {
  const subject = `🏨 Ivy Resort - Booking Confirmation ${reservation.confirmationId || reservation.id}`;
  const amountDisplay = reservation.totalAmountDisplay || (reservation.currency === 'RWF'
    ? new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(reservation.totalAmountInCurrency || reservation.totalAmount)
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: reservation.currency || 'USD' }).format(reservation.totalAmountInCurrency || reservation.totalAmount));
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Ivy Resort</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .confirmation-id { background: #e5e7eb; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; border: 2px solid #10b981; }
    .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .details-table .label { font-weight: bold; color: #6b7280; width: 30%; background-color: #f8fafc; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; background-color: #f8fafc; padding: 20px; border-radius: 8px; }
    .highlight { background-color: #fef3c7; padding: 10px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 15px 0; }
    .urgent { background-color: #fef2f2; padding: 10px; border-radius: 6px; border-left: 4px solid #ef4444; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏨 Ivy Resort</h1>
      <h2>Booking Confirmation</h2>
      <p>Your reservation has been confirmed!</p>
    </div>
    <div class="content">
      <p>Dear <strong>${reservation.guestName || reservation.name}</strong>,</p>
      
      <p>Thank you for choosing Ivy Resort! We're excited to welcome you and provide you with an exceptional stay experience.</p>
      
      <div class="confirmation-id">
        Confirmation ID: ${reservation.confirmationId || reservation.id}
      </div>
      
      <div class="urgent">
        <strong>IMPORTANT:</strong> Please save this confirmation email and bring the Confirmation ID with you to check-in. This is your booking reference.
      </div>
      
      <h3>📋 Reservation Details</h3>
      <table class="details-table">
        <tr>
          <td class="label">Room Type:</td>
          <td><strong>${reservation.roomName || reservation.roomType}</strong></td>
        </tr>
        <tr>
          <td class="label">Check-in Date:</td>
          <td><strong>${new Date(reservation.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></td>
        </tr>
        <tr>
          <td class="label">Check-out Date:</td>
          <td><strong>${new Date(reservation.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></td>
        </tr>
        <tr>
          <td class="label">Amount to be Paid:</td>
          <td><strong style="color: #10b981; font-size: 18px;">${amountDisplay}</strong></td>
        </tr>
        ${reservation.specialRequests ? `
        <tr>
          <td class="label">Special Requests:</td>
          <td>${reservation.specialRequests}</td>
        </tr>
        ` : ''}
      </table>
      
      <h3>📞 Contact Information</h3>
      <p>If you have any questions or need to modify your reservation, please don't hesitate to contact us:</p>
      <ul>
        <li><strong>Email:</strong> ivyresort449@gmail.com</li>
        <li><strong>Phone:</strong> +250 787 061 278</li>
        <li><strong>Website:</strong> www.ivyresort.com</li>
      </ul>
      
      <div class="highlight">
        <strong>Next Steps:</strong>
        <ul>
          <li>Save this confirmation email</li>
          <li>Arrive at the hotel on your check-in date</li>
          <li>Present this confirmation ID at check-in</li>
          <li>Enjoy your stay at Ivy Resort!</li>
        </ul>
      </div>
      
      <p>We look forward to providing you with an exceptional stay at Ivy Resort. Thank you for choosing us!</p>
      
      <div class="footer">
        <p><strong>Ivy Resort</strong><br>
        Your Gateway to Luxury and Comfort</p>
        <p>This is an automated confirmation email. Please keep this for your records.</p>
        <p><em>Generated on ${new Date().toLocaleString()}</em></p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
IVY RESORT - BOOKING CONFIRMATION
================================

Dear ${reservation.guestName || reservation.name},

Thank you for choosing Ivy Resort! Your booking has been confirmed.

CONFIRMATION ID: ${reservation.confirmationId || reservation.id}

IMPORTANT: Please save this confirmation email and bring the Confirmation ID with you to check-in. This is your booking reference.

RESERVATION DETAILS:
===================
Room Type: ${reservation.roomName || reservation.roomType}
Check-in: ${new Date(reservation.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Check-out: ${new Date(reservation.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Amount to be Paid: ${amountDisplay}
${reservation.specialRequests ? `Special Requests: ${reservation.specialRequests}` : ''}

CONTACT INFORMATION:
===================
Email: ivyresort449@gmail.com
Phone: +250 787 061 278
Website: www.ivyresort.com

NEXT STEPS:
===========
1. Save this confirmation email
2. Arrive at the hotel on your check-in date
3. Present this confirmation ID at check-in
4. Enjoy your stay at Ivy Resort!

We look forward to welcoming you!

Best regards,
Ivy Resort Team

Generated on ${new Date().toLocaleString()}
  `;

  return {
    subject,
    html: htmlContent,
    text: textContent
  };
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
