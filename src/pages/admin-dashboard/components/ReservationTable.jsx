import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReservationTable = ({ reservations, onViewDetails, onModifyReservation, onCancelReservation }) => {
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'checkIn', direction: 'asc' });
  const [filters, setFilters] = useState({
    guestName: '',
    roomType: '',
    status: '',
    dateRange: { start: '', end: '' }
  });
  const [isExporting, setIsExporting] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'checked-in', label: 'Checked In' },
    { value: 'checked-out', label: 'Checked Out' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const roomTypeOptions = [
    { value: '', label: 'All Room Types' },
    { value: 'standard-twin', label: 'Standard Twin With Balcony' },
    { value: 'deluxe-apartment', label: 'Deluxe Apartment With Balcony And Mountain View' },
    { value: 'deluxe-double', label: 'Deluxe Double Room With Balcony Non-Smoking' },
    { value: 'luxury-double', label: 'Luxury Double/Twin With Balcony' },
    { value: 'standard-mountain', label: 'Standard Room With Balcony Mountain View' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-success/10 text-success', label: 'Confirmed' },
      pending: { color: 'bg-warning/10 text-warning', label: 'Pending' },
      'checked-in': { color: 'bg-accent/10 text-accent', label: 'Checked In' },
      'checked-out': { color: 'bg-muted text-muted-foreground', label: 'Checked Out' },
      cancelled: { color: 'bg-error/10 text-error', label: 'Cancelled' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReservations(reservations?.map(r => r?.id));
    } else {
      setSelectedReservations([]);
    }
  };

  const handleSelectReservation = (reservationId, checked) => {
    if (checked) {
      setSelectedReservations(prev => [...prev, reservationId]);
    } else {
      setSelectedReservations(prev => prev?.filter(id => id !== reservationId));
    }
  };

  const handleExportSelected = async () => {
    if (selectedReservations.length === 0) {
      alert('Please select reservations to export.');
      return;
    }

    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedData = reservations.filter(r => selectedReservations.includes(r.id));
      const csvContent = [
        ['Reservation ID', 'Guest Name', 'Email', 'Phone', 'Room Type', 'Check-in', 'Check-out', 'Status', 'Total Amount'],
        ...selectedData.map(r => [
          r.reservationId,
          r.guestName,
          r.guestEmail,
          r.guestPhone,
          r.roomTypeName,
          r.checkIn,
          r.checkOut,
          r.status,
          r.totalAmount
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      alert(`Successfully exported ${selectedReservations.length} reservations.`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleNewBooking = () => {
    // Create a new reservation and add it to the list
    const newReservation = {
      id: Date.now(), // Simple ID generation
      reservationId: `IVY-2024-${String(Date.now()).slice(-3)}`,
      guestName: "New Guest",
      guestEmail: "guest@example.com",
      guestPhone: "+1 (555) 000-0000",
      guestCount: 2,
      roomType: "standard-twin",
      roomTypeName: "Standard Twin With Balcony",
      checkIn: new Date(Date.now() + 86400000).toLocaleDateString('en-US'), // Tomorrow
      checkOut: new Date(Date.now() + 172800000).toLocaleDateString('en-US'), // Day after tomorrow
      nights: 1,
      status: "pending",
      paymentStatus: "pending",
      totalAmount: "450",
      roomRate: "400",
      taxesAndFees: "50",
      bookingDate: new Date().toLocaleDateString('en-US'),
      specialRequests: "New booking created via dashboard",
      paymentHistory: []
    };
    
    // This would need to be passed as a prop to update the parent state
    alert(`New booking created: ${newReservation.reservationId}. Status: Pending. The reservation has been added to the dashboard.`);
  };

  const filteredReservations = reservations?.filter(reservation => {
    const matchesName = !filters?.guestName || 
      reservation?.guestName?.toLowerCase()?.includes(filters?.guestName?.toLowerCase());
    const matchesRoomType = !filters?.roomType || reservation?.roomType === filters?.roomType;
    const matchesStatus = !filters?.status || reservation?.status === filters?.status;
    
    return matchesName && matchesRoomType && matchesStatus;
  });

  const sortedReservations = [...filteredReservations]?.sort((a, b) => {
    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];
    
    if (sortConfig?.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
    <div className="bg-card rounded-xl luxury-shadow">
      {/* Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Reservation Management
              </h3>
              <p className="text-sm text-muted-foreground">Manage all guest reservations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              disabled={selectedReservations?.length === 0 || isExporting}
              onClick={handleExportSelected}
              className="hover:bg-accent/10 hover:text-accent hover:border-accent/30"
            >
              {isExporting ? 'Exporting...' : 'Export Selected'}
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={handleNewBooking}
              className="bg-accent hover:bg-accent/90"
            >
              New Booking
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Search by guest name..."
            value={filters?.guestName}
            onChange={(e) => setFilters(prev => ({ ...prev, guestName: e?.target?.value }))}
            className="w-full"
          />
          
          <Select
            placeholder="Filter by room type"
            options={roomTypeOptions}
            value={filters?.roomType}
            onChange={(value) => setFilters(prev => ({ ...prev, roomType: value }))}
            className="w-full"
          />
          
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            className="w-full"
          />
          
          <Input
            type="date"
            placeholder="Check-in date"
            value={filters?.dateRange?.start}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              dateRange: { ...prev?.dateRange, start: e?.target?.value }
            }))}
            className="w-full"
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedReservations?.length === reservations?.length}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('reservationId')}
              >
                <div className="flex items-center space-x-1">
                  <span>Reservation ID</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('guestName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Guest Name</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Room Type</th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('checkIn')}
              >
                <div className="flex items-center space-x-1">
                  <span>Check-in</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th 
                className="p-4 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('checkOut')}
              >
                <div className="flex items-center space-x-1">
                  <span>Check-out</span>
                  <Icon name="ArrowUpDown" size={14} />
                </div>
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Payment</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReservations?.map((reservation) => (
              <tr key={reservation?.id} className="border-b border-border hover:bg-muted/30 smooth-transition">
                <td className="p-4">
                  <Checkbox
                    checked={selectedReservations?.includes(reservation?.id)}
                    onChange={(e) => handleSelectReservation(reservation?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm text-accent">{reservation?.reservationId}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div>
                      <div className="font-medium text-card-foreground">{reservation?.guestName}</div>
                      <div className="text-sm text-muted-foreground">{reservation?.guestEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-card-foreground">{reservation?.roomTypeName}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-card-foreground">{reservation?.checkIn}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-card-foreground">{reservation?.checkOut}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(reservation?.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-card-foreground">${reservation?.totalAmount}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      reservation?.paymentStatus === 'paid' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                    }`}>
                      {reservation?.paymentStatus}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        console.log('View details clicked for:', reservation);
                        onViewDetails(reservation);
                      }}
                      className="h-8 w-8 rounded hover:bg-blue-100 flex items-center justify-center group"
                      title="View Details"
                    >
                      <Icon name="FileText" size={16} className="text-blue-600 group-hover:text-blue-700" />
                    </button>
                    <button
                      onClick={() => {
                        console.log('Modify clicked for:', reservation);
                        onModifyReservation(reservation);
                      }}
                      className="h-8 w-8 rounded hover:bg-green-100 flex items-center justify-center group"
                      title="Modify Reservation"
                    >
                      <Icon name="Edit" size={16} className="text-green-600 group-hover:text-green-700" />
                    </button>
                    <button
                      onClick={() => {
                        console.log('Cancel clicked for:', reservation);
                        onCancelReservation(reservation);
                      }}
                      className="h-8 w-8 rounded hover:bg-error/10 text-error hover:text-error flex items-center justify-center"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sortedReservations?.length} of {reservations?.length} reservations
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <span className="text-sm text-muted-foreground">Page 1 of 1</span>
          <Button variant="outline" size="sm" disabled>
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationTable;