import { ROUTES, routeHelpers } from './routes';
import { UserRole } from './enums';

// Navigation utility class
class NavigationService {
  // Direct route access
  routes = ROUTES;
  helpers = routeHelpers;

  // Navigation functions
  goToHome = () => ROUTES.COMMON.HOME;

  goToLogin = () => ROUTES.AUTH.LOGIN;

  goToDashboard = (role: UserRole) => {
    switch (role) {
      case UserRole.EP_MEMBER:
        return ROUTES.EP_MEMBER.DASHBOARD;
      case UserRole.SUPPLIER:
        return ROUTES.SUPPLIER.DASHBOARD;
      default:
        return ROUTES.COMMON.HOME;
    }
  };

  goToAuctionCreate = () => ROUTES.EP_MEMBER.AUCTION.CREATE;

  goToAuctionDetails = (id: string, role: UserRole) => {
    switch (role) {
      case UserRole.EP_MEMBER:
        return ROUTES.EP_MEMBER.AUCTION.DETAILS(id);
      case UserRole.SUPPLIER:
        return ROUTES.SUPPLIER.AUCTION.DETAILS(id);
      default:
        return ROUTES.COMMON.HOME;
    }
  };

  goToAuctionMonitor = (id: string) => ROUTES.EP_MEMBER.AUCTION.MONITOR(id);

  goToAuctionLive = (id: string) => ROUTES.SUPPLIER.AUCTION.LIVE(id);

  goToSettings = () => ROUTES.EP_MEMBER.SETTINGS.ROOT;

  goToCurrencySettings = () => ROUTES.EP_MEMBER.SETTINGS.CURRENCY;

  goToImportDutySettings = () => ROUTES.EP_MEMBER.SETTINGS.IMPORT_DUTY_MATRIX;

  goToSuppliers = () => ROUTES.EP_MEMBER.SUPPLIERS;

  goToAdminRegistration = () => ROUTES.EP_MEMBER.ADMIN_REGISTRATION;

  goToUnauthorized = () => ROUTES.COMMON.UNAUTHORIZED;

  // Helper function to get route based on user role and context
  getRouteForUser = (routeType: 'dashboard' | 'auction' | 'settings', userRole: UserRole, params?: Record<string, unknown>) => {
    switch (routeType) {
      case 'dashboard':
        return this.goToDashboard(userRole);
      case 'auction':
        if (params?.id && typeof params.id === 'string') {
          return this.goToAuctionDetails(params.id, userRole);
        }
        return this.goToAuctionCreate();
      case 'settings':
        return this.goToSettings();
      default:
        return ROUTES.COMMON.HOME;
    }
  };

  // Check if current route matches a pattern
  isCurrentRoute = (currentPath: string, routePattern: string) => {
    return currentPath === routePattern || currentPath.startsWith(routePattern + '/');
  };

  // Get breadcrumb data for a route
  getBreadcrumbs = (pathname: string) => {
    const breadcrumbs: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: ROUTES.COMMON.HOME }
    ];

    if (pathname.startsWith('/ep-member')) {
      breadcrumbs.push({ label: 'EP Member', href: ROUTES.EP_MEMBER.DASHBOARD });
      
      if (pathname.startsWith('/ep-member/dashboard')) {
        breadcrumbs.push({ label: 'Dashboard' });
      } else if (pathname.startsWith('/ep-member/auction')) {
        breadcrumbs.push({ label: 'Auctions' });
        
        if (pathname.includes('/create')) {
          breadcrumbs.push({ label: 'Create Auction' });
        } else if (pathname.includes('/monitor')) {
          breadcrumbs.push({ label: 'Monitor Auction' });
        }
      } else if (pathname.startsWith('/ep-member/settings')) {
        breadcrumbs.push({ label: 'Settings', href: ROUTES.EP_MEMBER.SETTINGS.ROOT });
        
        if (pathname.includes('/currency')) {
          breadcrumbs.push({ label: 'Currency Settings' });
        } else if (pathname.includes('/import-duty-matrix')) {
          breadcrumbs.push({ label: 'Import Duty Matrix' });
        }
      } else if (pathname.startsWith('/ep-member/suppliers')) {
        breadcrumbs.push({ label: 'Suppliers' });
      }
    } else if (pathname.startsWith('/supplier')) {
      breadcrumbs.push({ label: 'Supplier', href: ROUTES.SUPPLIER.DASHBOARD });
      
      if (pathname.startsWith('/supplier/dashboard')) {
        breadcrumbs.push({ label: 'Dashboard' });
      } else if (pathname.startsWith('/supplier/auction')) {
        breadcrumbs.push({ label: 'Auctions' });
        
        if (pathname.includes('/live')) {
          breadcrumbs.push({ label: 'Live Auction' });
        }
      }
    } else if (pathname.startsWith('/auth')) {
      breadcrumbs.push({ label: 'Authentication' });
      
      if (pathname.includes('/login')) {
        breadcrumbs.push({ label: 'Login' });
      }
    }

    return breadcrumbs;
  };
}

// Export singleton instance
export const navigationService = new NavigationService();

// Export individual functions for convenience
export const {
  goToHome,
  goToLogin,
  goToDashboard,
  goToAuctionCreate,
  goToAuctionDetails,
  goToAuctionMonitor,
  goToAuctionLive,
  goToSettings,
  goToCurrencySettings,
  goToImportDutySettings,
  goToSuppliers,
  goToAdminRegistration,
  goToUnauthorized,
  getRouteForUser,
  isCurrentRoute,
  getBreadcrumbs,
} = navigationService; 