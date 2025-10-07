import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingArrivals = ({ arrivals, departures }) => {
  return (
    <div className="bg-card rounded-xl p-6 luxury-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Today's Schedule
            </h3>
            <p className="text-sm text-muted-foreground">Arrivals & departures</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" iconName="ExternalLink" className="hover:bg-accent/10 hover:text-accent">
          View All
        </Button>
      </div>
      {/* Arrivals */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="LogIn" size={16} className="text-success" />
          <h4 className="text-sm font-medium text-card-foreground">
            Arrivals ({arrivals?.length})
          </h4>
        </div>
        
        <div className="space-y-3">
          {arrivals?.slice(0, 3)?.map((arrival) => (
            <div key={arrival?.id} className="flex items-center space-x-3 p-3 rounded-lg bg-success/5 border border-success/20 hover:bg-success/10 smooth-transition group">
              <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center group-hover:scale-110 smooth-transition">
                <Icon name="User" size={16} className="text-success" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-card-foreground text-sm group-hover:text-success smooth-transition">{arrival?.guestName}</div>
                <div className="text-xs text-muted-foreground">
                  {arrival?.roomType} • {arrival?.checkInTime}
                </div>
              </div>
              <div className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-full">
                {arrival?.status}
              </div>
            </div>
          ))}
          
          {arrivals?.length > 3 && (
            <div className="text-center">
              <Button variant="ghost" size="sm" className="text-success">
                +{arrivals?.length - 3} more arrivals
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Departures */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="LogOut" size={16} className="text-warning" />
          <h4 className="text-sm font-medium text-card-foreground">
            Departures ({departures?.length})
          </h4>
        </div>
        
        <div className="space-y-3">
          {departures?.slice(0, 3)?.map((departure) => (
            <div key={departure?.id} className="flex items-center space-x-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
              <div className="h-8 w-8 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-warning" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-card-foreground text-sm">{departure?.guestName}</div>
                <div className="text-xs text-muted-foreground">
                  {departure?.roomType} • {departure?.checkOutTime}
                </div>
              </div>
              <div className="text-xs text-warning font-medium">
                {departure?.status}
              </div>
            </div>
          ))}
          
          {departures?.length > 3 && (
            <div className="text-center">
              <Button variant="ghost" size="sm" className="text-warning">
                +{departures?.length - 3} more departures
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Empty State */}
      {arrivals?.length === 0 && departures?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No scheduled arrivals or departures today</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingArrivals;