import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMapSection = () => {
  const [selectedTransport, setSelectedTransport] = useState('car');
  const [mapView, setMapView] = useState('satellite');

  const transportOptions = [
    {
      id: 'car',
      name: 'Private Car',
      duration: '3.5 hours',
      distance: '120 km',
      icon: 'Car',
      description: 'Scenic drive through Rwanda\'s rolling hills and countryside'
    },
    {
      id: 'helicopter',
      name: 'Helicopter',
      duration: '45 minutes',
      distance: '95 km',
      icon: 'Plane',
      description: 'Breathtaking aerial views of Lake Kivu and mountains'
    },
    {
      id: 'bus',
      name: 'Public Bus',
      duration: '4 hours',
      distance: '120 km',
      icon: 'Bus',
      description: 'Comfortable public transport with scenic views'
    }
  ];

  const nearbyPOIs = [
    {
      name: 'Ivy Resort',
      type: 'resort',
      coordinates: { lat: -1.6792, lng: 29.2584 },
      icon: 'MapPin',
      color: 'text-accent'
    },
    {
      name: 'Kigali International Airport',
      type: 'airport',
      coordinates: { lat: -1.9686, lng: 30.1394 },
      icon: 'Plane',
      color: 'text-primary'
    },
    {
      name: 'Volcanoes National Park',
      type: 'attraction',
      coordinates: { lat: -1.4826, lng: 29.5264 },
      icon: 'Mountain',
      color: 'text-success'
    },
    {
      name: 'Gisenyi Hot Springs',
      type: 'attraction',
      coordinates: { lat: -1.7025, lng: 29.2562 },
      icon: 'Droplets',
      color: 'text-warning'
    },
    {
      name: 'Local Coffee Plantation',
      type: 'attraction',
      coordinates: { lat: -1.6892, lng: 29.2684 },
      icon: 'Coffee',
      color: 'text-secondary'
    }
  ];

  const mapViewOptions = [
    { id: 'satellite', name: 'Satellite', icon: 'Satellite' },
    { id: 'terrain', name: 'Terrain', icon: 'Mountain' },
    { id: 'roadmap', name: 'Roads', icon: 'Map' }
  ];

  // Resort coordinates for Google Maps embed
  const resortLat = -1.6792;
  const resortLng = 29.2584;
  
  // Generate map source URL based on selected view
  const getMapSrc = (view) => {
    const baseUrl = `https://www.google.com/maps?q=${resortLat},${resortLng}&z=14&output=embed`;
    switch (view) {
      case 'satellite':
        return `${baseUrl}&t=k`; // Satellite view
      case 'terrain':
        return `${baseUrl}&t=p`; // Terrain view
      case 'roadmap':
        return `${baseUrl}&t=m`; // Road map view
      default:
        return baseUrl;
    }
  };
  
  const mapSrc = getMapSrc(mapView);

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
            Location & Accessibility
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our prime location on Lake Kivu's shores and explore the various ways 
            to reach our resort from Kigali and other major destinations.
          </p>
        </motion.div>

        {/* Map and Details Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Map Controls */}
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-semibold text-primary">
                Interactive Map
              </h3>
              <div className="flex items-center space-x-2">
                {mapViewOptions?.map((option) => (
                  <button
                    key={option?.id}
                    onClick={() => setMapView(option?.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm smooth-transition ${
                      mapView === option?.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={option?.icon} size={14} />
                    <span>{option?.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="relative w-full h-96 rounded-xl overflow-hidden luxury-shadow">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Ivy Resort Location"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapSrc}
                className="border-0"
              />
              
              {/* Custom Overlay with POIs */}
              <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-primary text-sm">Nearby Points</h4>
                {nearbyPOIs?.slice(0, 3)?.map((poi) => (
                  <div key={poi?.name} className="flex items-center space-x-2">
                    <Icon name={poi?.icon} size={12} className={poi?.color} />
                    <span className="text-xs text-foreground">{poi?.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Legend */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {nearbyPOIs?.map((poi) => (
                <div key={poi?.name} className="flex items-center space-x-2 text-sm">
                  <Icon name={poi?.icon} size={16} className={poi?.color} />
                  <span className="text-muted-foreground truncate">{poi?.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Location Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Address Information */}
            <div className="bg-card p-6 rounded-xl luxury-shadow">
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Resort Address
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Icon name="MapPin" size={20} className="text-accent mt-0.5" />
                  <div>
                    <p className="text-foreground font-medium">Ivy Resort Rwanda</p>
                    <p className="text-muted-foreground">Lake Kivu Shoreline</p>
                    <p className="text-muted-foreground">Rubavu District, Western Province</p>
                    <p className="text-muted-foreground">Rwanda, East Africa</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Icon name="Globe" size={20} className="text-accent" />
                  <div>
                    <p className="text-foreground font-medium">Coordinates</p>
                    <p className="text-muted-foreground font-mono text-sm">
                      {resortLat}°S, {resortLng}°E
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation Options */}
            <div className="bg-card p-6 rounded-xl luxury-shadow">
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Transportation from Kigali
              </h3>
              
              <div className="space-y-4">
                {transportOptions?.map((option) => (
                  <button
                    key={option?.id}
                    onClick={() => setSelectedTransport(option?.id)}
                    className={`w-full p-4 rounded-lg border-2 smooth-transition text-left ${
                      selectedTransport === option?.id
                        ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        selectedTransport === option?.id ? 'bg-accent text-accent-foreground' : 'bg-muted'
                      }`}>
                        <Icon name={option?.icon} size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-primary">{option?.name}</h4>
                          <span className="text-accent font-medium">{option?.duration}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">{option?.description}</p>
                        <p className="text-muted-foreground text-xs mt-1">{option?.distance}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                fullWidth
                iconName="Navigation"
                iconPosition="left"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={() => window.open('https://maps.google.com/?q=Ivy+Resort+Rwanda+Lake+Kivu', '_blank')}
              >
                Get Directions
              </Button>
              <Button
                variant="default"
                fullWidth
                iconName="Phone"
                iconPosition="left"
                className="bg-accent hover:bg-accent/90"
                onClick={() => window.open('tel:+250787061278', '_self')}
              >
                Call Resort
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Distance Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 luxury-shadow"
        >
          <h3 className="font-heading text-2xl font-semibold text-primary text-center mb-8">
            Distance to Major Destinations
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <Icon name="Plane" size={24} className="text-accent mx-auto" />
              <h4 className="font-medium text-primary">Kigali Airport</h4>
              <p className="text-2xl font-bold text-accent">3.5 hrs</p>
              <p className="text-sm text-muted-foreground">120 km drive</p>
            </div>
            
            <div className="text-center space-y-2">
              <Icon name="Building" size={24} className="text-accent mx-auto" />
              <h4 className="font-medium text-primary">Kigali City</h4>
              <p className="text-2xl font-bold text-accent">3.5 hrs</p>
              <p className="text-sm text-muted-foreground">120 km drive</p>
            </div>
            
            <div className="text-center space-y-2">
              <Icon name="Mountain" size={24} className="text-accent mx-auto" />
              <h4 className="font-medium text-primary">Volcanoes Park</h4>
              <p className="text-2xl font-bold text-accent">2 hours</p>
              <p className="text-sm text-muted-foreground">85 km drive</p>
            </div>
            
            <div className="text-center space-y-2">
              <Icon name="TreePine" size={24} className="text-accent mx-auto" />
              <h4 className="font-medium text-primary">Nyungwe Forest</h4>
              <p className="text-2xl font-bold text-accent">3 hours</p>
              <p className="text-sm text-muted-foreground">120 km drive</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveMapSection;