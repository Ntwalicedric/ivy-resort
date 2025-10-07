import React from 'react';
import useRWFConversion from '../../../hooks/useRWFConversion';

// CSS for elegant action buttons and table styling
const actionButtonStyles = `
  .action-btn {
    @apply px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 border-2 shadow-sm;
    position: relative;
    overflow: hidden;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    backdrop-filter: blur(10px);
    transform: translateY(0);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .action-icon {
    font-size: 16px;
    line-height: 1;
  }

  .action-text {
    font-size: 13px;
    font-weight: 500;
  }
  
  .action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .action-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .action-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .action-btn:hover::before {
    left: 100%;
  }
  
  .view-btn {
    @apply bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 hover:from-blue-100 hover:to-blue-200 hover:border-blue-400;
  }
  
  .edit-btn {
    @apply bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-300 hover:from-amber-100 hover:to-amber-200 hover:border-amber-400;
  }
  
  .checkin-btn {
    @apply bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-300 hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-400;
  }
  
  .checkout-btn {
    @apply bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-300 hover:from-indigo-100 hover:to-indigo-200 hover:border-indigo-400;
  }
  
  
  .delete-btn {
    @apply bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800 border-rose-300 hover:from-rose-100 hover:to-rose-200 hover:border-rose-400;
  }
  
  /* Enhanced table typography */
  .enhanced-table {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .enhanced-table th {
    @apply text-xs font-bold text-gray-700 uppercase tracking-wider;
    letter-spacing: 0.05em;
  }
  
  .enhanced-table td {
    @apply text-sm;
    font-weight: 500;
  }
  
  .enhanced-table .guest-name {
    @apply font-semibold text-gray-900;
    letter-spacing: -0.025em;
  }
  
  .enhanced-table .guest-email {
    @apply text-gray-600;
    font-weight: 400;
  }
  
  .enhanced-table .room-info {
    @apply font-medium text-gray-800;
  }
  
  .enhanced-table .date-info {
    @apply font-medium text-gray-700;
  }
  
  .enhanced-table .amount-info {
    @apply font-bold text-gray-900;
  }
  
  .enhanced-table .status-badge {
    @apply text-xs font-semibold px-2.5 py-1 rounded-full;
    letter-spacing: 0.025em;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = actionButtonStyles;
  document.head.appendChild(styleSheet);
}

// Inline SVG icons for better reliability
const EyeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

const EditIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const TimesCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const MapMarkerIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const ChevronUpIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const EnhancedReservationTable = ({
  reservations,
  selectedReservations,
  onBulkSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
  onCheckIn,
  onCheckOut,
  sortBy,
  sortOrder,
  onSort,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const { formatRWF } = useRWFConversion();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'checked-in': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked-out': return 'bg-slate-200 text-slate-700 border-slate-300 font-semibold';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'checked-in': return 'Guest is checked in';
      case 'checked-out': return 'Guest has been checked out';
      case 'cancelled': return 'Cancelled';
      case 'pending': return 'Pending';
      default: 
        return status || 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return formatRWF(amount);
  };

  const handleSort = (field) => {
    onSort(field);
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
    >
      <span>{children}</span>
      {sortBy === field && (
        sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden">
      {/* Table Header */}
      <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <span className="text-blue-600 font-bold">📋</span>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Reservations ({reservations.length})
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-2xl text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full enhanced-table">
          <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/80">
            <tr>
              <th className="px-8 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedReservations.length === reservations.length && reservations.length > 0}
                  onChange={onSelectAll}
                  className="rounded-xl border-gray-300 w-4 h-4"
                />
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <SortButton field="guestName">Guest</SortButton>
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <SortButton field="roomNumber">Room ID</SortButton>
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <SortButton field="checkIn">Check-in</SortButton>
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <SortButton field="checkOut">Check-out</SortButton>
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <SortButton field="totalAmount">Amount</SortButton>
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className={`hover:bg-blue-50/50 transition-all duration-200 ${
                reservation.status === 'checked-out' ? 'bg-slate-50/80 border-l-4 border-slate-300' : ''
              }`}>
                <td className="px-8 py-6 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedReservations.includes(reservation.id)}
                    onChange={() => onBulkSelect(reservation.id)}
                    className="rounded-xl border-gray-300 w-4 h-4"
                  />
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="guest-name">
                        {reservation.guestName}
                      </div>
                      <div className="guest-email flex items-center">
                        <EnvelopeIcon className="h-3 w-3 mr-1" />
                        {reservation.email}
                      </div>
                      {reservation.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {reservation.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="room-info font-medium">{reservation.roomNumber || reservation.roomId}</div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="date-info flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(reservation.checkIn)}
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="date-info flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(reservation.checkOut)}
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="amount-info font-semibold text-lg">
                    {formatCurrency(reservation.totalAmount)}
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${getStatusColor(reservation.status)} ${
                      reservation.status === 'checked-out' ? 'shadow-md px-4 py-2' : ''
                    }`}>
                      {getStatusDisplay(reservation.status || 'unknown')}
                    </span>
                    {reservation.status === 'checked-out' && reservation.updatedAt && (
                      <span className="text-xs text-slate-500">
                        {formatDate(reservation.updatedAt)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(reservation)}
                      className="action-btn view-btn group"
                      title="View Details"
                    >
                      <span className="action-icon">👁️</span>
                      <span className="action-text">View</span>
                    </button>
                    <button
                      onClick={() => onEdit(reservation)}
                      className="action-btn edit-btn group"
                      title="Edit"
                    >
                      <span className="action-icon">✏️</span>
                      <span className="action-text">Edit</span>
                    </button>
                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => onCheckIn(reservation.id)}
                        className="action-btn checkin-btn group"
                        title="Check In"
                      >
                        <span className="action-icon">🏨</span>
                        <span className="action-text">Check In</span>
                      </button>
                    )}
                    {(reservation.status === 'confirmed' || reservation.status === 'checked-in') && (
                      <button
                        onClick={() => onCheckOut(reservation.id)}
                        className="action-btn checkout-btn group hover:scale-105 transition-transform duration-200"
                        title="Check Out"
                      >
                        <span className="action-icon">🚪</span>
                        <span className="action-text">Check Out</span>
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(reservation.id)}
                      className="action-btn delete-btn group"
                      title="Delete"
                    >
                      <span className="action-icon">🗑️</span>
                      <span className="action-text">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-8 py-6 border-t border-gray-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
          <div className="flex items-center justify-between">
            <div className="text-base font-medium text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, reservations.length)} of {reservations.length} results
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-2xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
              >
                Previous
              </button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 border rounded-2xl text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg'
                        : 'border-gray-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-2xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedReservationTable;


