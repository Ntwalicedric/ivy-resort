import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, handleApiError } from '../services/api';
import syncStorage from '../services/syncStorage';

// Debug: Check if api object is properly imported (commented out for production)
// console.log('DatabaseContext: Imported api object:', api);
// console.log('DatabaseContext: api.updateReservation exists:', typeof api.updateReservation);
// console.log('DatabaseContext: api.cancelReservation exists:', typeof api.cancelReservation);
// console.log('DatabaseContext: api.createReservation exists:', typeof api.createReservation);

// Database Context
const DatabaseContext = createContext({
  // Data
  reservations: [],
  users: [],
  rooms: [],
  guests: [],
  overview: null,
  reports: null,
  
  // Loading states
  loading: {
    reservations: false,
    users: false,
    rooms: false,
    guests: false,
    overview: false,
    reports: false
  },
  
  // Error states
  errors: {
    reservations: null,
    users: null,
    rooms: null,
    guests: null,
    overview: null,
    reports: null
  },
  
  // Actions
  refreshData: () => {},
  refreshReservations: () => {},
  refreshRooms: () => {},
  refreshGuests: () => {},
  refreshUsers: () => {},
  refreshOverview: () => {},
  refreshReports: () => {},
  
  // CRUD Operations
  createReservation: () => {},
  updateReservation: () => {},
  cancelReservation: () => {},
  updateRoomStatus: () => {},
  updateGuest: () => {},
  // Users CRUD
  createUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  
  // Filters and search
  setReservationFilters: () => {},
  setRoomFilters: () => {},
  setGuestFilters: () => {},
  
  // Real-time updates
  enableRealTime: () => {},
  disableRealTime: () => {},
});

// Database Provider Component
export const DatabaseProvider = ({ children }) => {
  // Data states
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState(null);
  const [reports, setReports] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    reservations: false,
    users: false,
    rooms: false,
    guests: false,
    overview: false,
    reports: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    reservations: null,
    users: null,
    rooms: null,
    guests: null,
    overview: null,
    reports: null
  });
  
  // Filters
  const [filters, setFilters] = useState({
    reservations: {},
    rooms: {},
    guests: {}
  });
  
  // Real-time updates
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  // Generic data fetcher
  const fetchData = useCallback(async (dataType, params = {}) => {
    console.log(`DatabaseContext: fetchData called for ${dataType}`, params);
    setLoading(prev => ({ ...prev, [dataType]: true }));
    setErrors(prev => ({ ...prev, [dataType]: null }));
    
    try {
      let data;
      switch (dataType) {
        case 'reservations':
          data = await api.getReservations(params);
          console.log(`DatabaseContext: fetched ${dataType} data:`, data);
          setReservations(data);
          break;
        case 'rooms':
          data = await api.getRooms(params);
          console.log(`DatabaseContext: fetched ${dataType} data:`, data);
          setRooms(data);
          break;
        case 'guests':
          data = await api.getGuests(params);
          console.log(`DatabaseContext: fetched ${dataType} data:`, data);
          setGuests(data);
          break;
        case 'users':
          data = await api.getUsers(params);
          console.log(`DatabaseContext: fetched ${dataType} data:`, data);
          setUsers(data);
          break;
        case 'overview':
          data = await api.getOverview();
          console.log(`DatabaseContext: fetched ${dataType} data:`, data);
          setOverview(data);
          break;
        case 'reports':
          data = await api.getReports();
          console.log(`DatabaseContext: fetched ${dataType} data:`, data);
          setReports(data);
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }
    } catch (error) {
      const errorMessage = handleApiError(error, `Fetching ${dataType}`);
      setErrors(prev => ({ ...prev, [dataType]: errorMessage }));
      console.error(`Error fetching ${dataType}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [dataType]: false }));
    }
  }, []); // Remove filters dependency to avoid circular dependency
  
  // Individual refresh functions
  const refreshReservations = useCallback((params = {}) => {
    fetchData('reservations', params);
  }, [fetchData]);
  
  const refreshRooms = useCallback((params = {}) => {
    fetchData('rooms', params);
  }, [fetchData]);
  
  const refreshGuests = useCallback((params = {}) => {
    fetchData('guests', params);
  }, [fetchData]);
  
  const refreshUsers = useCallback((params = {}) => {
    fetchData('users', params);
  }, [fetchData]);
  
  const refreshOverview = useCallback(() => {
    fetchData('overview');
  }, [fetchData]);
  
  const refreshReports = useCallback(() => {
    fetchData('reports');
  }, [fetchData]);
  
  // Refresh all data
  const refreshData = useCallback(() => {
    console.log('DatabaseContext: refreshData called');
    // Call individual refresh functions directly
    refreshReservations();
    refreshRooms();
    refreshGuests();
    refreshUsers();
    refreshOverview();
    refreshReports();
  }, [refreshReservations, refreshRooms, refreshGuests, refreshOverview, refreshReports]);
  
  // CRUD Operations
  const createReservation = useCallback(async (reservationData) => {
    console.log('DatabaseContext: createReservation called with:', reservationData);
    try {
      setLoading(prev => ({ ...prev, reservations: true }));
      const response = await api.createReservation(reservationData);
      console.log('DatabaseContext: createReservation API response:', response);
      if (response.success) {
        const newReservations = [response.data, ...reservations];
        setReservations(newReservations);
        
        // Sync data across devices
        syncStorage.setLocalData({
          reservations: newReservations,
          lastUpdated: Date.now()
        });
        
        return { 
          success: true, 
          data: response.data,
          emailResult: response.emailResult
        };
      } else {
        return { success: false, error: response.error || 'Failed to create reservation' };
      }
    } catch (error) {
      console.error('DatabaseContext: createReservation error:', error);
      const errorMessage = handleApiError(error, 'Creating reservation');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }));
    }
  }, []);
  
  const updateReservation = useCallback(async (id, updateData) => {
    console.log('DatabaseContext: updateReservation called with:', { id, updateData });
    try {
      setLoading(prev => ({ ...prev, reservations: true }));
      const response = await api.updateReservation(id, updateData);
      console.log('DatabaseContext: updateReservation API response:', response);
      if (response.success) {
        console.log('DatabaseContext: Updating reservation state, current reservations:', reservations);
        setReservations(prev => {
          const updated = prev.map(reservation => 
            reservation.id === parseInt(id) || reservation.id === id ? response.data : reservation
          );
          console.log('DatabaseContext: Updated reservations:', updated);
          return updated;
        });
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to update reservation' };
      }
    } catch (error) {
      console.error('DatabaseContext: updateReservation error:', error);
      const errorMessage = handleApiError(error, 'Updating reservation');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }));
    }
  }, []);
  
  const cancelReservation = useCallback(async (id) => {
    console.log('DatabaseContext: cancelReservation called with id:', id);
    try {
      setLoading(prev => ({ ...prev, reservations: true }));
      const response = await api.cancelReservation(id);
      console.log('DatabaseContext: cancelReservation API response:', response);
      if (response.success) {
        console.log('DatabaseContext: Cancelling reservation state, current reservations:', reservations);
        setReservations(prev => {
          const updated = prev.map(reservation => 
            reservation.id === parseInt(id) || reservation.id === id
              ? response.data
              : reservation
          );
          console.log('DatabaseContext: Updated reservations after cancellation:', updated);
          return updated;
        });
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to cancel reservation' };
      }
    } catch (error) {
      console.error('DatabaseContext: cancelReservation error:', error);
      const errorMessage = handleApiError(error, 'Cancelling reservation');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }));
    }
  }, []);

  const checkInReservation = useCallback(async (id) => {
    console.log('DatabaseContext: checkInReservation called with id:', id);
    try {
      setLoading(prev => ({ ...prev, reservations: true }));
      // Simulate API call for check-in
      const response = { success: true, data: { id: parseInt(id), status: 'checked-in', updatedAt: new Date().toISOString() } };
      console.log('DatabaseContext: checkInReservation API response:', response);
      if (response.success) {
        setReservations(prev => {
          const updated = prev.map(reservation => 
            reservation.id === parseInt(id) || reservation.id === id
              ? { ...reservation, status: 'checked-in', updatedAt: new Date().toISOString() }
              : reservation
          );
          console.log('DatabaseContext: Updated reservations after check-in:', updated);
          return updated;
        });
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to check-in reservation' };
      }
    } catch (error) {
      console.error('DatabaseContext: checkInReservation error:', error);
      const errorMessage = handleApiError(error, 'Checking in reservation');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }));
    }
  }, []);

  const checkOutReservation = useCallback(async (id) => {
    console.log('DatabaseContext: checkOutReservation called with id:', id);
    try {
      setLoading(prev => ({ ...prev, reservations: true }));
      
      // Immediately update the UI for better responsiveness
      setReservations(prev => {
        const updated = prev.map(reservation => 
          reservation.id === parseInt(id) || reservation.id === id
            ? { ...reservation, status: 'checked-out', updatedAt: new Date().toISOString() }
            : reservation
        );
        console.log('DatabaseContext: Immediately updated reservations for check-out:', updated);
        return updated;
      });
      
      // Simulate API call for check-out
      const response = { success: true, data: { id: parseInt(id), status: 'checked-out', updatedAt: new Date().toISOString() } };
      console.log('DatabaseContext: checkOutReservation API response:', response);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        // Revert the optimistic update if API call fails
        setReservations(prev => {
          const reverted = prev.map(reservation => 
            reservation.id === parseInt(id) || reservation.id === id
              ? { ...reservation, status: 'confirmed', updatedAt: new Date().toISOString() }
              : reservation
          );
          console.log('DatabaseContext: Reverted reservations after check-out failure:', reverted);
          return reverted;
        });
        return { success: false, error: response.error || 'Failed to check-out reservation' };
      }
    } catch (error) {
      console.error('DatabaseContext: checkOutReservation error:', error);
      const errorMessage = handleApiError(error, 'Checking out reservation');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }));
    }
  }, []);

  // Users CRUD
  const createUser = useCallback(async (userData) => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await api.createUser(userData);
      if (response.success) {
        setUsers(prev => [response.data, ...prev]);
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error || 'Failed to create user' };
    } catch (error) {
      const errorMessage = handleApiError(error, 'Creating user');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, []);

  const updateUser = useCallback(async (id, userData) => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await api.updateUser(id, userData);
      if (response.success) {
        setUsers(prev => prev.map(u => (u.id === parseInt(id) || u.id === id) ? response.data : u));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error || 'Failed to update user' };
    } catch (error) {
      const errorMessage = handleApiError(error, 'Updating user');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await api.deleteUser(id);
      if (response.success) {
        setUsers(prev => prev.filter(u => u.id !== parseInt(id) && u.id !== id));
        return { success: true };
      }
      return { success: false, error: response.error || 'Failed to delete user' };
    } catch (error) {
      const errorMessage = handleApiError(error, 'Deleting user');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, []);

  const resendConfirmationEmail = useCallback(async (id) => {
    console.log('DatabaseContext: resendConfirmationEmail called with id:', id);
    try {
      setLoading(prev => ({ ...prev, reservations: true }));
      const response = await api.resendConfirmationEmail(id);
      console.log('DatabaseContext: resendConfirmationEmail API response:', response);
      if (response.success) {
        setReservations(prev => {
          const updated = prev.map(reservation => 
            reservation.id === parseInt(id) || reservation.id === id
              ? response.data
              : reservation
          );
          console.log('DatabaseContext: Updated reservations after resend email:', updated);
          return updated;
        });
        return { success: true, data: response.data, message: response.message };
      } else {
        return { success: false, error: response.error || 'Failed to resend confirmation email' };
      }
    } catch (error) {
      console.error('DatabaseContext: resendConfirmationEmail error:', error);
      const errorMessage = handleApiError(error, 'Resending confirmation email');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }));
    }
  }, []);
  
  const updateRoomStatus = useCallback(async (id, status) => {
    try {
      setLoading(prev => ({ ...prev, rooms: true }));
      const updatedRoom = await api.updateRoomStatus(id, status);
      setRooms(prev => 
        prev.map(room => 
          room.id === id ? updatedRoom : room
        )
      );
      return { success: true, data: updatedRoom };
    } catch (error) {
      const errorMessage = handleApiError(error, 'Updating room status');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, rooms: false }));
    }
  }, []);
  
  const updateGuest = useCallback(async (id, updateData) => {
    try {
      setLoading(prev => ({ ...prev, guests: true }));
      const updatedGuest = await api.updateGuest(id, updateData);
      setGuests(prev => 
        prev.map(guest => 
          guest.id === id ? updatedGuest : guest
        )
      );
      return { success: true, data: updatedGuest };
    } catch (error) {
      const errorMessage = handleApiError(error, 'Updating guest');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, guests: false }));
    }
  }, []);
  
  // Filter functions
  const setReservationFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, reservations: { ...prev.reservations, ...newFilters } }));
  }, []);
  
  const setRoomFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, rooms: { ...prev.rooms, ...newFilters } }));
  }, []);
  
  const setGuestFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, guests: { ...prev.guests, ...newFilters } }));
  }, []);
  
  // Real-time updates
  const enableRealTime = useCallback((interval = 30000) => {
    setRealTimeEnabled(true);
    const intervalId = setInterval(() => {
      refreshData();
    }, interval);
    setRefreshInterval(intervalId);
  }, [refreshData]);
  
  const disableRealTime = useCallback(() => {
    setRealTimeEnabled(false);
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [refreshInterval]);
  
  // Load initial data on mount (defer heavy admin-only data on public pages)
  useEffect(() => {
    // Initialize sync storage
    syncStorage.initialize();
    
    // Add sync listener for cross-device updates
    syncStorage.addSyncListener((syncedData) => {
      if (syncedData && syncedData.reservations) {
        console.log('DatabaseContext: Received sync update with', syncedData.reservations.length, 'reservations');
        setReservations(syncedData.reservations);
      }
    });
    
    const isAdminRoute = typeof window !== 'undefined' && window.location && window.location.pathname && window.location.pathname.startsWith('/admin');
    if (!isAdminRoute) {
      // Skip admin-heavy fetches on public pages to improve loading time
      return;
    }
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      console.log('DatabaseContext: Loading initial data...');
    }
    try {
      // Call individual functions directly to avoid dependency issues
      fetchData('reservations');
      fetchData('rooms');
      fetchData('guests');
      fetchData('overview');
      fetchData('reports');
    } catch (error) {
      console.error('DatabaseContext: Error loading initial data:', error);
    }
  }, []); // Empty dependency array to run only once on mount

  // Debug: Log when reservations state changes
  useEffect(() => {
    console.log('DatabaseContext: Reservations state changed:', reservations);
  }, [reservations]);

  // Auto-cleanup: Remove checked-out or cancelled reservations after 2 minutes
  useEffect(() => {
    const cleanupInterval = setInterval(async () => {
      try {
        // Call the API cleanup function to remove old reservations from mock data
        const removedCount = await api.cleanupOldReservations();
        
        if (removedCount > 0) {
          // Refresh reservations data to reflect the cleanup
          console.log(`DatabaseContext: Refreshing data after cleanup of ${removedCount} reservations`);
          const updatedReservations = await api.getReservations();
          setReservations(updatedReservations);
        }
      } catch (error) {
        console.error('DatabaseContext: Error during cleanup:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  // Debug logging (commented out for production)
  // console.log('DatabaseContext: Current state:', {
  //   reservations: reservations.length,
  //   rooms: rooms.length,
  //   guests: guests.length,
  //   overview: overview,
  //   loading,
  //   errors
  // });
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);
  
  const value = {
    // Data
    reservations,
    users,
    rooms,
    guests,
    overview,
    reports,
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // Actions
    refreshData,
    refreshReservations,
    refreshRooms,
    refreshGuests,
    refreshUsers,
    refreshOverview,
    refreshReports,
    
    // CRUD Operations
    createReservation,
    updateReservation,
    cancelReservation,
    checkInReservation,
    checkOutReservation,
    resendConfirmationEmail,
    updateRoomStatus,
    updateGuest,
    // Users CRUD
    createUser,
    updateUser,
    deleteUser,
    
    // Filters and search
    setReservationFilters,
    setRoomFilters,
    setGuestFilters,
    
    // Real-time updates
    enableRealTime,
    disableRealTime,
    realTimeEnabled
  };
  
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Hook to use database context
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export default DatabaseContext;
