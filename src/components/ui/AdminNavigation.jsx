import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from './AuthenticationGuard';

const AdminNavigation = ({ 
  user = { name: 'Admin User', role: 'Manager', avatar: null },
  onLogout,
  onCredentialsManager,
  className = '' 
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New booking received', time: '5 min ago', unread: true },
    { id: 2, message: 'Room 205 maintenance completed', time: '1 hour ago', unread: false },
    { id: 3, message: 'Guest feedback submitted', time: '2 hours ago', unread: true }
  ]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: 'LayoutDashboard' },
    { label: 'Reservations', path: '/admin-reservations', icon: 'Calendar' },
    { label: 'Rooms', path: '/admin-rooms', icon: 'Bed' },
    { label: 'Guests', path: '/admin-guests', icon: 'Users' },
    { label: 'Reports', path: '/admin-reports', icon: 'BarChart3' }
  ];
  

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('rememberAdmin');
      localStorage.removeItem('ivy_resort_reservations');
      sessionStorage.removeItem('adminSession');
      sessionStorage.removeItem('redirectAfterLogin');
      try { logout(); } catch (e) {}
      navigate('/admin-login');
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  return (
    <header className={`fixed top-0 left-0 right-0 z-300 bg-background border-b border-border ${className}`}>
      <nav className="mx-auto max-w-full px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('/admin-dashboard')}
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Mountain" size={20} color="white" />
              </div>
              <div>
                <span className="font-heading text-xl font-semibold text-primary">
                  Ivy Resort
                </span>
                <span className="ml-2 text-xs font-caption text-muted-foreground bg-muted px-2 py-1 rounded">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium smooth-transition ${
                  isActivePath(item?.path)
                    ? 'text-accent bg-accent/10 border border-accent/20' :'text-foreground hover:text-accent hover:bg-accent/5'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Icon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Quick Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigation('/admin-reservations')}
              iconName="Plus"
              iconPosition="left"
              className="hidden md:flex"
            >
              New Booking
            </Button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted smooth-transition"
              >
                <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-foreground">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.role}</div>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`text-muted-foreground smooth-transition ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg luxury-shadow z-200">
                  <div className="p-3 border-b border-border">
                    <div className="font-medium text-popover-foreground">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">{user?.role}</div>
                  </div>
                  
                  <div className="p-1">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent/10 rounded-md smooth-transition">
                      <Icon name="User" size={16} />
                      <span>Profile Settings</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (onCredentialsManager) onCredentialsManager();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent/10 rounded-md smooth-transition"
                    >
                      <Icon name="Shield" size={16} />
                      <span>Change Credentials</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent/10 rounded-md smooth-transition">
                      <Icon name="Settings" size={16} />
                      <span>Preferences</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent/10 rounded-md smooth-transition">
                      <Icon name="HelpCircle" size={16} />
                      <span>Help & Support</span>
                    </button>
                    
                    <div className="border-t border-border my-1"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md smooth-transition"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="Menu" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Navigation Overlay - Hidden by default, can be toggled */}
      <div className="lg:hidden hidden bg-background border-t border-border">
        <div className="px-4 py-4 space-y-2">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left smooth-transition ${
                isActivePath(item?.path)
                  ? 'text-accent bg-accent/10' :'text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={20} />
              <span className="font-medium">{item?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default AdminNavigation;