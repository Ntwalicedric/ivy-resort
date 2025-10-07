import React from 'react';
import Icon from '../../../components/AppIcon';

const ContactHero = ({ className = '' }) => {
  
  const breadcrumbs = [
    { label: 'Home', path: '/homepage' },
    { label: 'Contact', path: '/contact', active: true }
  ];

  return (
    <div className={`relative overflow-hidden bg-background ${className}`}>
      {/* Hero Section */}
      <div className="relative min-h-[600px] lg:min-h-[700px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-[700px]">
            
            {/* Left Side - 3D Animation with White Background */}
            <div className="relative h-[400px] lg:h-[500px] order-2 lg:order-1">
              <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden luxury-shadow border border-border">
                <div className="relative w-full h-full overflow-hidden" style={{ clipPath: 'inset(0 0 0 0)' }}>
                  <iframe
                    src="https://my.spline.design/genkubgreetingrobot-kk70NM1UrinYh0XzYahJiuVl/"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="3D Greeting Robot"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    loading="lazy"
                    style={{ 
                      background: 'white',
                      transform: 'scale(1.1)',
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
                {/* Comprehensive Watermark Overlay */}
                <div className="absolute bottom-0 right-0 w-60 h-20 bg-white"></div>
                <div className="absolute bottom-0 right-0 w-48 h-16 bg-white"></div>
                <div className="absolute bottom-0 right-0 w-36 h-12 bg-white"></div>
                <div className="absolute bottom-0 right-0 w-24 h-8 bg-white"></div>
                <div className="absolute bottom-0 right-0 w-16 h-6 bg-white"></div>
                <div className="absolute bottom-0 right-0 w-12 h-4 bg-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-3 bg-white"></div>
                <div className="absolute bottom-0 right-0 w-6 h-2 bg-white"></div>
                <div className="absolute bottom-0 right-0 w-4 h-1 bg-white"></div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center space-y-8 order-1 lg:order-2">
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs?.map((crumb, index) => (
                  <React.Fragment key={crumb?.path}>
                    {index > 0 && (
                      <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                    )}
                    <span className={`${
                      crumb?.active 
                        ? 'text-foreground font-medium' :'text-muted-foreground hover:text-foreground cursor-pointer'
                    }`}>
                      {crumb?.label}
                    </span>
                  </React.Fragment>
                ))}
              </nav>

              {/* Main Content */}
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
                    <Icon name="MessageCircle" size={16} className="text-accent" />
                    <span className="text-sm font-medium text-accent">Get in Touch</span>
                  </div>
                  
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                    Contact 
                    <span className="block text-primary">Ivy Resort</span>
                  </h1>
                  
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                    We're here to make your Lake Kivu experience extraordinary. 
                    Reach out to us for reservations, inquiries, or any assistance you need.
                  </p>
                </div>

                {/* Enhanced Contact Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group bg-card rounded-xl p-6 hover:bg-muted/50 smooth-transition border border-border luxury-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 smooth-transition">
                        <Icon name="Phone" size={24} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-1">
                          Call Us
                        </p>
                        <p className="text-foreground font-semibold text-lg">+250 787 061 278</p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-card rounded-xl p-6 hover:bg-muted/50 smooth-transition border border-border luxury-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 smooth-transition">
                        <Icon name="Mail" size={24} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-1">
                          Email Us
                        </p>
                        <p className="text-foreground font-semibold text-lg">info@ivyresort.rw</p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-card rounded-xl p-6 hover:bg-muted/50 smooth-transition border border-border luxury-shadow sm:col-span-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 smooth-transition">
                        <Icon name="Clock" size={24} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-1">
                          Available 24/7
                        </p>
                        <p className="text-foreground font-semibold text-lg">Round-the-clock support for all your needs</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => window.open('https://wa.me/250787061278', '_blank')}
                    className="flex items-center justify-center space-x-3 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-xl font-semibold smooth-transition luxury-shadow hover:luxury-shadow-hover"
                  >
                    <Icon name="MessageCircle" size={20} />
                    <span>Chat on WhatsApp</span>
                  </button>
                  
                  <button
                    onClick={() => window.open('tel:+250787061278')}
                    className="flex items-center justify-center space-x-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold smooth-transition luxury-shadow"
                  >
                    <Icon name="Phone" size={20} />
                    <span>Call Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHero;