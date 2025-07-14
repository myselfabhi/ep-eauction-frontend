// Centralized routing configuration
export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },

  // EP Member routes
  EP_MEMBER: {
    DASHBOARD: '/ep-member/dashboard',
    AUCTION: {
      CREATE: '/ep-member/auction/create',
      DETAILS: (id: string) => `/ep-member/auction/${id}`,
      MONITOR: (id: string) => `/ep-member/auction/${id}/monitor`,
    },
    SETTINGS: {
      ROOT: '/ep-member/settings',
      CURRENCY: '/ep-member/settings/currency',
      IMPORT_DUTY_MATRIX: '/ep-member/settings/import-duty-matrix',
    },
    SUPPLIERS: '/ep-member/suppliers',
    ADMIN_REGISTRATION: '/ep-member/admin-registration',
  },

  // Supplier routes
  SUPPLIER: {
    DASHBOARD: '/supplier/dashboard',
    AUCTION: {
      DETAILS: (id: string) => `/supplier/auction/${id}`,
      LIVE: (id: string) => `/supplier/auction/${id}/live`,
    },
  },

  // Common routes
  COMMON: {
    HOME: '/',
    UNAUTHORIZED: '/unauthorized',
  },
} as const;

// Route helper functions
export const routeHelpers = {
  // Auth helpers
  goToLogin: () => ROUTES.AUTH.LOGIN,
  goToDashboard: (role: 'ep-member' | 'supplier') => 
    role === 'ep-member' ? ROUTES.EP_MEMBER.DASHBOARD : ROUTES.SUPPLIER.DASHBOARD,
  
  // Auction helpers
  goToAuctionDetails: (id: string, role: 'ep-member' | 'supplier') =>
    role === 'ep-member' ? ROUTES.EP_MEMBER.AUCTION.DETAILS(id) : ROUTES.SUPPLIER.AUCTION.DETAILS(id),
  
  goToAuctionMonitor: (id: string) => ROUTES.EP_MEMBER.AUCTION.MONITOR(id),
  goToAuctionLive: (id: string) => ROUTES.SUPPLIER.AUCTION.LIVE(id),
  
  // Settings helpers
  goToSettings: () => ROUTES.EP_MEMBER.SETTINGS.ROOT,
  goToCurrencySettings: () => ROUTES.EP_MEMBER.SETTINGS.CURRENCY,
  goToImportDutySettings: () => ROUTES.EP_MEMBER.SETTINGS.IMPORT_DUTY_MATRIX,
} as const; 