import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationsPanel = ({ notifications = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);
  
  // Show elegant notification
  const showElegantNotification = (message, type = 'info') => {
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 320px;
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
      `;
      
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: rgba(255,255,255,0.8); border-radius: 50%; flex-shrink: 0;"></div>
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">🔔 Ivy Resort</div>
            <div style="opacity: 0.9; line-height: 1.4;">${message}</div>
          </div>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 4000);
    }
  };
  
  // Initialize notifications
  React.useEffect(() => {
    if (notifications.length > 0) {
      setLocalNotifications(notifications);
    } else {
      setLocalNotifications([
        {
          id: 1,
          type: 'booking',
          title: 'New Booking Received',
          message: 'Room 205 - John Smith, 2 guests, 3 nights',
          time: '5 minutes ago',
          unread: true,
          priority: 'high'
        },
        {
          id: 2,
          type: 'maintenance',
          title: 'Maintenance Completed',
          message: 'Room 301 bathroom repair finished',
          time: '1 hour ago',
          unread: true,
          priority: 'medium'
        },
        {
          id: 3,
          type: 'guest',
          title: 'Guest Feedback',
          message: '5-star review from Sarah Johnson',
          time: '2 hours ago',
          unread: false,
          priority: 'low'
        },
        {
          id: 4,
          type: 'system',
          title: 'System Update',
          message: 'Dashboard updated to v2.1.0',
          time: '1 day ago',
          unread: false,
          priority: 'low'
        }
      ]);
    }
  }, [notifications]);

  const mockNotifications = localNotifications;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking': return 'Calendar';
      case 'maintenance': return 'Wrench';
      case 'guest': return 'User';
      case 'system': return 'Settings';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    if (priority === 'medium') return 'text-warning';
    if (type === 'booking') return 'text-accent';
    if (type === 'guest') return 'text-success';
    return 'text-muted-foreground';
  };

  const unreadCount = mockNotifications.filter(n => n.unread).length;
  const displayNotifications = isExpanded ? mockNotifications : mockNotifications.slice(0, 3);

  const handleMarkAllRead = () => {
    setLocalNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
    // Show elegant notification instead of alert
    showElegantNotification('All notifications marked as read.', 'success');
  };

  const handleNotificationSettings = () => {
    // Simulate notification settings management
    const settings = {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      reminderTime: '1 hour before'
    };
    
    // Show elegant notification instead of alert
    const settingsText = `Email: ${settings.emailNotifications ? 'ON' : 'OFF'} • SMS: ${settings.smsNotifications ? 'ON' : 'OFF'} • Push: ${settings.pushNotifications ? 'ON' : 'OFF'} • Reminder: ${settings.reminderTime}`;
    showElegantNotification(settingsText, 'info');
  };

  return (
    <div className="bg-card rounded-xl p-6 luxury-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center relative">
            <Icon name="Bell" size={20} className="text-white" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-error rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{unreadCount}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Notifications
            </h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-accent/10 hover:text-accent"
        >
          {isExpanded ? 'Show Less' : 'Show All'}
        </Button>
      </div>

      <div className="space-y-3">
        {displayNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border smooth-transition hover:shadow-md ${
              notification.unread 
                ? 'bg-accent/5 border-accent/20' 
                : 'bg-muted/30 border-border hover:bg-muted/50'
            }`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              notification.unread ? 'bg-accent/10' : 'bg-muted/50'
            }`}>
              <Icon 
                name={getNotificationIcon(notification.type)} 
                size={16} 
                className={getNotificationColor(notification.type, notification.priority)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className={`text-sm font-medium ${
                  notification.unread ? 'text-card-foreground' : 'text-muted-foreground'
                }`}>
                  {notification.title}
                </h4>
                {notification.unread && (
                  <div className="h-2 w-2 bg-accent rounded-full"></div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {mockNotifications.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Check"
            iconPosition="left"
            onClick={handleMarkAllRead}
            className="text-xs hover:bg-success/10 hover:text-success hover:border-success/30"
          >
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            onClick={handleNotificationSettings}
            className="text-xs hover:bg-accent/10 hover:text-accent hover:border-accent/30"
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;

