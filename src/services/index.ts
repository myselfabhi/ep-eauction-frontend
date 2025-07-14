// Centralized exports for all service modules

// Main API service
export { apiService } from './api.service';

// Individual service modules
export { authService } from './api.service';
export { auctionService } from './api.service';
export { bidService } from './api.service';
export { userService } from './api.service';
export { supplierService } from './api.service';
export { currencyService } from './api.service';
export { dutyService } from './api.service';
export { invitationService } from './api.service';

// Legacy service exports (for backward compatibility)
export * from './auction.service';
export * from './user.service'; 