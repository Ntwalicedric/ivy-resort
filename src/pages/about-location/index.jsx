import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import PublicNavigation from '../../components/ui/PublicNavigation';
import BookingWidget from '../../components/ui/BookingWidget';
import HeroSection from './components/HeroSection';
import ResortStorySection from './components/ResortStorySection';
import LocationAdvantagesSection from './components/LocationAdvantagesSection';
import SustainabilitySection from './components/SustainabilitySection';
import InteractiveMapSection from './components/InteractiveMapSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactInfoSection from './components/ContactInfoSection';

const AboutLocationPage = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1000);
  };
  return (
    <>
      <Helmet>
        <title>About & Location - Ivy Resort Rwanda | Luxury Lake Kivu Resort</title>
        <meta 
          name="description" 
          content="Discover Ivy Resort's story, prime Lake Kivu location, sustainability initiatives, and guest testimonials. Experience luxury hospitality in Rwanda's most beautiful setting." 
        />
        <meta name="keywords" content="Ivy Resort Rwanda, Lake Kivu resort, luxury accommodation Rwanda, sustainable tourism, Rwanda hospitality, mountain views, eco-friendly resort" />
        <meta property="og:title" content="About & Location - Ivy Resort Rwanda" />
        <meta property="og:description" content="Learn about Ivy Resort's commitment to luxury, sustainability, and authentic Rwandan hospitality on the shores of Lake Kivu." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ivyresort.rw/about-location" />
        <link rel="canonical" href="https://ivyresort.rw/about-location" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <PublicNavigation />

        {/* Hero Section */}
        <HeroSection />

        {/* Resort Story Section */}
        <ResortStorySection />

        {/* Location Advantages Section */}
        <LocationAdvantagesSection />

        {/* Sustainability Section */}
        <SustainabilitySection />

        {/* Interactive Map Section */}
        <InteractiveMapSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Contact Information Section */}
        <ContactInfoSection />

        {/* Floating Booking Widget */}
        <BookingWidget variant="floating" />

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                    <Icon name="Mountain" size={20} className="text-accent-foreground" />
                  </div>
                  <span className="font-heading text-xl font-semibold">Ivy Resort</span>
                </div>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">
                  Luxury hospitality on Lake Kivu's pristine shores, where Rwanda's natural beauty meets world-class service.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-heading text-lg font-semibold">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/homepage" className="text-primary-foreground/80 hover:text-accent smooth-transition">Home</a></li>
                  <li><a href="/room-selection-booking" className="text-primary-foreground/80 hover:text-accent smooth-transition">Rooms & Booking</a></li>
                  <li><a href="/about-location" className="text-primary-foreground/80 hover:text-accent smooth-transition">About & Location</a></li>
                  <li><a href="/contact" className="text-primary-foreground/80 hover:text-accent smooth-transition">Contact</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h4 className="font-heading text-lg font-semibold">Contact</h4>
                <div className="space-y-2 text-sm text-primary-foreground/80">
                  <p>Lake Kivu Shoreline</p>
                  <p>Rubavu District, Rwanda</p>
                  <p>+250 787 061 278</p>
                  <p>info@ivyresort.rw</p>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-4">
                <h4 className="font-heading text-lg font-semibold">Stay Updated</h4>
                <p className="text-primary-foreground/80 text-sm">
                  Subscribe for exclusive offers and resort updates.
                </p>
                
                {isSubscribed ? (
                  <div className="p-3 bg-accent/20 border border-accent/30 rounded-lg">
                    <p className="text-accent text-sm font-medium text-center">
                      ✓ Thank you for subscribing!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-sm text-primary placeholder-primary-foreground/60 focus:outline-none focus:border-accent"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-primary-foreground/60 text-sm">
                © {new Date()?.getFullYear()} Ivy Resort Rwanda. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-primary-foreground/60 hover:text-accent text-sm smooth-transition">Privacy Policy</a>
                <a href="#" className="text-primary-foreground/60 hover:text-accent text-sm smooth-transition">Terms of Service</a>
                <a href="#" className="text-primary-foreground/60 hover:text-accent text-sm smooth-transition">Sitemap</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutLocationPage;