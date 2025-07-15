/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './client';
import axios from "axios";

// Interface cho booking request
export interface BookingRequest {
  customerId: string;
  serviceId: string;
  address: string;
  method: string;
  date: string;
  staffId?: string; // optional nếu muốn truyền, hoặc backend tự xử lý
  status?: string; // optional, nếu không truyền thì backend sẽ tự xử lý
}

// Cập nhật interface BookingResponse
export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string; // Thêm trường này để dễ dàng truy cập
  booking?: any; // Dữ liệu đầy đủ từ API
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
      status: data.status ?? "", // Thêm dòng này để gửi status lên API
    };


    const response = await apiClient.post('/api/Appointments', payload);


    // Trích xuất bookingId từ response theo đúng cấu trúc
    const responseData = response.data;
    let bookingId = null;

    // Kiểm tra xem bookingId nằm ở đâu trong response
    if (responseData.data && responseData.data.bookingId) {
      bookingId = responseData.data.bookingId;
    } else if (responseData.bookingId) {
      bookingId = responseData.bookingId;
    } else if (responseData.data && responseData.data.id) {
      bookingId = responseData.data.id;
    }



    // Cập nhật BookingResponse interface để bao gồm bookingId ở cấp cao nhất
    return {
      success: true,
      message: 'Đặt lịch thành công',
      bookingId: bookingId, // Thêm bookingId ở cấp cao nhất
      booking: response.data,
    };
  } catch (error: any) {
    console.error('Lỗi khi tạo booking:', error);
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

// Delete/cancel booking
export async function deleteBooking(bookingId: string): Promise<BookingResponse> {
  try {
    const response = await apiClient.delete(`/api/Appointments/${bookingId}`);
    return {
      success: true,
      message: 'Đã hủy đặt lịch thành công',
      booking: response.data,
    };
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Không thể hủy đặt lịch, vui lòng thử lại sau',
    };
  }
}

// Đảm bảo hàm được export đúng cách
export const getAllBookings = async (): Promise<any[]> => {
  try {
    const res = await fetch('http://localhost:5198/api/Appointments');
    let bookings = await res.json();
    if (!Array.isArray(bookings)) {
      if (bookings.$values && Array.isArray(bookings.$values)) {
        bookings = bookings.$values;
      } else {
        return [];
      }
    }
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

// Hàm cập nhật booking với đầy đủ dữ liệu (không chỉ status)
export async function updateBooking(
  bookingId: string,
  data: {
    date: string;
    staffId: string;
    serviceId: string;
    address: string;
    method: string;
    status: string;
  }
): Promise<BookingResponse> {
  try {
    // Đảm bảo gửi đúng format cho API backend
    const payload = {
      date: data.date,
      staffId: data.staffId,
      serviceId: data.serviceId,
      address: data.address,
      method: data.method,
      status: data.status,
    };
    const response = await apiClient.put(`/api/Appointments/${bookingId}`, payload);
    return {
      success: true,
      message: 'Cập nhật trạng thái thành công',
      bookingId,
      booking: response.data,
    };
  } catch (error: any) {
    console.error('Lỗi khi cập nhật trạng thái booking:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Cập nhật trạng thái thất bại',
    };
  }
}