import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationMap = ({ className = '' }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const resortLocation = {
    lat: -1.7041,
    lng: 29.2284,
    name: 'Ivy Resort',
    address: 'Lake Kivu Shores, Gisenyi District, Western Province, Rwanda'
  };

  const nearbyAttractions = [
    {
      name: 'Lake Kivu Beach',
      distance: '0.2 km',
      description: 'Private beach access with water sports'
    },
    {
      name: 'Gisenyi Hot Springs',
      distance: '3.5 km',
      description: 'Natural thermal springs and spa treatments'
    },
    {
      name: 'Nyiragongo Volcano View',
      distance: '15 km',
      description: 'Scenic viewpoint of the active volcano'
    },
    {
      name: 'Rubavu Market',
      distance: '5.2 km',
      description: 'Local crafts and fresh produce market'
    }
  ];

  const transportOptions = [
    {
      icon: 'Plane',
      title: 'Kigali International Airport',
      distance: '160 km (2.5 hours drive)',
      description: 'Airport transfer service available'
    },
    {
      icon: 'Car',
      title: 'Private Vehicle',
      distance: 'Parking available on-site',
      description: 'Complimentary valet parking'
    },
    {
      icon: 'Bus',
      title: 'Public Transport',
      distance: 'Bus station 2 km away',
      description: 'Shuttle service to/from station'
    }
  ];

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${resortLocation?.lat},${resortLocation?.lng}`;
    window.open(url, '_blank');
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Interactive Map */}
      <div className="bg-card rounded-2xl overflow-hidden luxury-shadow">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                Our Location
              </h2>
              <p className="text-muted-foreground">
                Nestled on the shores of Lake Kivu in Rwanda's Western Province
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleGetDirections}
              iconName="Navigation"
              iconPosition="left"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Get Directions
            </Button>
          </div>
        </div>

        <div className="relative h-96 bg-muted">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                <p className="text-muted-foreground text-sm">Loading map...</p>
              </div>
            </div>
          )}
          
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Ivy Resort Location"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${resortLocation?.lat},${resortLocation?.lng}&z=14&output=embed`}
            onLoad={handleMapLoad}
            className="border-0"
          />

          {/* Map Overlay Info */}
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-luxury rounded-lg p-4 luxury-shadow max-w-xs">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="MapPin" size={20} color="white" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{resortLocation?.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {resortLocation?.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Nearby Attractions */}
      <div className="bg-card rounded-xl p-6 luxury-shadow">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
          Nearby Attractions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyAttractions?.map((attraction, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:border-accent/50 smooth-transition">
              <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="MapPin" size={16} className="text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">{attraction?.name}</h4>
                  <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded">
                    {attraction?.distance}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{attraction?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Transportation Options */}
      <div className="bg-card rounded-xl p-6 luxury-shadow">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
          How to Reach Us
        </h3>
        <div className="space-y-4">
          {transportOptions?.map((transport, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
              <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={transport?.icon} size={20} className="text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{transport?.title}</h4>
                <p className="text-sm text-muted-foreground mb-1">{transport?.distance}</p>
                <p className="text-xs text-muted-foreground">{transport?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Location Highlights */}
      <div className="bg-gradient-to-r from-accent/5 to-secondary/5 rounded-xl p-6 border border-accent/20">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
          Why Our Location is Special
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Icon name="Waves" size={16} className="text-accent" />
              <span className="text-sm text-foreground">Direct lakefront access</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="Mountain" size={16} className="text-accent" />
              <span className="text-sm text-foreground">Panoramic mountain views</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="Sunrise" size={16} className="text-accent" />
              <span className="text-sm text-foreground">Spectacular sunrise & sunset</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Icon name="Trees" size={16} className="text-accent" />
              <span className="text-sm text-foreground">Pristine natural environment</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="Thermometer" size={16} className="text-accent" />
              <span className="text-sm text-foreground">Perfect year-round climate</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={16} className="text-accent" />
              <span className="text-sm text-foreground">Safe & secure location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;