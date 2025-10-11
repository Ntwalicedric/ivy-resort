import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../context/DatabaseContext';
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
  AlertCircle
} from 'lucide-react';
import AdminNavigation from '../../components/ui/AdminNavigation';
import EnhancedFilterPanel from './components/EnhancedFilterPanel';
import EnhancedReservationTable from './components/EnhancedReservationTable';

const AdminDashboard = () => {
  console.log('AdminDashboard: Component starting to render');
  
  const navigate = useNavigate();
  
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

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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
    try {
      const result = await updateReservation(selectedReservation.id, formData);
      console.log('updateReservation result:', result);
      if (result.success) {
        showNotification('Reservation updated successfully!', 'success');
        setIsEditModalOpen(false);
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
      try {
        const result = await cancelReservation(reservationId);
        console.log('cancelReservation result:', result);
        if (result.success) {
          showNotification('Reservation deleted successfully!', 'success');
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
      try {
        const result = await checkInReservation(reservationId);
        console.log('checkInReservation result:', result);
        if (result.success) {
          showNotification('Guest checked in successfully!', 'success');
        } else {
          showNotification('Failed to check in guest: ' + result.error, 'error');
        }
      } catch (error) {
        console.error('Error in handleCheckIn:', error);
        showNotification('Error checking in guest: ' + error.message, 'error');
      }
    }
  };

  // Handle check-out reservation
  const handleCheckOut = async (reservationId) => {
    console.log('handleCheckOut called with reservationId:', reservationId);
    if (window.confirm('Check out this guest?')) {
      try {
        const result = await checkOutReservation(reservationId);
        console.log('checkOutReservation result:', result);
        if (result.success) {
          showNotification('Guest checked out successfully!', 'success');
        } else {
          showNotification('Failed to check out guest: ' + result.error, 'error');
        }
      } catch (error) {
        console.error('Error in handleCheckOut:', error);
        showNotification('Error checking out guest: ' + error.message, 'error');
      }
    }
  };

  const handleResendEmail = async (reservationId) => {
    console.log('handleResendEmail called with reservationId:', reservationId);
    try {
      const result = await resendConfirmationEmail(reservationId);
      console.log('resendConfirmationEmail result:', result);
      if (result.success) {
        showNotification(result.message || 'Confirmation email resent successfully!', 'success');
      } else {
        showNotification('Error resending email: ' + (result.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error in handleResendEmail:', error);
      showNotification('Error resending email: ' + error.message, 'error');
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
      try {
        const promises = selectedReservations.map(id => checkInReservation(id));
        await Promise.all(promises);
        showNotification(`${selectedReservations.length} guests checked in successfully!`, 'success');
        setSelectedReservations([]);
      } catch (error) {
        showNotification('Error checking in guests: ' + error.message, 'error');
      }
    }
  };

  const handleBulkCheckOut = async () => {
    if (selectedReservations.length === 0) return;
    
    if (window.confirm(`Check out ${selectedReservations.length} guests?`)) {
      try {
        const promises = selectedReservations.map(id => checkOutReservation(id));
        await Promise.all(promises);
        showNotification(`${selectedReservations.length} guests checked out successfully!`, 'success');
        setSelectedReservations([]);
      } catch (error) {
        showNotification('Error checking out guests: ' + error.message, 'error');
      }
    }
  };

  const handleBulkCancel = async () => {
    if (selectedReservations.length === 0) return;
    
    if (window.confirm(`Cancel ${selectedReservations.length} reservations?`)) {
      try {
        const promises = selectedReservations.map(id => cancelReservation(id));
        await Promise.all(promises);
        showNotification(`${selectedReservations.length} reservations cancelled successfully!`, 'success');
        setSelectedReservations([]);
      } catch (error) {
        showNotification('Error cancelling reservations: ' + error.message, 'error');
      }
    }
  };

  const handleBulkResendEmail = async () => {
    if (selectedReservations.length === 0) return;
    
    if (window.confirm(`Resend confirmation emails to ${selectedReservations.length} guests?`)) {
      try {
        const promises = selectedReservations.map(id => resendConfirmationEmail(id));
        await Promise.all(promises);
        showNotification(`Confirmation emails sent to ${selectedReservations.length} guests!`, 'success');
        setSelectedReservations([]);
      } catch (error) {
        showNotification('Error resending emails: ' + error.message, 'error');
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
    try {
      const result = await createReservation(formData);
      console.log('createReservation result:', result);
      if (result.success) {
        showNotification('Reservation created successfully!', 'success');
        setIsAddModalOpen(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? <CheckCircle size={20} /> :
             notification.type === 'error' ? <XCircle size={20} /> :
             <AlertCircle size={20} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <AdminNavigation onLogout={handleLogout} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          onBulkResendEmail={handleBulkResendEmail}
          showBulkActions={selectedReservations.length > 0}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {filteredReservations.length}
              </div>
              <div className="text-sm text-slate-600">
                Total Reservations
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {filteredReservations.filter(r => r.status === 'confirmed').length}
              </div>
              <div className="text-sm text-slate-600">
                Confirmed
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {filteredReservations.filter(r => r.status === 'checked-in').length}
              </div>
              <div className="text-sm text-slate-600">
                Checked In
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                ${filteredReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">
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
          onResendEmail={handleResendEmail}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;





























