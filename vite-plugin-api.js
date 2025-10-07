// Vite plugin to handle API endpoints
// This allows us to serve API routes directly from Vite

import { createServer } from 'http';
import nodemailer from 'nodemailer';

const GMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'ivyresort449@gmail.com',
    pass: 'wiibwjjeonsitmri' // App password (no spaces)
  },
  tls: {
    rejectUnauthorized: false
  }
};

export default function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      // Add API middleware
      server.middlewares.use('/api', async (req, res, next) => {
        if (req.method === 'POST' && req.url === '/send-email') {
          try {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', async () => {
              try {
                const { reservation } = JSON.parse(body);
                
                if (!reservation) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    success: false,
                    error: 'No reservation data provided'
                  }));
                  return;
                }

                // Validate required fields
                const required = ['email', 'guestName', 'confirmationId', 'roomName', 'checkIn', 'checkOut', 'totalAmount'];
                for (const field of required) {
                  if (!reservation[field]) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                      success: false,
                      error: `Missing required field: ${field}`
                    }));
                    return;
                  }
                }

                console.log('📧 Sending email to:', reservation.email);
                console.log('📧 Confirmation ID:', reservation.confirmationId);

                // Create transporter
                const transporter = nodemailer.createTransport(GMAIL_CONFIG);

                // Generate email content
                const emailHTML = generateEmailHTML(reservation);
                const emailText = generateEmailText(reservation);

                // Send email
                const mailOptions = {
                  from: 'ivyresort449@gmail.com',
                  to: reservation.email,
                  subject: `🏨 Ivy Resort - Booking Confirmation ${reservation.confirmationId}`,
                  text: emailText,
                  html: emailHTML
                };

                const info = await transporter.sendMail(mailOptions);
                
                console.log('✅ Email sent successfully:', info.messageId);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: true,
                  message: 'Email sent successfully',
                  messageId: info.messageId,
                  confirmationId: reservation.confirmationId
                }));

              } catch (error) {
                console.error('❌ Email sending failed:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  error: error.message
                }));
              }
            });
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: error.message
            }));
          }
        } else {
          next();
        }
      });
    }
  };
}

// Generate email HTML content
function generateEmailHTML(reservation) {
  const amountDisplay = reservation.totalAmountDisplay || (reservation.currency === 'RWF'
    ? new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(reservation.totalAmountInCurrency || reservation.totalAmount)
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: reservation.currency || 'USD' }).format(reservation.totalAmountInCurrency || reservation.totalAmount));
  return `
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
      <p>Dear <strong>${reservation.guestName}</strong>,</p>
      
      <p>Thank you for choosing Ivy Resort! We're excited to welcome you and provide you with an exceptional stay experience.</p>
      
      <div class="confirmation-id">
        Confirmation ID: ${reservation.confirmationId}
      </div>
      
      <div class="urgent">
        <strong>IMPORTANT:</strong> Please save this confirmation email and bring the Confirmation ID with you to check-in. This is your booking reference.
      </div>
      
      <h3>📋 Reservation Details</h3>
      <table class="details-table">
        <tr>
          <td class="label">Room Type:</td>
          <td><strong>${reservation.roomName}</strong></td>
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
}

// Generate email text content
function generateEmailText(reservation) {
  const amountDisplay = reservation.totalAmountDisplay || (reservation.currency === 'RWF'
    ? new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(reservation.totalAmountInCurrency || reservation.totalAmount)
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: reservation.currency || 'USD' }).format(reservation.totalAmountInCurrency || reservation.totalAmount));
  return `
IVY RESORT - BOOKING CONFIRMATION
================================

Dear ${reservation.guestName},

Thank you for choosing Ivy Resort! Your booking has been confirmed.

CONFIRMATION ID: ${reservation.confirmationId}

IMPORTANT: Please save this confirmation email and bring the Confirmation ID with you to check-in. This is your booking reference.

RESERVATION DETAILS:
===================
Room Type: ${reservation.roomName}
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
}
