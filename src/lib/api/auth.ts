/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import apiClient from './client';

// Interface cho login request
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// Interface cho User Response
export interface User {
  userID: string;
  username: string;
  fullname: string;
  gender: string;
  roleID: string;
  email: string;
  phone: string;
  birthdate: string; // ISO date string
  image: string;
  address: string;
}

// Interface cho decoded JWT token
export interface DecodedToken {
  userID?: string;
  username?: string;
  roleID?: string;
  Role?: string;
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  exp?: number;
  iat?: number;
  [key: string]: string | number | boolean | undefined; // Cho phép các thuộc tính khác với kiểu cụ thể
}

// Interface cho login response
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  roleID?: string; // Thêm roleID từ decoded token
  redirectPath?: string; // Thêm path điều hướng
}

// Hàm gọi API đăng nhập
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/api/Auth/login', {
      username: loginData.username,
      password: loginData.password,
      rememberMe: loginData.rememberMe || false,
    });

    // Kiểm tra status code thành công (200-299)
    if (response.status >= 200 && response.status < 300) {
      const data = response.data;
      
      // Lấy token từ response
      const token = data.token || data.accessToken || data.access_token || data.jwt;
      
      if (token) {
        try {          // Decode JWT token để lấy thông tin role
          const decoded: DecodedToken = jwtDecode(token);
          console.log('FULL TOKEN DEBUG:');
          console.log('Raw token:', token);
          console.log('Decoded object:', decoded);
          console.log('All properties:', Object.keys(decoded));
          console.log('All entries:', Object.entries(decoded));

          // Tìm tất cả thuộc tính có chứa 'role' (case-insensitive)
          const allKeys = Object.keys(decoded);
          const roleKeys = allKeys.filter(key => 
            key.toLowerCase().includes('role') ||
            key.toLowerCase().includes('claim') ||
            key.toLowerCase().includes('permission')
          );
          
          console.log('Keys có thể chứa role:', roleKeys);
          roleKeys.forEach(key => {
            console.log(`  ${key}:`, decoded[key]);
          });          // Tìm roleID từ nhiều thuộc tính có thể có
          let roleID: string | undefined = String(decoded.roleID || 
                      decoded.Role || 
                      decoded.role || 
                      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
                      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
                      decoded.RoleID ||
                      decoded.roleid ||
                      decoded.ROLE_ID ||
                      decoded.role_id ||
                      decoded.roleName ||
                      decoded.RoleName ||
                      decoded.userRole ||
                      decoded.UserRole || '').trim();
          console.log('RoleID từ token:', roleID);          // FIX: Nếu không có roleID trong token, gọi API để lấy user profile
          if (!roleID || roleID === 'undefined' || roleID === '') {
            console.log('No roleID found in token, fetching user profile...');
            try {
              const userProfile = await getUserProfile(token);
              
              if (userProfile && userProfile.roleID) {
                console.log('Got roleID from user profile:', userProfile.roleID);
                roleID = userProfile.roleID;
                  // Cập nhật user object với thông tin từ profile
                const userRoleName = getRoleName(userProfile.roleID);
                const user: User = {
                  userID: userProfile.userID || decoded.userID || data.userID || data.id || '',
                  username: userProfile.username || decoded.username || data.username || loginData.username,
                  fullname: userProfile.fullname || data.fullname || data.name || decoded.username || '',
                  gender: userProfile.gender || data.gender || '',
                  roleID: userRoleName, // Sử dụng role name
                  email: userProfile.email || data.email || '',
                  phone: userProfile.phone || data.phone || '',
                  birthdate: userProfile.birthdate || data.birthdate || '',
                  image: userProfile.image || data.image || '',
                  address: userProfile.address || data.address || '',
                };                const redirectPath = getRedirectPath(userProfile.roleID);
                console.log('Final user object (from profile):', user);
                console.log('Role conversion: ', userProfile.roleID, ' → ', userRoleName);
                console.log('Final redirect path (from profile):', redirectPath);

                return {
                  success: true,
                  message: 'Đăng nhập thành công',
                  token: token,
                  user: user,
                  roleID: userRoleName, // Trả về role name
                  redirectPath: redirectPath,
                };
              } else {
                console.log(' Failed to get user profile');
              }
            } catch (profileError) {
              console.error(' Error fetching user profile:', profileError);
            }
          }

          // ✅ Xác định path điều hướng theo roleID
          const redirectPath = getRedirectPath(roleID || '');
          console.log('Final redirect path:', redirectPath);          // Tạo user object từ decoded token hoặc response data
          const finalRoleID = roleID || data.roleID || data.role || data.Role || '';
          const finalRoleName = getRoleName(finalRoleID); // Chuyển đổi sang role name
          
          const user: User = {
            userID: decoded.userID || data.userID || data.id || '',
            username: decoded.username || data.username || loginData.username,
            fullname: data.fullname || data.name || decoded.username || '',
            gender: data.gender || '',
            roleID: finalRoleName, // Sử dụng role name thay vì roleID
            email: data.email || '',
            phone: data.phone || '',
            birthdate: data.birthdate || '',
            image: data.image || '',
            address: data.address || '',
          };          console.log('Final user object:', user);
          console.log('Role conversion: ', finalRoleID, ' → ', finalRoleName);

          return {
            success: true,
            message: 'Đăng nhập thành công',
            token: token,
            user: user,
            roleID: finalRoleName, // Trả về role name
            redirectPath: redirectPath,
          };

        } catch (decodeError) {
          console.error('Lỗi decode token:', decodeError);
          return {
            success: false,
            message: 'Token không hợp lệ hoặc không thể giải mã',
          };
        }
      }

      // Fallback nếu không có token
      return {
        success: false,
        message: 'Không nhận được token từ server',
      };
    }

    return {
      success: false,
      message: response.data?.message || 'Đăng nhập thất bại',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Lỗi từ server
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.[0] || 
                           'Email hoặc mật khẩu không đúng';
        return {
          success: false,
          message: errorMessage,
        };
      }
      
      // Lỗi network
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        return {
          success: false,
          message: 'Không thể kết nối đến server. Vui lòng thử lại sau.',
        };
      }

      // Lỗi SSL/HTTPS
      if (error.message.includes('certificate') || error.message.includes('SSL')) {
        return {
          success: false,
          message: 'Lỗi kết nối an toàn. Vui lòng kiểm tra cấu hình SSL.',
        };
      }
    }

    // Lỗi khác
    return {
      success: false,
      message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.',
    };
  }
};

// Hàm logout
export const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    await apiClient.post('/User/Logout');
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };  } catch (_error) {
    // Ngay cả khi API thất bại, vẫn coi như logout thành công để clear local data
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  }
};

// Hàm decode JWT token
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    console.log('Token decoded:', decoded);
    return decoded;
  } catch (error) {
    console.error('Lỗi decode token:', error);
    return null;
  }
};

// Hàm lấy roleID từ token
export const getRoleFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  const roleID = String(decoded.roleID || 
                decoded.Role || 
                decoded.role || 
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
                decoded.RoleID ||
                decoded.roleid ||
                decoded.ROLE_ID ||
                decoded.role_id || '').trim();
  
  console.log(' getRoleFromToken - roleID found:', roleID);
  return roleID || null;
};

// Hàm xác định path điều hướng dựa trên roleID hoặc role name
export const getRedirectPath = (roleID: string): string => {
  switch (roleID) {
    case 'R01':
    case 'Admin':
      return '/admin';
    case 'R03':
    case 'Customer':
      return '/';
    case 'R04':
    case 'Manager':
      return '/manager';
    default:
      return '/';
  }
};

// Hàm kiểm tra token có hợp lệ và chưa hết hạn
export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

// Hàm lấy thông tin user từ localStorage token
export const getUserFromToken = (): { user: Partial<User>; roleID: string | null } | null => {
  const token = localStorage.getItem('token');
  if (!token || !isTokenValid(token)) {
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const roleID = getRoleFromToken(token);
  const roleName = roleID ? getRoleName(roleID) : null;
  
  const user: Partial<User> = {
    userID: decoded.userID || '',
    username: decoded.username || '',
    roleID: roleName || '', // Sử dụng role name
  };

  return { user, roleID: roleName };
};

// Hàm debug token để kiểm tra cấu trúc
export const debugToken = (token: string): void => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    console.log(' DEBUG TOKEN:');
    console.log('Full decoded object:', decoded);
    console.log('Object keys:', Object.keys(decoded));
    console.log('Object entries:', Object.entries(decoded));
    
    // Tìm tất cả thuộc tính có chứa 'role'
    const roleKeys = Object.keys(decoded).filter(key => 
      key.toLowerCase().includes('role')
    );
    console.log('Keys containing "role":', roleKeys);
    
    roleKeys.forEach(key => {
      console.log(`${key}:`, decoded[key]);
    });
  } catch (error) {
    console.error('Debug token error:', error);
  }
};

// Hàm lấy thông tin user profile từ API (sau khi có token)
export const getUserProfile = async (token: string): Promise<User | null> => {
  try {
    const response = await apiClient.get('/api/User/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 && response.data) {
      console.log('User profile from /api/User/me:', response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile from /api/User/me:', error);
    return null;
  }
};

// Hàm chuyển đổi roleID thành role name
export const getRoleName = (roleID: string): string => {
  switch (roleID) {
    case 'R01':
      return 'Admin';
    case 'R03':
      return 'Customer';
    case 'R04':
      return 'Manager';
    default:
      return roleID; // Trả về roleID gốc nếu không khớp
  }
};
