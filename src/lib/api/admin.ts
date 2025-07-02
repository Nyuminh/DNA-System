/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './client';

// Interface cho admin dashboard statistics
export interface AdminStats {
  totalUsers: number;
  totalTests: number;
  totalRevenue: number;
  pendingTests: number;
  completedTests: number;
  activeUsers: number;
}

// Interface cho reports
export interface Report {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>; // Replace any with proper type
  generatedAt: string;
  generatedBy: string;
}

// Interface cho Admin User
export interface AdminUser {
  userID: string;
  username: string;
  password?: string;
  fullname: string;
  gender: "Male" | "Female" | "Other";
  roleID: string;
  email: string;
  phone: string;
  birthdate: string;
  image: string;
  address: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

// Interface cho Admin Profile
export interface AdminProfile {
  id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  department?: string;
  position?: string;
  joinDate: string;
  lastLogin: string;
  avatar?: string;
  isActive: boolean;
  permissions: string[];
  statistics: {
    totalUsers: number;
    totalTests: number;
    totalServices: number;
    todayLogin: number;
  };
}

export interface UpdateProfileRequest {
  fullname: string;
  phone: string;
  email?: string;
  address?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

// Interface cho cập nhật thông tin tài khoản người dùng
export interface UpdateUserRequest {
  username: string;
  password: string; // Trường bắt buộc khi cập nhật theo API
  fullname: string;
  roleId: string; // Đã đổi từ roleID thành roleId theo API thực tế
  email: string;
  phone: string;
  birthdate: string;
  image?: string;
  address: string;
}

// Lấy dashboard statistics
export const getAdminDashboardStats = async (): Promise<{ success: boolean; stats?: AdminStats; message?: string }> => {
  try {
    const response = await apiClient.get('/Admin/dashboard');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        stats: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy thống kê dashboard'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy thống kê dashboard'
    };
  }
};

// Lấy reports
export const getAdminReports = async (type?: string): Promise<{ success: boolean; reports?: Report[]; message?: string }> => {
  try {
    const url = type ? `/Admin/reports?type=${type}` : '/Admin/reports';
    const response = await apiClient.get(url);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        reports: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy báo cáo'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy báo cáo'
    };
  }
};

// Lấy danh sách users
export const getAllUsers = async (): Promise<{ success: boolean; users?: AdminUser[]; message?: string }> => {
  try {
    const response = await apiClient.get('/api/User');
    
    if (response.status >= 200 && response.status < 300) {
      console.log('API User Response:', response.data); // Debug log
      
      // Transform API response to match AdminUser interface
      const users: AdminUser[] = response.data.map((user: any) => {
        // Debug log cho mỗi user
        console.log('Processing user:', user);
        
        // Các thuộc tính user có thể được trả về từ API với nhiều tên khác nhau
        const userId = user.userID || user.UserId || user.userId || user.userid || user.id || user.ID || `user-${Math.random().toString(36).substring(2, 9)}`;
        const roleId = user.roleID || user.RoleId || user.roleId || user.roleid || user.role || user.Role || 'R003';
        // Lấy password từ API nếu có
        const password = user.password || user.Password || '';
        
        console.log(`Extracted userID: ${userId}, roleID: ${roleId}`);
        
        return {
          userID: userId,
          username: user.username || user.userName || user.Username || user.UserName || '',
          password: password, // Lưu trữ password từ API
          fullname: user.fullname || user.fullName || user.Fullname || user.FullName || user.name || user.Name || '',
          gender: user.gender || user.Gender || 'Khác',
          roleID: roleId,
          email: user.email || user.Email || '',
          phone: user.phone || user.phoneNumber || user.Phone || user.PhoneNumber || '',
          birthdate: user.birthdate || user.dateOfBirth || user.Birthdate || user.DateOfBirth || '',
          image: user.image || user.avatar || user.Image || user.Avatar || '',
          address: user.address || user.Address || '',
          status: user.status || user.Status || (user.isActive || user.IsActive ? 'active' : 'inactive'),
          createdAt: user.createdAt || user.createDate || user.CreatedAt || user.CreateDate || new Date().toISOString(),
          lastLogin: user.lastLogin || user.lastLoginDate || user.LastLogin || undefined
        };
      });

      return {
        success: true,
        users: users
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách người dùng'
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách người dùng'
    };
  }
};

// API functions for admin profile management
export const adminProfileAPI = {  // Lấy thông tin profile admin hiện tại
  getProfile: async (): Promise<{ success: boolean; profile?: AdminProfile; message?: string }> => {
    try {
      const response = await apiClient.get('/api/User/me');
      
      if (response.status >= 200 && response.status < 300 && response.data) {
        // Transform API response to match AdminProfile interface
        const profileData: AdminProfile = {
          id: response.data.userID || response.data.id || '',
          username: response.data.username || response.data.userName || '',
          fullname: response.data.fullname || response.data.fullName || response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || response.data.phoneNumber || '',
          address: response.data.address || '',
          role: response.data.roleID || response.data.role || 'Admin',
          department: response.data.department || 'IT',
          position: response.data.position || 'Administrator',
          joinDate: response.data.joinDate || response.data.createdDate || new Date().toISOString(),
          lastLogin: response.data.lastLogin || new Date().toISOString(),
          avatar: response.data.image || response.data.avatar || response.data.profileImage || '',
          isActive: response.data.isActive !== undefined ? response.data.isActive : true,
          permissions: response.data.permissions || ['admin'],
          statistics: {
            totalUsers: response.data.statistics?.totalUsers || 0,
            totalTests: response.data.statistics?.totalTests || 0,
            totalServices: response.data.statistics?.totalServices || 0,
            todayLogin: response.data.statistics?.todayLogin || 0,
          }
        };
        
        return {
          success: true,
          profile: profileData
        };
      }
      
      return {
        success: false,
        message: 'Không thể lấy thông tin profile'
      };
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy thông tin profile'
      };
    }
  },
  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest): Promise<{ success: boolean; profile?: AdminProfile; message?: string }> => {
    try {
      const response = await apiClient.put('/api/User/me', data);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          profile: response.data,
          message: 'Cập nhật thông tin thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không thể cập nhật thông tin'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật thông tin'
      };
    }
  },
  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post('/api/User/change-password', data);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          message: 'Đổi mật khẩu thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không thể đổi mật khẩu'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Có lỗi xảy ra khi đổi mật khẩu'
      };
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ success: boolean; avatarUrl?: string; message?: string }> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post('/Admin/profile/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          avatarUrl: response.data.avatarUrl,
          message: 'Upload avatar thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không thể upload avatar'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Có lỗi xảy ra khi upload avatar'
      };
    }
  },

  // Lấy lịch sử hoạt động
  getActivityLogs: async (page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    logs?: ActivityLog[];
    total?: number;
    currentPage?: number;
    totalPages?: number;
    message?: string;
  }> => {
    try {
      const response = await apiClient.get(`/Admin/profile/activity-logs?page=${page}&limit=${limit}`);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          logs: response.data.logs,
          total: response.data.total,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages
        };
      }
      
      return {
        success: false,
        message: 'Không thể lấy lịch sử hoạt động'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy lịch sử hoạt động'
      };
    }
  }
};

// Cập nhật thông tin người dùng theo ID (Dành cho Admin)
export const updateUserById = async (userId: string, userData: UpdateUserRequest): Promise<{
  success: boolean;
  message: string;
  updatedUser?: AdminUser;
}> => {
  try {
    console.log('Input userData:', userData);
    
    // Đảm bảo tất cả các trường bắt buộc đều được cung cấp
    if (!userData.password) {
      return {
        success: false,
        message: 'Thiếu thông tin mật khẩu. Vui lòng cung cấp mật khẩu để cập nhật thông tin.'
      };
    }
    
    // Chuẩn hóa dữ liệu trước khi gửi API
    const formattedData = {
      username: userData.username,
      password: userData.password,
      fullname: userData.fullname,
      roleId: userData.roleId, // Đã sửa thành roleId
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      // Đảm bảo định dạng ngày tháng là chuẩn ISO string
      birthdate: userData.birthdate 
        ? new Date(userData.birthdate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      image: userData.image || null
    };
    
    console.log('Formatted userData being sent:', formattedData);
    console.log('Endpoint being called:', `/api/User/${userId}`);
    
    const response = await apiClient.put(`/api/User/${userId}`, formattedData);
    
    console.log('API response:', response);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Cập nhật thông tin người dùng thành công',
        updatedUser: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể cập nhật thông tin người dùng'
    };
  } catch (error: any) {
    console.error('Error updating user details:', error);
    console.error('Error response data:', error?.response?.data);
    console.error('Error status:', error?.response?.status);
    
    // Hiển thị thông báo lỗi chi tiết từ server nếu có
    const errorMessage = error?.response?.data?.title || 
                         error?.response?.data?.message || 
                         (error?.response?.data?.errors && Object.entries(error.response.data.errors)
                           .map(([key, value]) => `${key}: ${value}`).join(', ')) ||
                         error?.message || 
                         'Có lỗi xảy ra khi cập nhật thông tin người dùng';
    
    return {
      success: false,
      message: errorMessage
    };
  }
};
