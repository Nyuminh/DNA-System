// User interface dựa trên database schema
export interface User {
  userID: string;
  username: string;
  password?: string; // Optional vì không nên trả về từ API
  fullname: string;
  gender: string;
  roleID: string;
  email: string;
  phone: string;
  birthdate: string; // ISO date string (YYYY-MM-DD)
  image: string;
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response interface
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Role constants
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Helper functions
export const isAdmin = (user: User | null): boolean => {
  return user?.roleID?.toLowerCase() === USER_ROLES.ADMIN;
};

export const isManager = (user: User | null): boolean => {
  return user?.roleID?.toLowerCase() === USER_ROLES.MANAGER;
};

export const getUserDisplayName = (user: User | null): string => {
  return user?.fullname || user?.username || user?.email || 'Người dùng';
};
