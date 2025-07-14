import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Auction } from '@/types/auction';
import { Bid } from '@/types/bid';
import { User } from '@/types/user';

// Base API service class
class ApiService {
  // Generic HTTP methods
  private async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const response = await api.get(endpoint, { params });
    return response.data;
  }

  private async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await api.post(endpoint, data);
    return response.data;
  }

  private async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await api.put(endpoint, data);
    return response.data;
  }

  private async delete<T>(endpoint: string): Promise<T> {
    const response = await api.delete(endpoint);
    return response.data;
  }

  // Auth API methods
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.post<{ token: string; user: User }>(API_ENDPOINTS.AUTH.LOGIN, credentials),

    register: (userData: Partial<User>) =>
      this.post<{ token: string; user: User }>(API_ENDPOINTS.AUTH.REGISTER, userData),

    logout: () => this.post(API_ENDPOINTS.AUTH.LOGOUT),

    forgotPassword: (email: string) =>
      this.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

    verifyOtp: (email: string, otp: string) =>
      this.post<{ token: string; user: User }>(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp }),

    verifyForgotOtp: (email: string, otp: string) =>
      this.post(API_ENDPOINTS.AUTH.VERIFY_FORGOT_OTP, { email, otp }),

    resetPassword: (email: string, otp: string, newPassword: string) =>
      this.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, otp, newPassword }),
  };

  // Auction API methods
  auction = {
    getAll: () => this.get<Auction[]>(API_ENDPOINTS.AUCTION.GET_ALL),

    getById: (id: string) => this.get<Auction>(API_ENDPOINTS.AUCTION.GET_BY_ID(id)),

    create: (auctionData: Partial<Auction>) =>
      this.post<Auction>(API_ENDPOINTS.AUCTION.CREATE, auctionData),

    update: (id: string, auctionData: Partial<Auction>) =>
      this.put<Auction>(API_ENDPOINTS.AUCTION.UPDATE(id), auctionData),

    delete: (id: string) => this.delete(API_ENDPOINTS.AUCTION.DELETE(id)),

    pause: (id: string) => this.post(API_ENDPOINTS.AUCTION.PAUSE(id)),

    resume: (id: string) => this.post(API_ENDPOINTS.AUCTION.RESUME(id)),

    getMonitoring: (id: string) => this.get(API_ENDPOINTS.AUCTION.MONITORING(id)),

    launch: (id: string) => this.post(API_ENDPOINTS.AUCTION.LAUNCH(id)),
  };

  // Bid API methods
  bid = {
    getByAuction: (auctionId: string) =>
      this.get<Bid[]>(API_ENDPOINTS.BID.GET_BY_AUCTION(auctionId)),

    getRanking: (auctionId: string) =>
      this.get<Bid[]>(API_ENDPOINTS.BID.RANKING(auctionId)),

    create: (bidData: Partial<Bid>) =>
      this.post<Bid>(API_ENDPOINTS.BID.CREATE, bidData),

    update: (id: string, bidData: Partial<Bid>) =>
      this.put<Bid>(API_ENDPOINTS.BID.UPDATE(id), bidData),

    delete: (id: string) => this.delete(API_ENDPOINTS.BID.DELETE(id)),
  };

  // User API methods
  user = {
    getProfile: () => this.get<User>(API_ENDPOINTS.USER.PROFILE),

    updateProfile: (userData: Partial<User>) =>
      this.put<User>(API_ENDPOINTS.USER.UPDATE, userData),

    getAll: () => this.get<User[]>(API_ENDPOINTS.USER.GET_ALL),

    getById: (id: string) => this.get<User>(API_ENDPOINTS.USER.GET_BY_ID(id)),
  };

  // Supplier API methods
  supplier = {
    getAll: () => this.get(API_ENDPOINTS.SUPPLIER.GET_ALL),

    create: (supplierData: unknown) =>
      this.post(API_ENDPOINTS.SUPPLIER.CREATE, supplierData),

    update: (id: string, supplierData: unknown) =>
      this.put(API_ENDPOINTS.SUPPLIER.UPDATE(id), supplierData),

    delete: (id: string) => this.delete(API_ENDPOINTS.SUPPLIER.DELETE(id)),

    invite: (invitationData: unknown) =>
      this.post(API_ENDPOINTS.SUPPLIER.INVITE, invitationData),
  };

  // Currency API methods
  currency = {
    getRates: () => this.get(API_ENDPOINTS.CURRENCY.RATES),

    updateRate: (rateData: unknown) =>
      this.put(API_ENDPOINTS.CURRENCY.UPDATE_RATE, rateData),
  };

  // Duty API methods
  duty = {
    getProducts: () => this.get(API_ENDPOINTS.DUTY.PRODUCTS),

    getProduct: (productData: unknown) =>
      this.post(API_ENDPOINTS.DUTY.PRODUCT, productData),

    getMatrix: () => this.get(API_ENDPOINTS.DUTY.MATRIX),

    getCountries: () => this.get('/import-duty/countries'),

    addCountry: (countryData: unknown) =>
      this.post('/import-duty/country', countryData),

    addProduct: (productData: unknown) =>
      this.post('/import-duty/product', productData),

    saveDuty: (dutyData: unknown) =>
      this.post('/import-duty/', dutyData),

    deleteProductOrCountry: (data: unknown) =>
      this.post('/import-duty/deleteProductOrCountryWithDuties', data),
  };

  // Invitation API methods
  invitation = {
    send: (invitationData: unknown) =>
      this.post(API_ENDPOINTS.INVITATION.SEND, invitationData),

    accept: (id: string) => this.post(API_ENDPOINTS.INVITATION.ACCEPT(id)),

    decline: (id: string) => this.post(API_ENDPOINTS.INVITATION.DECLINE(id)),
  };
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual service modules for convenience
export const authService = apiService.auth;
export const auctionService = apiService.auction;
export const bidService = apiService.bid;
export const userService = apiService.user;
export const supplierService = apiService.supplier;
export const currencyService = apiService.currency;
export const dutyService = apiService.duty;
export const invitationService = apiService.invitation; 