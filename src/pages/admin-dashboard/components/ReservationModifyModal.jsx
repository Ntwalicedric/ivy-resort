import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  RotateCcw, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Icon from '../../../components/AppIcon';

const ReservationModifyModal = ({ 
  isOpen, 
  onClose, 
  reservation, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    roomNumber: '',
    totalAmount: '',
    status: 'confirmed',
    specialRequests: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (reservation) {
      const initialData = {
        guestName: reservation.guestName || '',
        email: reservation.email || '',
        phone: reservation.phone || '',
        checkIn: reservation.checkIn || '',
        checkOut: reservation.checkOut || '',
        guests: reservation.guests || 1,
        roomType: reservation.roomType || '',
        roomNumber: reservation.roomNumber || '',
        totalAmount: reservation.totalAmount || '',
        status: reservation.status || 'confirmed',
        specialRequests: reservation.specialRequests || ''
      };
      setFormData(initialData);
      setHasChanges(false);
      setErrors({});
    }
  }, [reservation]);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Check if there are changes
      const hasChanges = Object.keys(newData).some(key => 
        newData[key] !== (reservation?.[key] || '')
      );
      setHasChanges(hasChanges);
      
      return newData;
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }
    
    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }
    
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }
      
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }
    
    if (formData.guests < 1 || formData.guests > 10) {
      newErrors.guests = 'Number of guests must be between 1 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const roomRates = {
      'Standard Twin': 120,
      'Deluxe Apartment': 280,
      'Deluxe Double': 180,
      'Luxury Suite': 220,
      'Mountain Standard': 150
    };
    
    const baseRate = roomRates[formData.roomType] || 200;
    return baseRate * nights;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showNotification('Please fix the errors before saving', 'error');
      return;
    }

    if (!hasChanges) {
      showNotification('No changes to save', 'info');
      return;
    }

    setIsLoading(true);
    try {
      const updatedReservation = {
        ...reservation,
        ...formData,
        totalAmount: calculateTotal(),
        id: reservation.id
      };

      onSave(updatedReservation);
      showNotification('Reservation updated successfully!', 'success');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showNotification('Failed to save changes. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (reservation) {
      const initialData = {
        guestName: reservation.guestName || '',
        email: reservation.email || '',
        phone: reservation.phone || '',
        checkIn: reservation.checkIn || '',
        checkOut: reservation.checkOut || '',
        guests: reservation.guests || 1,
        roomType: reservation.roomType || '',
        roomNumber: reservation.roomNumber || '',
        totalAmount: reservation.totalAmount || '',
        status: reservation.status || 'confirmed',
        specialRequests: reservation.specialRequests || ''
      };
      setFormData(initialData);
      setHasChanges(false);
      setErrors({});
      showNotification('Form reset to original values', 'info');
    }
  };

  if (!isOpen || !reservation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Enhanced Notification */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, x: 400, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: 400, scale: 0.8, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3 
              }}
              className="fixed top-6 right-6 z-60 max-w-sm"
            >
              <div className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-xl ${
                notification.type === 'error' 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200/50 text-red-900' 
                  : 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200/50 text-emerald-900'
              }`}>
                {/* Animated background gradient */}
                <div className={`absolute inset-0 opacity-20 ${
                  notification.type === 'error' 
                    ? 'bg-gradient-to-r from-red-400 to-red-600' 
                    : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                }`} />
                
                <div className="relative p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon with pulse animation */}
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                      notification.type === 'error' 
                        ? 'bg-red-200 animate-pulse' 
                        : 'bg-emerald-200 animate-pulse'
                    }`}>
                      <Icon 
                        name={notification.type === 'error' ? 'AlertCircle' : 'CheckCircle'} 
                        size={24} 
                        className={notification.type === 'error' ? 'text-red-600' : 'text-emerald-600'} 
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold uppercase tracking-wide ${
                          notification.type === 'error' ? 'text-red-700' : 'text-emerald-700'
                        }`}>
                          {notification.type === 'error' ? 'Error' : 'Success'}
                        </h4>
                        <button
                          onClick={() => setNotification(null)}
                          className={`ml-2 p-1 rounded-full hover:bg-white/50 transition-all duration-200 ${
                            notification.type === 'error' ? 'text-red-500 hover:text-red-700' : 'text-emerald-500 hover:text-emerald-700'
                          }`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <p className="mt-2 text-sm font-medium leading-relaxed">
                        {notification.message}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "100%" }}
                          animate={{ width: "0%" }}
                          transition={{ duration: 5, ease: "linear" }}
                          className={`h-full ${
                            notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden bg-white rounded-3xl shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Modify Reservation</h2>
                  <p className="text-emerald-100">Reservation ID: {reservation.id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Guest Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <User size={20} className="mr-2 text-emerald-600" />
                      Guest Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Guest Name *
                        </label>
                        <input
                          type="text"
                          value={formData.guestName}
                          onChange={(e) => handleInputChange('guestName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                            errors.guestName 
                              ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                              : 'border-slate-200 focus:ring-emerald-500'
                          }`}
                          placeholder="Enter guest name"
                        />
                        {errors.guestName && (
                          <p className="mt-1 text-sm text-red-600">{errors.guestName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                            errors.email 
                              ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                              : 'border-slate-200 focus:ring-emerald-500'
                          }`}
                          placeholder="Enter email address"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                            errors.phone 
                              ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                              : 'border-slate-200 focus:ring-emerald-500'
                          }`}
                          placeholder="Enter phone number"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Number of Guests
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                            errors.guests 
                              ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                              : 'border-slate-200 focus:ring-emerald-500'
                          }`}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        {errors.guests && (
                          <p className="mt-1 text-sm text-red-600">{errors.guests}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Calendar size={20} className="mr-2 text-emerald-600" />
                      Special Requests
                    </h3>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                </div>

                {/* Booking Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Calendar size={20} className="mr-2 text-emerald-600" />
                      Booking Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Check-in Date *
                          </label>
                          <input
                            type="date"
                            value={formData.checkIn}
                            onChange={(e) => handleInputChange('checkIn', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                              errors.checkIn 
                                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                                : 'border-slate-200 focus:ring-emerald-500'
                            }`}
                          />
                          {errors.checkIn && (
                            <p className="mt-1 text-sm text-red-600">{errors.checkIn}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Check-out Date *
                          </label>
                          <input
                            type="date"
                            value={formData.checkOut}
                            onChange={(e) => handleInputChange('checkOut', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                              errors.checkOut 
                                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                                : 'border-slate-200 focus:ring-emerald-500'
                            }`}
                          />
                          {errors.checkOut && (
                            <p className="mt-1 text-sm text-red-600">{errors.checkOut}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Room Type
                          </label>
                          <select
                            value={formData.roomType}
                            onChange={(e) => handleInputChange('roomType', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                          >
                            <option value="">Select room type</option>
                            <option value="Standard Twin">Standard Twin - $120/night</option>
                            <option value="Deluxe Apartment">Deluxe Apartment - $280/night</option>
                            <option value="Deluxe Double">Deluxe Double - $180/night</option>
                            <option value="Luxury Suite">Luxury Suite - $220/night</option>
                            <option value="Mountain Standard">Mountain Standard - $150/night</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Room Number
                          </label>
                          <input
                            type="text"
                            value={formData.roomNumber}
                            onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                            placeholder="Room number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Reservation Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Auto-calculated total */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">Total Amount (Auto-calculated)</span>
                          <span className="text-2xl font-bold text-emerald-600">
                            ${calculateTotal().toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Based on room type and number of nights
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-6 py-3 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading || !hasChanges}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors disabled:opacity-50 ${
                      hasChanges 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>
                      {isLoading ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReservationModifyModal;