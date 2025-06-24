/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './client';

// Interface cho booking request
export interface BookingRequest {
  customerId: string;
  serviceId: string;
  address: string;
  method: string;
  date: string;
  staffId?: string; // optional nếu muốn truyền, hoặc backend tự xử lý
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
export async function createBooking(data: BookingRequest): Promise<BookingResponse> {
  try {
    // Đảm bảo gửi đúng format cho API backend
    const payload = {
      bookingId: "", // để trống theo yêu cầu
      customerId: data.customerId,
      date: data.date,
      staffId: data.staffId ?? "", // để trống nếu không có
      serviceId: data.serviceId,
      address: data.address,
      method: data.method,
    };

    const response = await apiClient.post('/api/Appointments', payload);
    return {
      success: true,
      message: 'Đặt lịch thành công',
      booking: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Đặt lịch thất bại',
    };
  }
}

// Lấy danh sách booking từ API
export async function getBookings(): Promise<BookingResponse[]> {
  try {
    const response = await apiClient.get('/api/Appointments');
    return response.data;
  } catch (error: any) {
    return [];
  }
}