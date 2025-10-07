import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ 
  title, 
  value, 
  trend, 
  trendDirection, 
  icon, 
  iconColor = 'text-accent',
  className = '' 
}) => {
  const getTrendColor = () => {
    if (trendDirection === 'up') return 'text-success';
    if (trendDirection === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trendDirection === 'up') return 'TrendingUp';
    if (trendDirection === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`relative bg-card rounded-xl p-6 luxury-shadow smooth-transition hover:luxury-shadow-hover hover:scale-105 group cursor-pointer ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`h-12 w-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 smooth-transition ${iconColor}`}>
          <Icon name={icon} size={24} className="group-hover:animate-pulse" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full bg-muted/50 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={14} />
            <span className="text-xs font-medium">{trend}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-heading font-bold text-card-foreground group-hover:text-accent smooth-transition">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 smooth-transition pointer-events-none"></div>
    </div>
  );
};

export default MetricsCard;