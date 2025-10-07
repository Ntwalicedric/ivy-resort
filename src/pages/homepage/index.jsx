import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavigation from '../../components/ui/PublicNavigation';
import BookingWidget from '../../components/ui/BookingWidget';
import HeroSection from './components/HeroSection';
import FeaturedRooms from './components/FeaturedRooms';
import RestaurantShowcase from './components/RestaurantShowcase';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import LocationHighlights from './components/LocationHighlights';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set page title
    document.title = 'Ivy Resort - Luxury Lakeside Retreat in Rwanda';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleBookingClick = () => {
    navigate('/room-selection-booking');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleAboutClick = () => {
    navigate('/about-location');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <PublicNavigation />
      {/* Hero Section */}
      <HeroSection onBookingClick={handleBookingClick} />
      {/* Booking Widget - Hero Variant */}
      <section className="relative -mt-8 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingWidget variant="hero" />
        </div>
      </section>
      {/* Featured Rooms Section */}
      <FeaturedRooms onBookingClick={handleBookingClick} />
      {/* Restaurant Showcase */}
      <RestaurantShowcase />
      {/* Testimonials Carousel */}
      <TestimonialsCarousel />
      {/* Location Highlights */}
      <LocationHighlights />
      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-2 bg-accent/20 px-4 py-2 rounded-full mb-8">
            <Icon name="Star" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Limited Time Offer</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Your Lake Kivu Adventure Awaits
          </h2>
          
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Book your stay at Ivy Resort today and experience the perfect blend of luxury, nature, and Rwandan hospitality. Create memories that will last a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              variant="default"
              size="lg"
              onClick={handleBookingClick}
              iconName="Calendar"
              iconPosition="left"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold"
            >
              Book Your Stay Now
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleContactClick}
              iconName="Phone"
              iconPosition="left"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 px-8 py-4 text-lg font-semibold"
            >
              Speak with Concierge
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-secondary-foreground/20">
            <div className="text-center">
              <div className="font-heading text-2xl font-bold mb-2">4.9★</div>
              <div className="text-sm text-secondary-foreground/80">Guest Rating</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl font-bold mb-2">500+</div>
              <div className="text-sm text-secondary-foreground/80">Happy Guests</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl font-bold mb-2">24/7</div>
              <div className="text-sm text-secondary-foreground/80">Concierge Service</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl font-bold mb-2">SSL</div>
              <div className="text-sm text-secondary-foreground/80">Secure Booking</div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Icon name="Mountain" size={20} color="white" />
                </div>
                <span className="font-heading text-xl font-semibold text-primary">
                  Ivy Resort
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Experience luxury and tranquility on the shores of Lake Kivu, where every moment becomes a cherished memory.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                  <Icon name="Facebook" size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                  <Icon name="Instagram" size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                  <Icon name="Twitter" size={16} />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-primary mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleBookingClick}
                  className="block text-sm text-muted-foreground hover:text-accent smooth-transition"
                >
                  Book Now
                </button>
                <button 
                  onClick={handleAboutClick}
                  className="block text-sm text-muted-foreground hover:text-accent smooth-transition"
                >
                  About Us
                </button>
                <button 
                  onClick={handleContactClick}
                  className="block text-sm text-muted-foreground hover:text-accent smooth-transition"
                >
                  Contact
                </button>
                <button className="block text-sm text-muted-foreground hover:text-accent smooth-transition">
                  Gallery
                </button>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-primary mb-4">Services</h3>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Luxury Accommodations</div>
                <div className="text-sm text-muted-foreground">Rooftop Dining</div>
                <div className="text-sm text-muted-foreground">Spa & Wellness</div>
                <div className="text-sm text-muted-foreground">Concierge Service</div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-primary mb-4">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="MapPin" size={14} />
                  <span>Lake Kivu, Kibuye, Rwanda</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Phone" size={14} />
                  <span>+250 788 123 456</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Mail" size={14} />
                  <span>info@ivyresort.rw</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} Ivy Resort. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
      {/* Floating Booking Widget */}
      <BookingWidget variant="floating" />
    </div>
  );
};

export default Homepage;