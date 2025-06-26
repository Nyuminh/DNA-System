'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAppointmentById, updateAppointment, Appointment, TestResult, createTestResultV2 } from '@/lib/api/staff';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

type AppointmentStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [submittingResult, setSubmittingResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AppointmentStatus>('pending');
  
  // State cho form kết quả xét nghiệm
  const [testResult, setTestResult] = useState<Partial<TestResult>>({
    customerId: '',
    staffId: '',
    serviceId: '',
    bookingId: id as string,
    date: new Date().toISOString().slice(0, 16),
    description: '',
    status: 'Trùng nhau'
  });
  
  // State hiển thị form kết quả
  const [showResultForm, setShowResultForm] = useState(false);
  
  // Xử lý thay đổi input form kết quả
  const handleResultInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTestResult(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Xử lý submit form kết quả
  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !appointment) return;
    
    try {
      setSubmittingResult(true);
      
      // Chuẩn bị dữ liệu kết quả cho API mới /api/Results
      const resultData: Partial<TestResult> = {
        customerId: appointment.customerId,
        staffId: appointment.staffId || user?.userID || '',
        serviceId: appointment.serviceId,
        bookingId: appointment.bookingId,
        date: new Date(testResult.date || '').toISOString(),
        description: testResult.description,
        status: testResult.status // Trùng nhau hoặc Không trùng nhau
      };
      
      console.log('Submitting test result to /api/Results:', resultData);
      
      // Gọi API tạo kết quả xét nghiệm với endpoint mới /api/Results
      const result = await createTestResultV2(token, resultData);
      
      if (result) {
        toast.success('Đã lưu kết quả xét nghiệm thành công');
        // Cập nhật trạng thái booking thành Completed
        await handleUpdateStatus('completed');
        // Ẩn form sau khi lưu thành công
        setShowResultForm(false);
        // Reset form
        setTestResult({
          customerId: '',
          staffId: '',
          serviceId: '',
          bookingId: id as string,
          date: new Date().toISOString().slice(0, 16),
          description: '',
          status: 'Trùng nhau' // Đặt lại giá trị mặc định
        });
      } else {
        toast.error('Không thể lưu kết quả xét nghiệm');
      }
    } catch (error: any) {
      console.error('Error submitting test result:', error);
      let errorMessage = 'Đã xảy ra lỗi khi lưu kết quả xét nghiệm';
      
      if (error.response && error.response.data) {
        errorMessage += `: ${error.response.data.message || JSON.stringify(error.response.data)}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmittingResult(false);
    }
  };

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (!user || !token) return;
      
      try {
        setLoading(true);
        const data = await getAppointmentById(token, id as string);
        
        if (data) {
          setAppointment(data);
          
          // Determine status from appointment data
          if (data.status) {
            setStatus(mapStatusToEnum(data.status));
          }
          
          // Khởi tạo giá trị cho form kết quả
          setTestResult(prev => ({
            ...prev,
            customerId: data.customerId,
            staffId: data.staffId || '',
            serviceId: data.serviceId,
            bookingId: data.bookingId,
            status: 'Trùng nhau' // Đặt giá trị mặc định cho kết quả xét nghiệm
          }));
        }
      } catch (err) {
        setError('Failed to load appointment details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [id, user, token]);
  
  // Helper function to map status string to enum
  const mapStatusToEnum = (status: string): AppointmentStatus => {
    if (status === 'Pending') return 'pending';
    if (status === 'Confirmed') return 'in-progress';
    if (status === 'Completed') return 'completed';
    if (status === 'Cancelled') return 'cancelled';
    
    // Fallback for other values
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('pending')) return 'pending';
    if (lowerStatus.includes('confirm')) return 'in-progress';
    if (lowerStatus.includes('complet')) return 'completed';
    if (lowerStatus.includes('cancel')) return 'cancelled';
    
    return 'pending';
  };

  const handleUpdateStatus = async (newStatus: AppointmentStatus) => {
    if (!appointment || !token) return;
    
    try {
      setUpdating(true);
      
      // Chuyển đổi trạng thái thành giá trị thích hợp cho API
      let apiStatus = '';
      switch (newStatus) {
        case 'pending':
          apiStatus = 'Pending';
          break;
        case 'in-progress':
          apiStatus = 'Confirmed';
          break;
        case 'completed':
          apiStatus = 'Completed';
          break;
        case 'cancelled':
          apiStatus = 'Cancelled';
          break;
        default:
          apiStatus = 'Pending';
      }
      
      // Create update payload
      const updateData = {
        ...appointment,
        status: apiStatus
      };
      
      console.log(`Updating appointment ${id} status to ${apiStatus}`);
      console.log('Update payload:', updateData);
      
      // Call API to update appointment
      const updatedAppointment = await updateAppointment(token, id as string, updateData);
      
      if (updatedAppointment) {
        setAppointment(updatedAppointment);
        setStatus(newStatus);
        toast.success(`Trạng thái đã được cập nhật thành ${getStatusText(newStatus)}`);
      } else {
        toast.error('Không thể cập nhật trạng thái');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      let errorMessage = 'Đã xảy ra lỗi khi cập nhật trạng thái';
      
      if (error.response && error.response.data) {
        errorMessage += `: ${error.response.data.message || JSON.stringify(error.response.data)}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

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

  const getStatusText = (statusValue: AppointmentStatus) => {
    switch (statusValue) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (statusValue: AppointmentStatus) => {
    switch (statusValue) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết lịch hẹn #{appointment.bookingId}</h1>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Quay lại
        </button>
      </div>
      
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
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status as AppointmentStatus)}`}>
                  {getStatusText(status as AppointmentStatus)}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Trạng thái xử lý</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Pending</p>
                  <p className="text-sm text-gray-500">{formatDate(appointment.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${status === 'in-progress' || status === 'completed' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Confirmed</p>
                  <p className="text-sm text-gray-500">{status === 'in-progress' || status === 'completed' ? 'Confirmed' : 'Not confirmed'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Completed</p>
                  <p className="text-sm text-gray-500">{status === 'completed' ? 'Completed' : 'Not completed'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Cập nhật trạng thái</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleUpdateStatus('in-progress')}
                  disabled={updating || status === 'in-progress' || status === 'completed' || status === 'cancelled'}
                  className={`px-4 py-2 rounded ${
                    updating || status === 'in-progress' || status === 'completed' || status === 'cancelled'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {updating ? 'Processing...' : 'Confirm'}
                </button>
                
                <button 
                  onClick={() => setShowResultForm(true)}
                  disabled={updating || status === 'completed' || status === 'cancelled' || status !== 'in-progress'}
                  className={`px-4 py-2 rounded ${
                    updating || status === 'completed' || status === 'cancelled' || status !== 'in-progress'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {updating ? 'Processing...' : 'Nhập kết quả'}
                </button>
                
                <button 
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={updating || status === 'completed' || status === 'cancelled'}
                  className={`px-4 py-2 rounded ${
                    updating || status === 'completed' || status === 'cancelled'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {updating ? 'Processing...' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form nhập kết quả xét nghiệm */}
        {showResultForm && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Nhập kết quả xét nghiệm</h2>
            <form onSubmit={handleSubmitResult} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Ngày có kết quả <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={testResult.date}
                    onChange={handleResultInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Kết quả xét nghiệm <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={testResult.status}
                    onChange={handleResultInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Trùng nhau">Trùng nhau</option>
                    <option value="Không trùng nhau">Không trùng nhau</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Mô tả kết quả <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={testResult.description}
                  onChange={handleResultInputChange}
                  required
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả chi tiết về kết quả xét nghiệm..."
                ></textarea>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Booking ID:</span> {appointment.bookingId}<br />
                  <span className="font-medium">Khách hàng:</span> {appointment.customerId}<br />
                  <span className="font-medium">Dịch vụ:</span> {appointment.serviceId}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowResultForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submittingResult}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {submittingResult ? 'Đang lưu...' : 'Lưu kết quả'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 