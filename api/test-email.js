// Simple email test function
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('📧 Testing email to:', email);

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
    console.log('✅ SMTP connection verified');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'Ivy Resort <no-reply@ivyresort.com>',
      to: email,
      subject: '🏨 Ivy Resort - Email Test',
      html: `
        <h1>Email Test Successful!</h1>
        <p>Hello ${name || 'Guest'},</p>
        <p>This is a test email from Ivy Resort to verify that our email service is working correctly.</p>
        <p>If you received this email, our email system is functioning properly!</p>
        <p>Best regards,<br>Ivy Resort Team</p>
      `,
      text: `
        Email Test Successful!
        
        Hello ${name || 'Guest'},
        
        This is a test email from Ivy Resort to verify that our email service is working correctly.
        
        If you received this email, our email system is functioning properly!
        
        Best regards,
        Ivy Resort Team
      `
    });

    console.log('✅ Test email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Test email sent successfully'
    });

  } catch (error) {
    console.error('❌ Test email failed:', error);
    return res.status(500).json({
      error: 'Failed to send test email',
      details: error.message
    });
  }
}
