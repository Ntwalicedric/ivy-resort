import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Download,
  Printer
} from 'lucide-react';
import Icon from '../../../components/AppIcon';

const ReservationDetailsModal = ({ 
  isOpen, 
  onClose, 
  reservation, 
  onModify, 
  onCancel 
}) => {
  if (!isOpen || !reservation) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting reservation details...');
  };

  const handlePrint = () => {
    window.print();
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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Reservation Details</h2>
                  <p className="text-emerald-100">Reservation ID: {reservation.id}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleExport}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    title="Export"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    title="Print"
                  >
                    <Printer size={20} />
                  </button>
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
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Guest Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <User size={20} className="mr-2 text-emerald-600" />
                      Guest Information
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{reservation.guestName}</p>
                          <p className="text-slate-600">Primary Guest</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail size={16} className="text-slate-400" />
                          <span className="text-slate-600">{reservation.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone size={16} className="text-slate-400" />
                          <span className="text-slate-600">{reservation.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users size={16} className="text-slate-400" />
                          <span className="text-slate-600">{reservation.guests} guest{reservation.guests > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Clock size={20} className="mr-2 text-emerald-600" />
                      Special Requests
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-6">
                      <p className="text-slate-700">
                        {reservation.specialRequests || 'No special requests'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Calendar size={20} className="mr-2 text-emerald-600" />
                      Booking Details
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Check-in</p>
                          <p className="font-semibold text-slate-900">{formatDate(reservation.checkIn)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Check-out</p>
                          <p className="font-semibold text-slate-900">{formatDate(reservation.checkOut)}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <MapPin size={16} className="text-slate-400" />
                          <div>
                            <p className="font-semibold text-slate-900">{reservation.roomType}</p>
                            <p className="text-slate-600">Room {reservation.roomNumber}</p>
                            {reservation.roomName && (
                              <p className="text-sm text-slate-500 mt-1">{reservation.roomName}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Total Amount</span>
                          <span className="text-2xl font-bold text-emerald-600">{reservation.totalAmount}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Confirmation ID</span>
                          <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                            {reservation.confirmationId || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Email Status</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            reservation.emailSent 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            <AppIcon name="Mail" size={12} className="mr-1" />
                            {reservation.emailSent ? 'Sent' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <DollarSign size={20} className="mr-2 text-emerald-600" />
                      Status & Actions
                    </h3>
                    <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Reservation Status</span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Created</span>
                        <span className="text-slate-900">{formatDate(reservation.createdAt)}</span>
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => onModify(reservation)}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                          >
                            <Edit size={16} />
                            <span>Modify</span>
                          </button>
                          <button
                            onClick={() => onCancel(reservation)}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReservationDetailsModal;