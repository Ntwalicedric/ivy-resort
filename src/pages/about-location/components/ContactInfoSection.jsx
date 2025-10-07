import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactInfoSection = () => {
  const navigate = useNavigate();

  const contactMethods = [
    {
      type: "phone",
      title: "Phone & WhatsApp",
      primary: "+250 787 061 278",
      secondary: "+250 787 061 278",
      description: "24/7 reservations and guest services",
      icon: "Phone",
      action: "Call Now"
    },
    {
      type: "email",
      title: "Email Contacts",
      primary: "reservations@ivyresort.rw",
      secondary: "info@ivyresort.rw",
      description: "Response within 2 hours during business hours",
      icon: "Mail",
      action: "Send Email"
    },
    {
      type: "address",
      title: "Physical Address",
      primary: "Lake Kivu Shoreline",
      secondary: "Rubavu District, Western Province, Rwanda",
      description: "GPS: -1.7041°S, 29.2284°E",
      icon: "MapPin",
      action: "Get Directions"
    }
  ];

  const socialMedia = [
    {
      platform: "Instagram",
      handle: "@ivyresort_rwanda",
      followers: "25.4K",
      icon: "Instagram",
      color: "text-pink-500",
      url: "https://instagram.com/ivyresort_rwanda"
    },
    {
      platform: "Facebook",
      handle: "Ivy Resort Rwanda",
      followers: "18.2K",
      icon: "Facebook",
      color: "text-blue-600",
      url: "https://facebook.com/ivyresortrwanda"
    },
    {
      platform: "Twitter",
      handle: "@ivyresort",
      followers: "12.8K",
      icon: "Twitter",
      color: "text-blue-400",
      url: "https://twitter.com/ivyresort"
    },
    {
      platform: "LinkedIn",
      handle: "Ivy Resort Rwanda",
      followers: "8.5K",
      icon: "Linkedin",
      color: "text-blue-700",
      url: "https://linkedin.com/company/ivyresortrwanda"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "6:00 AM - 11:00 PM", type: "weekday" },
    { day: "Saturday - Sunday", hours: "24/7 Service", type: "weekend" },
    { day: "Reception", hours: "24/7 Available", type: "always" },
    { day: "Concierge", hours: "6:00 AM - 10:00 PM", type: "service" }
  ];

  const certifications = [
    {
      name: "Rwanda Tourism Board",
      code: "RTB-2024-LUX-001",
      icon: "Award"
    },
    {
      name: "Green Key Certified",
      code: "GK-RW-2024-001",
      icon: "Leaf"
    },
    {
      name: "ISO 9001:2015",
      code: "Quality Management",
      icon: "Shield"
    },
    {
      name: "Safe Travels Stamp",
      code: "WTTC Approved",
      icon: "CheckCircle"
    }
  ];

  const handleContactAction = (type) => {
    switch (type) {
      case 'phone':
        window.open('tel:+250787061278', '_self');
        break;
      case 'email':
        window.open('mailto:reservations@ivyresort.rw', '_self');
        break;
      case 'address':
        window.open('https://maps.google.com/?q=-1.7041,29.2284', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-6">
            Contact Information
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get in touch with our dedicated team for reservations, inquiries, or assistance. 
            We're here to make your Ivy Resort experience exceptional.
          </p>
        </motion.div>

        {/* Main Contact Methods */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactMethods?.map((method, index) => (
            <motion.div
              key={method?.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl luxury-shadow card-hover-pop"
            >
              <div className="text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name={method?.icon} size={24} className="text-accent" />
                </div>
                
                <div className="flex-grow space-y-3">
                  <h3 className="font-heading text-xl font-semibold text-primary">
                    {method?.title}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">{method?.primary}</p>
                    <p className="text-muted-foreground">{method?.secondary}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method?.description}
                  </p>
                </div>
                
                <div className="mt-6">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleContactAction(method?.type)}
                    iconName={method?.icon}
                    iconPosition="left"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {method?.action}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Business Hours & Social Media */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card p-8 rounded-xl luxury-shadow"
          >
            <h3 className="font-heading text-2xl font-semibold text-primary mb-6 text-center">
              Business Hours
            </h3>
            
            <div className="space-y-4">
              {businessHours?.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={schedule?.type === 'always' ? 'Clock' : schedule?.type === 'weekend' ? 'Calendar' : 'Sun'} 
                      size={16} 
                      className="text-accent" 
                    />
                    <span className="font-medium text-primary">{schedule?.day}</span>
                  </div>
                  <span className={`font-medium ${
                    schedule?.hours?.includes('24/7') ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {schedule?.hours}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-accent/5 rounded-lg border-l-4 border-accent">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-accent" />
                <span className="font-medium text-accent">Emergency Contact</span>
              </div>
              <p className="text-sm text-muted-foreground">
                For urgent matters outside business hours, call our 24/7 emergency line: 
                <span className="font-medium text-foreground"> +250 788 123 999</span>
              </p>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card p-8 rounded-xl luxury-shadow"
          >
            <h3 className="font-heading text-2xl font-semibold text-primary mb-6 text-center">
              Follow Our Journey
            </h3>
            
            <div className="space-y-4 mb-6">
              {socialMedia?.map((social, index) => (
                <div key={social?.platform} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 smooth-transition cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Icon name={social?.icon} size={20} className={social?.color} />
                    <div>
                      <p className="font-medium text-primary">{social?.platform}</p>
                      <p className="text-sm text-muted-foreground">{social?.handle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-accent">{social?.followers}</p>
                    <p className="text-xs text-muted-foreground">followers</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your Ivy Resort experience with #IvyResortRwanda
              </p>
              <Button
                variant="outline"
                fullWidth
                iconName="Camera"
                iconPosition="left"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={() => window.open('https://instagram.com/ivyresort_rwanda', '_blank')}
              >
                Tag Us in Your Photos
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Certifications & Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 luxury-shadow"
        >
          <h3 className="font-heading text-2xl font-semibold text-primary text-center mb-8">
            Certifications & Trust Signals
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {certifications?.map((cert, index) => (
              <div key={cert?.name} className="text-center space-y-3">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name={cert?.icon} size={20} className="text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-primary">{cert?.name}</h4>
                  <p className="text-xs text-muted-foreground">{cert?.code}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Ivy Resort is committed to maintaining the highest standards of service, 
              safety, and environmental responsibility.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="default"
                onClick={() => navigate('/contact')}
                iconName="MessageCircle"
                iconPosition="left"
                className="bg-accent hover:bg-accent/90"
              >
                Contact Us
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/room-selection-booking')}
                iconName="Calendar"
                iconPosition="left"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Make Reservation
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfoSection;