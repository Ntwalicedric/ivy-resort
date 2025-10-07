import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, PublicRoute } from '../../components/ui/AuthenticationGuard';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import BackgroundOverlay from './components/BackgroundOverlay';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/admin-dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleBackToWebsite = () => {
    navigate('/homepage');
  };

  return (
    <PublicRoute redirectTo="/admin-dashboard">
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background with Overlay */}
        <BackgroundOverlay />

        {/* Header Navigation */}
        <header className="relative z-10 w-full">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                  <Icon name="Mountain" size={20} color="white" />
                </div>
                <span className="font-heading text-xl font-semibold text-white">
                  Ivy Resort
                </span>
              </div>

              {/* Back to Website */}
              <Button
                variant="ghost"
                onClick={handleBackToWebsite}
                iconName="ArrowLeft"
                iconPosition="left"
                className="text-white hover:bg-white/10 border border-white/20"
              >
                Back to Website
              </Button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Login Form */}
              <div className="bg-background/95 backdrop-blur-luxury rounded-2xl p-8 lg:p-12 luxury-shadow-hover">
                <LoginForm />
              </div>

              {/* Right Side - Security Information */}
              <div className="hidden lg:block">
                <div className="bg-background/90 backdrop-blur-luxury rounded-2xl p-8 luxury-shadow">
                  <SecurityBadges />
                </div>
              </div>
            </div>

            {/* Mobile Security Info */}
            <div className="lg:hidden mt-8">
              <div className="bg-background/95 backdrop-blur-luxury rounded-2xl p-6 luxury-shadow">
                <SecurityBadges />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-background/80 backdrop-blur-luxury">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Shield" size={14} className="text-success" />
                  <span>Secure Login Portal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>24/7 System Access</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <button className="hover:text-accent smooth-transition">
                  Privacy Policy
                </button>
                <button className="hover:text-accent smooth-transition">
                  Terms of Service
                </button>
                <button className="hover:text-accent smooth-transition flex items-center space-x-1">
                  <Icon name="HelpCircle" size={14} />
                  <span>Support</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} Ivy Resort. All rights reserved. 
                Administrative access is restricted to authorized personnel only.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PublicRoute>
  );
};

export default AdminLogin;