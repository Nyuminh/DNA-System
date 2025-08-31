/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from './client';

// Interface cho service
export interface Service {
  id: string;
  type: string;
  name: string;
  price: string;
  description: string;
  image: string;
}

// Lấy danh sách services
export const getServices = async (): Promise<{ success: boolean; services?: Service[]; message?: string }> => {
  try {
    const response = await apiClient.get('/api/Services');
    
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
    const response = await apiClient.get(`/api/Services/${id}`);
    
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

//Delete service by ID
export const deleteServiceById = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete(`/api/Services/${id}`);
    
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
export const createService = async (
  service: Service
): Promise<{ success: boolean; service?: Service; message?: string }> => {
  try {
    const response = await apiClient.post('/api/Services', service);

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        service: response.data, // <-- trả về service mới tạo
        message: 'Tạo dịch vụ thành công',
      };
    }

    return {
      success: false,
      message: 'Không thể tạo dịch vụ',
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi tạo dịch vụ',
    };
  }
};