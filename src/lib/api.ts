import axios from 'axios';

// Cấu hình base URL cho API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7029';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Tăng timeout cho HTTPS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Cho phép self-signed certificates trong development
  ...(process.env.NODE_ENV === 'development' && {
    httpsAgent: false,
  }),
});

// Request interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
      // Token hết hạn, xóa token và redirect về login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Interface cho login request
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Interface cho login response
export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

// Hàm gọi API đăng nhập
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/User/Login', {
      email: loginData.email,
      password: loginData.password,
      rememberMe: loginData.rememberMe || false,
    });
    
    return response.data;  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Lỗi từ server
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Đăng nhập thất bại',
        };
      }
      // Lỗi network hoặc SSL
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        return {
          success: false,
          message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        };
      }
      if (error.message.includes('certificate') || error.message.includes('SSL')) {
        return {
          success: false,
          message: 'Lỗi chứng chỉ SSL. Vui lòng liên hệ quản trị viên.',
        };
      }
      // Lỗi network khác
      return {
        success: false,
        message: 'Không thể kết nối đến server',
      };
    }
    
    // Lỗi khác
    return {
      success: false,
      message: 'Đã xảy ra lỗi không mong muốn',    };
  }
};

export default apiClient;
