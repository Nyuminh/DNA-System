/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './client';

// Interface cho appointment
export interface Appointment {
  id: string;
  userId: string;
  testId?: string;
  type: 'consultation' | 'sample-collection' | 'result-discussion';
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
  staffMember?: string;
  notes?: string;
  createdAt: string;
}

// Lấy danh sách appointments
export const getAppointments = async (userId?: string): Promise<{ success: boolean; appointments?: Appointment[]; message?: string }> => {
  try {
    const url = userId ? `/Appointments?userId=${userId}` : '/Appointments';
    const response = await apiClient.get(url);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        appointments: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách cuộc hẹn'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách cuộc hẹn'
    };
  }
};

// Lấy appointment theo ID
export const getAppointmentById = async (id: string): Promise<{ success: boolean; appointment?: Appointment; message?: string }> => {
  try {
    const response = await apiClient.get(`/Appointments/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        appointment: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy thông tin cuộc hẹn'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin cuộc hẹn'
    };
  }
};

// Tạo appointment mới
export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Promise<{ success: boolean; appointment?: Appointment; message?: string }> => {
  try {
    const response = await apiClient.post('/Appointments', appointmentData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        appointment: response.data,
        message: 'Đặt lịch hẹn thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể đặt lịch hẹn'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đặt lịch hẹn'
    };
  }
};

// Cập nhật appointment
export const updateAppointment = async (id: string, appointmentData: Partial<Appointment>): Promise<{ success: boolean; appointment?: Appointment; message?: string }> => {
  try {
    const response = await apiClient.put(`/Appointments/${id}`, appointmentData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        appointment: response.data,
        message: 'Cập nhật lịch hẹn thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể cập nhật lịch hẹn'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật lịch hẹn'
    };
  }
};

// Xóa appointment
export const deleteAppointment = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete(`/Appointments/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Hủy lịch hẹn thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể hủy lịch hẹn'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi hủy lịch hẹn'
    };
  }
};

// Lấy lịch trống để đặt hẹn
export const getAvailableSchedule = async (date?: string): Promise<{ success: boolean; schedule?: any[]; message?: string }> => {
  try {
    const url = date ? `/Appointments/schedule?date=${date}` : '/Appointments/schedule';
    const response = await apiClient.get(url);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        schedule: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy lịch trống'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy lịch trống'
    };
  }
};
