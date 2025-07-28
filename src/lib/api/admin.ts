/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './client';
import axios from 'axios'; // Added for axios.isAxiosError

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
  birthdate?: string; // Thêm trường birthdate
  statistics: {
    totalUsers: number;
    totalTests: number;
    totalServices: number;
    todayLogin: number;
  };
}

export interface UpdateProfileRequest {
  username: string; // Đổi từ optional thành required
  fullname: string;  // API sẽ chuyển thành fullName
  phone: string;     // API sẽ chuyển thành phoneNumber
  email: string;
  address: string;
  birthdate: string; // Thêm trường birthdate theo định dạng "YYYY-MM-DD"
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
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token available when fetching admin profile');
        return {
          success: false,
          message: 'Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.'
        };
      }

      console.log('Fetching admin profile with token:', token.substring(0, 15) + '...');
      
      // Thử gọi API với timeout ngắn hơn
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await apiClient.get('/api/User/me', {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.status >= 200 && response.status < 300 && response.data) {
        console.log('API User/me response:', response.data);
        
        // Transform API response to match AdminProfile interface
        const profileData: AdminProfile = {
          id: response.data.userID || response.data.userId || response.data.id || '',
          username: response.data.username || response.data.userName || '',
          fullname: response.data.fullname || response.data.fullName || response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || response.data.phoneNumber || '',
          address: response.data.address || '',
          role: response.data.roleID || response.data.roleId || response.data.role || 'Admin',
          department: response.data.department || 'IT',
          position: response.data.position || 'Administrator',
          joinDate: response.data.joinDate || response.data.createdDate || new Date().toISOString(),
          lastLogin: response.data.lastLogin || new Date().toISOString(),
          avatar: response.data.image || response.data.avatar || response.data.profileImage || '',
          isActive: response.data.isActive !== undefined ? response.data.isActive : true,
          permissions: response.data.permissions || ['admin'],
          birthdate: response.data.birthdate || response.data.dateOfBirth || response.data.Birthdate || response.data.DateOfBirth || undefined,
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
      
      if (axios.isAxiosError(error)) {
        // Xử lý lỗi timeout
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          return {
            success: false,
            message: 'Yêu cầu bị timeout. Vui lòng thử lại sau.'
          };
        }
        
        // Xử lý lỗi abort
        if (error.message.includes('aborted')) {
          return {
            success: false,
            message: 'Yêu cầu bị hủy.'
          };
        }
        
        // Xử lý lỗi 401 một cách cụ thể
        if (error.response?.status === 401) {
          console.warn('401 Unauthorized when fetching admin profile');
          // Xóa token nếu không hợp lệ
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          return {
            success: false,
            message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
          };
        }
        
        if (error.response?.status === 404) {
          return {
            success: false,
            message: 'API endpoint không tồn tại. Vui lòng kiểm tra cấu hình hệ thống.'
          };
        }
        
        return {
          success: false,
          message: `Lỗi: ${error.response?.status} - ${error.response?.data?.message || error.message}`
        };
      }
      
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy thông tin profile'
      };
    }
  },
  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest): Promise<{ success: boolean; profile?: AdminProfile; message?: string }> => {
    try {
      // Lấy token từ localStorage để đảm bảo xác thực
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          message: 'Không tìm thấy token xác thực. Vui lòng đăng nhập lại.'
        };
      }
      
      console.log('Updating admin profile with data:', data);
      
      // Tạo bản sao của data để không thay đổi dữ liệu gốc
      const requestData = { ...data };
      
      // API yêu cầu các trường đúng định dạng camelCase
      // Không cần chuyển đổi thêm vì API sẽ tự nhận diện các trường
      
      console.log('Formatted request data for API:', requestData);
      
      // Sử dụng endpoint '/api/User/profile'
      const response = await apiClient.put('/api/User/profile', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Update profile API response:', response);
      
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
      console.error('Error updating admin profile:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
          };
        }
        
        if (error.response?.status === 400) {
          const errorData = error.response?.data;
          console.error('Bad Request Details:', errorData);
          
          // Xử lý lỗi validation từ API
          let errorMessage = errorData?.title || errorData?.message || 'Dữ liệu không hợp lệ';
          
          // Kiểm tra xem có lỗi validation chi tiết không
          if (errorData?.errors) {
            try {
              const errorDetails = Object.entries(errorData.errors)
                .map(([field, messages]) => {
                  const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                  return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
                })
                .join('; ');
              
              if (errorDetails) {
                errorMessage += ` - ${errorDetails}`;
              }
            } catch (parseError) {
              console.error('Error parsing validation errors:', parseError);
            }
          }
          
          return {
            success: false,
            message: errorMessage
          };
        }
        
        return {
          success: false,
          message: `Lỗi: ${error.response?.status} - ${error.response?.data?.message || error.message}`
        };
      }
      
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
      // Validate input
      if (!file) {
        return {
          success: false,
          message: 'Vui lòng chọn ảnh để upload'
        };
      }

      // Validate file type


      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif','image/webp'];

      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          message: 'Chỉ hỗ trợ file ảnh định dạng JPG, PNG, GIF,webp'
        };
      }

      // Validate file size (2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        return {
          success: false,
          message: 'Kích thước ảnh không được vượt quá 2MB'
        };
      }

      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          message: 'Không tìm thấy token xác thực. Vui lòng đăng nhập lại.'
        };
      }

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('picture', file);

      console.log('Uploading admin avatar:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        hasToken: !!token
      });

      // Gửi request đến API
      const response = await apiClient.put('/api/User/update-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Update admin avatar API response:', response);

      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        return {
          success: true,
          avatarUrl: data.imageUrl || data.image || '',
          message: data.message || 'Cập nhật ảnh đại diện thành công!'
        };
      } else {
        return {
          success: false,
          message: 'Cập nhật ảnh thất bại!'
        };
      }
    } catch (error) {
      console.error('Update admin avatar error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
          };
        }
        
        if (error.response?.status === 400) {
          return {
            success: false,
            message: error.response?.data?.message || 'File ảnh không hợp lệ hoặc vượt quá giới hạn cho phép'
          };
        }
        
        return {
          success: false,
          message: `Lỗi: ${error.response?.status} - ${error.response?.data?.message || error.message}`
        };
      }
      
      return {
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật ảnh đại diện'
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

// Xóa người dùng theo ID
export const deleteUserById = async (userId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        message: 'Không có quyền truy cập. Vui lòng đăng nhập lại.'
      };
    }

    const response = await apiClient.delete(`/api/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Xóa người dùng thành công'
      };
    }

    return {
      success: false,
      message: 'Không thể xóa người dùng'
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Có lỗi xảy ra khi xóa người dùng'
    };
  }
};
