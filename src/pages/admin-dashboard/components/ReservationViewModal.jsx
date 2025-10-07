import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useRWFConversion from '../../../hooks/useRWFConversion';
import { 
  X, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Users,
  MapPin,
  Clock,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock3
} from 'lucide-react';

const ReservationViewModal = ({ 
  isOpen, 
  onClose, 
  reservation 
}) => {
  const { formatRWF } = useRWFConversion();
  
  if (!isOpen || !reservation) return null;

  const getStatusConfig = (status) => {
    const statusConfigs = {
      confirmed: { 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
        icon: CheckCircle,
        label: 'Confirmed' 
      },
      pending: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200', 
        icon: Clock3,
        label: 'Pending' 
      },
      'checked-in': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: CheckCircle,
        label: 'Guest is checked in' 
      },
      'checked-out': { 
        color: 'bg-slate-200 text-slate-700 border-slate-300 font-semibold shadow-md', 
        icon: CheckCircle,
        label: 'Guest has been checked out' 
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: XCircle,
        label: 'Cancelled' 
      }
    };
    return statusConfigs[status] || statusConfigs.pending;
  };

  const statusConfig = getStatusConfig(reservation.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return formatRWF(amount);
  };

  const calculateNights = () => {
    if (!reservation.checkIn || !reservation.checkOut) return 0;
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden bg-white rounded-3xl shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Reservation Details</h2>
                  <p className="text-slate-300">Reservation ID: #{reservation.id}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Status Badge */}
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
                    <StatusIcon size={16} />
                    <span className="font-medium text-sm">{statusConfig.label}</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Guest Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <User size={20} className="mr-2 text-slate-600" />
                      Guest Information
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <User size={18} className="text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">Guest Name</p>
                            <p className="font-medium text-slate-900">{reservation.guestName || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Mail size={18} className="text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">Email Address</p>
                            <p className="font-medium text-slate-900">{reservation.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Phone size={18} className="text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">Phone Number</p>
                            <p className="font-medium text-slate-900">{reservation.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Users size={18} className="text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">Number of Guests</p>
                            <p className="font-medium text-slate-900">{reservation.guests || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {reservation.specialRequests && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <FileText size={20} className="mr-2 text-slate-600" />
                        Special Requests
                      </h3>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-slate-700 leading-relaxed">{reservation.specialRequests}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Calendar size={20} className="mr-2 text-slate-600" />
                      Booking Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <Calendar size={18} className="text-slate-500" />
                            <div>
                              <p className="text-sm text-slate-500">Check-in Date</p>
                              <p className="font-medium text-slate-900">{formatDate(reservation.checkIn)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <Calendar size={18} className="text-slate-500" />
                            <div>
                              <p className="text-sm text-slate-500">Check-out Date</p>
                              <p className="font-medium text-slate-900">{formatDate(reservation.checkOut)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <Clock size={18} className="text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">Duration</p>
                            <p className="font-medium text-slate-900">{calculateNights()} night{calculateNights() !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <MapPin size={18} className="text-slate-500" />
                            <div>
                              <p className="text-sm text-slate-500">Room Type</p>
                              <p className="font-medium text-slate-900">{reservation.roomType || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <MapPin size={18} className="text-slate-500" />
                            <div>
                              <p className="text-sm text-slate-500">Room Number</p>
                              <p className="font-medium text-slate-900">{reservation.roomNumber || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard size={20} className="text-emerald-600" />
                            <div>
                              <p className="text-emerald-700 font-medium">Total Amount</p>
                              <p className="text-sm text-emerald-600">Including all fees and taxes</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-emerald-600">
                              {formatCurrency(reservation.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
              <div className="flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReservationViewModal;
