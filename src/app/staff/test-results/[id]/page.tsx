'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAppointmentById, updateAppointment, updateAppointmentStatus, updateAppointmentStatusSafe, Appointment, TestResult, createTestResultV2, getTestResultsByBookingId } from '@/lib/api/staff';
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

  // State để lưu kết quả xét nghiệm đã có
  const [existingResults, setExistingResults] = useState<TestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  
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
        
        // Thêm kết quả mới vào danh sách kết quả hiện có
        setExistingResults(prev => [result, ...prev]);
        
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
        console.error('Failed to create test result - API returned null');
        toast.error('Không thể lưu kết quả xét nghiệm - API trả về null');
        
        // Dùng prompt để hỏi người dùng có muốn thử lại hay không
        if (window.confirm('Lưu không thành công. Bạn có muốn thử lại không?')) {
          return; // Giữ form mở để người dùng thử lại
        }
      }
    } catch (error: any) {
      console.error('Error submitting test result:', error);
      let errorMessage = 'Đã xảy ra lỗi khi lưu kết quả xét nghiệm';
      
      if (error.response && error.response.data) {
        errorMessage += `: ${error.response.data.message || JSON.stringify(error.response.data)}`;
      }
      
      toast.error(errorMessage);
      // Dữ liệu đã nhập vẫn được giữ nguyên để người dùng có thể thử lại
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
          
          // Lấy kết quả xét nghiệm nếu booking đã hoàn thành
          if (data.status === 'Completed' || mapStatusToEnum(data.status) === 'completed') {
            fetchTestResults(data.bookingId);
          }
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
  
  // Hàm lấy kết quả xét nghiệm theo booking ID
  const fetchTestResults = async (bookingId: string) => {
    if (!token) return;
    
    try {
      setLoadingResults(true);
      console.log(`🔍 Fetching test results for booking ID: ${bookingId}`);
      
      // Gọi API để lấy kết quả xét nghiệm
      const results = await getTestResultsByBookingId(token, bookingId);
      
      console.log(`✅ Found ${results.length} test results:`, results);
      setExistingResults(results);
      
      if (results.length === 0) {
        console.log('No test results found for this booking');
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
    } finally {
      setLoadingResults(false);
    }
  };
  
  // Helper function to map status string to enum
  const mapStatusToEnum = (status: string): AppointmentStatus => {
    if (status === 'Đã xác nhận') return 'pending';
    if (status === 'Đang thực hiện') return 'in-progress';
    if (status === 'Hoàn thành') return 'completed';
    if (status === 'Hủy') return 'cancelled';
    
    // Legacy mappings cho các giá trị cũ
    if (status === 'Pending') return 'pending';
    if (status === 'Confirmed') return 'in-progress';
    if (status === 'Completed') return 'completed';
    if (status === 'Cancelled') return 'cancelled';
    
    // Fallback for other values
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('xác nhận')) return 'pending';
    if (lowerStatus.includes('thực hiện')) return 'in-progress';
    if (lowerStatus.includes('hoàn thành')) return 'completed';
    if (lowerStatus.includes('hủy')) return 'cancelled';
    
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
          apiStatus = 'Đã xác nhận';
          break;
        case 'in-progress':
          apiStatus = 'Đang thực hiện';
          break;
        case 'completed':
          apiStatus = 'Hoàn thành';
          break;
        case 'cancelled':
          apiStatus = 'Hủy';
          break;
        default:
          apiStatus = 'Đã xác nhận';
      }
      
      console.log(`Updating appointment ${id} status to ${apiStatus}`);
      
      // Sử dụng phương pháp an toàn để cập nhật trạng thái
      // Cần token vì hàm này sẽ fetch dữ liệu hiện tại trước
      const success = await updateAppointmentStatusSafe(token, id as string, apiStatus);
      
      if (success) {
        console.log(`✅ Status updated successfully to: ${apiStatus}`);
        
        // Cập nhật trạng thái trong state
        setAppointment(prevAppointment => {
          if (!prevAppointment) return null;
          return {
            ...prevAppointment,
            status: apiStatus
          };
        });
        
        setStatus(newStatus);
        toast.success(`Trạng thái đã được cập nhật thành ${getStatusText(newStatus)}`);
        
        // Luôn fetch lại dữ liệu để đảm bảo mọi thứ là mới nhất
        await refetchAppointment();
        
        // Nếu trạng thái được cập nhật thành "completed", tự động lấy kết quả xét nghiệm
        if (newStatus === 'completed' && appointment.bookingId) {
          fetchTestResults(appointment.bookingId);
        }
      } else {
        console.error("❌ Failed to update status");
        toast.error('Không thể cập nhật trạng thái');
        // Nếu API không thành công, thử fetch lại dữ liệu để xem trạng thái hiện tại
        await refetchAppointment();
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      let errorMessage = 'Đã xảy ra lỗi khi cập nhật trạng thái';
      
      if (error.response && error.response.data) {
        errorMessage += `: ${error.response.data.message || JSON.stringify(error.response.data)}`;
      }
      
      toast.error(errorMessage);
      // Thử fetch lại dữ liệu
      await refetchAppointment();
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
        return 'Đã xác nhận';
      case 'in-progress':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Hủy';
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

  // Hàm để tải lại dữ liệu booking khi cần thiết
  const refetchAppointment = async () => {
    if (!token || !id) return;
    
    try {
      console.log(`🔄 Re-fetching appointment data for ID: ${id}`);
      const data = await getAppointmentById(token, id as string);
      
      if (data) {
        console.log('✅ Refreshed appointment data:', data);
        setAppointment(data);
        
        // Determine status from appointment data
        if (data.status) {
          setStatus(mapStatusToEnum(data.status));
        }
      } else {
        console.error('❌ Failed to refresh appointment data');
      }
    } catch (error) {
      console.error('Error re-fetching appointment:', error);
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
        <div className="flex space-x-2">
          <button
            onClick={refetchAppointment}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
            title="Làm mới dữ liệu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Quay lại
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Hiển thị thông báo nếu appointment bị lỗi hoặc không có đủ dữ liệu */}
        {(!appointment.bookingId || !appointment.customerId || !appointment.serviceId) && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Dữ liệu booking không đầy đủ. Vui lòng bấm "Làm mới" để tải lại dữ liệu.
                </p>
              </div>
            </div>
          </div>
        )}
        
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
                  title={status === 'pending' ? 'Chuyển sang trạng thái đang thực hiện' : ''}
                >
                  {updating ? 'Đang xử lý...' : 'Đang thực hiện'}
                </button>
                
                <button 
                  onClick={() => setShowResultForm(true)}
                  disabled={updating || status === 'completed' || status === 'cancelled' || status !== 'in-progress'}
                  className={`px-4 py-2 rounded ${
                    updating || status === 'completed' || status === 'cancelled' || status !== 'in-progress'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title={status !== 'in-progress' ? 'Hãy chuyển sang trạng thái đang thực hiện trước khi nhập kết quả' : 'Nhập kết quả xét nghiệm'}
                >
                  {updating ? 'Đang xử lý...' : 'Nhập kết quả'}
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
                  {updating ? 'Đang xử lý...' : 'Hủy'}
                </button>
              </div>
              
              {status === 'in-progress' && !showResultForm && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-blue-700 flex items-center font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Booking đang trong trạng thái thực hiện
                  </p>
                  <div className="mt-2 ml-7">
                    <p className="text-sm text-blue-600 mb-2">
                      Bạn có thể nhập kết quả xét nghiệm ngay bây giờ bằng cách bấm nút "Nhập kết quả" ở trên.
                    </p>
                    <p className="text-sm text-blue-600">
                      <strong>Lưu ý:</strong> Nếu bạn không thấy dữ liệu đầy đủ, hãy bấm nút "Làm mới" ở góc trên cùng bên phải.
                    </p>
                    <button 
                      onClick={() => setShowResultForm(true)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Nhập kết quả ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Hiển thị kết quả xét nghiệm nếu booking đã hoàn thành */}
        {status === 'completed' && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Kết quả xét nghiệm</h2>
            
            {loadingResults ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : existingResults.length > 0 ? (
              <div className="space-y-6">
                {existingResults.map((result, index) => (
                  <div key={result.resultId || index} className="bg-gray-50 p-4 rounded-md border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Ngày có kết quả:</p>
                        <p className="font-medium">{formatDate(result.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Kết quả:</p>
                        <p className="font-semibold text-lg">
                          <span className={`inline-block px-3 py-1 rounded-full ${
                            result.status === 'Trùng nhau' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status}
                          </span>
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Mô tả chi tiết:</p>
                        <div className="mt-1 p-3 bg-white border rounded-md">
                          <p className="whitespace-pre-line">{result.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">Không tìm thấy kết quả xét nghiệm cho booking này</p>
                {user?.roleID?.toLowerCase() === 'staff' && (
                  <button 
                    onClick={() => setShowResultForm(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Thêm kết quả xét nghiệm
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
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