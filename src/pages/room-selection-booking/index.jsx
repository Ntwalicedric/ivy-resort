import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavigation from '../../components/ui/PublicNavigation';
import RoomCard from './components/RoomCard';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import BookingSuccess from './components/BookingSuccess';
import DateGuestSelector from './components/DateGuestSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { roomsData } from '../../data/rooms';

const RoomSelectionBooking = () => {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState({
    checkIn: '',
    checkOut: ''
  });
  const [guestCount, setGuestCount] = useState('2');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Room data is now imported from shared data file

  // Initialize dates from sessionStorage or set defaults
  useEffect(() => {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
      const parsed = JSON.parse(bookingData);
      setSelectedDates({
        checkIn: parsed?.checkIn || '',
        checkOut: parsed?.checkOut || ''
      });
      setGuestCount(parsed?.guests || '2');
    } else {
      // Set default dates (today + 1 and today + 2)
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow?.setDate(tomorrow?.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter?.setDate(dayAfter?.getDate() + 2);
      
      setSelectedDates({
        checkIn: tomorrow?.toISOString()?.split('T')?.[0],
        checkOut: dayAfter?.toISOString()?.split('T')?.[0]
      });
    }
  }, []);

  const handleRoomSelect = (room) => {
    if (!room?.available) return;
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingComplete = (bookingData) => {
    setBookingSuccess(bookingData);
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  const handleModifyBooking = () => {
    setSelectedRoom(null);
    setShowBookingForm(false);
  };

  const handleSearchUpdate = () => {
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const availableRooms = roomsData?.filter(room => room?.available);
  const unavailableRooms = roomsData?.filter(room => !room?.available);

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => navigate('/homepage')}
              className="text-accent hover:text-accent/80 smooth-transition"
            >
              Home
            </button>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
            <span className="text-foreground font-medium">Room Selection & Booking</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Choose Your Perfect Stay
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated accommodations, each designed to provide 
            exceptional comfort and stunning views of Lake Kivu and the surrounding mountains.
          </p>
        </div>

        {/* Date & Guest Selector */}
        <DateGuestSelector
          selectedDates={selectedDates}
          guestCount={guestCount}
          onDatesChange={setSelectedDates}
          onGuestCountChange={setGuestCount}
          onSearch={handleSearchUpdate}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Selection */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching available rooms...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Available Rooms */}
                {availableRooms?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Available Rooms
                      </h2>
                      <div className="text-sm text-muted-foreground">
                        {availableRooms?.length} room{availableRooms?.length > 1 ? 's' : ''} available
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {availableRooms?.map((room) => (
                        <RoomCard
                          key={room?.id}
                          room={room}
                          selectedDates={selectedDates}
                          guestCount={guestCount}
                          onSelectRoom={handleRoomSelect}
                          isSelected={selectedRoom?.id === room?.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Unavailable Rooms */}
                {unavailableRooms?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-2xl font-semibold text-foreground">
                        Currently Unavailable
                      </h2>
                      <div className="text-sm text-muted-foreground">
                        {unavailableRooms?.length} room{unavailableRooms?.length > 1 ? 's' : ''} fully booked
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {unavailableRooms?.map((room) => (
                        <RoomCard
                          key={room?.id}
                          room={room}
                          selectedDates={selectedDates}
                          guestCount={guestCount}
                          onSelectRoom={handleRoomSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* No Rooms Available */}
                {availableRooms?.length === 0 && unavailableRooms?.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      No Rooms Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your dates or guest count to see available options.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/contact')}
                      iconName="Phone"
                      iconPosition="left"
                    >
                      Contact Us for Assistance
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingSummary
                selectedRoom={selectedRoom}
                selectedDates={selectedDates}
                guestCount={guestCount}
                onModifyBooking={handleModifyBooking}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Booking Form Modal */}
      {showBookingForm && selectedRoom && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-center justify-center p-4">
          <BookingForm
            selectedRoom={selectedRoom}
            selectedDates={selectedDates}
            guestCount={guestCount}
            onBookingComplete={handleBookingComplete}
            onClose={() => setShowBookingForm(false)}
          />
        </div>
      )}
      {/* Booking Success Modal */}
      {bookingSuccess && (
        <BookingSuccess
          bookingData={bookingSuccess}
          onClose={() => setBookingSuccess(null)}
        />
      )}
    </div>
  );
};

export default RoomSelectionBooking;