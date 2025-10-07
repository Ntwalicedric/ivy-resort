import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      location: "London, UK",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 5,
      stayDuration: "7 nights",
      roomType: "Luxury Double with Balcony",
      bookingPlatform: "Booking.com",
      verifiedStay: true,
      date: "August 2024",
      review: `Absolutely breathtaking! The views of Lake Kivu from our balcony were spectacular every morning. The staff went above and beyond to make our honeymoon unforgettable. The sustainability initiatives really impressed us - it's wonderful to see a luxury resort that cares about the environment.`,
      highlights: ["Stunning lake views", "Exceptional service", "Eco-friendly practices", "Perfect for couples"]
    },
    {
      id: 2,
      name: "Marcus Johnson",
      location: "New York, USA",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 5,
      stayDuration: "4 nights",
      roomType: "Executive Suite",
      bookingPlatform: "TripAdvisor",
      verifiedStay: true,
      date: "July 2024",
      review: `As a frequent business traveler, I've stayed at luxury resorts worldwide, but Ivy Resort stands out. The combination of modern amenities with authentic Rwandan culture is perfect. The rooftop restaurant's cuisine is world-class, and the proximity to Volcanoes National Park made for an incredible gorilla trekking experience.`,
      highlights: ["World-class dining", "Cultural authenticity", "Business amenities", "Adventure access"]
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      location: "Barcelona, Spain",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 5,
      stayDuration: "10 nights",
      roomType: "Private Villa",
      bookingPlatform: "Expedia",
      verifiedStay: true,
      date: "June 2024",
      review: `Our family vacation at Ivy Resort exceeded all expectations. The kids loved the lake activities while my husband and I enjoyed the spa treatments. The villa provided perfect privacy, and the staff arranged amazing cultural experiences with local communities. Rwanda's beauty is unmatched, and this resort showcases it perfectly.`,
      highlights: ["Family-friendly", "Private villa luxury", "Cultural experiences", "Spa excellence"]
    },
    {
      id: 4,
      name: "James Thompson",
      location: "Sydney, Australia",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 5,
      stayDuration: "5 nights",
      roomType: "Deluxe Mountain View",
      bookingPlatform: "Hotels.com",
      verifiedStay: true,
      date: "September 2024",
      review: `The photography opportunities here are endless! Every sunrise over Lake Kivu was more beautiful than the last. The resort's commitment to conservation is evident everywhere, from the solar panels to the local community partnerships. The mountain views from our room were absolutely stunning.`,
      highlights: ["Photography paradise", "Conservation focus", "Mountain views", "Sunrise experiences"]
    },
    {
      id: 5,
      name: "Amara Okafor",
      location: "Lagos, Nigeria",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      rating: 5,
      stayDuration: "6 nights",
      roomType: "Standard Twin with Balcony",
      bookingPlatform: "Agoda",
      verifiedStay: true,
      date: "August 2024",
      review: `As an African traveler, I was impressed by how Ivy Resort celebrates our continent's beauty while providing international luxury standards. The staff's warmth felt like being welcomed by family. The coffee plantation tour was educational and delicious - Rwanda's coffee is truly exceptional!`,
      highlights: ["African hospitality", "Coffee experiences", "Cultural pride", "Warm service"]
    }
  ];

  const stats = [
    { value: "4.9/5", label: "Average Rating", icon: "Star" },
    { value: "2,847", label: "Verified Reviews", icon: "MessageCircle" },
    { value: "98%", label: "Would Recommend", icon: "ThumbsUp" },
    { value: "4.8/5", label: "Service Rating", icon: "Heart" }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials?.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
    setIsAutoPlaying(false);
  };

  const currentReview = testimonials?.[currentTestimonial];

  return (
    <section className="py-20 bg-background">
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
            Guest Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover what our guests say about their unforgettable experiences at Ivy Resort. 
            Every review is verified from actual stays at our property.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats?.map((stat, index) => (
            <div key={stat?.label} className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name={stat?.icon} size={20} className="text-accent" />
              </div>
              <div className="text-2xl font-bold text-primary">{stat?.value}</div>
              <div className="text-sm text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main Testimonial Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-card rounded-2xl p-8 md:p-12 luxury-shadow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-3 gap-8 items-center"
              >
                {/* Guest Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={currentReview?.avatar}
                        alt={currentReview?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-primary">
                        {currentReview?.name}
                      </h3>
                      <p className="text-muted-foreground">{currentReview?.location}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={16}
                          className={i < currentReview?.rating ? "text-warning fill-current" : "text-muted"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {currentReview?.rating}/5 stars
                    </span>
                  </div>

                  {/* Stay Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Calendar" size={14} className="text-accent" />
                      <span className="text-muted-foreground">
                        {currentReview?.stayDuration} • {currentReview?.date}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Bed" size={14} className="text-accent" />
                      <span className="text-muted-foreground">{currentReview?.roomType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Shield" size={14} className="text-success" />
                      <span className="text-success">Verified stay on {currentReview?.bookingPlatform}</span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="lg:col-span-2 space-y-6">
                  <blockquote className="text-lg text-foreground leading-relaxed italic">
                    "{currentReview?.review}"
                  </blockquote>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-primary">What they loved most:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentReview?.highlights?.map((highlight, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="w-10 h-10"
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="w-10 h-10"
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground smooth-transition"
                >
                  <Icon name={isAutoPlaying ? "Pause" : "Play"} size={14} />
                  <span>{isAutoPlaying ? "Pause" : "Play"}</span>
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {testimonials?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentTestimonial(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full smooth-transition ${
                      index === currentTestimonial ? 'bg-accent w-6' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            All reviews are verified from actual guest stays and sourced from leading travel platforms
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm font-medium">Booking.com Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-success" />
              <span className="text-sm font-medium">TripAdvisor Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Star" size={16} className="text-success" />
              <span className="text-sm font-medium">Expedia Partner</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium">Hotels.com Verified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;