import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';


// Authentication Context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true
});

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authData = localStorage.getItem('adminAuth');
      const sessionData = sessionStorage.getItem('adminSession');
      
      if (authData && sessionData) {
        const parsedAuth = JSON.parse(authData);
        const parsedSession = JSON.parse(sessionData);
        
        // Verify session is still valid (example: check expiry)
        const now = new Date()?.getTime();
        if (parsedSession?.expires && now < parsedSession?.expires) {
          setIsAuthenticated(true);
          setUser(parsedAuth?.user);
        } else {
          // Session expired, clear storage
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Simulate API call - replace with actual authentication
      const mockAuth = {
        user: {
          id: 1,
          name: 'Resort Manager',
          email: credentials?.email,
          role: 'Manager',
          permissions: ['dashboard', 'reservations', 'rooms', 'guests', 'reports']
        },
        token: 'mock-jwt-token-' + Date.now()
      };

      // Set expiry for 8 hours
      const expiryTime = new Date()?.getTime() + (8 * 60 * 60 * 1000);
      
      // Store authentication data
      localStorage.setItem('adminAuth', JSON.stringify(mockAuth));
      sessionStorage.setItem('adminSession', JSON.stringify({
        expires: expiryTime,
        loginTime: new Date()?.getTime()
      }));

      setIsAuthenticated(true);
      setUser(mockAuth?.user);
      
      return { success: true, user: mockAuth?.user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
  };

  const clearAuthData = () => {
    localStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminSession');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
export const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Store the attempted location for redirect after login
      sessionStorage.setItem('redirectAfterLogin', location?.pathname);
      navigate('/admin-login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check permissions if required
  if (isAuthenticated && requiredPermissions?.length > 0) {
    const hasPermission = requiredPermissions?.every(permission => 
      user?.permissions?.includes(permission)
    );
    
    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md">
            <div className="h-16 w-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="ShieldX" size={32} className="text-error" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              You don't have permission to access this resource.
            </p>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="text-accent hover:text-accent/80 font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  // Render protected content if authenticated
  return isAuthenticated ? children : null;
};

// Public Route Component (redirects if already authenticated)
export const PublicRoute = ({ children, redirectTo = '/admin-dashboard' }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || redirectTo;
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : null;
};

// Default export for the main guard component
const AuthenticationGuard = ({ children, type = 'protected', ...props }) => {
  if (type === 'public') {
    return <PublicRoute {...props}>{children}</PublicRoute>;
  }
  
  return <ProtectedRoute {...props}>{children}</ProtectedRoute>;
};

export default AuthenticationGuard;