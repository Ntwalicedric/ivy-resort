import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  RefreshCw,
  Eye,
  EyeOff,
  XCircle
} from 'lucide-react';
import sharedDatabase from '../../../services/sharedDatabase';
import useRWFConversion from '../../../hooks/useRWFConversion';

const PaymentTotals = ({ onClose }) => {
  const [totals, setTotals] = useState({ totals: {}, count: 0, reservations: [] });
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const { formatRWF } = useRWFConversion();

  // Load payment totals
  const loadTotals = async () => {
    setLoading(true);
    try {
      const data = await sharedDatabase.getPaymentTotals();
      console.log('PaymentTotals: Loaded data', data);
      setTotals(data);
    } catch (error) {
      console.error('Failed to load payment totals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTotals();
  }, []);

  const formatCurrency = (amount, currency = 'USD') => {
    // Use the same currency formatting as the main dashboard
    console.log('PaymentTotals: formatCurrency()', { amount, currency });
    const formatted = formatRWF(amount);
    console.log('PaymentTotals: formatted result', formatted);
    return formatted;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalRevenue = () => {
    const total = Object.values(totals.totals || {}).reduce((sum, amount) => sum + amount, 0);
    console.log('PaymentTotals: getTotalRevenue()', { totals: totals.totals, total });
    return total;
  };

  const getPrimaryCurrency = () => {
    const currencies = Object.keys(totals.totals || {});
    return currencies.length > 0 ? currencies[0] : 'USD';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Totals</h2>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
              Active Reservations Only
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">{showDetails ? 'Hide' : 'Show'} Details</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading totals...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold">
                        {formatCurrency(getTotalRevenue(), getPrimaryCurrency())}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Active Reservations</p>
                      <p className="text-3xl font-bold">{totals.count}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Currencies</p>
                      <p className="text-3xl font-bold">{Object.keys(totals.totals || {}).length}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-200" />
                  </div>
                </div>
              </div>

              {/* Currency Breakdown */}
              {Object.keys(totals.totals || {}).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Currency</h3>
                  <div className="space-y-3">
                    {Object.entries(totals.totals || {}).map(([currency, amount]) => (
                      <div key={currency} className="flex items-center justify-between bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{currency}</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(amount, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Reservations */}
              {showDetails && totals.reservations && totals.reservations.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Active Reservations ({totals.reservations.length})
                  </h3>
                  <div className="space-y-3">
                    {totals.reservations.map((reservation) => (
                      <div key={reservation.id} className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-gray-900">{reservation.guestName}</h4>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                {reservation.status}
                              </span>
                              <span className="text-sm text-gray-500">{reservation.confirmationId}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {reservation.roomName} • {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(reservation.totalAmount, reservation.currency)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reservation.guestCount} guest(s)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {totals.count === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <DollarSign className="w-12 h-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Reservations</h3>
                  <p className="text-center max-w-md">
                    There are no confirmed or checked-in reservations to calculate totals from.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>• Only includes reservations with <strong>confirmed</strong> or <strong>checked-in</strong> status</p>
              <p>• Excludes cancelled, deleted, and checked-out reservations</p>
            </div>
            <button
              onClick={loadTotals}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTotals;
