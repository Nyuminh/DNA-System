/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
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

// Interface cho login response
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
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
      
      // Thử nhiều cách khác nhau để lấy token và user
      let token = data.token || data.accessToken || data.access_token || data.jwt;
      let user = data.user || data.userData || data.userInfo || data;
      
      // Nếu response chỉ trả về user data mà không có wrapper
      if (!token && !user && data.userID) {
        user = data;
        token = 'temp-token'; // Tạm thời để test
      }

      if (user) {
        return {
          success: true,
          message: 'Đăng nhập thành công',
          token: token,
          user: user,
        };
      }
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
