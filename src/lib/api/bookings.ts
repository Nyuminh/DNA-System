/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './client';

// Interface cho booking request
export interface BookingRequest {
  serviceId: string;
  testType: string;
  collectionMethod: string;
  appointmentDate?: string;
  appointmentTime?: string;
  participants: Array<{
    role: string;
    name: string;
    dob: string;
    gender: string;
    relationship?: string;
    sampleType: string;
  }>;
  notes?: string;
}

// Interface cho booking response
export interface BookingResponse {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    status: string;
    createdAt: string;
  };
}

// Tạo booking mới
export const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  try {
    const response = await apiClient.post('/Bookings', bookingData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Đặt lịch xét nghiệm thành công!',
        booking: response.data
      };
    }
    
    return {
      success: false,
      message: response.data?.message || 'Đặt lịch thất bại'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đặt lịch'
    };
  }
};

// Lấy danh sách booking của user
export const getUserBookings = async (userId?: string): Promise<any> => {
  try {
    const url = userId ? `/Bookings?userId=${userId}` : '/Bookings';
    const response = await apiClient.get(url);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        bookings: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách booking'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách booking'
    };
  }
};
