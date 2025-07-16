'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAppointmentById, updateAppointment, updateAppointmentStatus, updateAppointmentStatusSafe, Appointment, TestResult, createTestResultV2, getTestResultsByBookingId, kitApi, Kit, getUserById, User, getAllUsers, Relative, getRelativesByBookingId } from '@/lib/api/staff';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Định nghĩa lại type trạng thái tiếng Việt
type AppointmentStatusVN = 'Đang chờ mẫu' | 'Đang thực hiện' | 'Hoàn thành' | 'Đã hủy';

// Hàm chuyển đổi trạng thái từ database sang enum tiếng Việt
const mapStatusToVN = (status: string): AppointmentStatusVN => {
  if (!status) return 'Đang chờ mẫu';
  if (status === 'Đang chờ mẫu' || status === 'Đã xác nhận' || status === 'pending') return 'Đang chờ mẫu';
  if (status === 'Đang thực hiện' || status === 'in-progress') return 'Đang thực hiện';
  if (status === 'Hoàn thành' || status === 'completed') return 'Hoàn thành';
  if (status === 'Đã hủy' || status === 'Hủy' || status === 'cancelled') return 'Đã hủy';
  return 'Đang chờ mẫu';
};

// Hàm lấy màu cho trạng thái tiếng Việt
const getStatusColorVN = (status: AppointmentStatusVN) => {
  switch (status) {
    case 'Đang chờ mẫu':
      return 'bg-yellow-100 text-yellow-800';
    case 'Đang thực hiện':
      return 'bg-blue-100 text-blue-800';
    case 'Hoàn thành':
      return 'bg-green-100 text-green-800';
    case 'Đã hủy':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  
  // State tracking
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [showKitModal, setShowKitModal] = useState<boolean>(false);
  const [showResultForm, setShowResultForm] = useState<boolean>(false);
  const [statusVN, setStatusVN] = useState<AppointmentStatusVN>('Đang chờ mẫu');
  const [updating, setUpdating] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState<User | null>(null);
  
  // Form người xét nghiệm cùng
  const [showRelatedPersonForm, setShowRelatedPersonForm] = useState<boolean>(false);
  const [relatedPerson, setRelatedPerson] = useState<Relative | null>(null);
  const [loadingRelatives, setLoadingRelatives] = useState<boolean>(false);
  
  // Kit related state
  const [kitExists, setKitExists] = useState<boolean>(false);
  const [kitInfo, setKitInfo] = useState<Kit | null>(null);
  const [checkingKit, setCheckingKit] = useState<boolean>(true);  // Bắt đầu với true để hiện loading
  const [kitDetailLoading, setKitDetailLoading] = useState<boolean>(false);
  
  // Kết quả xét nghiệm
  const [testResult, setTestResult] = useState<Partial<TestResult>>({
    customerId: '',
    staffId: '',
    serviceId: '',
    bookingId: id as string,
    date: new Date().toISOString().slice(0, 16),
    description: '',
    status: 'Trùng nhau'
  });
  const [submittingResult, setSubmittingResult] = useState<boolean>(false);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [existingResults, setExistingResults] = useState<TestResult[]>([]);
  
  // State hiển thị form kết quả
  
  // Hàm lấy chi tiết kit và hiển thị modal
  const handleViewKit = async () => {
    if (!kitInfo?.kitID) return;
    
    try {
      setKitDetailLoading(true);
      setShowKitModal(true);
      
      // Lấy dữ liệu chi tiết từ API
      const kitDetail = await kitApi.refreshKitData(kitInfo.kitID);
      
      // Cập nhật kitInfo với dữ liệu chi tiết
      setKitInfo(kitDetail);
    } catch (error) {
      console.error('Error fetching kit details:', error);
      toast.error('Không thể tải thông tin chi tiết kit');
    } finally {
      setKitDetailLoading(false);
    }
  };
  
  // Component modal hiển thị chi tiết kit
  const KitDetailModal = () => {
    if (!showKitModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Chi tiết Kit {kitInfo?.kitID}</h3>
            <button 
              onClick={() => setShowKitModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="px-6 py-4">
            {kitDetailLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : kitInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Mã Kit:</span>
                    <p className="mt-1">{kitInfo.kitID}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Trạng thái:</span>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {/* Lấy thẳng status từ database */}
                      {kitInfo.status || 'Không xác định'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Tên khách hàng:</span>
                    <p className="mt-1">{kitInfo.customerID || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Tên nhân viên:</span>
                    <p className="mt-1">{kitInfo.staffName || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">ID Lịch hẹn:</span>
                    <p className="mt-1">{kitInfo.bookingId || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Ngày nhận:</span>
                    <p className="mt-1">{kitInfo.receivedate ? new Date(kitInfo.receivedate).toLocaleDateString('vi-VN', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'N/A'}</p>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <span className="font-medium text-gray-500">Mô tả:</span>
                  <p className="mt-1 whitespace-pre-line">{kitInfo.description || 'Không có mô tả'}</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-red-500">
                Không thể tải thông tin kit.
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
            <button
              onClick={() => setShowKitModal(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Function to fetch appointment data
  const fetchAppointmentData = async () => {
    if (!token || !id) {
      setError('Token or appointment ID missing');
      setLoading(false);
      return;
    }
    
    try {
      console.log(`Fetching appointment data for ID: ${id}`);
      setLoading(true);
      setError(null);
      
      const data = await getAppointmentById(token, id as string);
      
      if (data) {
        console.log('Fetched appointment data:', data);
        setAppointment(data);
        
        // Xác định trạng thái từ dữ liệu booking
        if (data.status) {
          setStatusVN(mapStatusToVN(data.status));
        }
        
        // Fetch customer info if we have customerId
        if (data.customerId) {
          try {
            console.log(`Fetching customer info for ID: ${data.customerId}`);
            
            // First try to get all users to have a local cache
            const allUsers = await getAllUsers();
            console.log(`Got ${allUsers.length} users, searching for ID: ${data.customerId}`);
            
            // Find customer in the list by exact ID match
            const matchingCustomer = allUsers.find(u => u.id === data.customerId);
            
            if (matchingCustomer) {
              console.log("Found exact customer match:", matchingCustomer);
              setCustomerInfo(matchingCustomer);
              
              // Fetch relatives by user ID
              await fetchRelativeData(data.customerId, data.bookingId);
            } else {
              console.log("No exact ID match, trying with getUserById");
              // Try direct fetch as fallback
              const customerData = await getUserById(data.customerId);
              if (customerData) {
                console.log("Got customer via getUserById:", customerData);
                setCustomerInfo(customerData);
                
                // Fetch relatives by user ID
                await fetchRelativeData(data.customerId, data.bookingId);
              } else {
                console.log("Could not fetch customer info, using fallback");
                // Create a fallback customer object to show ID
                setCustomerInfo({
                  id: data.customerId,
                  username: data.customerId,
                  fullname: data.customerId,
                  email: ''
                });
              }
            }
          } catch (error) {
            console.error("Error fetching customer info:", error);
            // Create a fallback customer object for error case
            setCustomerInfo({
              id: data.customerId,
              username: data.customerId,
              fullname: data.customerId,
              email: ''
            });
          }
        }
        
        // Kiểm tra xem có kit cho booking này không
        if (data.bookingId) {
          await checkKitForBooking(data.bookingId);
        } else {
          setCheckingKit(false);
        }
        
        // Kiểm tra xem đã có kết quả xét nghiệm cho booking này chưa
        if (data.bookingId && (data.status === 'Hoàn thành'  )) {
          fetchTestResults(data.bookingId);
        }
        
        // Điền thông tin vào form kết quả
        setTestResult(prev => ({
          ...prev,
          customerId: data.customerId || '',
          staffId: data.staffId || user?.userID || '',
          serviceId: data.serviceId || '',
          bookingId: data.bookingId || ''
        }));
      } else {
        console.error('Failed to fetch appointment data');
        setError('Không thể tải dữ liệu lịch hẹn');
      }
    } catch (error: any) {
      console.error('Error fetching appointment data:', error);
      let errorMessage = 'Đã xảy ra lỗi khi tải dữ liệu';
      
      if (error.response && error.response.data) {
        errorMessage += `: ${error.response.data.message || JSON.stringify(error.response.data)}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy thông tin người thân
  const fetchRelativeData = async (userId: string, bookingId?: string) => {
    if (!token || !bookingId) return;
    
    try {
      setLoadingRelatives(true);
      console.log(`Fetching relative data for booking ID: ${bookingId}`);
      
      // Sử dụng API để lấy người xét nghiệm cùng từ bookingId
      const bookingRelatives = await getRelativesByBookingId(token, bookingId);
      
      if (bookingRelatives && bookingRelatives.length > 0) {
        console.log(`Found ${bookingRelatives.length} relatives by booking ID:`, bookingRelatives);
        setRelatedPerson(bookingRelatives[0]);
      } else {
        console.log('No relatives found for this booking');
        // Sử dụng dữ liệu mặc định nếu không tìm thấy
        setRelatedPerson({
          fullname: 'Không có thông tin',
          phone: 'Không có thông tin',
          birthdate: new Date().toISOString().slice(0, 10),
          gender: 'Không có thông tin',
          relationship: 'Không có thông tin'
        });
      }
    } catch (error) {
      console.error('Error fetching relative data:', error);
      // Sử dụng dữ liệu mặc định nếu có lỗi
      setRelatedPerson({
        fullname: 'Không có thông tin',
        phone: 'Không có thông tin',
        birthdate: new Date().toISOString().slice(0, 10),
        gender: 'Không có thông tin',
        relationship: 'Không có thông tin'
      });
    } finally {
      setLoadingRelatives(false);
    }
  };
  
  // Load data when component mounts
  useEffect(() => {
    fetchAppointmentData();
  }, [id, token]);
  
  // Hàm lấy kết quả xét nghiệm theo booking ID
  const fetchTestResults = async (bookingId: string) => {
    if (!token) return;
    
    try {
      setLoadingResults(true);
      console.log(`Fetching test results for booking ID: ${bookingId}`);
      
      // Gọi API để lấy kết quả xét nghiệm
      const results = await getTestResultsByBookingId(token, bookingId);
      
      console.log(`Found ${results.length} test results:`, results);
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
  
  const handleUpdateStatus = async (newStatus: AppointmentStatusVN) => {
    if (!appointment || !token) return;
    
    try {
      setUpdating(true);
      
      // Nếu muốn chuyển sang "Đang thực hiện", kiểm tra điều kiện kit
      if (newStatus === 'Đang thực hiện') {
        // Kiểm tra xem kit đã tồn tại chưa
        if (!kitExists || !kitInfo) {
          toast.error('Không thể chuyển trạng thái: Booking này chưa có kit!');
          setUpdating(false);
          return;
        }
        
        // Kiểm tra điều kiện kit dựa trên phương thức thu mẫu
        if (appointment.method?.toLowerCase().includes('tại cơ sở y tế')) {
          // Đối với phương thức "Tại cơ sở y tế", chỉ cần kit ở trạng thái "Đã lấy mẫu"
          if (kitInfo.status !== 'Đã lấy mẫu' && kitInfo.status !== 'Đã tới kho') {
            toast.error(`Không thể chuyển trạng thái: Kit phải ở trạng thái "Đã lấy mẫu" hoặc "Đã tới kho" (hiện tại: ${kitInfo.status})`);
            setUpdating(false);
            return;
          }
        } else {
          // Đối với các phương thức khác (như "Tự thu mẫu"), vẫn yêu cầu kit ở trạng thái "Đã tới kho"
          if (kitInfo.status !== 'Đã tới kho') {
            toast.error(`Không thể chuyển trạng thái: Kit phải ở trạng thái "Đã tới kho" (hiện tại: ${kitInfo.status})`);
            setUpdating(false);
            return;
          }
        }
      }
      
      setStatusVN(newStatus);

      // Gửi trạng thái tiếng Việt lên API (nếu backend chấp nhận), nếu không cần map lại tại đây
      const success = await updateAppointmentStatusSafe(token, id as string, newStatus);
      
      if (success) {
        setAppointment(prevAppointment => {
          if (!prevAppointment) return null;
          return {
            ...prevAppointment,
            status: newStatus
          };
        });
        
        toast.success(`Trạng thái đã được cập nhật thành ${newStatus}`);
        await refetchAppointment();
        
        // Nếu trạng thái được cập nhật thành "Hoàn thành", tự động lấy kết quả xét nghiệm
        if (newStatus === 'Hoàn thành' && appointment.bookingId) {
          fetchTestResults(appointment.bookingId);
        }
      } else {
        toast.error('Không thể cập nhật trạng thái');
        await refetchAppointment();
      }
    } catch (error: any) {
      let errorMessage = 'Đã xảy ra lỗi khi cập nhật trạng thái';
      if (error.response && error.response.data) {
        errorMessage += `: ${error.response.data.message || JSON.stringify(error.response.data)}`;
      }
      toast.error(errorMessage);
      await refetchAppointment();
    } finally {
      setUpdating(false);
    }
  };

  const getMethodText = (method: string) => {
    // Debug giá trị method
    console.log('Method value received:', method);
    
    // Hiển thị chính xác như trong database
    if (method === 'Tự thu mẫu') return 'Tự thu mẫu';
    if (method === 'Tại cơ sở') return 'Tại cơ sở';
    
    // Trường hợp khác
    return method || 'Không xác định';
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

  // Chuyển đổi trạng thái sang dạng hiển thị
 

 

  // Hàm để tải lại dữ liệu booking khi cần thiết
  const refetchAppointment = async () => {
    if (!token || !id) return;
    
    try {
      console.log(`Re-fetching appointment data for ID: ${id}`);
      const data = await getAppointmentById(token, id as string);
      
      if (data) {
        console.log('Refreshed appointment data:', data);
        setAppointment(data);
        
        // Determine status from appointment data
        if (data.status) {
          setStatusVN(mapStatusToVN(data.status));
        }
        
        // Re-check kit status
        if (data.bookingId) {
          checkKitForBooking(data.bookingId);
        }
      } else {
        console.error('Failed to refresh appointment data');
      }
    } catch (error) {
      console.error('Error re-fetching appointment:', error);
    }
  };

  // Function to check if a kit exists for the current booking
  const checkKitForBooking = async (bookingId: string) => {
    try {
      setCheckingKit(true);
      console.log(`Checking if kit exists for booking ID: ${bookingId}`);
      
      // Get all kits and filter by bookingId
      const allKits = await kitApi.getAllKits();
      console.log(`Fetched ${allKits.length} kits from API`);
      
      const matchingKits = allKits.filter(kit => kit.bookingId === bookingId);
      console.log(`Filter results: Found ${matchingKits.length} kit(s) matching bookingId ${bookingId}`);
      
      if (matchingKits.length > 0) {
        const kit = matchingKits[0]; // Get the first matching kit
        console.log(`Found kit: ${kit.kitID}, Status: ${kit.status}`, kit);
        
        // Store kit data without additional name lookup
        setKitExists(true);
        setKitInfo(kit);
        
        console.log(`Status mapped from backend: ${kit.status}`);
        console.log(`Status text for display: ${getKitStatusText(kit.status)}`);
      } else {
        console.log('No kits found for this booking');
        setKitExists(false);
        setKitInfo(null);
      }
    } catch (error) {
      console.error('Error checking kit for booking:', error);
    } finally {
      setCheckingKit(false);
    }
  };

  // Helper function to get status text for kit (similar to the one in kits page)
  const getKitStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Đã vận chuyển';
      case 'in-use':
        return 'Đang vận chuyển';
      case 'completed':
        return 'Đã lấy mẫu';
      case 'expired':
        return 'Đã tới kho';
      default:
        return 'Không xác định';
    }
  };

  // Function to manually refresh kit status
  const refreshKitStatus = async () => {
    if (!appointment || !appointment.bookingId) return;
    
    try {
      await checkKitForBooking(appointment.bookingId);
      toast.success('Đã làm mới trạng thái kit');
    } catch (error) {
      console.error('Error refreshing kit status:', error);
      toast.error('Không thể làm mới trạng thái kit');
    }
  };

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
        await handleUpdateStatus('Hoàn thành');
        
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

  // Xử lý thay đổi thông tin người xét nghiệm cùng
  const handleRelatedPersonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Đã bỏ chức năng này vì form chỉ để xem
  };

  // Xử lý lưu thông tin người xét nghiệm cùng
  const handleSubmitRelatedPerson = (e: React.FormEvent) => {
    // Đã bỏ chức năng này vì form chỉ để xem
  };

  // Hàm xác định văn bản trạng thái đầu tiên dựa trên phương thức booking
  const getInitialStatusText = (method: string): string => {
    // Nếu phương thức là "Tại cơ sở y tế" thì hiển thị "Đang chờ checkin"
    if (method?.toLowerCase().includes('tại cơ sở')) {
      return "Đang chờ Checkin";
    }
    
    // Mặc định là "Đang chờ mẫu" cho "Tự thu mẫu" hoặc các trường hợp khác
    return "Đang chờ mẫu";
  };
  
  // Hàm xác định điều kiện chuyển trạng thái dựa trên phương thức booking
  const getStatusRequirements = (method: string): React.ReactNode => {
    // Nếu phương thức là "Tại cơ sở y tế"
    if (method?.toLowerCase().includes('tại cơ sở')) {
      return (
        <ul className="list-disc ml-5 text-sm text-yellow-700 space-y-1">
          <li>Khách hàng đã checkin tại cơ sở</li>
          <li>Kit phải ở trạng thái "Đã lấy mẫu" hoặc "Đã tới kho"</li>
          <li>Có thể bắt đầu thực hiện xét nghiệm</li>
        </ul>
      );
    }
    
    // Mặc định cho "Tự thu mẫu" và các trường hợp khác
    return (
      <ul className="list-disc ml-5 text-sm text-yellow-700 space-y-1">
        <li>Booking phải có kit đã được tạo</li>
        <li>Kit phải ở trạng thái "Đã tới kho"</li>
      </ul>
    );
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
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      {/* Thanh tiêu đề và nút thao tác */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết lịch hẹn #{appointment.bookingId}</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={refetchAppointment}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center shadow-sm"
            title="Làm mới dữ liệu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 shadow-sm"
          >
            Quay lại
          </button>
        </div>
      </div>
      
      {/* Lưới thông tin chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin lịch hẹn */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Thông tin lịch hẹn</h2>
          <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Mã lịch hẹn:</span>
              <span className="font-semibold">{appointment.bookingId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Khách hàng:</span>
              <span className="font-semibold">{appointment.customer?.fullname || customerInfo?.fullname || customerInfo?.username || appointment.customerId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Ngày hẹn:</span>
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Dịch vụ:</span>
                <span>{appointment.serviceId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Phương thức:</span>
                <span>{getMethodText(appointment.method)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Địa chỉ:</span>
                <span>{appointment.address || 'N/A'}</span>
              </div>
            <div className="flex justify-between border-b pb-2 items-center">
              <span className="font-medium text-gray-500">Trạng thái:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColorVN(statusVN)}`}>
                {statusVN}
              </span>
              </div>
            </div>
          </div>
          
        {/* Trạng thái xử lý & thao tác */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Trạng thái & Thao tác</h2>
          {/* Các bước trạng thái */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{getInitialStatusText(appointment.method)}</p>
                  <p className="text-sm text-gray-500">{formatDate(appointment.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${statusVN === 'Đang thực hiện' || statusVN === 'Hoàn thành' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Đang thực hiện</p>
                  <p className="text-sm text-gray-500">{statusVN === 'Đang thực hiện' || statusVN === 'Hoàn thành' ? 'Đã xác nhận' : 'Chưa xác nhận'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${statusVN === 'Hoàn thành' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Hoàn thành</p>
                  <p className="text-sm text-gray-500">{statusVN === 'Hoàn thành' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</p>
                </div>
              </div>
            </div>
          {/* Các nút thao tác cập nhật trạng thái, nhập kết quả, tạo kit ... */}
          <div className="flex flex-wrap gap-2 mt-4">
                <button 
                  onClick={() => handleUpdateStatus('Đang thực hiện')}
                  disabled={
                    updating ||
                    statusVN === 'Đang thực hiện' ||
                    statusVN === 'Hoàn thành' ||
                    statusVN === 'Đã hủy' ||
                    (
                      !appointment.method?.toLowerCase().includes('tại cơ sở y tế') &&
                      appointment.method?.toLowerCase().includes('tự thu mẫu') &&
                      (
                        !kitExists ||
                        !kitInfo ||
                        (kitInfo.status !== 'Đã tới kho')
                      )
                    ) ||
                    (
                      appointment.method?.toLowerCase().includes('tại cơ sở y tế') &&
                      (
                        !kitExists ||
                        !kitInfo ||
                        (kitInfo.status !== 'Đã lấy mẫu' && kitInfo.status !== 'Đã tới kho')
                      )
                    )
                  }
                  className={`px-4 py-2 rounded ${
                    updating || statusVN === 'Đang thực hiện' || statusVN === 'Hoàn thành' || statusVN === 'Đã hủy' ||
                    (
                      !appointment.method?.toLowerCase().includes('tại cơ sở y tế') &&
                      appointment.method?.toLowerCase().includes('tự thu mẫu') &&
                      (
                        !kitExists ||
                        !kitInfo ||
                        (kitInfo.status !== 'Đã tới kho')
                      )
                    ) ||
                    (
                      appointment.method?.toLowerCase().includes('tại cơ sở y tế') &&
                      (
                        !kitExists ||
                        !kitInfo ||
                        (kitInfo.status !== 'Đã lấy mẫu' && kitInfo.status !== 'Đã tới kho')
                      )
                    )
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  title={
                    statusVN === 'Đang chờ mẫu'
                      ? appointment.method?.toLowerCase().includes('tại cơ sở')
                        ? kitExists 
                          ? (kitInfo?.status === 'Đã lấy mẫu' || kitInfo?.status === 'Đã tới kho')
                            ? 'Chuyển sang trạng thái Đang thực hiện khi khách hàng đã checkin'
                            : `Kit phải ở trạng thái "Đã lấy mẫu" hoặc "Đã tới kho" trước khi chuyển sang thực hiện (hiện tại: ${kitInfo ? kitInfo.status : 'N/A'})`
                          : 'Booking này chưa có kit. Vui lòng tạo kit trước.'
                        : kitExists 
                          ? kitInfo?.status === 'Đã tới kho'
                            ? 'Chuyển sang trạng thái Đang thực hiện' 
                            : `Kit phải ở trạng thái "Đã tới kho" trước khi chuyển sang thực hiện (hiện tại: ${kitInfo ? kitInfo.status : 'N/A'})`
                          : 'Booking này chưa có kit. Vui lòng tạo kit trước.'
                      : ''
                  }
                >
                  {updating ? 'Đang xử lý...' : 'Đang thực hiện'}
                </button>
                
                <button 
                  onClick={() => setShowResultForm(true)}
                  disabled={updating || statusVN === 'Hoàn thành' || statusVN === 'Đã hủy' || statusVN !== 'Đang thực hiện'}
                  className={`px-4 py-2 rounded ${
                    updating || statusVN === 'Hoàn thành' || statusVN === 'Đã hủy' || statusVN !== 'Đang thực hiện'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                  title={statusVN !== 'Đang thực hiện' ? 'Hãy chuyển sang trạng thái đang thực hiện trước khi nhập kết quả' : 'Nhập kết quả xét nghiệm'}
                >
                  {updating ? 'Đang xử lý...' : 'Nhập kết quả'}
                </button>
                
                <button 
                  onClick={() => handleUpdateStatus('Đã hủy')}
                  disabled={updating || statusVN === 'Hoàn thành' || statusVN === 'Đã hủy'}
                  className={`px-4 py-2 rounded ${
                    updating || statusVN === 'Hoàn thành' || statusVN === 'Đã hủy'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {updating ? 'Đang xử lý...' : 'Hủy'}
                </button>

                {checkingKit ? (
                  <button className="px-4 py-2 rounded bg-gray-400 text-white cursor-wait flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang kiểm tra kit...
                  </button>
                ) : kitExists && kitInfo ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleViewKit}
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Xem Kit: {kitInfo?.kitID}
                    </button>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Kit: { kitInfo?.status}
                    </div>
                    <button
                      onClick={refreshKitStatus}
                      className="p-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                      title="Làm mới trạng thái kit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    {/* Nút đổi trạng thái Đã tới kho cho tự thu mẫu và kit đang tới kho */}
                    {appointment.method?.toLowerCase().includes('tự thu mẫu') &&
                      kitInfo.status === 'Đang tới kho' && (
                        <button
                          onClick={async () => {
                            try {
                              await kitApi.updateKit(kitInfo.kitID, { status: 'Đã tới kho' });
                              toast.success('Kit đã chuyển sang trạng thái "Đã tới kho"');
                              await refreshKitStatus();
                            } catch (error) {
                              toast.error('Không thể cập nhật trạng thái kit');
                            }
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-semibold transition-colors"
                        >
                          Đã tới kho
                        </button>
                      )
                    }
                    {/* Nút chuyển trạng thái Đã lấy mẫu khi kit đang lấy mẫu */}
                    {kitInfo.status === 'Đang lấy mẫu' && (
                      <button
                        onClick={async () => {
                          try {
                            await kitApi.updateKit(kitInfo.kitID, { status: 'Đã lấy mẫu' });
                            toast.success('Kit đã chuyển sang trạng thái "Đã lấy mẫu"');
                            await refreshKitStatus();
                          } catch (error) {
                            toast.error('Không thể cập nhật trạng thái kit');
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold transition-colors"
                      >
                        Đã lấy mẫu
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        // Chỉ kiểm tra trạng thái check-in nếu phương thức là "Tại cơ sở y tế"
                        if (
                          appointment.method?.toLowerCase().includes('tại cơ sở y tế') &&
                          (appointment.status === 'Đang chờ check-in' || appointment.status === 'Đang chờ mẫu')
                        ) {
                          toast.error('Vui lòng chờ khách hàng check-in trước khi tạo kit!');
                          return;
                        }
                        // Tạo URL với đường dẫn đầy đủ
                        const currentUrl = `/staff/test-results/${id}`;
                        const kitUrl = `/staff/kits?bookingId=${appointment.bookingId}&customerId=${appointment.customerId}&staffId=${appointment.staffId || user?.userID || ''}&description=${encodeURIComponent(`Kit cho lịch hẹn #${appointment.bookingId}`)}&returnUrl=${encodeURIComponent(currentUrl)}`;
                        router.push(kitUrl);
                      }}
                      className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 flex items-center"
                      title="Tạo kit cho booking này"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Tạo Kit
                    </button>
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Chưa có kit
                    </div>
                    <button
                      onClick={refreshKitStatus}
                      className="p-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                      title="Làm mới trạng thái kit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              {statusVN === 'Đang thực hiện' && !showResultForm && (
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
              
              {statusVN === 'Đang chờ mẫu' && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-yellow-700 flex items-center font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Thông tin về việc chuyển trạng thái
                  </p>
                  <div className="mt-2 ml-7">
                    <p className="text-sm text-yellow-700 mb-2">
                      <strong>Điều kiện để chuyển sang trạng thái "Đang thực hiện":</strong>
                    </p>
                    {getStatusRequirements(appointment.method)}
                    {appointment.method?.toLowerCase().includes('tại cơ sở') ? (
                      <p className="mt-2 text-sm text-yellow-700">
                        ⚠️ Hãy đảm bảo khách hàng đã checkin tại cơ sở trước khi chuyển trạng thái.
                      </p>
                    ) : checkingKit ? (
                      <div className="flex items-center space-x-2 mt-2 text-sm text-blue-600">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Đang kiểm tra trạng thái kit...</span>
                      </div>
                    ) : kitExists ? (
                      kitInfo?.status === 'expired' ? (
                        <p className="mt-2 text-sm text-green-600">
                          ✅ Tất cả điều kiện đã thỏa mãn. Bạn có thể chuyển sang trạng thái "Đang thực hiện".
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-yellow-700">
                          ⚠️ Trạng thái kit hiện tại: <strong>{kitInfo ? getKitStatusText(kitInfo.status) : 'N/A'}</strong>. 
                          Cần đổi sang <strong>Đã tới kho</strong> trước khi có thể chuyển trạng thái booking.
                        </p>
                      )
                    ) : (
                      <p className="mt-2 text-sm text-yellow-700">
                        ⚠️ Booking này chưa có kit. Vui lòng tạo kit trước khi chuyển trạng thái.
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
        
      {/* Thông tin người xét nghiệm cùng */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Thông tin người xét nghiệm cùng</h2>
          
          {loadingRelatives ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : relatedPerson ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="border-b pb-2">
                <span className="text-sm font-medium text-gray-500">Họ và tên:</span>
                <p className="mt-1 font-medium">{relatedPerson.fullname}</p>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-sm font-medium text-gray-500">Số điện thoại:</span>
                <p className="mt-1 font-medium">{relatedPerson.phone}</p>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-sm font-medium text-gray-500">Ngày sinh:</span>
                <p className="mt-1 font-medium">
                  {relatedPerson.birthdate ? new Date(relatedPerson.birthdate).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : 'Không có thông tin'}
                </p>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-sm font-medium text-gray-500">Giới tính:</span>
                <p className="mt-1 font-medium">{relatedPerson.gender}</p>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-sm font-medium text-gray-500">Địa chỉ:</span>
                <p className="mt-1 font-medium">{relatedPerson.address || 'Không có thông tin'}</p>
              </div>
              
              <div className="border-b pb-2">
                <span className="text-sm font-medium text-gray-500">Mối quan hệ:</span>
                <p className="mt-1 font-medium">{relatedPerson.relationship}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Không tìm thấy thông tin người xét nghiệm cùng
            </div>
          )}
        </div>
      </div>
        
      {/* Kết quả xét nghiệm */}
        {statusVN === 'Hoàn thành' && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">Kết quả xét nghiệm</h2>
            
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
          </div>
        )}
        
        {/* Form nhập kết quả xét nghiệm */}
        {showResultForm && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">Nhập kết quả xét nghiệm</h2>
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
      </div>
      )}
      <KitDetailModal />
    </div>
  );
}