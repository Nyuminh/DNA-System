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

// Quản lý services (Admin)
export const getAdminServices = async (): Promise<{ success: boolean; services?: any[]; message?: string }> => {
  try {
    const response = await apiClient.get('/Admin/services');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        services: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách dịch vụ admin'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách dịch vụ admin'
    };
  }
};
