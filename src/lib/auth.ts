import axios from 'axios';

// Base URL của API backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7029';

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, xóa token và chuyển về login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Interface cho Login Request
export interface LoginRequest {
  email: string;
  password: string;
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
}

// Interface cho Login Response
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Hàm login
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('Sending login request:', { email: loginData.email });
    
    const response = await apiClient.post('/User/Login', {
      email: loginData.email,
      password: loginData.password,
    });

    console.log('Full API Response:', response);
    console.log('Response data:', response.data);
    console.log('Response status:', response.status);

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

      console.log('Parsed token:', token);
      console.log('Parsed user:', user);

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

export default apiClient;
