import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyToken: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout')
};

// User API
export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data)
};

// Parent API
export const parents = {
  getChildren: () => api.get('/parents/children'),
  getChildTransactions: (childId) => api.get(`/parents/children/${childId}/transactions`),
  getChildBalance: (childId) => api.get(`/parents/children/${childId}/balance`),
  makePayment: (childId, data) => api.post(`/parents/children/${childId}/payments`, data)
};

// Student API
export const students = {
  getBalance: () => api.get('/students/balance'),
  getTransactions: () => api.get('/students/transactions'),
  getUpcomingPayments: () => api.get('/students/upcoming-payments'),
  makePayment: (data) => api.post('/students/payments', data)
};

// Vendor API
export const vendors = {
  getDashboardStats: () => api.get('/vendors/dashboard'),
  getTransactions: () => api.get('/vendors/transactions'),
  getServiceStats: (service) => api.get(`/vendors/services/${service}/stats`),
  recordSale: (data) => api.post('/vendors/sales', data),
  getInventory: () => api.get('/vendors/inventory'),
  updateInventory: (data) => api.put('/vendors/inventory', data)
};

// Payments API
export const payments = {
  getPaymentMethods: () => api.get('/payments/methods'),
  addPaymentMethod: (data) => api.post('/payments/methods', data),
  removePaymentMethod: (id) => api.delete(`/payments/methods/${id}`),
  processPayment: (data) => api.post('/payments/process', data),
  getPaymentHistory: () => api.get('/payments/history')
};

// School API
export const school = {
  getFees: () => api.get('/school/fees'),
  getAnnouncements: () => api.get('/school/announcements'),
  getEvents: () => api.get('/school/events')
};

export default api;
