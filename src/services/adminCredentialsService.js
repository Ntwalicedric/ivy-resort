// Admin Credentials Management Service
class AdminCredentialsService {
  constructor() {
    this.CREDENTIALS_KEY = 'ivyResortAdminCredentials';
    this.DEFAULT_CREDENTIALS = {
      email: 'admin@ivyresort.com',
      password: 'IvyAdmin2024!'
    };
  }

  // Get current admin credentials
  getCredentials() {
    try {
      const stored = localStorage.getItem(this.CREDENTIALS_KEY);
      if (stored) {
        const credentials = JSON.parse(stored);
        return {
          email: credentials.email || this.DEFAULT_CREDENTIALS.email,
          password: credentials.password || this.DEFAULT_CREDENTIALS.password
        };
      }
      return this.DEFAULT_CREDENTIALS;
    } catch (error) {
      console.error('Error getting admin credentials:', error);
      return this.DEFAULT_CREDENTIALS;
    }
  }

  // Update admin credentials
  updateCredentials(newCredentials) {
    try {
      const credentials = {
        email: newCredentials.email,
        password: newCredentials.password,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin'
      };
      
      localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(credentials));
      
      // Log the change for security purposes
      console.log('Admin credentials updated at:', new Date().toISOString());
      
      return { success: true, message: 'Credentials updated successfully' };
    } catch (error) {
      console.error('Error updating admin credentials:', error);
      return { success: false, error: 'Failed to update credentials' };
    }
  }

  // Validate credentials format
  validateCredentials(credentials) {
    const errors = {};
    
    // Email validation
    if (!credentials.email || !credentials.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!credentials.password || !credentials.password.trim()) {
      errors.password = 'Password is required';
    } else if (credentials.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(credentials.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Reset to default credentials
  resetToDefault() {
    try {
      localStorage.removeItem(this.CREDENTIALS_KEY);
      return { success: true, message: 'Credentials reset to default' };
    } catch (error) {
      console.error('Error resetting credentials:', error);
      return { success: false, error: 'Failed to reset credentials' };
    }
  }

  // Get credentials info (without password)
  getCredentialsInfo() {
    try {
      const stored = localStorage.getItem(this.CREDENTIALS_KEY);
      if (stored) {
        const credentials = JSON.parse(stored);
        return {
          email: credentials.email,
          updatedAt: credentials.updatedAt,
          updatedBy: credentials.updatedBy,
          isCustom: true
        };
      }
      return {
        email: this.DEFAULT_CREDENTIALS.email,
        updatedAt: null,
        updatedBy: 'system',
        isCustom: false
      };
    } catch (error) {
      console.error('Error getting credentials info:', error);
      return {
        email: this.DEFAULT_CREDENTIALS.email,
        updatedAt: null,
        updatedBy: 'system',
        isCustom: false
      };
    }
  }
}

// Create and export a singleton instance
const adminCredentialsService = new AdminCredentialsService();
export default adminCredentialsService;



























