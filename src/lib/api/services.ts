/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from './client';

// Interface cho service
export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  isPopular: boolean;
}

// Lấy danh sách services
export const getServices = async (): Promise<{ success: boolean; services?: Service[]; message?: string }> => {
  try {
    const response = await apiClient.get('/Services');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        services: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách dịch vụ'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách dịch vụ'
    };
  }
};

// Lấy service theo ID
export const getServiceById = async (id: string): Promise<{ success: boolean; service?: Service; message?: string }> => {
  try {
    const response = await apiClient.get(`/Services/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        service: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy thông tin dịch vụ'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin dịch vụ'
    };
  }
};

// Tạo service mới (Admin)
export const createService = async (serviceData: Omit<Service, 'id'>): Promise<{ success: boolean; service?: Service; message?: string }> => {
  try {
    const response = await apiClient.post('/Services', serviceData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        service: response.data,
        message: 'Tạo dịch vụ thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể tạo dịch vụ'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tạo dịch vụ'
    };
  }
};

// Cập nhật service (Admin)
export const updateService = async (id: string, serviceData: Partial<Service>): Promise<{ success: boolean; service?: Service; message?: string }> => {
  try {
    const response = await apiClient.put(`/Services/${id}`, serviceData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        service: response.data,
        message: 'Cập nhật dịch vụ thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể cập nhật dịch vụ'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật dịch vụ'
    };
  }
};

// Xóa service (Admin)
export const deleteService = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete(`/Services/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Xóa dịch vụ thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể xóa dịch vụ'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi xóa dịch vụ'
    };
  }
};
