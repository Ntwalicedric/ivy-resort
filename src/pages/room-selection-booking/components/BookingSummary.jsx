import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useCurrency } from '../../../context/CurrencyContext';

const BookingSummary = ({ 
  selectedRoom, 
  selectedDates, 
  guestCount, 
  onModifyBooking,
  className = '' 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateNights = () => {
    if (!selectedDates?.checkIn || !selectedDates?.checkOut) return 1;
    const checkIn = new Date(selectedDates.checkIn);
    const checkOut = new Date(selectedDates.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const { currency, setCurrency, convert, loading } = useCurrency();

  const currencySymbols = { USD: '$', EUR: '€', RWF: 'RWF', KES: 'KES' };
  const formatPrice = (price) => {
    const symbol = currencySymbols?.[currency] || '$';
    const value = convert(price, 'USD', currency) || 0;
    const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
    return `${symbol} ${formatted}`;
  };

  if (!selectedRoom) {
    return (
      <div className={`bg-card rounded-xl luxury-shadow p-6 ${className}`}>
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
            No Room Selected
          </h3>
          <p className="text-muted-foreground text-sm">
            Choose a room to see your booking summary
          </p>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const subtotal = selectedRoom?.pricePerNight * nights;
  const total = subtotal;

  return (
    <div className={`bg-card rounded-xl luxury-shadow overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-accent/5 px-6 py-4 border-b border-border">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Booking Summary
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {/* Currency Selector */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Currency</div>
          <div className="w-40">
            <Select
              value={currency}
              onChange={setCurrency}
              options={[
                { value: 'USD', label: 'USD — US Dollar' },
                { value: 'RWF', label: 'RWF — Rwandan Franc' },
              ]}
            />
          </div>
        </div>
        {/* Room Details */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={selectedRoom?.images?.[0]}
                alt={selectedRoom?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">
                {selectedRoom?.name}
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span>Up to {selectedRoom?.maxGuests} guests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Maximize" size={12} />
                  <span>{selectedRoom?.size} sq ft</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dates & Guests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-accent" />
              <span className="font-medium text-foreground">Check-in</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-foreground">
                {formatDate(selectedDates?.checkIn)}
              </div>
              <div className="text-xs text-muted-foreground">After 3:00 PM</div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-accent" />
              <span className="font-medium text-foreground">Check-out</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-foreground">
                {formatDate(selectedDates?.checkOut)}
              </div>
              <div className="text-xs text-muted-foreground">Before 11:00 AM</div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-accent" />
              <span className="font-medium text-foreground">Guests</span>
            </div>
            <div className="font-medium text-foreground">
              {guestCount} guest{guestCount > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {formatPrice(selectedRoom?.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}
            </span>
            <span className="font-medium text-foreground">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Taxes & fees removed */}

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-foreground">
                Total
              </span>
              <span className="font-heading text-xl font-bold text-foreground">
                {formatPrice(total)}
                {loading && <span className="text-xs text-muted-foreground ml-2">Updating rates…</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h5 className="font-medium text-foreground text-sm">Important Policies</h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-start space-x-2">
              <Icon name="Clock" size={12} className="mt-0.5 flex-shrink-0" />
              <span>Free cancellation until 24 hours before check-in</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="CreditCard" size={12} className="mt-0.5 flex-shrink-0" />
              <span>Payment will be processed upon confirmation</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={12} className="mt-0.5 flex-shrink-0" />
              <span>Your booking is protected by our guarantee</span>
            </div>
          </div>
        </div>

        {/* Modify Button */}
        {onModifyBooking && (
          <Button
            variant="outline"
            fullWidth
            onClick={onModifyBooking}
            iconName="Edit"
            iconPosition="left"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            Modify Booking Details
          </Button>
        )}

        {/* Contact Support */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Need help with your booking?
          </p>
          <Button
            variant="ghost"
            size="sm"
            iconName="Phone"
            iconPosition="left"
            className="text-accent hover:text-accent/80"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;