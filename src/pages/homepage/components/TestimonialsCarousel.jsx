import React, { useState, useEffect } from 'react';
// import { motion,  } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TestimonialsCarousel = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      location: "London, UK",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      date: "August 2024",
      title: "Absolutely Breathtaking Experience",
      content: `Our stay at Ivy Resort exceeded every expectation. The lake views from our balcony were simply magical, especially during sunrise. The rooftop restaurant's French cuisine was exceptional, and the staff's attention to detail made us feel like royalty. We've traveled extensively, but this resort stands out as truly special.`,
      verified: true,
      roomType: "Deluxe Apartment With Mountain View",
      highlights: ["Exceptional Service", "Stunning Views", "Outstanding Food"]
    },
    {
      id: 2,
      name: "James Chen",
      location: "Singapore",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      date: "July 2024",
      title: "Perfect Romantic Getaway",
      content: `Ivy Resort provided the perfect setting for our anniversary celebration. The luxury suite was immaculate, and the panoramic views of Lake Kivu created the most romantic atmosphere. The Chinese cuisine at the rooftop restaurant reminded us of home, but with an elevated twist. Highly recommend for couples seeking luxury and tranquility.`,
      verified: true,
      roomType: "Luxury Double With Balcony",
      highlights: ["Romantic Setting", "Luxury Amenities", "Authentic Cuisine"]
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      location: "Madrid, Spain",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      date: "June 2024",
      title: "Unforgettable Family Vacation",
      content: `Our family of four had an incredible time at Ivy Resort. The apartment-style accommodation gave us plenty of space, and the kids loved the balcony overlooking the mountains. The variety of cuisines at the restaurant meant everyone found something they loved. The staff went above and beyond to make our stay memorable.`,
      verified: true,
      roomType: "Deluxe Apartment With Balcony",
      highlights: ["Family Friendly", "Spacious Rooms", "Diverse Dining"]
    },
    {
      id: 4,
      name: "David Thompson",
      location: "Toronto, Canada",
      avatar: "https://randomuser.me/api/portraits/men/38.jpg",
      rating: 5,
      date: "May 2024",
      title: "Business Trip Turned Paradise",
      content: `What started as a business trip to Rwanda became an extended vacation thanks to Ivy Resort. The WiFi and business amenities were excellent for work, but the serene environment and world-class dining made it impossible to leave. The Italian cuisine was particularly outstanding. Already planning my return visit.`,
      verified: true,
      roomType: "Standard Room With Mountain View",
      highlights: ["Business Friendly", "Peaceful Environment", "Great Connectivity"]
    },
    {
      id: 5,
      name: "Priya Sharma",
      location: "Mumbai, India",
      avatar: "https://randomuser.me/api/portraits/women/41.jpg",
      rating: 5,
      date: "April 2024",
      title: "Spiritual Retreat in Paradise",
      content: `Ivy Resort offered the perfect escape from city life. The mountain views provided a sense of peace and tranquility that I desperately needed. The Indian cuisine at the restaurant was authentic and delicious, making me feel at home. The spa services and yoga sessions on the rooftop were the highlight of my stay.`,
      verified: true,
      roomType: "Deluxe Double Room With Balcony",
      highlights: ["Peaceful Atmosphere", "Authentic Cuisine", "Wellness Focus"]
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials?.length]);

  const handleTestimonialChange = (index) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
    setIsAutoPlaying(false);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    setIsAutoPlaying(false);
  };

  const currentReview = testimonials?.[currentTestimonial];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-success/10 px-4 py-2 rounded-full mb-6">
            <Icon name="MessageCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Guest Testimonials</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            What Our Guests Say
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover why travelers from around the world choose Ivy Resort for their Lake Kivu experience. Read verified reviews from our valued guests.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-5xl mx-auto">
          <div
            key={currentTestimonial}
            className="bg-card rounded-3xl p-8 lg:p-12 luxury-shadow"
          >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Guest Info */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-6">
                    <Image
                      src={currentReview?.avatar}
                      alt={currentReview?.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto lg:mx-0"
                    />
                    {currentReview?.verified && (
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-success rounded-full flex items-center justify-center">
                        <Icon name="CheckCircle" size={16} color="white" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                    {currentReview?.name}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4">
                    {currentReview?.location}
                  </p>
                  
                  <div className="flex items-center justify-center lg:justify-start space-x-1 mb-4">
                    {[...Array(currentReview?.rating)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
                    ))}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    Stayed in: {currentReview?.roomType}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {currentReview?.date}
                  </div>
                </div>

                {/* Review Content */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <Icon name="Quote" size={32} className="text-accent/20 mb-4" />
                    <h4 className="font-heading text-2xl font-semibold text-primary mb-4">
                      {currentReview?.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {currentReview?.content}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentReview?.highlights?.map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Verified Badge */}
                  {currentReview?.verified && (
                    <div className="flex items-center space-x-2 text-success">
                      <Icon name="Shield" size={16} />
                      <span className="text-sm font-medium">Verified Guest Review</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 hidden lg:block">
            <button
              onClick={handlePrevTestimonial}
              className="w-12 h-12 bg-background luxury-shadow rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/5 smooth-transition"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 hidden lg:block">
            <button
              onClick={handleNextTestimonial}
              className="w-12 h-12 bg-background luxury-shadow rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/5 smooth-transition"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials?.map((_, index) => (
            <button
              key={index}
              onClick={() => handleTestimonialChange(index)}
              className={`w-3 h-3 rounded-full smooth-transition ${
                index === currentTestimonial
                  ? 'bg-accent scale-125' :'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-center space-x-4 mt-8 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevTestimonial}
            className="border-accent/20 text-accent hover:bg-accent/5"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextTestimonial}
            className="border-accent/20 text-accent hover:bg-accent/5"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="font-heading text-3xl font-bold text-primary mb-2">4.9</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Guest Reviews</div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Would Recommend</div>
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-muted-foreground">Return Guests</div>
          </div>
        </div>
    </section>
  );
};

export default TestimonialsCarousel;
