// Centralized exports for all lib modules

// Core API and configuration
export { default as api } from './api';
export { API_ENDPOINTS, APP_CONFIG, DEFAULTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';

// Enums and types
export * from './enums';

// Routing and navigation
export { ROUTES, routeHelpers } from './routes';
export { navigationService, goToHome, goToLogin, goToDashboard, goToAuctionCreate, goToAuctionDetails, goToAuctionMonitor, goToAuctionLive, goToSettings, goToCurrencySettings, goToImportDutySettings, goToSuppliers, goToAdminRegistration, goToUnauthorized, getRouteForUser, isCurrentRoute, getBreadcrumbs } from './navigation';

// Session management
export { clearSession, getCurrentUser, getToken, isAuthenticated, validateSession, getUserRole, isEpMember, isSupplier } from './session';

// Socket utilities
export { getSocket, joinAuctionRoom, disconnectSocket } from './socket';

// Utility functions
export * from './utils'; 