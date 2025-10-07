import React from 'react';
import { Helmet } from 'react-helmet';
import PublicNavigation from '../../components/ui/PublicNavigation';
import ContactHero from './components/ContactHero';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import LocationMap from './components/LocationMap';
import BookingWidget from '../../components/ui/BookingWidget';
import Icon from '../../components/AppIcon';

const ContactPage = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact Us - Ivy Resort | Lake Kivu Luxury Resort Rwanda</title>
        <meta 
          name="description" 
          content="Contact Ivy Resort for reservations, inquiries, and assistance. Located on Lake Kivu shores in Rwanda. 24/7 support available. Call +250 788 123 456 or email info@ivyresort.rw" 
        />
        <meta name="keywords" content="contact ivy resort, lake kivu resort contact, rwanda resort booking, gisenyi hotel contact, luxury resort rwanda" />
        <meta property="og:title" content="Contact Us - Ivy Resort | Lake Kivu Luxury Resort" />
        <meta property="og:description" content="Get in touch with Ivy Resort for your Lake Kivu luxury experience. 24/7 support, instant booking confirmation, and personalized service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ivyresort.rw/contact" />
        <link rel="canonical" href="https://ivyresort.rw/contact" />
      </Helmet>

      {/* Navigation */}
      <PublicNavigation />

      {/* Hero Section */}
      <ContactHero />

      {/* Main Content */}
      <main className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Form & Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
            {/* Contact Form - 60% width on desktop */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Contact Information - 40% width on desktop */}
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>

          {/* Location Map Section */}
          <div className="mb-16">
            <LocationMap />
          </div>

          {/* Additional Support Section */}
          <div className="bg-gradient-to-r from-accent/5 to-secondary/5 rounded-2xl p-8 lg:p-12 border border-accent/20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="HeadphonesIcon" size={32} className="text-accent" />
              </div>
              
              <h2 className="font-heading text-3xl font-semibold text-foreground mb-4">
                Need Immediate Assistance?
              </h2>
              
              <p className="text-muted-foreground text-lg mb-8">
                Our dedicated guest services team is available 24/7 to assist with any questions, 
                special requests, or urgent matters during your stay.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon name="MessageCircle" size={24} className="text-success" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Available on our website</p>
                </div>
                
                <div className="text-center">
                  <div className="h-12 w-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon name="Phone" size={24} className="text-warning" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">+250 787 061 278</p>
                </div>
                
                <div className="text-center">
                  <div className="h-12 w-12 bg-error/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon name="AlertCircle" size={24} className="text-error" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">Emergency</h3>
                  <p className="text-sm text-muted-foreground">24/7 Guest Support</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => window.open('https://wa.me/250787061278', '_blank')}
                  className="flex items-center space-x-2 bg-success hover:bg-success/90 text-success-foreground px-6 py-3 rounded-lg font-medium smooth-transition w-full sm:w-auto"
                >
                  <Icon name="MessageCircle" size={20} />
                  <span>Chat on WhatsApp</span>
                </button>
                
                <button
                  onClick={() => window.open('tel:+250787061278')}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-medium smooth-transition w-full sm:w-auto"
                >
                  <Icon name="Phone" size={20} />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                  <Icon name="Mountain" size={20} color="white" />
                </div>
                <span className="font-heading text-xl font-semibold">Ivy Resort</span>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Experience luxury on the shores of Lake Kivu, Rwanda's most beautiful destination.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/homepage" className="text-primary-foreground/80 hover:text-primary-foreground smooth-transition">Home</a></li>
                <li><a href="/room-selection-booking" className="text-primary-foreground/80 hover:text-primary-foreground smooth-transition">Rooms & Booking</a></li>
                <li><a href="/about-location" className="text-primary-foreground/80 hover:text-primary-foreground smooth-transition">About & Location</a></li>
                <li><a href="/contact" className="text-primary-foreground/80 hover:text-primary-foreground smooth-transition">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-heading font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Lake Kivu Shores, Gisenyi</li>
                <li>Western Province, Rwanda</li>
                <li>+250 787 061 278</li>
                <li>info@ivyresort.rw</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-heading font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.open('https://facebook.com/ivyresortrwanda', '_blank')}
                  className="h-10 w-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center smooth-transition"
                >
                  <Icon name="Facebook" size={20} />
                </button>
                <button 
                  onClick={() => window.open('https://instagram.com/ivyresort_rwanda', '_blank')}
                  className="h-10 w-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center smooth-transition"
                >
                  <Icon name="Instagram" size={20} />
                </button>
                <button 
                  onClick={() => window.open('https://twitter.com/ivyresort', '_blank')}
                  className="h-10 w-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center smooth-transition"
                >
                  <Icon name="Twitter" size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} Ivy Resort. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ContactPage;