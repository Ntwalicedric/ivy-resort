import React from 'react';
import heroSvg from '/assets/images/undraw_beach-day_cnsv.svg';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = ({ onBookingClick }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-white max-w-full">
      {/* Hero Visual */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-white flex items-center justify-start pl-4 overflow-hidden">
            <Image
              src={heroSvg}
              alt="Luxury Beach Resort"
              className="max-w-[80%] md:max-w-[60%] h-full object-contain p-6 md:p-8 -mt-2 md:-mt-12 opacity-50 md:opacity-100 pointer-events-none"
              style={{ transform: 'scaleX(-1)' }}
              priority={true}
              loading="eager"
            />
          </div>
        </div>
      </div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Brand Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary ring-2 ring-white/90 shadow-md flex items-center justify-center">
                <Icon name="Mountain" size={28} color="white" />
              </div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground">
                Ivy Resort
              </h1>
            </div>

            {/* Highlight Badge */}
            <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
              <Icon name="Star" size={16} className="text-secondary" />
              <span className="text-sm font-medium text-secondary">
                Beach Paradise
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-foreground/90 mb-4">
              Luxury Beach Resort
            </h2>
            
            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Experience the perfect blend of tropical paradise and modern luxury
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onBookingClick}
                variant="primary"
                size="lg"
                className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Icon name="Calendar" size={20} className="mr-2" />
                Book Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-2 hover:bg-foreground/5 transition-all duration-300"
              >
                <Icon name="Play" size={20} className="mr-2" />
                Watch Video
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2 text-foreground/60">
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-foreground/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;