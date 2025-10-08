import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationHighlights = () => {
  const [activeHighlight, setActiveHighlight] = useState(0);

  const locationHighlights = [
  {
    id: 1,
    title: "Lake Kivu Shores",
    description: "Pristine waters perfect for swimming, kayaking, and sunset cruises",
    image: "/assets/images/lake kivu shores.jpg",
    features: ["Swimming", "Water Sports", "Sunset Views", "Boat Tours"],
    distance: "0 km",
    icon: "Waves"
  },
  {
    id: 2,
    title: "Nyungwe Forest",
    description: "Ancient rainforest with canopy walks and diverse wildlife",
    image: "/assets/images/nyungwe park.jpg",
    features: ["Canopy Walk", "Wildlife Viewing", "Hiking Trails", "Bird Watching"],
    distance: "45 km",
    icon: "Trees"
  },
  {
    id: 3,
    title: "Kibuye Town",
    description: "Charming lakeside town with local markets and cultural sites",
    image: "/assets/images/kibuye town.jpg",
    features: ["Local Markets", "Cultural Sites", "Traditional Crafts", "Local Cuisine"],
    distance: "5 km",
    icon: "MapPin"
  },
  {
    id: 4,
    title: "Mountain Trails",
    description: "Scenic hiking paths with breathtaking panoramic views",
    image: "/assets/images/mountain trails.jpg",
    features: ["Hiking Trails", "Mountain Views", "Photography", "Nature Walks"],
    distance: "2 km",
    icon: "Mountain"
  }];


  const nearbyAttractions = [
  {
    name: "Genocide Memorial",
    distance: "8 km",
    type: "Historical Site",
    icon: "Landmark"
  },
  {
    name: "Coffee Plantations",
    distance: "12 km",
    type: "Agricultural Tour",
    icon: "Coffee"
  },
  {
    name: "Hot Springs",
    distance: "15 km",
    type: "Natural Wonder",
    icon: "Droplets"
  },
  {
    name: "Local Artisan Village",
    distance: "6 km",
    type: "Cultural Experience",
    icon: "Palette"
  }];


  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">

          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
            <Icon name="MapPin" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">Prime Location</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Discover Rwanda's Natural Beauty
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nestled on the shores of Lake Kivu, Ivy Resort offers unparalleled access to Rwanda's most spectacular natural attractions and cultural experiences.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Interactive Map Section */}
          <div className="space-y-8">

            <div className="bg-card rounded-2xl p-6 luxury-shadow">
              <h3 className="font-heading text-2xl font-semibold text-primary mb-6">
                Explore Our Surroundings
              </h3>
              
              {/* Custom Google Map */}
              <div className="relative h-80 rounded-xl overflow-hidden mb-6">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="Ivy Resort Location"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5!2d29.2284!3d-1.7041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNDInMTQuOCJTIDI5wrAxMy'42LjIiRQ!5e0!3m2!1sen!2srw!4v1234567890123!5m2!1sen!2srw"
                  className="border-0"
                  allowFullScreen
                  frameBorder="0" />

                
                {/* Custom Overlay */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-luxury rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-primary">Ivy Resort</span>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Icon name="MapPin" size={24} className="text-secondary mx-auto mb-2" />
                  <div className="font-semibold text-primary">Coordinates</div>
                  <div className="text-sm text-muted-foreground">1°42'15"S, 29°13'42"E</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Icon name="Clock" size={24} className="text-secondary mx-auto mb-2" />
                  <div className="font-semibold text-primary">From Kigali</div>
                  <div className="text-sm text-muted-foreground">2.5 hours drive</div>
                </div>
              </div>

              <Button
                variant="outline"
                fullWidth
                iconName="Navigation"
                iconPosition="left"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => window.open('https://www.google.com/maps?q=-1.7041,29.2284', '_blank')}
              >
                Get Directions
              </Button>
            </div>

            {/* Nearby Attractions */}
            <div className="bg-card rounded-2xl p-6 luxury-shadow">
              <h4 className="font-heading text-xl font-semibold text-primary mb-4">
                Nearby Attractions
              </h4>
              
              <div className="space-y-3">
                {nearbyAttractions?.map((attraction, index) =>
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Icon name={attraction?.icon} size={16} className="text-secondary" />
                      </div>
                      <div>
                        <div className="font-medium text-primary">{attraction?.name}</div>
                        <div className="text-sm text-muted-foreground">{attraction?.type}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-secondary">{attraction?.distance}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Highlights Showcase */}
          <div className="space-y-6">

            {/* Active Highlight Display */}
            <div className="bg-card rounded-2xl overflow-hidden luxury-shadow">
              <div className="relative h-64">
                <Image
                  src={locationHighlights?.[activeHighlight]?.image}
                  alt={locationHighlights?.[activeHighlight]?.title}
                  className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-background">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={locationHighlights?.[activeHighlight]?.icon} size={20} />
                    <span className="font-semibold">{locationHighlights?.[activeHighlight]?.title}</span>
                  </div>
                  <div className="text-sm opacity-90">
                    {locationHighlights?.[activeHighlight]?.distance} from resort
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {locationHighlights?.[activeHighlight]?.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {locationHighlights?.[activeHighlight]?.features?.map((feature, index) =>
                  <span
                    key={index}
                    className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">

                      {feature}
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  iconName="ExternalLink"
                  iconPosition="right"
                  className="border-secondary/20 text-secondary hover:bg-secondary/5"
                  onClick={() => {
                    const currentHighlight = locationHighlights[activeHighlight];
                    const searchQuery = encodeURIComponent(`${currentHighlight.title} Rwanda`);
                    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Highlight Navigation */}
            <div className="grid grid-cols-2 gap-3">
              {locationHighlights?.map((highlight, index) =>
              <button
                key={highlight?.id}
                onClick={() => setActiveHighlight(index)}
                className={`p-4 rounded-xl text-left smooth-transition ${
                activeHighlight === index ?
                'bg-accent text-accent-foreground' :
                'bg-card hover:bg-muted/50 text-foreground'}`
                }>

                  <div className="flex items-center space-x-3">
                    <Icon
                    name={highlight?.icon}
                    size={20}
                    className={activeHighlight === index ? 'text-accent-foreground' : 'text-accent'} />

                    <div>
                      <div className="font-medium text-sm">{highlight?.title}</div>
                      <div className={`text-xs ${
                    activeHighlight === index ? 'text-accent-foreground/80' : 'text-muted-foreground'}`
                    }>
                        {highlight?.distance}
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Transportation & Access */}
        <div className="bg-card rounded-2xl p-8 luxury-shadow">

          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
              Getting to Ivy Resort
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple convenient transportation options to reach your lakeside paradise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Car" size={24} className="text-accent" />
              </div>
              <h4 className="font-semibold text-primary">By Car</h4>
              <p className="text-sm text-muted-foreground">
                Scenic drive via RN1 highway with parking available
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-accent hover:bg-accent/10"
                onClick={() => window.open('https://www.google.com/maps/dir/Kigali,+Rwanda/Lake+Kivu,+Rwanda', '_blank')}
              >
                Driving Directions
              </Button>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Bus" size={24} className="text-accent" />
              </div>
              <h4 className="font-semibold text-primary">By Bus</h4>
              <p className="text-sm text-muted-foreground">
                Regular bus service from Kigali to Gisenyi town
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-accent hover:bg-accent/10"
                onClick={() => window.open('https://www.rwandair.com/bus-services', '_blank')}
              >
                Bus Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default LocationHighlights;
