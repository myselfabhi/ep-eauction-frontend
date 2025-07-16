import { Currency, FileType } from './enums';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    VERIFY_FORGOT_OTP: '/auth/verify-forgot-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Auction endpoints
  AUCTION: {
    BASE: '/auction',
    CREATE: '/auction/create',
    GET_ALL: '/auction',
    GET_BY_ID: (id: string) => `/auction/${id}`,
    GET_SINGLE: (id: string) => `/auction/${id}`,
    UPDATE: (id: string) => `/auction/update/${id}`,
    DELETE: (id: string) => `/auction/${id}`,
    PAUSE: (id: string) => `/auction/${id}/pause`,
    RESUME: (id: string) => `/auction/${id}/resume`,
    MONITORING: (id: string) => `/auction/${id}/monitoring`,
    LAUNCH: (id: string) => `/auction/${id}/launch`,
  },

  // Bid endpoints
  BID: {
    BASE: '/bid',
    CREATE: '/bid',
    GET_BY_AUCTION: (auctionId: string) => `/bid/auction/${auctionId}`,
    RANKING: (auctionId: string) => `/bid/ranking/${auctionId}`,
    UPDATE: (id: string) => `/bid/${id}`,
    DELETE: (id: string) => `/bid/${id}`,
  },

  // User endpoints
  USER: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    CHECK_EMAIL: (email: string) => `/users/check-email?email=${encodeURIComponent(email)}`,
  },

  // Supplier endpoints
  SUPPLIER: {
    BASE: '/suppliers',
    GET_ALL: '/suppliers',
    CREATE: '/suppliers',
    UPDATE: (id: string) => `/suppliers/${id}`,
    DELETE: (id: string) => `/suppliers/${id}`,
    INVITE: '/suppliers/invite',
  },

  // Currency endpoints
  CURRENCY: {
    BASE: '/currency',
    RATES: '/currency/rates',
    UPDATE_RATE: '/currency/rates',
  },

  // Duty endpoints
  DUTY: {
    BASE: '/import-duty',
    PRODUCTS: '/import-duty/products',
    PRODUCT: '/import-duty/product',
    MATRIX: '/import-duty/matrix',
  },

  // Invitation endpoints
  INVITATION: {
    BASE: '/invitations',
    SEND: '/invitations/send',
    ACCEPT: (id: string) => `/invitations/${id}/accept`,
    DECLINE: (id: string) => `/invitations/${id}/decline`,
  },
} as const;

// Application configuration
export const APP_CONFIG = {
  // API configuration
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },

  // Socket configuration
  SOCKET: {
    URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002',
    RECONNECTION_ATTEMPTS: 5,
    RECONNECTION_DELAY: 1000,
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // File upload
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [FileType.PDF, FileType.EXCEL, FileType.CSV, FileType.IMAGE],
    MAX_FILES: 5,
  },

  // Auction configuration
  AUCTION: {
    MIN_DURATION: 5 * 60 * 1000, // 5 minutes
    MAX_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    EXTENSION_TIME: 2 * 60 * 1000, // 2 minutes
    MIN_BID_INCREMENT: 0.01,
  },

  // UI configuration
  UI: {
    TOAST_DURATION: 5000,
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 200,
    MODAL_BACKDROP_BLUR: true,
  },

  // Validation
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    EMAIL_MAX_LENGTH: 254,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 1000,
  },
} as const;

// Default values
export const DEFAULTS = {
  // Currency defaults
  CURRENCY: {
    DEFAULT: Currency.USD,
    DECIMAL_PLACES: 2,
  },

  // Time defaults
  TIME: {
    DEFAULT_TIMEZONE: 'UTC',
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm:ss',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  },

  // Form defaults
  FORM: {
    DEBOUNCE_DELAY: 300,
    SUBMIT_TIMEOUT: 5000,
  },

  // Table defaults
  TABLE: {
    DEFAULT_SORT_FIELD: 'createdAt',
    DEFAULT_SORT_ORDER: 'desc',
    ROWS_PER_PAGE: 10,
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // General errors
  GENERAL: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN_ERROR: 'An unknown error occurred.',
    VALIDATION_ERROR: 'Please check your input and try again.',
  },

  // Auth errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    TOKEN_EXPIRED: 'Your session has expired. Please login again.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    FORBIDDEN: 'Access denied.',
  },

  // Form errors
  FORM: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters.`,
    MAX_LENGTH: (field: string, max: number) => `${field} must be no more than ${max} characters.`,
  },

  // Auction errors
  AUCTION: {
    NOT_FOUND: 'Auction not found.',
    ALREADY_STARTED: 'Auction has already started.',
    ALREADY_ENDED: 'Auction has already ended.',
    INVALID_STATUS: 'Invalid auction status.',
  },

  // Bid errors
  BID: {
    INVALID_AMOUNT: 'Invalid bid amount.',
    TOO_LOW: 'Bid amount is too low.',
    AUCTION_ENDED: 'Cannot place bid on ended auction.',
    AUCTION_PAUSED: 'Cannot place bid on paused auction.',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  // General success
  GENERAL: {
    SAVED: 'Changes saved successfully.',
    DELETED: 'Item deleted successfully.',
    CREATED: 'Item created successfully.',
    UPDATED: 'Item updated successfully.',
  },

  // Auth success
  AUTH: {
    LOGIN_SUCCESS: 'Login successful.',
    LOGOUT_SUCCESS: 'Logout successful.',
    PASSWORD_RESET: 'Password reset successfully.',
    PROFILE_UPDATED: 'Profile updated successfully.',
  },

  // Auction success
  AUCTION: {
    CREATED: 'Auction created successfully.',
    UPDATED: 'Auction updated successfully.',
    LAUNCHED: 'Auction launched successfully.',
    PAUSED: 'Auction paused successfully.',
    RESUMED: 'Auction resumed successfully.',
  },

  // Bid success
  BID: {
    PLACED: 'Bid placed successfully.',
    UPDATED: 'Bid updated successfully.',
    WITHDRAWN: 'Bid withdrawn successfully.',
  },
} as const;
