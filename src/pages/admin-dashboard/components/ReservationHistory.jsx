import React, { useState, useEffect } from 'react';
import { 
  History, 
  Eye, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import sharedDatabase from '../../../services/sharedDatabase';

const ReservationHistory = ({ onClose }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load reservation history
  const loadHistory = async () => {
    setLoading(true);
    try {
      // Temporary workaround: use debug parameter until /history endpoint is deployed
      const response = await fetch('/api/supabase-reservations?showAll=true');
      const result = await response.json();
      
      if (result.success) {
        // Filter to only show hidden reservations (cancelled, deleted, checked-out)
        const hiddenReservations = result.data.filter(reservation => 
          !reservation.visibleInDashboard || 
          ['cancelled', 'deleted', 'checked-out'].includes(reservation.status)
        );
        setReservations(hiddenReservations);
      } else {
        console.error('Failed to load reservation history:', result.error);
        setReservations([]);
      }
    } catch (error) {
      console.error('Failed to load reservation history:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Filter and sort reservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.confirmationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.roomName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'checkIn' || sortBy === 'checkOut' || sortBy === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'deleted': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      'checked-out': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    // Ensure amount is a number
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount)) {
      return `${currency} 0`;
    }

    // Special handling for RWF to show proper formatting
    if (currency === 'RWF') {
      return `RWF ${numericAmount.toLocaleString('en-US')}`;
    }

    // Use the original currency without conversion
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(numericAmount);
  };

  // Calculate days remaining until automatic deletion (7 days from updated_at)
  const getDaysUntilDeletion = (updatedAt) => {
    const updatedDate = new Date(updatedAt);
    const deletionDate = new Date(updatedDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    const now = new Date();
    const daysRemaining = Math.ceil((deletionDate - now) / (24 * 60 * 60 * 1000));
    return Math.max(0, daysRemaining);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Reservation History</h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {filteredReservations.length} hidden reservations
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by guest name, email, confirmation ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="cancelled">Cancelled</option>
              <option value="deleted">Deleted</option>
              <option value="checked-out">Checked Out</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="updatedAt-desc">Last Updated (Newest)</option>
              <option value="updatedAt-asc">Last Updated (Oldest)</option>
              <option value="checkIn-desc">Check-in (Latest)</option>
              <option value="checkIn-asc">Check-in (Earliest)</option>
              <option value="guestName-asc">Guest Name (A-Z)</option>
              <option value="guestName-desc">Guest Name (Z-A)</option>
            </select>

            {/* Refresh */}
            <button
              onClick={loadHistory}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading history...</span>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <History className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Hidden Reservations</h3>
              <p className="text-center max-w-md">
                There are no cancelled, deleted, or checked-out reservations in the history.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reservation.guestName}
                        </h3>
                        {getStatusBadge(reservation.status)}
                        <span className="text-sm text-gray-500">
                          {reservation.confirmationId}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{reservation.email}</span>
                        </div>
                        {reservation.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{reservation.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{reservation.roomName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{reservation.guestCount} guest(s)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Check-in</div>
                            <div className="font-medium">{formatDate(reservation.checkIn)}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Check-out</div>
                            <div className="font-medium">{formatDate(reservation.checkOut)}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Last Updated</div>
                            <div className="font-medium">{formatDate(reservation.updatedAt)}</div>
                          </div>
                        </div>
                      </div>

                      {reservation.specialRequests && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 mb-1">Special Requests</div>
                          <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                            {reservation.specialRequests}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="text-lg font-semibold text-gray-900">
                            {formatCurrency(reservation.totalAmount, reservation.currency)}
                          </div>
                          {getDaysUntilDeletion(reservation.updatedAt) > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Auto-delete in {getDaysUntilDeletion(reservation.updatedAt)} day{getDaysUntilDeletion(reservation.updatedAt) !== 1 ? 's' : ''}
                            </div>
                          )}
                          {getDaysUntilDeletion(reservation.updatedAt) === 0 && (
                            <div className="text-xs text-red-500 mt-1">
                              Scheduled for deletion
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {formatDate(reservation.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationHistory;
