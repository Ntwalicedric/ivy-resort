import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useCurrency } from '../../../context/CurrencyContext';

const BookingSuccess = ({ bookingData, onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { currency, convert } = useCurrency();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmountByCurrency = (amountUSD) => {
    const converted = convert?.(amountUSD, 'USD', currency) || amountUSD;
    const isRWF = currency === 'RWF';
    return new Intl.NumberFormat(isRWF ? 'en-RW' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: isRWF ? 0 : 2,
      maximumFractionDigits: isRWF ? 0 : 2,
    })?.format(converted);
  };

  const handleDownloadConfirmation = () => {
    // Create a simple text-based confirmation
    const confirmationText = `
BOOKING CONFIRMATION - IVY RESORT

Reservation ID: ${bookingData?.reservationId}
Guest Name: ${bookingData?.guestDetails?.firstName} ${bookingData?.guestDetails?.lastName}
Email: ${bookingData?.guestDetails?.email}
Phone: ${bookingData?.guestDetails?.phone}

ACCOMMODATION DETAILS:
Room: ${bookingData?.room?.name}
Check-in: ${formatDate(bookingData?.dates?.checkIn)}
Check-out: ${formatDate(bookingData?.dates?.checkOut)}
Guests: ${bookingData?.guests}

PAYMENT SUMMARY:
Amount to be Paid: ${formatAmountByCurrency(bookingData?.totalAmount)}
Status: ${bookingData?.status?.toUpperCase()}
Booking Date: ${new Date(bookingData.bookingDate)?.toLocaleString()}

Thank you for choosing Ivy Resort!
    `;

    const blob = new Blob([confirmationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ivy-resort-confirmation-${bookingData?.reservationId}.txt`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailConfirmation = () => {
    const subject = `Booking Confirmation - ${bookingData?.confirmationId || bookingData?.reservationId}`;
    const body = `Dear ${bookingData?.guestDetails?.firstName},\n\nYour booking at Ivy Resort has been confirmed!\n\nConfirmation ID: ${bookingData?.confirmationId || bookingData?.reservationId}\nRoom: ${bookingData?.room?.name}\nCheck-in: ${formatDate(bookingData?.dates?.checkIn)}\nCheck-out: ${formatDate(bookingData?.dates?.checkOut)}\n\nWe look forward to welcoming you!`;
    
    window.location.href = `mailto:${bookingData?.guestDetails?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-300 flex items-center justify-center p-4">
      <div className={`bg-background rounded-2xl luxury-shadow-hover max-w-2xl w-full max-h-[90vh] overflow-y-auto smooth-transition ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Success Header */}
        <div className="text-center p-8 bg-gradient-to-br from-success/10 to-accent/10 rounded-t-2xl">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Check" size={40} color="white" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground text-lg">
            Your reservation has been successfully processed
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Email Confirmation Notice */}
          {bookingData?.emailResult && (
            <div className={`rounded-xl p-4 border ${
              bookingData?.emailResult?.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start space-x-3">
                <Icon 
                  name={bookingData?.emailResult?.success ? "CheckCircle" : "AlertCircle"} 
                  size={20} 
                  className={`mt-0.5 ${
                    bookingData?.emailResult?.success ? 'text-green-600' : 'text-yellow-600'
                  }`} 
                />
                <div>
                  <h4 className={`font-medium mb-1 ${
                    bookingData?.emailResult?.success ? 'text-green-900' : 'text-yellow-900'
                  }`}>
                    {bookingData?.emailResult?.success ? 'Confirmation Email Sent!' : 'Email Confirmation Pending'}
                  </h4>
                  <p className={`text-sm ${
                    bookingData?.emailResult?.success ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {bookingData?.emailResult?.message || 'A confirmation email will be sent to your email address shortly.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reservation Details */}
          <div className="bg-accent/5 rounded-xl p-6 border border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Reservation Details
              </h3>
              <div className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium">
                Confirmed
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Confirmation ID</div>
                <div className="font-mono text-lg font-bold text-foreground">
                  {bookingData?.confirmationId || bookingData?.reservationId}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email Status</div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  bookingData?.emailSent 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <Icon name="Mail" size={12} className="mr-1" />
                  {bookingData?.emailSent ? 'Sent' : 'Pending'}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Booking Date</div>
                <div className="font-medium text-foreground">
                  {new Date(bookingData.bookingDate)?.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-foreground">
              Guest Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Icon name="User" size={16} className="text-accent" />
                <div>
                  <div className="font-medium text-foreground">
                    {bookingData?.guestDetails?.firstName} {bookingData?.guestDetails?.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">Primary Guest</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={16} className="text-accent" />
                <div>
                  <div className="font-medium text-foreground">
                    {bookingData?.guestDetails?.email}
                  </div>
                  <div className="text-sm text-muted-foreground">Email Address</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={16} className="text-accent" />
                <div>
                  <div className="font-medium text-foreground">
                    {bookingData?.guestDetails?.phone}
                  </div>
                  <div className="text-sm text-muted-foreground">Phone Number</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Users" size={16} className="text-accent" />
                <div>
                  <div className="font-medium text-foreground">
                    {bookingData?.guests} Guest{bookingData?.guests > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Guests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Accommodation Details */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-foreground">
              Accommodation Details
            </h4>
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={bookingData?.room?.images?.[0]}
                    alt={bookingData?.room?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-foreground mb-2">
                    {bookingData?.room?.name}
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Check-in</div>
                      <div className="font-medium text-foreground">
                        {formatDate(bookingData?.dates?.checkIn)}
                      </div>
                      <div className="text-xs text-muted-foreground">After 3:00 PM</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Check-out</div>
                      <div className="font-medium text-foreground">
                        {formatDate(bookingData?.dates?.checkOut)}
                      </div>
                      <div className="text-xs text-muted-foreground">Before 11:00 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-heading text-lg font-semibold text-foreground mb-3">
              Payment Summary
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount to be Paid</span>
              <span className="font-heading text-xl font-bold text-foreground">
                {formatAmountByCurrency(bookingData?.totalAmount)}
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span>What's Next?</span>
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <Icon name="Mail" size={12} className="mt-1 text-accent flex-shrink-0" />
                <span>A confirmation email has been sent to your email address. Please check your inbox and spam folder.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Icon name="IdCard" size={12} className="mt-1 text-accent flex-shrink-0" />
                <span>Show your confirmation email with the booking ID at check-in for faster service.</span>
              </li>
              <li className="flex items-start space-x-2">
                <Icon name="MapPin" size={12} className="mt-1 text-accent flex-shrink-0" />
                <span>Check-in is available from 3:00 PM at the resort reception. We look forward to welcoming you.</span>
              </li>
            </ul>
          </div>

          

          {/* Close Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              fullWidth
              onClick={() => navigate('/homepage')}
              iconName="Home"
              iconPosition="left"
              className="bg-accent hover:bg-accent/90"
            >
              Return to Homepage
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
              iconName="X"
              iconPosition="left"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;