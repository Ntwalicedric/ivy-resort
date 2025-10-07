import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useCurrency } from '../../../context/CurrencyContext';

const RoomCard = ({ 
  room, 
  selectedDates, 
  guestCount, 
  onSelectRoom, 
  isSelected = false 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === room?.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? room?.images?.length - 1 : prev - 1
    );
  };

  const { currency, convert } = useCurrency();
  const currencySymbols = { USD: '$', EUR: '€', RWF: 'RWF', KES: 'KES' };
  const formatPrice = (priceUSD) => {
    const symbol = currencySymbols?.[currency] || '$';
    const value = convert(priceUSD, 'USD', currency) || 0;
    return `${symbol} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)}`;
  };

  const calculateNights = () => {
    if (!selectedDates?.checkIn || !selectedDates?.checkOut) return 1;
    const checkIn = new Date(selectedDates.checkIn);
    const checkOut = new Date(selectedDates.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const totalPrice = room?.pricePerNight * calculateNights();

  return (
    <div className={`bg-card rounded-xl luxury-shadow smooth-transition ${
      isSelected ? 'ring-2 ring-accent border-accent/20' : 'border border-border'
    } overflow-hidden`}>
      {/* Image Gallery */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={room?.images?.[currentImageIndex]}
          alt={`${room?.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {room?.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background smooth-transition"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background smooth-transition"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {room?.images?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full smooth-transition ${
                    index === currentImageIndex ? 'bg-accent' : 'bg-background/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Room Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            room?.available 
              ? 'bg-success/20 text-success border border-success/30' :'bg-error/20 text-error border border-error/30'
          }`}>
            {room?.available ? 'Available' : 'Fully Booked'}
          </span>
        </div>

        {/* Popular Badge */}
        {room?.isPopular && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning border border-warning/30">
              Most Popular
            </span>
          </div>
        )}
      </div>
      {/* Room Details */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
              {room?.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} />
                <span>Up to {room?.maxGuests} guests</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Maximize" size={14} />
                <span>{room?.size} sq ft</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-heading font-bold text-foreground">
              {formatPrice(room?.pricePerNight)}
            </div>
            <div className="text-sm text-muted-foreground">per night</div>
          </div>
        </div>

        {/* Key Amenities */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {room?.keyAmenities?.slice(0, 4)?.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-foreground">
              <Icon name={amenity?.icon} size={14} className="text-accent" />
              <span>{amenity?.name}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {isExpanded ? room?.description : `${room?.description?.substring(0, 120)}...`}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent hover:text-accent/80 ml-1 font-medium"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        </p>

        {/* All Amenities (Expanded) */}
        {isExpanded && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-3">All Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {room?.allAmenities?.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-foreground">
                  <Icon name={amenity?.icon} size={12} className="text-accent" />
                  <span>{amenity?.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="bg-muted/30 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-muted-foreground">
              {formatPrice(room?.pricePerNight)} × {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
            </span>
            <span className="font-medium text-foreground">
              {formatPrice(totalPrice)}
            </span>
          </div>
          {/* Taxes & fees removed */}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Total</span>
              <span className="font-heading text-lg font-bold text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant={isSelected ? "default" : "outline"}
          fullWidth
          disabled={!room?.available}
          onClick={() => onSelectRoom(room)}
          iconName={isSelected ? "Check" : "Calendar"}
          iconPosition="left"
          className={isSelected ? "bg-accent hover:bg-accent/90" : "border-accent text-accent hover:bg-accent hover:text-accent-foreground"}
        >
          {isSelected ? 'Selected' : room?.available ? 'Select Room' : 'Unavailable'}
        </Button>

        {/* Special offers removed */}
      </div>
    </div>
  );
};

export default RoomCard;