import axios from 'axios';

// Cấu hình base URL cho API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5198';

// Function để kiểm tra token có hợp lệ không
const isTokenValid = (token: string): boolean => {
  try {
    if (!token) return false;
    
    // Parse JWT payload
    const base64Url = token.split('.')[1];
    if (!base64Url) return false;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    // Kiểm tra thời gian hết hạn
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      console.warn('Token has expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};

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
    const token = localStorage.getItem('token');
    
    // Kiểm tra token tồn tại và hợp lệ
    if (token && isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } else if (token && !isTokenValid(token)) {
      // Token không hợp lệ - xóa token và redirect sau khi xử lý xong request
      console.warn('Invalid token detected in request interceptor');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Sử dụng setTimeout để tránh chuyển hướng trong quá trình xử lý request
        setTimeout(() => {
          window.location.href = '/auth/login?expired=true';
        }, 0);
      }
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
      console.warn('401 Unauthorized response received');
      // Token hết hạn, xóa token và redirect về login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Sử dụng đường dẫn với tham số để hiển thị thông báo phù hợp
        window.location.href = '/auth/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
