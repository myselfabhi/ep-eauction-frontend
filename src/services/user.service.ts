import { userService, authService } from './api.service';
import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/constants';
import { User } from '@/types/user';

// User management functions
export const getUserProfile = async (): Promise<User> => {
  return userService.getProfile();
};

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  return userService.updateProfile(userData);
};

export const getAllUsers = async (): Promise<User[]> => {
  return userService.getAll();
};

export const getUserById = async (id: string): Promise<User> => {
  return userService.getById(id);
};

// Authentication functions
export const loginUser = async (credentials: { email: string; password: string }) => {
  return authService.login(credentials);
};

export const registerUser = async (userData: Partial<User>) => {
  return authService.register(userData);
};

export const logoutUser = async () => {
  return authService.logout();
};

export const forgotPassword = async (email: string) => {
  return authService.forgotPassword(email);
};

export const verifyOtp = async (email: string, otp: string) => {
  return authService.verifyOtp(email, otp);
};

export const verifyForgotOtp = async (email: string, otp: string) => {
  return authService.verifyForgotOtp(email, otp);
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  return authService.resetPassword(email, otp, newPassword);
};

export const checkEmail = async (email: string): Promise<boolean> => {
  try {
    const res = await apiService.getRaw<{ exists: boolean }>(API_ENDPOINTS.USER.CHECK_EMAIL(email));
    return !!res.exists;
  } catch {
    return false;
  }
};

// Export the centralized services for new code
export { userService, authService };
