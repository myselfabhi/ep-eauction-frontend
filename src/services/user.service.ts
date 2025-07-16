import { userService, authService } from './api.service';
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

// Export the centralized services for new code
export { userService, authService };
