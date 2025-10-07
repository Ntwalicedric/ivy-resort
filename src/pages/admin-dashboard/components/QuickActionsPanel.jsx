import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActionsPanel = ({ onNewBooking, onCheckIn, onCheckOut, onRoomStatus }) => {
  const quickActions = [
    {
      id: 'new-booking',
      title: 'New Booking',
      description: 'Create a new reservation',
      icon: 'Plus',
      color: 'bg-accent text-accent-foreground',
      onClick: onNewBooking
    },
    {
      id: 'check-in',
      title: 'Quick Check-in',
      description: 'Process guest arrival',
      icon: 'LogIn',
      color: 'bg-success text-success-foreground',
      onClick: onCheckIn
    },
    {
      id: 'check-out',
      title: 'Quick Check-out',
      description: 'Process guest departure',
      icon: 'LogOut',
      color: 'bg-warning text-warning-foreground',
      onClick: onCheckOut
    },
    {
      id: 'room-status',
      title: 'Update Room Status',
      description: 'Change room availability',
      icon: 'Settings',
      color: 'bg-secondary text-secondary-foreground',
      onClick: onRoomStatus
    }
  ];

  return (
    <div className="bg-card rounded-xl p-6 luxury-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            Quick Actions
          </h3>
          <p className="text-sm text-muted-foreground">Common tasks at a glance</p>
        </div>
      </div>
      <div className="space-y-3">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.onClick}
            className="w-full flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-accent/30 smooth-transition group hover:shadow-md"
          >
            <div className={`h-10 w-10 rounded-lg ${action?.color} flex items-center justify-center group-hover:scale-110 smooth-transition shadow-sm`}>
              <Icon name={action?.icon} size={20} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-card-foreground group-hover:text-accent smooth-transition">
                {action?.title}
              </div>
              <div className="text-sm text-muted-foreground">
                {action?.description}
              </div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 smooth-transition" />
          </button>
        ))}
      </div>
      {/* Recent Activity */}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-4">Recent Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="h-2 w-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Room 205 checked in</span>
            <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="h-2 w-2 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">New booking received</span>
            <span className="text-xs text-muted-foreground ml-auto">15 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="h-2 w-2 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Room 301 maintenance completed</span>
            <span className="text-xs text-muted-foreground ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;