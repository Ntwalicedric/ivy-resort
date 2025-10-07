// Email Verification Service
// Tracks email delivery status and provides verification

class EmailVerificationService {
  constructor() {
    this.sentEmails = new Map(); // Track sent emails
    this.deliveryStatus = new Map(); // Track delivery status
    this.verificationInterval = null;
  }

  // Track sent email
  trackSentEmail(emailId, reservation, method) {
    const emailRecord = {
      emailId,
      reservation,
      method,
      sentAt: new Date().toISOString(),
      status: 'sent',
      attempts: 1,
      lastAttempt: new Date().toISOString()
    };

    this.sentEmails.set(emailId, emailRecord);
    console.log('📧 Email tracked:', emailId, 'Method:', method);
    
    return emailRecord;
  }

  // Update email status
  updateEmailStatus(emailId, status, details = {}) {
    const emailRecord = this.sentEmails.get(emailId);
    if (emailRecord) {
      emailRecord.status = status;
      emailRecord.lastUpdate = new Date().toISOString();
      emailRecord.details = { ...emailRecord.details, ...details };
      
      console.log('📧 Email status updated:', emailId, 'Status:', status);
    }
  }

  // Get email status
  getEmailStatus(emailId) {
    return this.sentEmails.get(emailId);
  }

  // Get all sent emails
  getAllSentEmails() {
    return Array.from(this.sentEmails.values());
  }

  // Verify email delivery (simulation for demo)
  async verifyDelivery(emailId) {
    const emailRecord = this.sentEmails.get(emailId);
    if (!emailRecord) {
      return { verified: false, error: 'Email not found' };
    }

    // Simulate delivery verification
    // In a real implementation, you would:
    // 1. Check with email service provider API
    // 2. Use webhook notifications
    // 3. Check bounce/complaint reports
    
    const deliveryTime = new Date(emailRecord.sentAt);
    const now = new Date();
    const timeDiff = now - deliveryTime;
    
    // Simulate delivery after 2-5 seconds
    if (timeDiff > 2000 && timeDiff < 10000) {
      this.updateEmailStatus(emailId, 'delivered', {
        deliveredAt: new Date().toISOString(),
        deliveryTime: timeDiff
      });
      
      return { verified: true, status: 'delivered' };
    } else if (timeDiff > 10000) {
      // Simulate bounce after 10 seconds
      this.updateEmailStatus(emailId, 'bounced', {
        bouncedAt: new Date().toISOString(),
        reason: 'Recipient email not found'
      });
      
      return { verified: false, status: 'bounced' };
    } else {
      return { verified: false, status: 'pending' };
    }
  }

  // Start verification monitoring
  startVerificationMonitoring() {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval);
    }

    this.verificationInterval = setInterval(async () => {
      const sentEmails = this.getAllSentEmails();
      
      for (const email of sentEmails) {
        if (email.status === 'sent') {
          const verification = await this.verifyDelivery(email.emailId);
          console.log('📧 Verification result:', email.emailId, verification);
        }
      }
    }, 5000); // Check every 5 seconds

    console.log('📧 Email verification monitoring started');
  }

  // Stop verification monitoring
  stopVerificationMonitoring() {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval);
      this.verificationInterval = null;
      console.log('📧 Email verification monitoring stopped');
    }
  }

  // Get delivery statistics
  getDeliveryStats() {
    const emails = this.getAllSentEmails();
    const stats = {
      total: emails.length,
      sent: emails.filter(e => e.status === 'sent').length,
      delivered: emails.filter(e => e.status === 'delivered').length,
      bounced: emails.filter(e => e.status === 'bounced').length,
      failed: emails.filter(e => e.status === 'failed').length
    };

    stats.deliveryRate = stats.total > 0 ? (stats.delivered / stats.total * 100).toFixed(2) : 0;
    
    return stats;
  }

  // Resend failed emails
  async resendFailedEmails(emailService) {
    const failedEmails = this.getAllSentEmails().filter(e => e.status === 'failed' || e.status === 'bounced');
    
    console.log(`📧 Resending ${failedEmails.length} failed emails`);
    
    for (const email of failedEmails) {
      try {
        email.attempts++;
        email.lastAttempt = new Date().toISOString();
        
        const result = await emailService.sendConfirmationEmail(email.reservation);
        
        if (result.success) {
          this.updateEmailStatus(email.emailId, 'sent', {
            resentAt: new Date().toISOString(),
            attempts: email.attempts
          });
          console.log('✅ Email resent successfully:', email.emailId);
        } else {
          this.updateEmailStatus(email.emailId, 'failed', {
            error: result.error,
            attempts: email.attempts
          });
          console.log('❌ Email resend failed:', email.emailId, result.error);
        }
      } catch (error) {
        this.updateEmailStatus(email.emailId, 'failed', {
          error: error.message,
          attempts: email.attempts
        });
        console.log('❌ Email resend error:', email.emailId, error.message);
      }
    }
  }
}

// Create singleton instance
const emailVerificationService = new EmailVerificationService();

export default emailVerificationService;





