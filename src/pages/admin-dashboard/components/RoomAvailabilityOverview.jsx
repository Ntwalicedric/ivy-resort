import React from 'react';
import Icon from '../../../components/AppIcon';

const RoomAvailabilityOverview = ({ roomData, onRoomStatusChange }) => {
  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-error text-error-foreground';
      case 'available':
        return 'bg-success text-success-foreground';
      case 'maintenance':
        return 'bg-warning text-warning-foreground';
      case 'cleaning':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoomStatusIcon = (status) => {
    switch (status) {
      case 'occupied':
        return 'User';
      case 'available':
        return 'CheckCircle';
      case 'maintenance':
        return 'Wrench';
      case 'cleaning':
        return 'Sparkles';
      default:
        return 'Circle';
    }
  };

  const totalRooms = roomData?.reduce((sum, floor) => sum + floor?.rooms?.length, 0);
  const occupiedRooms = roomData?.reduce((sum, floor) => 
    sum + floor?.rooms?.filter(room => room?.status === 'occupied')?.length, 0
  );
  const availableRooms = roomData?.reduce((sum, floor) => 
    sum + floor?.rooms?.filter(room => room?.status === 'available')?.length, 0
  );
  const maintenanceRooms = roomData?.reduce((sum, floor) => 
    sum + floor?.rooms?.filter(room => room?.status === 'maintenance')?.length, 0
  );

  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  return (
    <div className="bg-card rounded-xl p-6 luxury-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
          <Icon name="Building" size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            Room Availability
          </h3>
          <p className="text-sm text-muted-foreground">Real-time room status</p>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:shadow-md smooth-transition">
          <div className="text-2xl font-heading font-bold text-accent">{occupancyRate}%</div>
          <div className="text-sm text-muted-foreground">Occupancy Rate</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:shadow-md smooth-transition">
          <div className="text-2xl font-heading font-bold text-success">{availableRooms}</div>
          <div className="text-sm text-muted-foreground">Available Rooms</div>
        </div>
      </div>
      {/* Status Legend */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-success rounded-full"></div>
          <span className="text-xs text-muted-foreground">Available ({availableRooms})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-error rounded-full"></div>
          <span className="text-xs text-muted-foreground">Occupied ({occupiedRooms})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-warning rounded-full"></div>
          <span className="text-xs text-muted-foreground">Maintenance ({maintenanceRooms})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-accent rounded-full"></div>
          <span className="text-xs text-muted-foreground">Cleaning</span>
        </div>
      </div>
      {/* Floor-wise Room Status */}
      <div className="space-y-4">
        {roomData?.map((floor) => (
          <div key={floor?.floorNumber} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-card-foreground">
                Floor {floor?.floorNumber}
              </h4>
              <span className="text-xs text-muted-foreground">
                {floor?.rooms?.filter(r => r?.status === 'available')?.length}/{floor?.rooms?.length} available
              </span>
            </div>
            
            <div className="grid grid-cols-8 gap-1">
              {floor?.rooms?.map((room) => (
                <div
                  key={room?.number}
                  className={`h-8 w-8 rounded flex items-center justify-center text-xs font-medium ${getRoomStatusColor(room?.status)} hover:scale-105 smooth-transition cursor-pointer`}
                  title={`Room ${room?.number} - ${room?.status} ${room?.guestName ? `(${room?.guestName})` : ''}`}
                  onClick={() => {
                    if (onRoomStatusChange) {
                      onRoomStatusChange(room);
                    } else {
                      // Cycle through room statuses
                      const statusCycle = {
                        'available': 'occupied',
                        'occupied': 'maintenance', 
                        'maintenance': 'cleaning',
                        'cleaning': 'available'
                      };
                      
                      const newStatus = statusCycle[room?.status] || 'available';
                      alert(`Room ${room?.number} status changed from ${room?.status} to ${newStatus}.`);
                    }
                  }}
                >
                  <Icon name={getRoomStatusIcon(room?.status)} size={12} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-border hover:bg-muted/50 smooth-transition">
            <Icon name="RefreshCw" size={14} />
            <span className="text-xs">Refresh Status</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-2 rounded-lg border border-border hover:bg-muted/50 smooth-transition">
            <Icon name="Settings" size={14} />
            <span className="text-xs">Manage Rooms</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityOverview;