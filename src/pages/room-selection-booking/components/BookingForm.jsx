import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useDatabase } from '../../../context/DatabaseContext';
import { useCurrency } from '../../../context/CurrencyContext';

const BookingForm = ({ 
  selectedRoom, 
  selectedDates, 
  guestCount, 
  onBookingComplete,
  onClose 
}) => {
  const { createReservation } = useDatabase();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Guest Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    
    // Special Requests
    specialRequests: '',
    arrivalTime: '',
    
    // Preferences
    newsletter: false,
    terms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currency, convert } = useCurrency();

  const countryOptions = [
    { value: '', label: 'Select Country' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'rw', label: 'Rwanda' },
    { value: 'ke', label: 'Kenya' },
    { value: 'tz', label: 'Tanzania' },
    { value: 'ug', label: 'Uganda' }
  ];

  const arrivalTimeOptions = [
    { value: '', label: 'Select Arrival Time' },
    { value: 'morning', label: 'Morning (8:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon (12:00 PM - 6:00 PM)' },
    { value: 'evening', label: 'Evening (6:00 PM - 10:00 PM)' },
    { value: 'late', label: 'Late Night (After 10:00 PM)' }
  ];

  // Removed demo auto-fill so inputs show placeholders by default

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
      if (!formData?.email?.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Invalid email format';
      if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
      if (!formData?.country) newErrors.country = 'Country is required';
    }
    
    if (step === 3) {
      if (!formData?.terms) newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const generateReservationId = () => {
    const timestamp = Date.now()?.toString(36);
    const random = Math.random()?.toString(36)?.substr(2, 5);
    return `IVY-${timestamp}-${random}`?.toUpperCase();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    
    try {
      const nights = calculateNights();
      const totalUSD = selectedRoom.pricePerNight * nights;
      const amountInSelectedCurrency = convert?.(totalUSD, 'USD', currency) || totalUSD;
      const isRWF = currency === 'RWF';
      const formattedAmountSelected = new Intl.NumberFormat(isRWF ? 'en-RW' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: isRWF ? 0 : 2,
        maximumFractionDigits: isRWF ? 0 : 2,
      })?.format(amountInSelectedCurrency);
      
      // Prepare reservation data for API
      const reservationData = {
        guestName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        roomNumber: `${selectedRoom.id}01`, // Generate room number
        roomType: selectedRoom.shortName,
        roomName: selectedRoom.name,
        checkIn: selectedDates.checkIn,
        checkOut: selectedDates.checkOut,
        totalAmount: totalUSD,
        currency,
        totalAmountInCurrency: amountInSelectedCurrency,
        totalAmountDisplay: formattedAmountSelected,
        specialRequests: formData.specialRequests,
        arrivalTime: formData.arrivalTime,
        guestCount: guestCount,
        country: formData.country
      };
      
      // Create reservation using Supabase API
      const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '/api';
      const response = await fetch(`${baseUrl}/supabase-reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Also send email directly as backup to ensure delivery
        let directEmailResult = { success: false, message: 'Direct email not attempted' };
        try {
          console.log('📧 BookingForm: Sending direct confirmation email...');
          const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAIL_API_URL) || '/api';
          const emailResponse = await fetch(`${baseUrl}/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              reservation: {
                ...reservationData,
                confirmationId: result.data.confirmationId
              }
            })
          });
          const emailData = await emailResponse.json();
          if (emailResponse.ok && emailData?.success) {
            directEmailResult = { success: true, message: 'Confirmation email sent successfully' };
            console.log('📧 BookingForm: Direct email sent successfully');
          } else {
            directEmailResult = { success: false, message: emailData?.error || 'Direct email failed' };
            console.warn('📧 BookingForm: Direct email failed:', emailData?.error);
          }
        } catch (emailError) {
          console.warn('📧 BookingForm: Direct email error:', emailError);
          directEmailResult = { success: false, message: 'Direct email failed due to error' };
        }

        // Prepare booking data for success page
        const bookingData = {
          reservationId: result.data.confirmationId,
          confirmationId: result.data.confirmationId,
          room: selectedRoom,
          dates: selectedDates,
          guests: guestCount,
          guestDetails: formData,
          totalAmount: selectedRoom.pricePerNight * calculateNights(),
          bookingDate: new Date().toISOString(),
          status: result.data.status,
          emailSent: result.data.emailSent || directEmailResult.success,
          emailResult: directEmailResult.success ? directEmailResult : result.emailResult
        };
        
        onBookingComplete(bookingData);
      } else {
        throw new Error(result.error || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      // You could add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateNights = () => {
    if (!selectedDates?.checkIn || !selectedDates?.checkOut) return 1;
    const checkIn = new Date(selectedDates.checkIn);
    const checkOut = new Date(selectedDates.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
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

  const steps = [
    { number: 1, title: 'Guest Details', icon: 'User' },
    { number: 2, title: 'Preferences', icon: 'Settings' },
    { number: 3, title: 'Confirmation', icon: 'Mail' }
  ];

  return (
    <div className="bg-background rounded-xl luxury-shadow max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Complete Your Booking
          </h2>
          <p className="text-muted-foreground mt-1">
            {selectedRoom?.name} • {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>
      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => (
            <div key={step?.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 smooth-transition ${
                currentStep >= step?.number
                  ? 'bg-accent border-accent text-accent-foreground'
                  : 'border-border text-muted-foreground'
              }`}>
                {currentStep > step?.number ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <div className={`text-sm font-medium ${
                  currentStep >= step?.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </div>
              </div>
              {index < steps?.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  currentStep > step?.number ? 'bg-accent' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Guest Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData?.firstName}
                onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                error={errors?.firstName}
                required
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name"
                type="text"
                value={formData?.lastName}
                onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                error={errors?.lastName}
                required
                placeholder="Enter your last name"
              />
            </div>
            
            <Input
              label="Email Address"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
              placeholder="Enter your email address"
              description="Booking confirmation will be sent to this email"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                required
                placeholder="+1 (555) 123-4567"
              />
              <Select
                label="Country"
                options={countryOptions}
                value={formData?.country}
                onChange={(value) => handleInputChange('country', value)}
                error={errors?.country}
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Select
              label="Expected Arrival Time"
              description="Help us prepare for your arrival"
              options={arrivalTimeOptions}
              value={formData?.arrivalTime}
              onChange={(value) => handleInputChange('arrivalTime', value)}
            />
            
            <Input
              label="Special Requests"
              type="textarea"
              value={formData?.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e?.target?.value)}
              placeholder="Any special requests or dietary requirements..."
              description="We'll do our best to accommodate your needs"
              rows={4}
            />
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-accent/5 rounded-xl p-6 border border-accent/20">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center">
                <Icon name="CheckCircle" size={20} className="mr-2 text-success" />
                Booking Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room:</span>
                  <span className="font-medium">{selectedRoom?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="font-medium">{new Date(selectedDates?.checkIn)?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-medium">{new Date(selectedDates?.checkOut)?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-medium">{guestCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights:</span>
                  <span className="font-medium">{calculateNights()}</span>
                </div>
                <div className="border-t border-accent/20 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-success">{formatAmountByCurrency(selectedRoom?.pricePerNight * calculateNights())}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Mail" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Email Confirmation</h4>
                  <p className="text-sm text-blue-700">
                    A confirmation email with your unique booking ID will be sent to <strong>{formData?.email}</strong> 
                    once you complete your booking. No payment is required at this time.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="space-y-3">
              <Checkbox
                label="Subscribe to newsletter for exclusive offers"
                checked={formData?.newsletter}
                onChange={(e) => handleInputChange('newsletter', e?.target?.checked)}
              />
              <Checkbox
                label="I agree to the terms and conditions and privacy policy"
                checked={formData?.terms}
                onChange={(e) => handleInputChange('terms', e?.target?.checked)}
                error={errors?.terms}
                required
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>
            )}
          </div>
          
          <div>
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                iconName="ChevronRight"
                iconPosition="right"
                className="bg-accent hover:bg-accent/90"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                loading={isSubmitting}
                iconName="Mail"
                iconPosition="left"
                className="bg-accent hover:bg-accent/90"
              >
                {isSubmitting ? 'Sending Confirmation...' : 'Complete Booking & Send Confirmation'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;