import React from 'react';
import Icon from '../../../components/AppIcon';

const RevenueChart = ({ data = [] }) => {
  // Mock data for the last 7 days
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', revenue: 18500, bookings: 12 },
    { day: 'Tue', revenue: 22100, bookings: 15 },
    { day: 'Wed', revenue: 19800, bookings: 13 },
    { day: 'Thu', revenue: 25600, bookings: 18 },
    { day: 'Fri', revenue: 31200, bookings: 22 },
    { day: 'Sat', revenue: 28900, bookings: 20 },
    { day: 'Sun', revenue: 24580, bookings: 17 }
  ];

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <div className="bg-card rounded-xl p-6 luxury-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Revenue Trend
            </h3>
            <p className="text-sm text-muted-foreground">Last 7 days performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-accent rounded-full"></div>
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">Bookings</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={item.day} className="flex items-center space-x-4">
            <div className="w-8 text-xs text-muted-foreground font-medium">
              {item.day}
            </div>
            <div className="flex-1 space-y-2">
              {/* Revenue Bar */}
              <div className="relative">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full smooth-transition hover:from-accent/90 hover:to-accent/70"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  ></div>
                </div>
                <div className="absolute -top-6 right-0 text-xs font-medium text-accent">
                  ${(item.revenue / 1000).toFixed(1)}k
                </div>
              </div>
              {/* Bookings Bar */}
              <div className="relative">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-success to-success/80 rounded-full smooth-transition hover:from-success/90 hover:to-success/70"
                    style={{ width: `${(item.bookings / 25) * 100}%` }}
                  ></div>
                </div>
                <div className="absolute -top-5 right-0 text-xs font-medium text-success">
                  {item.bookings} bookings
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-heading font-bold text-accent">
              ${(chartData.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-heading font-bold text-success">
              {chartData.reduce((sum, d) => sum + d.bookings, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Bookings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;



