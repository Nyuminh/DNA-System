/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from './client';

// Interface cho review
export interface Review {
  id: string;
  userId: string;
  testId: string;
  rating: number;
  content: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Interface cho notification
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// Interface cho payment
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
}

// === REVIEWS API ===

// Lấy danh sách reviews
export const getReviews = async (): Promise<{ success: boolean; reviews?: Review[]; message?: string }> => {
  try {
    const response = await apiClient.get('/Reviews');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        reviews: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách đánh giá'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách đánh giá'
    };
  }
};

// Tạo review mới
export const createReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; review?: Review; message?: string }> => {
  try {
    const response = await apiClient.post('/Reviews', reviewData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        review: response.data,
        message: 'Tạo đánh giá thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể tạo đánh giá'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tạo đánh giá'
    };
  }
};

// Cập nhật review
export const updateReview = async (id: string, reviewData: Partial<Review>): Promise<{ success: boolean; review?: Review; message?: string }> => {
  try {
    const response = await apiClient.put(`/Reviews/${id}`, reviewData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        review: response.data,
        message: 'Cập nhật đánh giá thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể cập nhật đánh giá'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật đánh giá'
    };
  }
};

// Xóa review
export const deleteReview = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete(`/Reviews/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Xóa đánh giá thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể xóa đánh giá'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi xóa đánh giá'
    };
  }
};

// === NOTIFICATIONS API ===

// Lấy danh sách notifications
export const getNotifications = async (): Promise<{ success: boolean; notifications?: Notification[]; message?: string }> => {
  try {
    const response = await apiClient.get('/Notifications');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        notifications: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách thông báo'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách thông báo'
    };
  }
};

// Tạo notification mới (System)
export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<{ success: boolean; notification?: Notification; message?: string }> => {
  try {
    const response = await apiClient.post('/Notifications', notificationData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        notification: response.data,
        message: 'Tạo thông báo thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể tạo thông báo'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tạo thông báo'
    };
  }
};

// Đánh dấu notification đã đọc
export const markNotificationAsRead = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.put(`/Notifications/${id}`, { isRead: true });
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        message: 'Đánh dấu đã đọc thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể đánh dấu đã đọc'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đánh dấu đã đọc'
    };
  }
};

// === PAYMENTS API ===

// Lấy danh sách payments
export const getPayments = async (): Promise<{ success: boolean; payments?: Payment[]; message?: string }> => {
  try {
    const response = await apiClient.get('/Payments');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        payments: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách thanh toán'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách thanh toán'
    };
  }
};

// Tạo payment mới
export const createPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'completedAt'>): Promise<{ success: boolean; payment?: Payment; message?: string }> => {
  try {
    const response = await apiClient.post('/Payments', paymentData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        payment: response.data,
        message: 'Tạo thanh toán thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể tạo thanh toán'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tạo thanh toán'
    };
  }
};

// Lấy payment details
export const getPaymentById = async (id: string): Promise<{ success: boolean; payment?: Payment; message?: string }> => {
  try {
    const response = await apiClient.get(`/Payments/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        payment: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy thông tin thanh toán'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin thanh toán'
    };
  }
};

// Xác nhận payment
export const confirmPayment = async (id: string): Promise<{ success: boolean; payment?: Payment; message?: string }> => {
  try {
    const response = await apiClient.post(`/Payments/${id}/confirm`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        payment: response.data,
        message: 'Xác nhận thanh toán thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể xác nhận thanh toán'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi xác nhận thanh toán'
    };
  }
};
