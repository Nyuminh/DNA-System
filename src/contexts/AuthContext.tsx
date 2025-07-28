'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@/lib/api/auth';
import { isTokenValid, getUserFromToken, logoutUser } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isCustomer: () => boolean;
  isStaff: () => boolean;
  isBanned: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Kiểm tra localStorage khi component mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken) {
      // Kiểm tra token có hợp lệ và chưa hết hạn
      if (isTokenValid(savedToken)) {
        // Lấy thông tin user từ token
        const userFromToken = getUserFromToken();
        
        if (userFromToken && userFromToken.user) {
          setToken(savedToken);
          
          // Sử dụng thông tin từ localStorage nếu có, ngược lại dùng từ token
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
            } catch {
              // Nếu savedUser bị lỗi, sử dụng thông tin từ token
              setUser(userFromToken.user as User);
            }
          } else {
            setUser(userFromToken.user as User);
          }
        } else {
          // Token không thể decode được, xóa localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        // Token đã hết hạn hoặc không hợp lệ
        console.log('Token expired or invalid, clearing localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);const login = (newToken: string, newUser: User) => {
    // Kiểm tra nếu tài khoản bị khóa (vai trò R05)
    if (newUser.roleID === 'R05') {
      alert('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
      // Không lưu token và user vào localStorage
      return;
    }
    
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };  const logout = () => {
    setToken(null);
    setUser(null);
    // Clear tất cả localStorage data liên quan đến auth
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roleID');
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    console.log('AuthContext logout - all data cleared');
    
    // Chuyển hướng về trang đăng nhập
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };  // Helper functions để kiểm tra quyền
  const isAdmin = () => user?.roleID === 'Admin' || user?.roleID === 'R01';
  const isManager = () => user?.roleID === 'Manager' || user?.roleID === 'R04';
  const isCustomer = () => user?.roleID === 'Customer' || user?.roleID === 'R03';
  const isStaff = () => user?.roleID === 'Staff' || user?.roleID === 'R02';
  // Kiểm tra tài khoản bị khóa
  const isBanned = () => user?.roleID === 'Ban' || user?.roleID === 'R05';

  const value = {
    user,
    token,
    login,
    logout,
    isLoggedIn: !!user && !!token,
    isLoading,
    isAdmin,
    isManager,
    isCustomer,
    isStaff,
    isBanned
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
