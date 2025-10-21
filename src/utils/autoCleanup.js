// Auto Cleanup Utility
// Automatically deletes old hidden reservations after 7 days

import sharedDatabase from '../services/sharedDatabase';

class AutoCleanupService {
  constructor() {
    this.isRunning = false;
    this.cleanupInterval = null;
    this.lastCleanup = null;
  }

  // Start automatic cleanup (runs every 24 hours)
  startAutoCleanup() {
    if (this.isRunning) {
      console.log('Auto cleanup already running');
      return;
    }

    console.log('Starting automatic cleanup service...');
    this.isRunning = true;

    // Run cleanup immediately on start
    this.runCleanup();

    // Set up interval to run cleanup every 24 hours
    this.cleanupInterval = setInterval(() => {
      this.runCleanup();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    console.log('Auto cleanup service started - will run every 24 hours');
  }

  // Stop automatic cleanup
  stopAutoCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.isRunning = false;
    console.log('Auto cleanup service stopped');
  }

  // Run cleanup process
  async runCleanup() {
    try {
      console.log('Running automatic cleanup...');
      const result = await sharedDatabase.cleanupOldReservations();
      
      if (result.deletedCount > 0) {
        console.log(`Auto cleanup: Deleted ${result.deletedCount} old reservations`);
        this.lastCleanup = new Date();
        
        // Store cleanup info in localStorage
        localStorage.setItem('ivy_resort_last_cleanup', JSON.stringify({
          date: this.lastCleanup.toISOString(),
          deletedCount: result.deletedCount
        }));
      } else {
        console.log('Auto cleanup: No old reservations found to delete');
      }
    } catch (error) {
      console.error('Auto cleanup failed:', error);
    }
  }

  // Get cleanup status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastCleanup: this.lastCleanup,
      nextCleanup: this.isRunning ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
    };
  }

  // Get last cleanup info from localStorage
  getLastCleanupInfo() {
    try {
      const stored = localStorage.getItem('ivy_resort_last_cleanup');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading last cleanup info:', error);
      return null;
    }
  }
}

// Create singleton instance
const autoCleanupService = new AutoCleanupService();

export default autoCleanupService;
