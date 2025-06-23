import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import apiClient from './client';

// Interface cho register request
export interface RegisterRequest {
  username: string;
  password: string;
  fullname: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  image?: File;
}

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

// Interface cho Test History
export interface TestHistory {
  id: string;
  serviceType: string;
  testType: string;
  status: string;
  requestDate: string;
  completionDate: string | null;
  sampleMethod: string;
  amount: string;
}

// Interface cho Test History từ API response
interface TestHistoryApiResponse {
  id?: string;
  testID?: string;
  requestID?: string;
  serviceType?: string;
  serviceName?: string;
  type?: string;
  testType?: string;
  testName?: string;
  name?: string;
  status?: string;
  state?: string;
  requestDate?: string;
  createdDate?: string;
  orderDate?: string;
  completionDate?: string;
  finishedDate?: string;
  resultDate?: string;
  sampleMethod?: string;
  collectionMethod?: string;
  samplingMethod?: string;
  amount?: string;
  price?: string;
  cost?: string;
  fee?: string;
}

// Interface cho Notification từ API response
interface NotificationApiResponse {
  id?: string;
  notificationID?: string;
  title?: string;
  subject?: string;
  header?: string;
  message?: string;
  content?: string;
  body?: string;
  description?: string;
  type?: string;
  category?: string;
  level?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  createDate?: string;
  timestamp?: string;
}

// Interface cho Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// Interface cho Dashboard Stats
export interface DashboardStats {
  totalTests: number;
  completedTests: number;
  pendingTests: number;
  unreadNotifications: number;
}

// Interface cho Dashboard Data
export interface DashboardData {
  user: User | null;
  testHistory: TestHistory[];
  notifications: Notification[];
  stats: DashboardStats;
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
    // Lấy token từ localStorage để gửi trong header
    const token = localStorage.getItem('token');
    
    if (token) {
      await apiClient.post('/api/Auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Clear authentication data sau khi logout thành công
    clearAuthData();
    
    console.log('Logout successful');
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Ngay cả khi API thất bại, vẫn coi như logout thành công để clear local data
    clearAuthData();
    
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  }
};

// Hàm logout với option force (không cần gọi API)
export const forceLogout = (): { success: boolean; message: string } => {
  clearAuthData();
  console.log('Force logout - authentication data cleared');
  return {
    success: true,
    message: 'Đã đăng xuất khỏi hệ thống'
  };
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
    case 'R02':
    case 'Manager':
      return '/manager';
    case 'R03':
    case 'Staff':
      return '/staff';
    case 'R04':
    case 'Customer':
      return '/';
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
    console.log('Fetching user profile from /api/User/me with token:', token ? 'present' : 'missing');
    
    const response = await apiClient.get('/api/User/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response Status:', response.status);
    console.log('API Response Data:', response.data);

    if (response.status === 200 && response.data) {
      // Transform API response to match User interface
      const userData: User = {
        userID: response.data.userID || response.data.id || '',
        username: response.data.username || response.data.userName || '',
        fullname: response.data.fullname || response.data.fullName || response.data.name || '',
        gender: response.data.gender || '',
        roleID: response.data.roleID || response.data.role || '',
        email: response.data.email || '',
        phone: response.data.phone || response.data.phoneNumber || '',
        birthdate: response.data.birthdate || response.data.birthDate || response.data.dateOfBirth || '',
        image: response.data.image || response.data.avatar || response.data.profileImage || '',
        address: response.data.address || '',
      };
      
      console.log('Transformed user data:', userData);
      return userData;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
      }
    } else {
      console.error('Error fetching user profile from /api/User/me:', error);
    }
    return null;
  }
};

// Hàm chuyển đổi roleID thành role name
export const getRoleName = (roleID: string): string => {
  switch (roleID) {
    case 'R01':
      return 'Admin';
    case 'R02':
      return 'Manager';
    case 'R03':
      return 'Staff';
    case 'R04':
      return 'Customer';
    default:
      return roleID; // Trả về roleID gốc nếu không khớp
  }
};

// Hàm helper để clear authentication data từ localStorage
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('roleID');
  localStorage.removeItem('role');
  localStorage.removeItem('userData');
  localStorage.removeItem('authToken');
  console.log('Authentication data cleared from localStorage');
};

// Hàm kiểm tra user có đang đăng nhập không
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return token !== null && isTokenValid(token);
};

// Hàm lấy current user role
export const getCurrentUserRole = (): string | null => {
  const userInfo = getUserFromToken();
  return userInfo?.roleID || null;
};

// Hàm save user data vào localStorage (sau khi login thành công)
export const saveUserData = (user: User, token: string): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('roleID', user.roleID);
  console.log('User data saved to localStorage');
};

// Hàm lấy thông tin user từ localStorage (không cần token validation)
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  } catch {
    return null;
  }
};

// Hàm lấy dashboard data cho user hiện tại
export const getDashboardData = async (): Promise<DashboardData | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found for dashboard data');
      return null;
    }

    console.log('Fetching dashboard data with token:', token ? 'present' : 'missing');

    // Fetch user profile
    console.log('Step 1: Fetching user profile...');
    const userProfile = await getUserProfile(token);
    
    // Fetch test history
    console.log('Step 2: Fetching test history...');
    const testHistory = await getUserTestHistory(token);
    
    // Fetch notifications
    console.log('Step 3: Fetching notifications...');
    const notifications = await getUserNotifications(token);
    
    // Calculate stats
    const stats: DashboardStats = {
      totalTests: testHistory?.length || 0,
      completedTests: testHistory?.filter((test: TestHistory) => test.status === 'Đã hoàn thành').length || 0,
      pendingTests: testHistory?.filter((test: TestHistory) => test.status === 'Đang xử lý').length || 0,
      unreadNotifications: notifications?.filter((notif: Notification) => !notif.isRead).length || 0,
    };

    console.log('Dashboard data compiled successfully:', {
      user: userProfile ? 'loaded' : 'failed',
      testHistory: testHistory?.length || 0,
      notifications: notifications?.length || 0,
      stats
    });

    return {
      user: userProfile,
      testHistory: testHistory || [],
      notifications: notifications || [],
      stats
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};

// Hàm lấy lịch sử xét nghiệm của user
export const getUserTestHistory = async (token: string): Promise<TestHistory[] | null> => {
  try {
    console.log('Fetching user test history from /api/User/tests');
    
    const response = await apiClient.get('/api/User/tests', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Test History API Response Status:', response.status);
    console.log('Test History API Response Data:', response.data);

    if (response.status === 200 && response.data) {      // Transform API response to match TestHistory interface
      const testHistory: TestHistory[] = Array.isArray(response.data) 
        ? response.data.map((test: TestHistoryApiResponse) => ({
            id: test.id || test.testID || test.requestID || '',
            serviceType: test.serviceType || test.serviceName || test.type || 'Không xác định',
            testType: test.testType || test.testName || test.name || 'Không xác định',
            status: test.status || test.state || 'Không xác định',
            requestDate: test.requestDate || test.createdDate || test.orderDate || new Date().toISOString(),
            completionDate: test.completionDate || test.finishedDate || test.resultDate || null,
            sampleMethod: test.sampleMethod || test.collectionMethod || test.samplingMethod || 'Không xác định',
            amount: test.amount || test.price || test.cost || test.fee || '0 VNĐ',
          }))
        : [];
      
      console.log('Transformed test history data:', testHistory);
      return testHistory;
    }
    
    console.log('No test history data found or invalid response');
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Test History API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
      }
    } else {
      console.error('Error fetching user test history:', error);
    }
    
    // Return mock data as fallback
    console.log('Returning mock test history data as fallback');
    return [
      {
        id: 'TEST123',
        serviceType: 'Xét nghiệm Huyết thống',
        testType: 'Xét nghiệm cha con',
        status: 'Đã hoàn thành',
        requestDate: '2025-05-12',
        completionDate: '2025-05-15',
        sampleMethod: 'Tự thu mẫu',
        amount: '4,000,000 VNĐ',
      },
      {
        id: 'TEST124',
        serviceType: 'Xét nghiệm ADN Dân sự',
        testType: 'Xét nghiệm cha con ẩn danh',
        status: 'Đang xử lý',
        requestDate: '2025-05-20',
        completionDate: null,
        sampleMethod: 'Thu mẫu tận nơi',
        amount: '3,500,000 VNĐ',
      },
    ];
  }
};

// Hàm lấy thông báo của user
export const getUserNotifications = async (token: string): Promise<Notification[] | null> => {
  try {
    console.log('Fetching user notifications from /api/User/notifications');
    
    const response = await apiClient.get('/api/User/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Notifications API Response Status:', response.status);
    console.log('Notifications API Response Data:', response.data);

    if (response.status === 200 && response.data) {
      // Transform API response to match Notification interface
      const notifications: Notification[] = Array.isArray(response.data) 
        ? response.data.map((notif: NotificationApiResponse) => ({
            id: notif.id || notif.notificationID || '',
            title: notif.title || notif.subject || notif.header || 'Thông báo',
            message: notif.message || notif.content || notif.body || notif.description || '',
            type: (notif.type || notif.category || notif.level || 'info') as 'success' | 'info' | 'warning' | 'error',
            isRead: notif.isRead !== undefined ? notif.isRead : (notif.read !== undefined ? notif.read : false),
            createdAt: notif.createdAt || notif.createDate || notif.timestamp || new Date().toISOString(),
          }))
        : [];
      
      console.log('Transformed notifications data:', notifications);
      return notifications;
    }
    
    console.log('No notifications data found or invalid response');
    return [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Notifications API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        console.error('Unauthorized - token may be invalid or expired');
      }
    } else {
      console.error('Error fetching user notifications:', error);
    }
    
    // Return mock data as fallback
    console.log('Returning mock notifications data as fallback');
    return [
      {
        id: '1',
        title: 'Kết quả xét nghiệm đã sẵn sàng',
        message: 'Kết quả xét nghiệm TEST123 đã có, vui lòng kiểm tra.',
        type: 'success',
        isRead: false,
        createdAt: '2025-06-20T10:30:00Z'
      },
      {
        id: '2',
        title: 'Nhắc nhở thu mẫu',
        message: 'Vui lòng chuẩn bị mẫu cho xét nghiệm TEST124.',
        type: 'info',
        isRead: true,
        createdAt: '2025-06-19T14:20:00Z'
      }
    ];
  }
};

// Hàm test kết nối API
export const testApiConnection = async (): Promise<{success: boolean; message: string; data?: unknown}> => {
  try {
    console.log('Testing API connection to:', `${apiClient.defaults.baseURL}/api/User/me`);
    
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        message: 'No token found in localStorage'
      };
    }
    
    const response = await apiClient.get('/api/User/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      message: `API connection successful (Status: ${response.status})`,
      data: response.data
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: `API Error: ${error.response?.status} - ${error.response?.statusText || error.message}`,
        data: error.response?.data
      };
    }
    
    return {
      success: false,
      message: `Unknown error: ${error}`,
    };
  }
};

// Interface cho register response
export interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Hàm gọi API đăng ký
export const registerUser = async (registerData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    // Kiểm tra xem có file image không
    if (registerData.image) {
      // Nếu có file, sử dụng FormData
      const formData = new FormData();
      
      // Thêm các trường dữ liệu
      formData.append('username', registerData.username);
      formData.append('password', registerData.password);
      formData.append('fullname', registerData.fullname);
      formData.append('gender', registerData.gender);
      formData.append('email', registerData.email);
      formData.append('phone', registerData.phone);
      formData.append('birthdate', registerData.birthdate);
      formData.append('address', registerData.address);      formData.append('roleID', 'R04'); // R04 - Customer role
      formData.append('image', registerData.image);

      const response = await apiClient.post('/api/Auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return handleRegisterResponse(response);
    } else {
      // Nếu không có file, sử dụng JSON
      const jsonData = {
        username: registerData.username,
        password: registerData.password,
        fullname: registerData.fullname,
        gender: registerData.gender,
        email: registerData.email,
        phone: registerData.phone,
        birthdate: registerData.birthdate,
        address: registerData.address,
        roleID: 'R04', // R04 - Customer role
        image: null
      };

      console.log('Sending register data as JSON:', jsonData);

      const response = await apiClient.post('/api/Auth/register', jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return handleRegisterResponse(response);
    }
  } catch (error: any) {
    console.error('Register error:', error);
    
    let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
    
    if (error.response?.status === 415) {
      errorMessage = 'Định dạng dữ liệu không được hỗ trợ. Vui lòng thử lại.';
    } else if (error.response?.status === 400) {
      errorMessage = error.response.data?.message || 'Dữ liệu không hợp lệ.';
    } else if (error.response?.status === 409) {
      errorMessage = 'Tên đăng nhập hoặc email đã tồn tại.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Hàm helper xử lý response từ API register
const handleRegisterResponse = (response: any): RegisterResponse => {
  // Kiểm tra status code thành công (200-299)
  if (response.status >= 200 && response.status < 300) {
    const data = response.data;
    
    console.log('Register API response:', data);
    
    // Lấy token từ response nếu có
    const token = data.token || data.accessToken || data.access_token || data.jwt;
    
    if (token) {
      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      
      // Lưu user info nếu có
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }

    return {
      success: true,
      message: data.message || 'Đăng ký thành công!',
      token: token,
      user: data.user,
    };
  } else {
    return {
      success: false,
      message: 'Đăng ký thất bại!',
    };
  }
};