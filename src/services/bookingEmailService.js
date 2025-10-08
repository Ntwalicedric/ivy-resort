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

  // Send booking confirmation email automatically
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
      
      // Use EmailJS as the primary method
      try {
        const result = await this.sendViaEmailJS(reservation, emailContent);
        if (result.success) {
          console.log('✅ Email sent successfully via EmailJS');
        } else {
          throw new Error('EmailJS failed');
        }
      } catch (error) {
        console.warn('❌ EmailJS failed:', error.message);
        // Fall back to email client if EmailJS fails
        console.log('📧 EmailJS failed, falling back to email client...');
        return await this.sendViaEmailClient(reservation, emailContent);
      }

      return {
        success: true,
        message: 'Confirmation email sent automatically to client inbox',
        confirmationId: reservation.confirmationId,
        emailId: `booking_${Date.now()}`,
        method: 'automated',
        requiresManualAction: false
      };

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
      const base = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAIL_API_URL) || '/api';
      const response = await fetch(`${base}/send-email`, {
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

  // Method 2: Send via EmailJS
  async sendViaEmailJS(reservation, emailContent) {
    console.log('📧 Trying EmailJS method...');

    try {
      // EmailJS Configuration - Using hardcoded credentials
      const serviceId = 'service_udxi846';
      const templateId = 'template_dq18wwh';
      const publicKey = 'EnfzHuKwjR3SE_xqv';

      // Lazy import to avoid bundling if unused
      const { default: emailjs } = await import('@emailjs/browser');
      emailjs.init({ publicKey });

      const templateParams = {
        to_email: reservation.email,
        guest_name: reservation.guestName,
        confirmation_id: reservation.confirmationId,
        room_name: reservation.roomName,
        check_in_date: new Date(reservation.checkIn).toLocaleDateString(),
        check_out_date: new Date(reservation.checkOut).toLocaleDateString(),
        // Prefer currency-aware amount if available
        total_amount: reservation.totalAmountInCurrency || reservation.totalAmount,
        total_amount_display: reservation.totalAmountDisplay,
        currency: reservation.currency || 'USD',
        special_requests: reservation.specialRequests || 'None',
        current_date: new Date().toLocaleString()
      };

      const result = await emailjs.send(serviceId, templateId, templateParams);

      return {
        success: true,
        method: 'emailjs',
        messageId: result?.status || `emailjs_${Date.now()}`
      };
    } catch (error) {
      console.warn('❌ EmailJS method failed:', error.message);
      throw error;
    }
  }

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
