// Standalone email test script
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailConnection() {
  console.log('🔍 Testing email connection...');
  
  try {
    // Check if environment variables are set
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    console.log('📧 SMTP Configuration:');
    console.log(`   Host: ${smtpHost}`);
    console.log(`   Port: ${smtpPort}`);
    console.log(`   User: ${smtpUser ? '***@gmail.com' : 'NOT SET'}`);
    console.log(`   Pass: ${smtpPass ? '***' : 'NOT SET'}`);
    
    if (!smtpUser || !smtpPass) {
      console.log('❌ SMTP credentials not configured');
      console.log('📝 Please set SMTP_USER and SMTP_PASS environment variables');
      return false;
    }
    
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
    
    // Verify connection
    console.log('🔗 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Send test email
    const testEmail = {
      from: process.env.MAIL_FROM || 'Ivy Resort <no-reply@ivyresort.com>',
      to: 'ivyresort449@gmail.com', // Send to self for testing
      subject: '🏨 Ivy Resort - Email Test',
      html: `
        <h1>Email Test Successful!</h1>
        <p>This is a test email from Ivy Resort to verify that our email service is working correctly.</p>
        <p>If you received this email, our email system is functioning properly!</p>
        <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
        <p>Best regards,<br>Ivy Resort Team</p>
      `,
      text: `
        Email Test Successful!
        
        This is a test email from Ivy Resort to verify that our email service is working correctly.
        
        If you received this email, our email system is functioning properly!
        
        Test Time: ${new Date().toLocaleString()}
        
        Best regards,
        Ivy Resort Team
      `
    };
    
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📧 Response: ${info.response}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    if (error.code) {
      console.error(`   Error Code: ${error.code}`);
    }
    return false;
  }
}

// Run the test
testEmailConnection().then(success => {
  if (success) {
    console.log('\n🎉 Email service is working correctly!');
    process.exit(0);
  } else {
    console.log('\n💥 Email service needs configuration!');
    process.exit(1);
  }
});
