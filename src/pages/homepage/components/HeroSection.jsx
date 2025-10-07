import React, { useState, useEffect } from 'react';
import heroSvg from '/assets/images/undraw_beach-day_cnsv.svg';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onBookingClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const heroSlides = [
    {
      id: 1,
      image: heroSvg,
      title: "Luxury Beach Resort",
      subtitle: "Experience the perfect blend of tropical paradise and modern luxury",
      highlight: "Beach Paradise"
    }
  ];

  useEffect(() => {
    // No autoplay when only one slide
    return () => {};
  }, []);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePrevSlide = () => {};
  const handleNextSlide = () => {};

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white max-w-full">
      {/* Hero Visual - Fade In */}
      <div className="absolute inset-0">
          <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
          >
          <div className="w-full h-full bg-white flex items-center justify-start pl-4 overflow-hidden">
            <Image
              src={heroSlides?.[currentSlide]?.image}
              alt={heroSlides?.[currentSlide]?.title}
              className="max-w-[80%] md:max-w-[60%] h-full object-contain p-6 md:p-8 -mt-2 md:-mt-12 opacity-50 md:opacity-100 pointer-events-none"
              style={{ transform: 'scaleX(-1)' }}
              priority={true}
              loading="eager"
            />
          </div>
          </motion.div>
      </div>
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Brand Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center justify-center space-x-3 mb-8"
            >
              <div className="h-12 w-12 rounded-xl bg-primary ring-2 ring-white/90 shadow-md flex items-center justify-center">
                <Icon name="Mountain" size={28} color="white" />
              </div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground">
                Ivy Resort
              </h1>
            </motion.div>

            {/* Highlight Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20"
            >
              <Icon name="Star" size={16} className="text-secondary" />
              <span className="text-sm font-medium text-secondary">
                {heroSlides?.[currentSlide]?.highlight}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="font-heading text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-tight"
            >
              {heroSlides?.[currentSlide]?.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-lg sm:text-xl text-foreground max-w-2xl mx-auto leading-relaxed bg-background/60 px-6 py-3 rounded-lg border border-secondary/20"
            >
              {heroSlides?.[currentSlide]?.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
            >
              <Button
                variant="default"
                size="lg"
                onClick={onBookingClick}
                iconName="Calendar"
                iconPosition="left"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold btn-hover-glow"
              >
                Book Your Stay
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                iconName="Play"
                iconPosition="left"
                className="border-input text-foreground hover:bg-background/60 px-8 py-4 text-lg font-semibold backdrop-blur-luxury btn-hover-glow"
              >
                Virtual Tour
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Removed slide indicators for single visual */}
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 hidden lg:block"
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium text-foreground bg-background/80 px-3 py-1 rounded-full border border-border">Discover More</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-foreground"
          >
            <Icon name="ChevronDown" size={20} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;