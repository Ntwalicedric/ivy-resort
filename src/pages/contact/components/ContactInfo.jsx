import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactInfo = ({ className = '' }) => {
  const contactDetails = [
    {
      icon: 'MapPin',
      title: 'Resort Address',
      details: [
        'Lake Kivu Shores',
        'Gisenyi District, Western Province',
        'Rwanda, East Africa'
      ],
      action: {
        label: 'Get Directions',
        onClick: () => window.open('https://maps.google.com/?q=-1.7041,29.2284', '_blank')
      }
    },
    {
      icon: 'Phone',
      title: 'Phone Numbers',
      details: [
        '+250 787 061 278 (Main Reception)',
        '+250 787 061 278 (Reservations)',
        '+250 787 061 278 (Restaurant)'
      ],
      action: {
        label: 'Call Reception',
        onClick: () => window.open('tel:+250787061278')
      }
    },
    {
      icon: 'Mail',
      title: 'Email Addresses',
      details: [
        'info@ivyresort.rw (General)',
        'reservations@ivyresort.rw (Bookings)',
        'events@ivyresort.rw (Events & Conferences)'
      ],
      action: {
        label: 'Send Email',
        onClick: () => window.open('mailto:info@ivyresort.rw')
      }
    },
    {
      icon: 'Clock',
      title: 'Business Hours',
      details: [
        'Reception: 24/7',
        'Restaurant: 6:00 AM - 11:00 PM',
        'Spa: 8:00 AM - 9:00 PM'
      ],
      timezone: 'Central Africa Time (CAT)'
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: 'Facebook',
      url: 'https://facebook.com/ivyresort',
      followers: '12.5K'
    },
    {
      name: 'Instagram',
      icon: 'Instagram',
      url: 'https://instagram.com/ivyresort',
      followers: '8.2K'
    },
    {
      name: 'Twitter',
      icon: 'Twitter',
      url: 'https://twitter.com/ivyresort',
      followers: '5.1K'
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      url: 'https://linkedin.com/company/ivyresort',
      followers: '2.8K'
    }
  ];

  const emergencyContacts = [
    {
      title: 'Guest Emergency',
      number: '+250 787 061 278',
      description: '24/7 emergency assistance for current guests'
    },
    {
      title: 'Medical Emergency',
      number: '112',
      description: 'National emergency services'
    }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Contact Details */}
      <div className="space-y-6">
        {contactDetails?.map((contact, index) => (
          <div key={index} className="bg-card rounded-xl p-6 luxury-shadow">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={contact?.icon} size={24} className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  {contact?.title}
                </h3>
                <div className="space-y-2">
                  {contact?.details?.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">
                      {detail}
                    </p>
                  ))}
                  {contact?.timezone && (
                    <p className="text-xs text-muted-foreground italic">
                      {contact?.timezone}
                    </p>
                  )}
                </div>
                {contact?.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={contact?.action?.onClick}
                    className="mt-4 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {contact?.action?.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Emergency Contacts */}
      <div className="bg-error/5 border border-error/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="AlertTriangle" size={20} className="text-error" />
          <h3 className="font-heading text-lg font-semibold text-error">
            Emergency Contacts
          </h3>
        </div>
        <div className="space-y-4">
          {emergencyContacts?.map((emergency, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{emergency?.title}</p>
                <p className="text-sm text-muted-foreground">{emergency?.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${emergency?.number}`)}
                iconName="Phone"
                iconPosition="left"
                className="border-error text-error hover:bg-error hover:text-error-foreground flex-shrink-0"
              >
                {emergency?.number}
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Social Media */}
      <div className="bg-card rounded-xl p-6 luxury-shadow">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
          Follow Us
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {socialLinks?.map((social, index) => (
            <button
              key={index}
              onClick={() => window.open(social?.url, '_blank')}
              className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-accent/50 hover:bg-accent/5 smooth-transition"
            >
              <Icon name={social?.icon} size={20} className="text-accent" />
              <div className="text-left">
                <p className="font-medium text-foreground text-sm">{social?.name}</p>
                <p className="text-xs text-muted-foreground">{social?.followers} followers</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Trust Signals */}
      <div className="bg-card rounded-xl p-6 luxury-shadow">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
          Security & Trust
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">SSL Encrypted Communication</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Award" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">Rwanda Tourism Board Certified</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Star" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">4.8/5 Guest Satisfaction Rating</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Lock" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">Privacy Policy Compliant</span>
          </div>
        </div>
      </div>
      {/* Response Time */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Clock" size={20} className="text-accent" />
          <h3 className="font-heading text-lg font-semibold text-accent">
            Response Times
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email inquiries:</span>
            <span className="font-medium text-foreground">2-4 hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone calls:</span>
            <span className="font-medium text-foreground">Immediate</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking confirmations:</span>
            <span className="font-medium text-foreground">Within 1 hour</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Emergency assistance:</span>
            <span className="font-medium text-foreground">24/7 Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;