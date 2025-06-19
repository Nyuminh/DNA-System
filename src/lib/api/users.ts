/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from './client';

// Interface cho user account 
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

// Interface cho user profile
export interface UserProfile {
  userID: string;
  username: string;
  fullname: string;
  gender: string;
  roleID: string;
  email: string;
  phone: string;
  birthdate: string;
  image: string;
}

// Lấy danh sách users (Admin)
export const getUsers = async (): Promise<{ success: boolean; users?: UserAccount[]; message?: string }> => {
  try {
    const response = await apiClient.get('/Users');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        users: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách người dùng'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách người dùng'
    };
  }
};

// Lấy thông tin user theo ID
export const getUserById = async (id: string): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
  try {
    const response = await apiClient.get(`/Users/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        user: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy thông tin người dùng'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin người dùng'
    };
  }
};

// Lấy profile của user hiện tại
export const getCurrentUserProfile = async (): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
  try {
    const response = await apiClient.get('/Users/profile');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        user: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy thông tin profile'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin profile'
    };
  }
};

// Cập nhật thông tin user
export const updateUser = async (id: string, userData: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
  try {
    const response = await apiClient.put(`/Users/${id}`, userData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        user: response.data,
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
};

// Tạo user mới (Admin)
export const createUser = async (userData: Omit<UserProfile, 'userID'>): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
  try {
    const response = await apiClient.post('/Users', userData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        user: response.data,
        message: 'Tạo người dùng thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể tạo người dùng'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tạo người dùng'
    };
  }
};

// Xóa user (Admin)
export const deleteUser = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete(`/Users/${id}`);
    
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
    return {
      success: false,
      message: 'Có lỗi xảy ra khi xóa người dùng'
    };
  }
};
