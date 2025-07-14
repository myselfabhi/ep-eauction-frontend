# Frontend Code Refactoring Guide

This document outlines the refactored structure of the e-auction frontend application, which now has centralized routing, API calls, and enums for better maintainability and consistency.

## 🏗️ New Structure Overview

### 1. Centralized Routing (`src/lib/routes.ts`)
All application routes are now defined in one place with helper functions.

```typescript
import { ROUTES, routeHelpers } from '@/lib/routes';

// Using routes
const loginRoute = ROUTES.AUTH.LOGIN;
const auctionDetailsRoute = ROUTES.EP_MEMBER.AUCTION.DETAILS('123');

// Using helper functions
const dashboardRoute = routeHelpers.goToDashboard('ep-member');
```

### 2. Centralized Enums (`src/lib/enums.ts`)
All application enums and constants are organized in one file.

```typescript
import { UserRole, AuctionStatus, Currency } from '@/lib/enums';

// Using enums
const userRole = UserRole.EP_MEMBER;
const auctionStatus = AuctionStatus.LIVE;
const currency = Currency.USD;
```

### 3. Centralized API Service (`src/services/api.service.ts`)
All API calls are now centralized with a clean, type-safe interface.

```typescript
import { auctionService, authService } from '@/services';

// Using API services
const auctions = await auctionService.getAll();
const user = await authService.login({ email, password });
```

### 4. Centralized Constants (`src/lib/constants.ts`)
Application configuration, endpoints, and messages are centralized.

```typescript
import { API_ENDPOINTS, APP_CONFIG, ERROR_MESSAGES } from '@/lib/constants';

// Using constants
const apiUrl = APP_CONFIG.API.BASE_URL;
const errorMsg = ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
```

### 5. Navigation Service (`src/lib/navigation.ts`)
Centralized navigation utilities with role-based routing.

```typescript
import { navigationService } from '@/lib/navigation';

// Using navigation
const route = navigationService.goToDashboard(UserRole.EP_MEMBER);
const breadcrumbs = navigationService.getBreadcrumbs(pathname);
```

## 📁 File Structure

```
src/
├── lib/
│   ├── index.ts              # Centralized exports
│   ├── routes.ts             # Route definitions
│   ├── enums.ts              # Application enums
│   ├── constants.ts          # App configuration & messages
│   ├── navigation.ts         # Navigation utilities
│   ├── api.ts               # Axios configuration
│   ├── session.ts           # Session management
│   ├── socket.ts            # Socket utilities
│   └── utils.ts             # Utility functions
├── services/
│   ├── index.ts             # Service exports
│   ├── api.service.ts       # Centralized API service
│   ├── auction.service.ts   # Auction-specific service (legacy)
│   └── user.service.ts      # User-specific service (legacy)
└── types/                   # TypeScript type definitions
```

## 🔄 Migration Guide

### Before (Old Way)
```typescript
// Scattered API calls
const res = await api.get('/auction');
const res2 = await api.post(`/auction/${id}/pause`);

// Hardcoded routes
router.push('/ep-member/dashboard');

// Scattered constants
const status = 'live';
```

### After (New Way)
```typescript
// Centralized API calls
const auctions = await auctionService.getAll();
const result = await auctionService.pause(id);

// Centralized routes
router.push(ROUTES.EP_MEMBER.DASHBOARD);

// Centralized enums
const status = AuctionStatus.LIVE;
```

## 🚀 Usage Examples

### 1. Making API Calls

```typescript
import { auctionService, authService } from '@/services';

// Fetch auctions
const auctions = await auctionService.getAll();

// Create auction
const newAuction = await auctionService.create(auctionData);

// Login user
const { token, user } = await authService.login(credentials);
```

### 2. Navigation

```typescript
import { useRouter } from 'next/navigation';
import { ROUTES, navigationService } from '@/lib';

const router = useRouter();

// Direct route usage
router.push(ROUTES.EP_MEMBER.AUCTION.CREATE);

// Navigation service
router.push(navigationService.goToAuctionDetails(id, UserRole.EP_MEMBER));
```

### 3. Using Enums and Constants

```typescript
import { AuctionStatus, Currency, ERROR_MESSAGES } from '@/lib';

// Status checks
if (auction.status === AuctionStatus.LIVE) {
  // Handle live auction
}

// Currency formatting
const formattedPrice = `${price} ${Currency.USD}`;

// Error handling
showError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
```

### 4. Form Validation

```typescript
import { APP_CONFIG, ERROR_MESSAGES } from '@/lib';

const validatePassword = (password: string) => {
  if (password.length < APP_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.FORM.MIN_LENGTH('Password', APP_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH);
  }
  return null;
};
```

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002
```

### App Configuration
All configuration is centralized in `src/lib/constants.ts`:

- API settings (timeout, retry attempts)
- Socket settings (reconnection, delays)
- Pagination defaults
- File upload limits
- Auction configuration
- UI settings
- Validation rules

## 📝 Best Practices

### 1. Always Use Centralized Services
```typescript
// ✅ Good
import { auctionService } from '@/services';
const auctions = await auctionService.getAll();

// ❌ Bad
import api from '@/lib/api';
const res = await api.get('/auction');
```

### 2. Use Enums for Status Values
```typescript
// ✅ Good
import { AuctionStatus } from '@/lib/enums';
if (auction.status === AuctionStatus.LIVE) { }

// ❌ Bad
if (auction.status === 'live') { }
```

### 3. Use Centralized Routes
```typescript
// ✅ Good
import { ROUTES } from '@/lib/routes';
router.push(ROUTES.EP_MEMBER.DASHBOARD);

// ❌ Bad
router.push('/ep-member/dashboard');
```

### 4. Use Error Messages from Constants
```typescript
// ✅ Good
import { ERROR_MESSAGES } from '@/lib/constants';
showError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);

// ❌ Bad
showError('Invalid email or password');
```

## 🔄 Backward Compatibility

The refactoring maintains backward compatibility:

- Legacy service functions are still exported
- Existing imports continue to work
- Gradual migration is possible

## 🧪 Testing

When writing tests, import from the centralized services:

```typescript
import { auctionService } from '@/services';
import { ROUTES } from '@/lib/routes';

// Mock the service
jest.mock('@/services', () => ({
  auctionService: {
    getAll: jest.fn(),
    getById: jest.fn(),
  }
}));
```

## 📚 Additional Resources

- [TypeScript Enums Documentation](https://www.typescriptlang.org/docs/handbook/enums.html)
- [Next.js Routing Documentation](https://nextjs.org/docs/routing)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 🤝 Contributing

When adding new features:

1. Add new routes to `src/lib/routes.ts`
2. Add new enums to `src/lib/enums.ts`
3. Add new API endpoints to `src/lib/constants.ts`
4. Add new service methods to `src/services/api.service.ts`
5. Update this documentation

This refactoring provides a solid foundation for scalable, maintainable code with clear separation of concerns and centralized configuration. 