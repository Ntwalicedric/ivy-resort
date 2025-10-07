// Email Service for Ivy Resort
// Handles sending confirmation emails using a single reliable method

// Removed CORS-free EmailJS and other client transports to avoid exposing secrets in the browser
import bookingEmailService from './bookingEmailService';

// Email service class
class EmailService {
  constructor() {
    this.isConfigured = false;
    this.transporter = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Initialize the email service
  async initialize() {
    try {
      if (import.meta && import.meta.env && import.meta.env.DEV) {
        console.log('📧 Initializing Email Service...');
      }
      
      // For browser environment, we'll use a different approach
      console.log('Email service initialized for browser environment');
      this.isConfigured = true;
      
      // Email verification monitoring (disabled for now)
      // if (emailVerificationService && typeof emailVerificationService.startVerificationMonitoring === 'function') {
      //   emailVerificationService.startVerificationMonitoring();
      // }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      return false;
    }
  }

  // Send confirmation email (delegates to bookingEmailService which uses the shared template)
  async sendConfirmationEmail(reservation) {
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      console.log('📧 EmailService: Starting confirmation email process...');
      console.log('📧 Recipient:', reservation.email);
      console.log('📧 Confirmation ID:', reservation.confirmationId);
    }
    
    // Validate reservation data
    if (!this.validateReservationData(reservation)) {
      throw new Error('Invalid reservation data provided');
    }

    // Use the booking email service only (single template path)
    const result = await bookingEmailService.sendConfirmationEmail(reservation);
    if (result && result.success) {
      return result;
    }
    throw new Error((result && result.error) || 'Booking service failed');
  }

  // Validate reservation data
  validateReservationData(reservation) {
    const required = ['email', 'guestName', 'confirmationId', 'roomName', 'checkIn', 'checkOut', 'totalAmount'];
    
    for (const field of required) {
      if (!reservation[field]) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reservation.email)) {
      console.error('Invalid email format:', reservation.email);
      return false;
    }
    
    return true;
  }

  // Execute function with retry logic
  async executeWithRetry(fn, maxAttempts) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          console.log(`📧 Retry attempt ${attempt + 1}/${maxAttempts} in ${this.retryDelay}ms...`);
          await this.delay(this.retryDelay);
        }
      }
    }
    
    throw lastError;
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  // Send test email
  async sendTestEmail() {
    const testReservation = {
      confirmationId: 'IVY-TEST-123456',
      guestName: 'Test User',
      email: 'test@example.com',
      roomName: 'Test Room',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      totalAmount: 300,
      specialRequests: 'Test special request'
    };
    
    return await this.sendConfirmationEmail(testReservation);
  }
}

// Create singleton instance
const emailService = new EmailService();

// Initialize the service
emailService.initialize();

export default emailService;