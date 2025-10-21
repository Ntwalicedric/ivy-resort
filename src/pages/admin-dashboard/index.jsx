import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../context/DatabaseContext';
import { ProtectedRoute, useAuth } from '../../components/ui/AuthenticationGuard';
import useRWFConversion from '../../hooks/useRWFConversion';
import sharedDatabase from '../../services/sharedDatabase';
import autoCleanupService from '../../utils/autoCleanup';

// Elegant notification styles
const notificationStyles = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%) skewX(-12deg);
    }
    100% {
      transform: translateX(200%) skewX(-12deg);
    }
  }
  
  @keyframes progress {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.5s ease-out;
  }
  
  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }
  
  .animate-progress {
    animation: progress 4s linear forwards;
  }
  
  .animate-progress-success {
    background: linear-gradient(90deg, #10b981, #34d399);
  }
  
  .animate-progress-error {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }
  
  .animate-progress-info {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = notificationStyles;
  document.head.appendChild(styleSheet);
}
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  LogOut,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  LogIn,
  AlertCircle,
  BarChart3,
  History,
  DollarSign
} from 'lucide-react';
import EnhancedFilterPanel from './components/EnhancedFilterPanel';
import EnhancedReservationTable from './components/EnhancedReservationTable';
import CredentialsManager from './components/CredentialsManager';
import ReservationViewModal from './components/ReservationViewModal';
import ReservationModifyModal from './components/ReservationModifyModal';
import ReportGenerator from './components/ReportGenerator';
import ReservationHistory from './components/ReservationHistory';
import PaymentTotals from './components/PaymentTotals';

const AdminDashboard = () => {
  console.log('AdminDashboard: Component starting to render');
  
  const navigate = useNavigate();
  const { formatRWF } = useRWFConversion();
  const { logout } = useAuth();
  
  console.log('AdminDashboard: About to call useDatabase hook');
  
  // Get data from database context
  const {
    reservations,
    loading,
    refreshData,
    createReservation,
    updateReservation,
    cancelReservation,
    checkInReservation,
    checkOutReservation,
    resendConfirmationEmail
  } = useDatabase();
  
  console.log('AdminDashboard: useDatabase hook completed');
  console.log('AdminDashboard: reservations count:', reservations?.length || 0);
  console.log('AdminDashboard: loading state:', loading);
  
  // Error boundary for debugging
  try {
    console.log('AdminDashboard: About to render main content');
  } catch (error) {
    console.error('AdminDashboard: Error in component:', error);
  }

  // Debug: Log when refreshData is called
  const debugRefreshData = () => {
    console.log('Dashboard: refreshData called');
    refreshData();
  };

  // Auto-refresh functionality removed - users can manually refresh when needed

  // Initialize auto cleanup service
  useEffect(() => {
    console.log('AdminDashboard: Starting auto cleanup service...');
    autoCleanupService.startAutoCleanup();
    
    // Cleanup on component unmount
    return () => {
      console.log('AdminDashboard: Stopping auto cleanup service...');
      autoCleanupService.stopAutoCleanup();
    };
  }, []);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('checkIn');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCredentialsManager, setShowCredentialsManager] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showReservationHistory, setShowReservationHistory] = useState(false);
  const [showPaymentTotals, setShowPaymentTotals] = useState(false);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Increased to 5 seconds to match progress bar
  };

  // Enhanced filtering and sorting
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.confirmationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.roomName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const matchesRoomType = roomTypeFilter === 'all' || reservation.roomName === roomTypeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const today = new Date();
      const checkInDate = new Date(reservation.checkIn);
      const checkOutDate = new Date(reservation.checkOut);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = checkInDate.toDateString() === today.toDateString();
          break;
        case 'thisWeek':
          const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
          matchesDate = checkInDate >= weekStart;
          break;
        case 'thisMonth':
          matchesDate = checkInDate.getMonth() === today.getMonth() && 
                       checkInDate.getFullYear() === today.getFullYear();
          break;
        case 'upcoming':
          matchesDate = checkInDate > today;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesRoomType && matchesDate;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'checkIn' || sortBy === 'checkOut') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, endIndex);

  // Handle cleanup of old reservations
  const handleCleanupOldReservations = async () => {
    if (window.confirm('Are you sure you want to delete all reservations older than 7 days from the history? This action cannot be undone.')) {
      try {
        setIsSubmitting(true);
        const result = await sharedDatabase.cleanupOldReservations();
        
        if (result.deletedCount > 0) {
          showNotification(`Successfully deleted ${result.deletedCount} old reservations from history!`, 'success');
          // Refresh data to update the dashboard
          await refreshData();
        } else {
          showNotification('No old reservations found to delete.', 'info');
        }
      } catch (error) {
        console.error('Error cleaning up old reservations:', error);
        showNotification('Failed to cleanup old reservations', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear all admin authentication data
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('rememberAdmin');
    localStorage.removeItem('ivy_resort_reservations');
    sessionStorage.removeItem('adminSession');
    sessionStorage.removeItem('redirectAfterLogin');
    try { logout(); } catch (e) {}
    navigate('/admin-login');
  };

  // Handle view reservation
  const handleView = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  // Handle edit reservation
  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setIsEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async (formData) => {
    console.log('handleSaveEdit called with:', { formData, selectedReservation });
    setIsSubmitting(true);
    
    // Show immediate feedback
    showNotification('Updating reservation...', 'info');
    
    try {
      const result = await updateReservation(selectedReservation.id, formData);
      console.log('updateReservation result:', result);
      if (result.success) {
        showNotification('Reservation updated successfully!', 'success');
        setIsEditModalOpen(false);
        // Force immediate UI refresh
        setTimeout(() => refreshData(), 100);
      } else {
        showNotification('Failed to update reservation: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error in handleSaveEdit:', error);
      showNotification('Error updating reservation: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete reservation
  const handleDelete = async (reservationId) => {
    console.log('handleDelete called with reservationId:', reservationId);
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      // Show immediate feedback
      showNotification('Deleting reservation...', 'info');
      
      try {
        const result = await cancelReservation(reservationId);
        console.log('cancelReservation result:', result);
        if (result.success) {
          showNotification('Reservation deleted successfully!', 'success');
          // Force immediate UI refresh
          setTimeout(() => refreshData(), 100);
        } else {
          showNotification('Failed to delete reservation: ' + result.error, 'error');
        }
      } catch (error) {
        console.error('Error in handleDelete:', error);
        showNotification('Error deleting reservation: ' + error.message, 'error');
      }
    }
  };

  // Handle check-in reservation
  const handleCheckIn = async (reservationId) => {
    console.log('handleCheckIn called with reservationId:', reservationId);
    if (window.confirm('Check in this guest?')) {
      // Show immediate feedback
      showNotification('Checking in guest...', 'info');
      
      try {
        const result = await checkInReservation(reservationId);
        console.log('checkInReservation result:', result);
        if (result.success) {
          showNotification('Guest checked in successfully!', 'success');
          // Don't refresh data as DatabaseContext already updated the state
        } else {
          showNotification('Failed to check in guest: ' + result.error, 'error');
          // Revert optimistic update on failure
          setTimeout(() => refreshData(), 100);
        }
      } catch (error) {
        console.error('Error in handleCheckIn:', error);
        showNotification('Error checking in guest: ' + error.message, 'error');
        // Revert optimistic update on error
        setTimeout(() => refreshData(), 100);
      }
    }
  };

  // Handle check-out reservation
  const handleCheckOut = async (reservationId) => {
    console.log('handleCheckOut called with reservationId:', reservationId);
    if (window.confirm('Check out this guest?')) {
      // Show immediate feedback
      showNotification('Checking out guest...', 'info');
      
      try {
        const result = await checkOutReservation(reservationId);
        console.log('checkOutReservation result:', result);
        if (result.success) {
          showNotification('Guest has been checked out successfully!', 'success');
          // Don't refresh data as DatabaseContext already updated the state
        } else {
          showNotification('Failed to check out guest: ' + result.error, 'error');
          // Revert optimistic update on failure
          setTimeout(() => refreshData(), 100);
        }
      } catch (error) {
        console.error('Error in handleCheckOut:', error);
        showNotification('Error checking out guest: ' + error.message, 'error');
        // Revert optimistic update on error
        setTimeout(() => refreshData(), 100);
      }
    }
  };


  // Bulk operations
  const handleBulkSelect = (reservationId) => {
    setSelectedReservations(prev => 
      prev.includes(reservationId) 
        ? prev.filter(id => id !== reservationId)
        : [...prev, reservationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReservations.length === paginatedReservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(paginatedReservations.map(r => r.id));
    }
  };

  const handleBulkCheckIn = async () => {
    if (selectedReservations.length === 0) return;
    
    if (window.confirm(`Check in ${selectedReservations.length} guests?`)) {
      // Show immediate feedback
      showNotification(`Checking in ${selectedReservations.length} guests...`, 'info');
      
      try {
        const promises = selectedReservations.map(id => checkInReservation(id));
        await Promise.all(promises);
        showNotification(`${selectedReservations.length} guests checked in successfully!`, 'success');
        setSelectedReservations([]);
        // Force immediate UI refresh
        setTimeout(() => refreshData(), 100);
      } catch (error) {
        showNotification('Error checking in guests: ' + error.message, 'error');
      }
    }
  };

  const handleBulkCheckOut = async () => {
    if (selectedReservations.length === 0) return;
    
    if (window.confirm(`Check out ${selectedReservations.length} guests?`)) {
      // Show immediate feedback
      showNotification(`Checking out ${selectedReservations.length} guests...`, 'info');
      
      try {
        const promises = selectedReservations.map(id => checkOutReservation(id));
        await Promise.all(promises);
        showNotification(`${selectedReservations.length} guests checked out successfully!`, 'success');
        setSelectedReservations([]);
        // Force immediate UI refresh
        setTimeout(() => refreshData(), 100);
      } catch (error) {
        showNotification('Error checking out guests: ' + error.message, 'error');
      }
    }
  };

  const handleBulkCancel = async () => {
    if (selectedReservations.length === 0) return;
    
    if (window.confirm(`Cancel ${selectedReservations.length} reservations?`)) {
      // Show immediate feedback
      showNotification(`Cancelling ${selectedReservations.length} reservations...`, 'info');
      
      try {
        const promises = selectedReservations.map(id => cancelReservation(id));
        await Promise.all(promises);
        showNotification(`${selectedReservations.length} reservations cancelled successfully!`, 'success');
        setSelectedReservations([]);
        // Force immediate UI refresh
        setTimeout(() => refreshData(), 100);
      } catch (error) {
        showNotification('Error cancelling reservations: ' + error.message, 'error');
      }
    }
  };


  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setRoomTypeFilter('all');
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Handle add new reservation
  const handleAddNew = () => {
    setSelectedReservation(null);
    setIsAddModalOpen(true);
  };

  // Handle save new reservation
  const handleSaveNew = async (formData) => {
    console.log('handleSaveNew called with:', formData);
    setIsSubmitting(true);
    
    // Show immediate feedback
    showNotification('Creating reservation...', 'info');
    
    try {
      const result = await createReservation(formData);
      console.log('createReservation result:', result);
      if (result.success) {
        showNotification('Reservation created successfully!', 'success');
        setIsAddModalOpen(false);
        // Force immediate UI refresh
        setTimeout(() => refreshData(), 100);
      } else {
        showNotification('Failed to create reservation: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error in handleSaveNew:', error);
      showNotification('Error creating reservation: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredPermissions={['dashboard']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Elegant Notification */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 max-w-sm transform transition-all duration-500 ease-out ${
            notification.type === 'success' ? 'animate-slide-in-right' :
            notification.type === 'error' ? 'animate-slide-in-right' :
            'animate-slide-in-right'
          }`}>
            <div className={`relative overflow-hidden rounded-xl shadow-2xl backdrop-blur-sm border ${
              notification.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400' :
              notification.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-400' :
              'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400'
            }`}>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer"></div>
              
              <div className="relative p-4">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === 'success' ? 'bg-white/20' :
                    notification.type === 'error' ? 'bg-white/20' :
                    'bg-white/20'
                  }`}>
                    {notification.type === 'success' ? <CheckCircle size={18} className="text-white" /> :
                     notification.type === 'error' ? <XCircle size={18} className="text-white" /> :
                     <AlertCircle size={18} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {notification.message}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                      <span className="text-xs text-white/80 font-medium">
                        {notification.type === 'success' ? 'Success' :
                         notification.type === 'error' ? 'Error' :
                         'Info'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotification(null)}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                  >
                    <XCircle size={14} className="text-white" />
                  </button>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                <div className={`h-full bg-white/60 animate-progress ${
                  notification.type === 'success' ? 'animate-progress-success' :
                  notification.type === 'error' ? 'animate-progress-error' :
                  'animate-progress-info'
                }`}></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/30 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Reservation Management</h1>
                  </div>
                  <p className="text-slate-600 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg">Manage client reservations and bookings with ease</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      refreshData().then(() => {
                        showNotification('Data refreshed successfully!', 'success');
                      }).catch(() => {
                        showNotification('Failed to refresh data', 'error');
                      });
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
                  >
                    <RefreshCw size={16} />
                    <span className="font-semibold hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={() => setShowReportGenerator(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
                  >
                    <BarChart3 size={16} />
                    <span className="font-semibold hidden sm:inline">Reports</span>
                  </button>
                  <button
                    onClick={() => setShowReservationHistory(true)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
                  >
                    <History size={16} />
                    <span className="font-semibold hidden sm:inline">History</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentTotals(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
                  >
                    <DollarSign size={16} />
                    <span className="font-semibold hidden sm:inline">Totals</span>
                  </button>
                  <button
                    onClick={handleCleanupOldReservations}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
                    title="Delete reservations older than 7 days from history"
                  >
                    <span className="text-sm">🧹</span>
                    <span className="font-semibold hidden sm:inline">Cleanup</span>
                  </button>
                  <button
                    onClick={() => setShowCredentialsManager(true)}
                    className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
                  >
                    <User size={16} />
                    <span className="font-semibold hidden sm:inline">Credentials</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
                  >
                    <LogOut size={16} />
                    <span className="font-semibold hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filter Panel */}
          <EnhancedFilterPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            roomTypeFilter={roomTypeFilter}
            onRoomTypeFilterChange={setRoomTypeFilter}
            onClearFilters={handleClearFilters}
            selectedReservations={selectedReservations}
            onBulkCheckIn={handleBulkCheckIn}
            onBulkCheckOut={handleBulkCheckOut}
            onBulkCancel={handleBulkCancel}
            showBulkActions={selectedReservations.length > 0}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/30 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {filteredReservations.length}
                </div>
                <div className="text-sm sm:text-base text-slate-600 font-medium">
                  Total Reservations
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/30 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {filteredReservations.filter(r => r.status === 'confirmed').length}
                </div>
                <div className="text-sm sm:text-base text-slate-600 font-medium">
                  Confirmed
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/30 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {filteredReservations.filter(r => r.status === 'checked-in').length}
                </div>
                <div className="text-sm sm:text-base text-slate-600 font-medium">
                  Checked In
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/30 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-lg sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-1 sm:mb-2 break-words">
                  {formatRWF(filteredReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0))}
                </div>
                <div className="text-sm sm:text-base text-slate-600 font-medium">
                  Total Revenue
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Reservations Table */}
          <EnhancedReservationTable
            reservations={paginatedReservations}
            selectedReservations={selectedReservations}
            onBulkSelect={handleBulkSelect}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />

          {/* View Modal */}
          <ReservationViewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            reservation={selectedReservation}
          />

          {/* Edit Modal */}
          <ReservationModifyModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            reservation={selectedReservation}
            onSave={handleSaveEdit}
          />

          {/* Report Generator Modal */}
          <ReportGenerator
            isOpen={showReportGenerator}
            onClose={() => setShowReportGenerator(false)}
            reservations={reservations}
            rooms={[]}
            guests={[]}
          />

          {/* Credentials Manager Modal */}
          {showCredentialsManager && (
            <CredentialsManager onClose={() => setShowCredentialsManager(false)} />
          )}

          {/* Reservation History Modal */}
          {showReservationHistory && (
            <ReservationHistory onClose={() => setShowReservationHistory(false)} />
          )}

          {/* Payment Totals Modal */}
          {showPaymentTotals && (
            <PaymentTotals onClose={() => setShowPaymentTotals(false)} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;