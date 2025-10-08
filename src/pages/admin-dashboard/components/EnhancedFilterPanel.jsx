import React from 'react';
import { Search, Filter, Calendar, User, Building, X } from 'lucide-react';

const EnhancedFilterPanel = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  roomTypeFilter,
  onRoomTypeFilterChange,
  onClearFilters,
  selectedReservations,
  onBulkCheckIn,
  onBulkCheckOut,
  onBulkCancel,
  showBulkActions
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'checked-in', label: 'Checked In' },
    { value: 'checked-out', label: 'Checked Out' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  const roomTypes = [
    'Standard Twin',
    'Deluxe Double',
    'Luxury Suite',
    'Standard Twin With Balcony',
    'Deluxe Apartment'
  ];

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || dateFilter !== 'all' || roomTypeFilter !== 'all';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/30 mb-6 lg:mb-8 overflow-hidden">
      {/* Filter Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Filters & Search</h3>
            {hasActiveFilters && (
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                Active Filters
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span className="font-medium">Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Search className="h-4 w-4 inline mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search guests, rooms, emails..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <User className="h-4 w-4 inline mr-1" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Building className="h-4 w-4 inline mr-1" />
              Room Type
            </label>
            <select
              value={roomTypeFilter}
              onChange={(e) => onRoomTypeFilterChange(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            >
              <option value="all">All Room Types</option>
              {roomTypes.map(roomType => (
                <option key={roomType} value={roomType}>
                  {roomType}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && selectedReservations.length > 0 && (
        <div className="px-8 py-6 border-t border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <span className="text-blue-600 font-bold">📋</span>
              </div>
              <span className="text-base font-semibold text-blue-900">
                {selectedReservations.length} reservation{selectedReservations.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onBulkCheckIn}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Check In All
              </button>
              <button
                onClick={onBulkCheckOut}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Check Out All
              </button>
              <button
                onClick={onBulkCancel}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Cancel All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFilterPanel;



