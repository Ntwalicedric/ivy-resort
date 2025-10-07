import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Select from './Select';
import Input from './Input';
import Icon from '../AppIcon';
import { getRoomOptions } from '../../data/rooms';

const BookingWidget = ({ 
  variant = 'floating', // 'floating', 'inline', 'hero'
  className = '' 
}) => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: ''
  });
  const [isVisible, setIsVisible] = useState(true);

  const roomOptions = getRoomOptions();

  const guestOptions = [
    { value: '1', label: '1 Guest' },
    { value: '2', label: '2 Guests' },
    { value: '3', label: '3 Guests' },
    { value: '4', label: '4 Guests' },
    { value: '5', label: '5+ Guests' }
  ];

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookingSubmit = (e) => {
    e?.preventDefault();
    // Store booking data in sessionStorage for the booking page
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/room-selection-booking');
  };

  const isFormValid = bookingData?.checkIn && bookingData?.checkOut && bookingData?.guests;

  const getVariantClasses = () => {
    switch (variant) {
      case 'hero':
        return 'w-full max-w-4xl mx-auto bg-background/95 backdrop-blur-luxury luxury-shadow rounded-2xl p-6 lg:p-8';
      case 'inline':
        return 'w-full bg-card rounded-xl p-6 luxury-shadow';
      case 'floating':
      default:
        return 'fixed top-1/2 right-6 transform -translate-y-1/2 w-80 bg-background luxury-shadow-hover rounded-xl p-4 z-150 hidden lg:block';
    }
  };

  // Show floating button when widget is hidden
  if (variant === 'floating' && !isVisible) {
    return (
      <Button
        variant="default"
        size="icon"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground z-150 shadow-lg"
      >
        <Icon name="Calendar" size={20} />
      </Button>
    );
  }

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      <form onSubmit={handleBookingSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={20} className="text-accent" />
            <h3 className="font-heading text-lg font-semibold text-primary">
              {variant === 'hero' ? 'Find Your Perfect Stay' : 'Quick Booking'}
            </h3>
          </div>
          {variant === 'floating' && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>

        {/* Form Fields */}
        <div className={`grid gap-4 ${variant === 'hero' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Check-in Date */}
          <Input
            type="date"
            label="Check-in"
            value={bookingData?.checkIn}
            onChange={(e) => handleInputChange('checkIn', e?.target?.value)}
            onFocus={(e) => { if (e?.target?.showPicker) { try { e.target.showPicker(); } catch {} } }}
            onMouseDown={(e) => { const t=e.target; if (t?.showPicker) { e.preventDefault(); try { t.showPicker(); } catch {} } }}
            min={new Date()?.toISOString()?.split('T')?.[0]}
            required
            className="w-full"
          />

          {/* Check-out Date */}
          <Input
            type="date"
            label="Check-out"
            value={bookingData?.checkOut}
            onChange={(e) => handleInputChange('checkOut', e?.target?.value)}
            onFocus={(e) => { if (e?.target?.showPicker) { try { e.target.showPicker(); } catch {} } }}
            onMouseDown={(e) => { const t=e.target; if (t?.showPicker) { e.preventDefault(); try { t.showPicker(); } catch {} } }}
            min={bookingData?.checkIn || new Date()?.toISOString()?.split('T')?.[0]}
            required
            className="w-full"
          />

          {/* Guests */}
          <Select
            label="Guests"
            options={guestOptions}
            value={bookingData?.guests}
            onChange={(value) => handleInputChange('guests', value)}
            required
            className="w-full"
          />

          {/* Room Type (Optional) */}
          <Select
            label="Room Preference"
            description="Optional - browse all options on booking page"
            options={roomOptions}
            value={bookingData?.roomType}
            onChange={(value) => handleInputChange('roomType', value)}
            className="w-full"
          />
        </div>

        {/* Availability Check */}
        {variant === 'hero' && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span>Real-time availability • Best rate guarantee</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size={variant === 'hero' ? 'lg' : 'default'}
          fullWidth
          disabled={!isFormValid}
          iconName="Search"
          iconPosition="left"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {variant === 'hero' ? 'Check Availability' : 'Book Now'}
        </Button>

        {/* Additional Info */}
        {variant !== 'floating' && (
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>Secure booking</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Instant confirmation</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Phone" size={12} />
              <span>24/7 support</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingWidget;