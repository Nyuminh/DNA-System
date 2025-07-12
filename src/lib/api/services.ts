/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from './client';
import axios from "axios";

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
    // Đảm bảo đúng tên trường backend yêu cầu (serviceId)
    const response = await apiClient.post('http://localhost:5198/api/Services', {
      serviceId: service.id, 
      type: service.type,
      name: service.name,
      price: service.price,
      description: service.description,
      image: service.image,
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        service: response.data,
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

// Lấy danh sách appointments theo serviceId
export const getAppointmentsByServiceId = async (
  id: string
): Promise<{ success: boolean; appointments?: any[]; message?: string }> => {
  try {
    const response = await apiClient.get(`/api/Appointments/by-service/${id}`);

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        appointments: response.data,
      };
    }

    return {
      success: false,
      message: 'Không thể lấy danh sách lịch hẹn theo dịch vụ',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách lịch hẹn theo dịch vụ',
    };
  }
};

// Cập nhật service theo ID
export const updateService = async (
  service: Service,
  file?: File
): Promise<{ success: boolean; service?: Service; message?: string }> => {
  try {
    let payload: any;
    let headers: any;

    if (file) {
      payload = new FormData();
      payload.append("Type", service.type);
      payload.append("Name", service.name);
      payload.append("Price", service.price);
      payload.append("Description", service.description);
      payload.append("picture", file); // Gửi file thực tế
      payload.append("Image", file.name); // Nếu backend cần tên file
      headers = {}; // Để axios tự set Content-Type
    } else {
      payload = {
        Type: service.type,
        Name: service.name,
        Price: service.price,
        Description: service.description,
        Image: service.image,
      };
      headers = { "Content-Type": "application/json" };
    }

    const response = await axios.put(
      `http://localhost:5198/api/Services/${service.id}`,
      payload,
      { headers }
    );

    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        service: response.data,
        message: "Cập nhật dịch vụ thành công",
      };
    }

    return {
      success: false,
      message: "Không thể cập nhật dịch vụ",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi cập nhật dịch vụ",
    };
  }
};