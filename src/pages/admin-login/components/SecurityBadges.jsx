import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encryption',
      description: 'All data transmitted is encrypted using industry-standard SSL/TLS protocols'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'Multi-factor authentication and session management for enhanced security'
    },
    {
      icon: 'Eye',
      title: 'Activity Monitoring',
      description: 'All login attempts and administrative actions are logged and monitored'
    },
    {
      icon: 'Clock',
      title: 'Session Management',
      description: 'Automatic session timeout and secure logout for data protection'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Security Header */}
      <div className="text-center space-y-2">
        <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
          <Icon name="ShieldCheck" size={20} className="text-success" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Enterprise Security
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Your data is protected by industry-leading security measures and compliance standards
        </p>
      </div>
      {/* Security Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {securityFeatures?.map((feature, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 space-y-3 hover:luxury-shadow-hover smooth-transition"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={16} className="text-accent" />
              </div>
              <h4 className="font-medium text-foreground text-sm">
                {feature?.title}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Compliance Badges */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Award" size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">
            Security Compliance
          </span>
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="CheckCircle" size={12} className="text-success" />
            <span>ISO 27001</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="CheckCircle" size={12} className="text-success" />
            <span>SOC 2 Type II</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="CheckCircle" size={12} className="text-success" />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
      {/* Support Information */}
      <div className="text-center space-y-2 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Need help accessing your account?
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs">
          <button className="text-accent hover:text-accent/80 smooth-transition flex items-center space-x-1">
            <Icon name="Phone" size={12} />
            <span>Call Support</span>
          </button>
          <button className="text-accent hover:text-accent/80 smooth-transition flex items-center space-x-1">
            <Icon name="Mail" size={12} />
            <span>Email Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityBadges;