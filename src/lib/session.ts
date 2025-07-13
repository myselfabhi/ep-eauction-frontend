export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('epUser');
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('auctionDraft');
  localStorage.removeItem('auctionStep');
  localStorage.removeItem('loginTimestamp');
};

export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('epUser');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return user;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

export const validateSession = (): boolean => {
  const token = getToken();
  const user = getCurrentUser();
  const loginTimestamp = localStorage.getItem('loginTimestamp');
  
  if (!token || !user || !loginTimestamp) {
    clearSession();
    return false;
  }
  
  // Check if login was more than 24 hours ago (JWT expires in 1 day)
  const loginTime = new Date(loginTimestamp);
  const now = new Date();
  const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLogin > 24) {
    clearSession();
    return false;
  }
  
  return true;
};

export const getUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const isEpMember = (): boolean => {
  const role = getUserRole();
  return ['Admin', 'Manager', 'Viewer'].includes(role || '');
};

export const isSupplier = (): boolean => {
  const role = getUserRole();
  return role === 'Supplier';
}; 