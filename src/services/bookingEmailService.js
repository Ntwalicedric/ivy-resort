// Booking Email Service - Sends emails automatically when users complete reservations
// This service is specifically designed for the booking completion flow

import { buildConfirmationEmail } from './emailTemplate';

class BookingEmailService {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize the service
  async initialize() {
    console.log('📧 Initializing Booking Email Service...');
    this.isInitialized = true;
    return true;
  }

  // Send booking confirmation email automatically (server-first strategy)
  async sendConfirmationEmail(reservation) {
    console.log('📧 Booking Email Service: Sending confirmation email...');
    console.log('📧 To:', reservation.email);
    console.log('📧 Confirmation ID:', reservation.confirmationId);

    try {
      // Validate reservation data
      if (!this.validateReservation(reservation)) {
        throw new Error('Invalid reservation data');
      }

      // Generate email content
      const emailContent = buildConfirmationEmail(reservation);

      // Primary: Serverless function (Nodemailer on server)
      try {
        const serverResult = await this.sendViaServerlessFunction(reservation, emailContent);
        if (serverResult.success) {
          return {
            success: true,
            message: 'Confirmation email sent via server',
            confirmationId: reservation.confirmationId,
            emailId: serverResult.messageId,
            method: serverResult.method,
            requiresManualAction: false
          };
        }
      } catch (serverError) {
        console.warn('❌ Serverless method failed:', serverError.message);
      }

      // Fallback: Open mail client for manual send
      console.log('📧 Falling back to email client...');
      return await this.sendViaEmailClient(reservation, emailContent);

    } catch (error) {
      console.error('❌ Booking email service failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Email delivery failed'
      };
    }
  }

  // Method 1: Send via serverless function
  async sendViaServerlessFunction(reservation, emailContent) {
    console.log('📧 Trying serverless function...');
    
    try {
      // Prefer absolute API URL when provided, fallback to relative /api for Vercel
      const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAIL_API_URL) || '/api';
      const response = await fetch(`${baseUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reservation: {
            ...reservation,
            emailContent: emailContent
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          method: 'serverless',
          messageId: result.messageId || `serverless_${Date.now()}`
        };
      } else {
        throw new Error(`Serverless function failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('❌ Serverless function method failed:', error.message);
      throw error;
    }
  }

  // Removed EmailJS method to enforce server-only email sending

  // Method 3: Send via webhook
  async sendViaWebhook(reservation, emailContent) {
    console.log('📧 Trying webhook method...');
    
    try {
      const webhookData = {
        to: reservation.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        confirmationId: reservation.confirmationId,
        guestName: reservation.guestName,
        roomName: reservation.roomName,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        totalAmount: reservation.totalAmount,
        from: 'Ivy Resort <ivyresort449@gmail.com>'
      };

      const response = await fetch('https://hooks.zapier.com/hooks/catch/your-webhook-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        return {
          success: true,
          method: 'webhook',
          messageId: `webhook_${Date.now()}`
        };
      } else {
        throw new Error(`Webhook failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('❌ Webhook method failed:', error.message);
      throw error;
    }
  }


  // Fallback: Send via email client
  async sendViaEmailClient(reservation, emailContent) {
    console.log('📧 Falling back to email client method...');
    
    try {
      const mailtoLink = this.createMailtoLink(reservation, emailContent);
      
      if (typeof window !== 'undefined') {
        window.open(mailtoLink, '_blank');
        
        // Also copy to clipboard as backup
        await this.copyToClipboard(emailContent.text);
        
        return {
          success: true,
          message: 'Email client opened with confirmation email ready to send',
          confirmationId: reservation.confirmationId,
          emailId: `email_client_${Date.now()}`,
          method: 'email_client',
          requiresManualAction: true,
          mailtoLink: mailtoLink
        };
      } else {
        throw new Error('Window object not available');
      }
    } catch (error) {
      console.warn('❌ Email client method failed:', error.message);
      throw error;
    }
  }

  // Create mailto link
  createMailtoLink(reservation, emailContent) {
    const subject = encodeURIComponent(emailContent.subject);
    const body = encodeURIComponent(emailContent.text);
    const to = encodeURIComponent(reservation.email);
    
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
    }
  }

  // Validate reservation data
  validateReservation(reservation) {
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

  // Removed local template generation in favor of shared template
}

// Create singleton instance
const bookingEmailService = new BookingEmailService();

// Initialize the service
bookingEmailService.initialize();

export default bookingEmailService;
