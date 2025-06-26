'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAppointmentById } from '@/lib/api/staff';
import { Appointment } from '@/lib/api/staff';
import { useAuth } from '@/contexts/AuthContext';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (!user || !token) return;
      
      try {
        setLoading(true);
        const data = await getAppointmentById(token, id as string);
        setAppointment(data);
      } catch (err) {
        setError('Failed to load appointment details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [id, user, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h2 className="text-red-800 text-lg font-semibold">Error</h2>
        <p className="text-red-700">{error || 'Appointment not found'}</p>
      </div>
    );
  }

  const getMethodText = (method: string) => {
    if (method === 'Tại nhà') return 'Tại nhà';
    if (method === 'Tại cơ sở') return 'Tại cơ sở';
    return method || 'N/A';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chi tiết lịch hẹn #{appointment.bookingId}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin lịch hẹn</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Mã lịch hẹn:</span>
                <span>{appointment.bookingId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Khách hàng:</span>
                <span>{appointment.customerId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Ngày hẹn:</span>
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Nhân viên phụ trách:</span>
                <span>{appointment.staffId || 'Chưa phân công'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Dịch vụ:</span>
                <span>{appointment.serviceId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Phương thức:</span>
                <span>{getMethodText(appointment.method)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Địa chỉ:</span>
                <span>{appointment.address || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Trạng thái xử lý</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Đã đặt lịch</p>
                  <p className="text-sm text-gray-500">{formatDate(appointment.date)}</p>
                </div>
              </div>
              
              {/* Các trạng thái khác có thể thêm sau */}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Cập nhật trạng thái</h3>
              <div className="flex space-x-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Đã lấy mẫu
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Hoàn thành
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 