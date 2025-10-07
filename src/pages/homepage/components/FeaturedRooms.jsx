import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { roomsData } from '../../../data/rooms';
import { useCurrency } from '../../../context/CurrencyContext';

const FeaturedRooms = ({ onBookingClick }) => {
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [detailsRoom, setDetailsRoom] = useState(null);

  // Transform shared room data for homepage display
  const roomCategories = roomsData.map(room => ({
    id: room.id,
    name: room.name,
    shortName: room.shortName,
    image: room.images[0], // Use the first image
    priceUSD: room.pricePerNight,
    // Removed original strikethrough price
    features: room.keyAmenities.map(amenity => amenity.name),
    size: `${Math.round(room.size * 0.092903)} m²`, // Convert sq ft to m²
    guests: `${room.maxGuests} Guest${room.maxGuests > 1 ? 's' : ''}`,
    description: room.description,
    amenities: room.allAmenities.map(amenity => amenity.name)
  }));

  const PriceBadge = ({ priceUSD }) => {
    const { currency, convert } = useCurrency();
    const currencySymbols = { USD: '$', EUR: '€', RWF: 'RWF', KES: 'KES' };
    const symbol = currencySymbols?.[currency] || '$';
    const price = convert(priceUSD, 'USD', currency) || 0;
    return (
      <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full">
        <div className="flex items-center space-x-1">
          <span className="text-sm font-semibold">{symbol} {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(price)}</span>
        </div>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
            <Icon name="Bed" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-secondary">Premium Accommodations</span>
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Discover Your Perfect Room
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Each thoughtfully designed accommodation offers stunning views, modern amenities, and the comfort you deserve for an unforgettable Lake Kivu experience.
          </p>
        </motion.div>

        {/* Room Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {roomCategories?.map((room) => (
            <motion.div
              key={room?.id}
              variants={cardVariants}
              onMouseEnter={() => setHoveredRoom(room?.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className="group bg-card rounded-2xl overflow-hidden luxury-shadow hover:luxury-shadow-hover smooth-transition cursor-pointer flex flex-col h-full card-hover"
            >
              {/* Room Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={room?.image}
                  alt={room?.name}
                  className="w-full h-full object-cover group-hover:scale-110 smooth-transition-slow"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                
                {/* Price Badge */}
                <PriceBadge priceUSD={room.priceUSD} />

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-primary/60 flex items-center justify-center smooth-transition ${
                  hoveredRoom === room?.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={onBookingClick}
                    iconName="Calendar"
                    iconPosition="left"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-primary mb-2 group-hover:text-accent smooth-transition">
                      {room?.shortName}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {room?.description}
                    </p>
                  </div>
                </div>

                {/* Room Info */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Maximize" size={14} />
                    <span>{room?.size}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={14} />
                    <span>{room?.guests}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room?.features?.slice(0, 3)?.map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    iconName="Eye"
                    iconPosition="left"
                    className="text-secondary border-secondary/30 hover:bg-secondary/5 hover:text-secondary"
                    onClick={() => setDetailsRoom(room)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    fullWidth
                    onClick={onBookingClick}
                    iconName="Calendar"
                    iconPosition="left"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Book
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Details Modal */}
        {detailsRoom && (
          <div className="fixed inset-0 z-200 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card text-card-foreground rounded-2xl max-w-2xl w-full overflow-hidden luxury-shadow">
              <div className="relative h-56 bg-muted">
                <Image src={detailsRoom?.image} alt={detailsRoom?.name} className="w-full h-full object-cover" sizes="(min-width: 1024px) 640px, 100vw" />
                <button
                  onClick={() => setDetailsRoom(null)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 text-foreground flex items-center justify-center hover:bg-background"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-2xl font-semibold">{detailsRoom?.name || detailsRoom?.shortName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center space-x-1"><Icon name="Maximize" size={14} /><span>{detailsRoom?.size}</span></span>
                      <span className="flex items-center space-x-1"><Icon name="Users" size={14} /><span>{detailsRoom?.guests}</span></span>
                    </div>
                  </div>
                  {detailsRoom?.price && (
                    <div className="text-right">
                      <div className="text-xl font-heading font-bold text-foreground">{detailsRoom?.price}</div>
                      {detailsRoom?.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through">{detailsRoom?.originalPrice}</div>
                      )}
                    </div>
                  )}
                </div>

                {detailsRoom?.description && (
                  <p className="text-muted-foreground mb-4 leading-relaxed">{detailsRoom?.description}</p>
                )}

                {detailsRoom?.features && detailsRoom?.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {detailsRoom?.features?.slice(0, 8)?.map((f, i) => (
                        <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3">
                  <Button variant="outline" onClick={() => setDetailsRoom(null)} className="hover:!bg-accent/5 hover:!text-accent">Close</Button>
                  <Button variant="default" iconName="Calendar" onClick={onBookingClick} className="bg-accent hover:bg-accent/90 text-accent-foreground">Book</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View All Rooms CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={onBookingClick}
            iconName="ArrowRight"
            iconPosition="right"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8"
          >
            Explore All Accommodations
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRooms;