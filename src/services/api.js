// API Service Layer for Ivy Resort Dashboard
// Handles all database operations and API calls

import { roomsData } from '../data/rooms';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:4028/api';
const API_TIMEOUT = 10000; // 10 seconds

// API Response Handler
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API Request Wrapper
const apiRequest = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return handleApiResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Real API Implementation
export const dashboardApi = {
  // Overview & Metrics
  getOverview: () => apiRequest('/overview'),
  
  // Reservations
  getReservations: (params = {}) => {
    console.log('Mock API: getReservations called');
    return Promise.resolve([
      {
        id: 1,
        guestName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        roomNumber: '101',
        roomType: 'Deluxe',
        checkIn: '2024-01-15',
        checkOut: '2024-01-18',
        status: 'confirmed',
        guests: 2,
        totalAmount: 450.00,
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z'
      },
      {
        id: 2,
        guestName: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0456',
        roomNumber: '205',
        roomType: 'Standard',
        checkIn: '2024-01-20',
        checkOut: '2024-01-25',
        status: 'pending',
        guests: 1,
        totalAmount: 320.00,
        createdAt: '2024-01-12T14:30:00Z',
        updatedAt: '2024-01-12T14:30:00Z'
      },
      {
        id: 3,
        guestName: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1-555-0789',
        roomNumber: '302',
        roomType: 'Suite',
        checkIn: '2024-01-25',
        checkOut: '2024-01-28',
        status: 'checked-in',
        guests: 3,
        totalAmount: 680.00,
        createdAt: '2024-01-15T09:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z'
      }
    ]);
  },
  
  createReservation: (data) => {
    console.log('Mock API: createReservation called with data:', data);
    return Promise.resolve({
      success: true,
      data: {
        id: Date.now(), // Generate a unique ID
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  },
  
  updateReservation: (id, data) => {
    console.log('Mock API: updateReservation called with id:', id, 'data:', data);
    return Promise.resolve({
      success: true,
      data: {
        id: parseInt(id),
        ...data,
        updatedAt: new Date().toISOString()
      }
    });
  },
  
  cancelReservation: (id) => {
    console.log('Mock API: cancelReservation called with id:', id);
    return Promise.resolve({
      success: true,
      data: {
        id: parseInt(id),
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      }
    });
  },
  
  // Rooms
  getRooms: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/rooms?${queryString}`);
  },
  
  updateRoomStatus: (id, status) => apiRequest(`/rooms/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  // Guests
  getGuests: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/guests?${queryString}`);
  },
  
  updateGuest: (id, data) => apiRequest(`/guests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Reports & Analytics
  getReports: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reports?${queryString}`);
  },
  
  getRevenueReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reports/revenue?${queryString}`);
  },
  
  getOccupancyReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reports/occupancy?${queryString}`);
  },
};

// Mock Data Fallback (for development/testing)
// Maintain state for CRUD operations
let mockReservations = [];
let mockUsers = [];

// Local storage keys
const LS_KEYS = {
  reservations: 'ivy_resort_reservations',
  users: 'ivy_resort_users'
};

// Persistence helpers
const loadFromLocalStorage = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.warn('LocalStorage load failed for', key, e);
    return fallback;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed for', key, e);
  }
};

// Generate unique confirmation ID
const generateConfirmationId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `IVY-${timestamp}-${random}`.toUpperCase();
};

// Import email services
import emailService from './emailService';

// Send confirmation email using serverless function (enrich payload to match template expectations)
const sendConfirmationEmail = async (reservation) => {
  console.log(`📧 API: Sending confirmation email to ${reservation.email}`);
  console.log(`📧 API: Confirmation ID: ${reservation.confirmationId}`);
  console.log(`📧 API: Reservation Details:`, {
    guestName: reservation.guestName,
    roomName: reservation.roomName,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    totalAmount: reservation.totalAmount
  });
  
  // Validate reservation data
  if (!reservation.email || !reservation.guestName || !reservation.confirmationId) {
    console.error('📧 API: Invalid reservation data for email sending');
    return {
      success: false,
      error: 'Invalid reservation data',
      message: 'Missing required fields for email sending'
    };
  }
  
  // Enrich reservation with currency display fields if missing
  try {
    const currency = reservation.currency || 'USD';
    const amountInCurrency = reservation.totalAmountInCurrency ?? reservation.totalAmount;
    const isRWF = currency === 'RWF';
    const totalAmountDisplay = reservation.totalAmountDisplay ?? new Intl.NumberFormat(isRWF ? 'en-RW' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: isRWF ? 0 : 2,
      maximumFractionDigits: isRWF ? 0 : 2,
    })?.format(amountInCurrency);
    reservation = { ...reservation, totalAmountInCurrency: amountInCurrency, totalAmountDisplay };
  } catch {
    // noop if Intl formatting fails
  }

  // Method 1: Use Vercel serverless function
  try {
    console.log('📧 API: Sending email via Vercel serverless function...');
    const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_EMAIL_API_URL) || '/api';
    const response = await fetch(`${baseUrl}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reservation })
    });
    
    const result = await response.json();
    console.log(`📧 API: Vercel serverless function result:`, result);
    
    if (result.success) {
      console.log('📧 API: Email sent successfully via Vercel serverless function!');
      return result;
    }
  } catch (error) {
    console.warn('📧 API: Vercel serverless function failed:', error.message);
  }
  
  // EmailJS fallback removed to avoid inconsistent templates
  
  // If both methods fail
  return {
    success: false,
    error: 'All email methods failed',
    message: 'Automatic email sending failed. Vercel serverless function is unavailable.'
  };
};

// Initialize mock reservations with room data
const initializeMockReservations = () => {
  if (mockReservations.length === 0) {
    // Attempt to load from localStorage first
    const stored = loadFromLocalStorage(LS_KEYS.reservations, []);
    if (stored.length > 0) {
      mockReservations = stored;
      return;
    }
  }

  // Start with empty array - no hardcoded persistent guests
  if (mockReservations.length === 0) {
    mockReservations = [];
    saveToLocalStorage(LS_KEYS.reservations, mockReservations);
  }
};

// Initialize mock users
const initializeMockUsers = () => {
  if (mockUsers.length === 0) {
    const stored = loadFromLocalStorage(LS_KEYS.users, []);
    if (stored.length > 0) {
      mockUsers = stored;
      return;
    }
  }

  if (mockUsers.length === 0) {
    mockUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@ivyresort.com',
        role: 'admin',
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        name: 'Manager Jane',
        email: 'jane.manager@ivyresort.com',
        role: 'manager',
        active: true,
        createdAt: '2024-01-05T10:15:00Z',
        updatedAt: '2024-01-05T10:15:00Z'
      }
    ];
    saveToLocalStorage(LS_KEYS.users, mockUsers);
  }
};

export const mockDataApi = {
  getOverview: () => {
    console.log('Mock API: getOverview called');
    return Promise.resolve({
      totalReservations: 156,
      totalRevenue: 125000,
      occupancyRate: 78.5,
      averageRating: 4.7,
      upcomingArrivals: 12,
      pendingCheckouts: 8,
      maintenanceRequests: 3,
      guestSatisfaction: 92,
      monthlyGrowth: 12.5,
      todayArrivals: 8,
      todayDepartures: 5,
      pendingReservations: 12
    });
  },
  
  getReservations: () => {
    console.log('Mock API: getReservations called');
    initializeMockReservations();
    return Promise.resolve([...mockReservations]); // Return a copy to prevent direct mutation
  },
  
  getRooms: () => {
    console.log('Mock API: getRooms called');
    
    // Ensure roomsData is available
    if (!roomsData || roomsData.length === 0) {
      console.error('Mock API: roomsData not available');
      return Promise.resolve([]);
    }
    
    // Transform the real room data to match dashboard format
    const transformedRooms = roomsData.map((room, index) => ({
      id: room.id,
      number: `${room.id}0${index + 1}`, // Generate room numbers like 101, 202, etc.
      type: room.shortName,
      name: room.name,
      pricePerNight: room.pricePerNight,
      maxGuests: room.maxGuests,
      size: room.size,
      status: room.available ? 'available' : 'occupied',
      guest: room.available ? null : 'Sample Guest',
      floor: Math.ceil(room.id / 2), // Distribute across floors
      amenities: room.keyAmenities.map(amenity => amenity.name),
      allAmenities: room.allAmenities.map(amenity => amenity.name),
      description: room.description,
      images: room.images,
      isPopular: room.isPopular,
      specialOffers: room.specialOffers
    }));
    
    return Promise.resolve(transformedRooms);
  },
  
  getGuests: () => {
    console.log('Mock API: getGuests called');
    return Promise.resolve([
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        nationality: 'US',
        checkInDate: '2024-01-15',
        checkOutDate: '2024-01-18',
        roomNumber: '101',
        status: 'checked-in',
        preferences: ['Non-smoking', 'High floor'],
        totalSpent: 450,
        loyaltyPoints: 450
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0456',
        nationality: 'CA',
        checkInDate: '2024-01-16',
        checkOutDate: '2024-01-20',
        roomNumber: '202',
        status: 'pending',
        preferences: ['Vegetarian meals', 'Ground floor'],
        totalSpent: 0,
        loyaltyPoints: 800
      }
    ]);
  },
  
  getReports: () => {
    console.log('Mock API: getReports called');
    return Promise.resolve({
      revenue: {
        daily: 2500,
        weekly: 17500,
        monthly: 75000,
        yearly: 900000
      },
      occupancy: {
        current: 78.5,
        average: 72.3,
        peak: 95.2
      },
      guestSatisfaction: {
        current: 4.7,
        average: 4.6,
        reviews: 156
      }
    });
  },

  // CRUD Operations for Reservations
  createReservation: async (data) => {
    console.log('Mock API: createReservation called with data:', data);
    initializeMockReservations();
    
    const confirmationId = generateConfirmationId();
    const newReservation = {
      id: Date.now(), // Generate a unique ID
      ...data,
      confirmationId,
      emailSent: false,
      status: 'pending', // Start as pending until email is sent
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock data
    mockReservations.push(newReservation);
    saveToLocalStorage(LS_KEYS.reservations, mockReservations);
    
    // Send confirmation email
    let emailResult = { success: false, message: 'Email sending not attempted' };
    
    try {
      console.log('📧 Mock API: Attempting to send confirmation email...');
      emailResult = await sendConfirmationEmail(newReservation);
      console.log('📧 Mock API: Email result:', emailResult);
      
      if (emailResult.success) {
        // Update reservation status to confirmed after email is sent
        newReservation.status = 'confirmed';
        newReservation.emailSent = true;
        newReservation.updatedAt = new Date().toISOString();
        
        // Update in mock data
        const index = mockReservations.findIndex(r => r.id === newReservation.id);
        if (index !== -1) {
          mockReservations[index] = newReservation;
        }
        
        console.log('📧 Mock API: Email sent successfully, reservation confirmed');
      } else {
        console.warn('📧 Mock API: Email sending failed, keeping reservation as pending');
        newReservation.status = 'pending';
        newReservation.emailSent = false;
      }
    } catch (error) {
      console.error('📧 Mock API: Failed to send confirmation email:', error);
      emailResult = {
        success: false,
        error: error.message,
        message: 'Email sending failed due to error'
      };
    }
    
    // Persist after email attempt
    saveToLocalStorage(LS_KEYS.reservations, mockReservations);

    return Promise.resolve({
      success: true,
      data: newReservation,
      emailResult: emailResult
    });
  },
  
  updateReservation: (id, data) => {
    console.log('Mock API: updateReservation called with id:', id, 'data:', data);
    initializeMockReservations();
    const index = mockReservations.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      mockReservations[index] = {
        ...mockReservations[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      saveToLocalStorage(LS_KEYS.reservations, mockReservations);
      return Promise.resolve({
        success: true,
        data: mockReservations[index]
      });
    } else {
      return Promise.resolve({
        success: false,
        error: 'Reservation not found'
      });
    }
  },
  
  cancelReservation: (id) => {
    console.log('Mock API: cancelReservation called with id:', id);
    initializeMockReservations();
    const index = mockReservations.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      mockReservations[index] = {
        ...mockReservations[index],
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      };
      saveToLocalStorage(LS_KEYS.reservations, mockReservations);
      return Promise.resolve({
        success: true,
        data: mockReservations[index]
      });
    } else {
      return Promise.resolve({
        success: false,
        error: 'Reservation not found'
      });
    }
  },

  // Helper function to clean up old cancelled/checked-out reservations
  cleanupOldReservations: () => {
    initializeMockReservations();
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    
    const initialLength = mockReservations.length;
    mockReservations = mockReservations.filter(reservation => {
      if (reservation.status === 'cancelled' || reservation.status === 'checked-out') {
        const updatedAt = new Date(reservation.updatedAt || reservation.createdAt);
        return updatedAt > twoMinutesAgo;
      }
      return true;
    });
    
    const removedCount = initialLength - mockReservations.length;
    if (removedCount > 0) {
      saveToLocalStorage(LS_KEYS.reservations, mockReservations);
    }
    if (removedCount > 0) {
      console.log(`Mock API: Cleaned up ${removedCount} old reservations`);
    }
    
    return removedCount;
  },

  // Clear all reservations (for testing/cleanup)
  clearAllReservations: () => {
    console.log('Mock API: Clearing all reservations');
    mockReservations = [];
    saveToLocalStorage(LS_KEYS.reservations, mockReservations);
    return { success: true, message: 'All reservations cleared' };
  },

  // Resend confirmation email
  resendConfirmationEmail: async (id) => {
    console.log('Mock API: resendConfirmationEmail called with id:', id);
    initializeMockReservations();
    
    const reservation = mockReservations.find(r => r.id === parseInt(id));
    if (!reservation) {
      return Promise.resolve({
        success: false,
        error: 'Reservation not found'
      });
    }
    
    try {
      const emailResult = await sendConfirmationEmail(reservation);
      if (emailResult.success) {
        // Update email sent status
        reservation.emailSent = true;
        reservation.updatedAt = new Date().toISOString();
        
        // Update in mock data
        const index = mockReservations.findIndex(r => r.id === reservation.id);
        if (index !== -1) {
          mockReservations[index] = reservation;
        }
        saveToLocalStorage(LS_KEYS.reservations, mockReservations);
      }
      
      return Promise.resolve({
        success: emailResult.success,
        data: reservation,
        message: emailResult.message
      });
    } catch (error) {
      console.error('Mock API: Failed to resend confirmation email:', error);
      return Promise.resolve({
        success: false,
        error: 'Failed to resend confirmation email'
      });
    }
  },

  // Users API (Dashboard user management)
  getUsers: () => {
    console.log('Mock API: getUsers called');
    initializeMockUsers();
    return Promise.resolve([...mockUsers]);
  },

  createUser: (data) => {
    console.log('Mock API: createUser called with data:', data);
    initializeMockUsers();
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      role: data.role || 'staff',
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    saveToLocalStorage(LS_KEYS.users, mockUsers);
    return Promise.resolve({ success: true, data: newUser });
  },

  updateUser: (id, data) => {
    console.log('Mock API: updateUser called with id:', id);
    initializeMockUsers();
    const index = mockUsers.findIndex(u => u.id === parseInt(id));
    if (index === -1) return Promise.resolve({ success: false, error: 'User not found' });
    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    saveToLocalStorage(LS_KEYS.users, mockUsers);
    return Promise.resolve({ success: true, data: mockUsers[index] });
  },

  deleteUser: (id) => {
    console.log('Mock API: deleteUser called with id:', id);
    initializeMockUsers();
    const before = mockUsers.length;
    mockUsers = mockUsers.filter(u => u.id !== parseInt(id));
    const removed = before - mockUsers.length;
    saveToLocalStorage(LS_KEYS.users, mockUsers);
    return Promise.resolve({ success: removed > 0 });
  }
};

// Determine which API to use based on environment
// Always use mock data for now to avoid environment variable issues
const useMockData = true;

console.log('API Service: Using mock data =', useMockData);
// Debug logs commented out for production
// console.log('API Service: mockDataApi object:', mockDataApi);
// console.log('API Service: mockDataApi.updateReservation exists:', typeof mockDataApi.updateReservation);
// console.log('API Service: mockDataApi.cancelReservation exists:', typeof mockDataApi.cancelReservation);
// console.log('API Service: mockDataApi.createReservation exists:', typeof mockDataApi.createReservation);

export const api = mockDataApi;

// Utility function to check if API is available
export const isApiAvailable = () => {
  return !useMockData && (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL);
};

// Error handling utility
export const handleApiError = (error, context = 'API call') => {
  console.error(`${context} failed:`, error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    context
  };
};