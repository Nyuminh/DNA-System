"use client";

import { useState, useEffect } from 'react';
import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { kitApi, Kit } from '@/lib/api/staff';
import { updateKitById } from '@/lib/api/kit';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// 1. Interface Kit và NewKitForm chỉ dùng status tiếng Việt:
interface NewKitForm {
  customerID: string;
  staffID: string;
  bookingId: string;
  description: string;
  status: 'Đã vận chuyển' | 'Đang vận chuyển' | 'Đang giao' | 'Đã lấy mẫu' | 'Đang tới kho' | 'Đã tới kho' | 'Đang lấy mẫu';
  receivedate: string;
  address: string; // New address field
}

export default function KitManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<NewKitForm>({
    customerID: '',
    staffID: '',
    bookingId: '',
    description: '',
    status: 'Đã vận chuyển',
    receivedate: new Date().toISOString().split('T')[0],
    address: '' // Initialize with empty string
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingStatus, setEditingStatus] = useState<{kitID: string, currentStatus: Kit['status']} | null>(null);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [showKitModal, setShowKitModal] = useState(false);
  const [kitDetailLoading, setKitDetailLoading] = useState(false);
  const [bookingMethod, setBookingMethod] = useState<string | null>(null); // Add state to track booking method
  // Thêm biến lưu trạng thái booking
  const [bookingStatus, setBookingStatus] = useState<string>('');

  useEffect(() => {
    fetchKits();
    
    // Check for URL parameters to pre-fill the form
    const bookingId = searchParams.get('bookingId');
    const customerId = searchParams.get('customerId');
    const staffId = searchParams.get('staffId');
    const description = searchParams.get('description');
    
    // If at least bookingId is present, pre-fill the form with available data
    if (bookingId) {
      setFormData(prev => ({
        ...prev,
        bookingId: bookingId || '',
        customerID: customerId || '',
        staffID: staffId || '',
        description: description || '',
        status: 'Đã vận chuyển',
        receivedate: new Date().toISOString().split('T')[0]
      }));
      
      // Fetch booking details to check method and update status if needed
      fetchBookingDetails(bookingId);
      
      setShowAddForm(true);
    }
  }, [searchParams]);

  const fetchKits = async () => {
    console.log('🔄 Starting to fetch kits...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Calling kitApi.getAllKits()...');
      const kitsData = await kitApi.getAllKits();
      console.log('✅ Received kits data:', kitsData);
      console.log('📊 Number of kits:', kitsData.length);
      
      // Sort kits in descending order by kitID (additional local sorting to ensure proper order)
      const sortedKits = [...kitsData].sort((a, b) => {
        // Extract numeric part from kitID
        const getNumericPart = (kitID: string) => {
          const match = kitID.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        
        const numA = getNumericPart(a.kitID);
        const numB = getNumericPart(b.kitID);
        
        // Sort in descending order (largest to smallest)
        return numB - numA;
      });
      
      setKits(sortedKits);
      
      if (sortedKits.length === 0) {
        console.log('⚠️ No kits found in the response');
      } else {
        console.log('🎉 Successfully loaded', sortedKits.length, 'kits');
      }
    } catch (error) {
      console.error('❌ Error in fetchKits:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách kit. Vui lòng thử lại.';
      setError(errorMessage);
      setKits([]); // Clear any existing data
    } finally {
      setLoading(false);
      console.log('🏁 fetchKits completed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If bookingId field is changed, fetch booking details
    if (name === 'bookingId' && value) {
      fetchBookingDetails(value);
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Function to fetch booking details
  const fetchBookingDetails = async (bookingId: string) => {
    try {
      console.log(`🔍 Fetching details for booking ID: ${bookingId}`);
      
      const response = await fetch(`http://localhost:5198/api/Appointments/${bookingId}`);
      
      if (!response.ok) {
        console.error(`❌ Failed to fetch booking details: ${response.status} ${response.statusText}`);
        if (response.status === 404) {
          toast.error(`Không tìm thấy thông tin cho lịch hẹn ID: ${bookingId}`);
        } else {
          toast.error('Lỗi khi tải thông tin lịch hẹn');
        }
        return;
      }
      
      const bookingData = await response.json();
      console.log(`✅ Booking data received:`, bookingData);
      
      // Set address from booking data if available
      if (bookingData && bookingData.address) {
        setFormData(prev => ({
          ...prev,
          address: bookingData.address
        }));
      }
      // Check if the booking method is "Tự thu mẫu"
      if (bookingData && bookingData.method === 'Tự thu mẫu') {
        setBookingMethod('Tự thu mẫu');
        // Set the status to "Đang vận chuyển" when method is "Tự thu mẫu"
        setFormData(prev => ({
          ...prev,
          status: 'Đang giao' as NewKitForm['status']
        }));
       
      } 
      // Check if the booking method is "Tại cơ sở y tế"
      else if (bookingData && bookingData.method === 'Tại cơ sở y tế') {
        setBookingMethod('Tại cơ sở y tế');
        // Set the status to "Đang chờ mẫu" when method is "Tại cơ sở y tế"
        setFormData(prev => ({
          ...prev,
          status: 'Đang lấy mẫu' as NewKitForm['status']
        }));
       
      } else {
        setBookingMethod(null);
      }
      // Thêm dòng này để cập nhật trạng thái booking
      setBookingStatus(bookingData.status || '');
      
    } catch (error) {
      console.error('❌ Error fetching booking details:', error);
      toast.error('Không thể tải thông tin lịch hẹn');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.customerID.trim()) {
      errors.customerID = 'Customer ID là bắt buộc';
    }
    
    if (!formData.staffID.trim()) {
      errors.staffID = 'Staff ID là bắt buộc';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Mô tả là bắt buộc';
    }
    
    if (!formData.receivedate) {
      errors.receivedate = 'Ngày nhận là bắt buộc';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log('🚀 Creating new kit:', formData);
      // Create kit data without kitID - let backend auto-generate it
      const kitDataToCreate = {
        ...formData,
        status: formData.status, // luôn là tiếng Việt
        // Backend will auto-generate kitID
      };
      
      console.log('📤 Sending kit data to API:', JSON.stringify(kitDataToCreate));
      
      const newKit = await kitApi.createKit(kitDataToCreate);
      console.log('✅ Kit created successfully:', newKit);
      toast.success(`Kit ${newKit.kitID} đã được tạo thành công`);
      
      // Reset form
      setFormData({
        customerID: '',
        staffID: '',
        bookingId: '',
        description: '',
        status: 'Đã vận chuyển',
        receivedate: new Date().toISOString().split('T')[0],
        address: '' // Reset address field
      });
      
      // Kiểm tra xem có returnUrl trong searchParams không
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        console.log('🔄 Redirecting to:', returnUrl);
        router.push(returnUrl);
      } else {
        setShowAddForm(false);
        await fetchKits(); // Chỉ refresh danh sách kits nếu không có returnUrl
      }
      
      console.log('✅ Kit creation process completed');
    } catch (error) {
      console.error('❌ Error creating kit:', error);
      setError('Không thể tạo kit mới. Vui lòng thử lại.');
    }
  };

  const handleCloseForm = () => {
    // Check if there's a returnUrl in the search params
    const returnUrl = searchParams.get('returnUrl');
    if (returnUrl) {
      // If returnUrl exists, navigate to that URL
      router.push(returnUrl);
    } else {
      // Otherwise just close the form
    setShowAddForm(false);
    }
    
    // Reset form data regardless
    setFormData({
      customerID: '',
      staffID: '',
      bookingId: '',
      description: '',
      status: 'Đã vận chuyển',
      receivedate: new Date().toISOString().split('T')[0],
      address: '' // Reset address field
    });
    setBookingMethod(null); // Reset booking method
    setFormErrors({});
  };

  const handleUpdateStatus = async (kitID: string, newStatus: Kit['status']) => {
    try {
      // Gọi API updateKitById để cập nhật trạng thái kit
      await updateKitById(kitID, { status: newStatus });

      // Cập nhật lại state sau khi update thành công
      setKits(prev => prev.map(kit =>
        kit.kitID === kitID ? { ...kit, status: newStatus } : kit
      ));
      setEditingStatus(null);
      toast.success('Cập nhật trạng thái kit thành công');
      // Có thể gọi lại fetchKits() nếu muốn reload toàn bộ danh sách
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái kit');
    }
  };
  const filteredKits = kits.filter(kit => {
    const matchesSearch = kit.kitID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (kit.description && kit.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.customerID && kit.customerID.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.staffID && kit.staffID.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.bookingId && kit.bookingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.customerName && kit.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.staffName && kit.staffName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || kit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Thay thế hàm thống kê stats để dùng trạng thái tiếng Việt
  const stats = {
    total: kits.length,
    available: kits.filter(k => k.status === 'Đã vận chuyển').length,
    inUse: kits.filter(k => k.status === 'Đang vận chuyển').length,
    completed: kits.filter(k => k.status === 'Đã lấy mẫu').length,
    expired: kits.filter(k => k.status === 'Đã tới kho').length,
    waiting: kits.filter(k => k.status === 'Đang chờ mẫu').length
  };

  // Hàm để hiển thị modal chi tiết kit
  const handleViewKit = async (kitID: string) => {
    try {
      setKitDetailLoading(true);
      setShowKitModal(true);
      
      // Tìm kit trong state hiện tại
      const kitFromState = kits.find(kit => kit.kitID === kitID);
      
      if (kitFromState) {
        // Tạm thời hiển thị thông tin từ state
        setSelectedKit(kitFromState);
        
        // Sau đó lấy thông tin chi tiết từ API
        try {
          const kitDetail = await kitApi.refreshKitData(kitID);
          setSelectedKit(kitDetail);
        } catch (error) {
          console.error('Error fetching kit details:', error);
          // Vẫn giữ thông tin từ state nếu API bị lỗi
        }
      } else {
        toast.error('Không tìm thấy thông tin kit');
      }
    } catch (error) {
      console.error('Error viewing kit details:', error);
      toast.error('Không thể tải thông tin chi tiết kit');
    } finally {
      setKitDetailLoading(false);
    }
  };

  // Component modal hiển thị chi tiết kit
  const KitDetailModal = () => {
    if (!showKitModal || !selectedKit) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Chi tiết Kit {selectedKit.kitID}</h3>
            <button 
              onClick={() => setShowKitModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="px-6 py-4">
            {kitDetailLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Mã Kit:</span>
                    <p className="mt-1">{selectedKit.kitID}</p>

                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Trạng thái:</span>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedKit.status)}`}>
                        {selectedKit.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Tên khách hàng:</span>
                    <p className="mt-1">{selectedKit.customerName || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Tên nhân viên:</span>
                    <p className="mt-1">{selectedKit.staffName || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">ID Lịch hẹn:</span>
                    <p className="mt-1">{selectedKit.bookingId || 'N/A'}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium text-gray-500">Ngày nhận:</span>
                    <p className="mt-1">{selectedKit.receivedate ? new Date(selectedKit.receivedate).toLocaleDateString('vi-VN', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'N/A'}</p>
                  </div>
                </div>
                
                <div className="border-b pb-2">
                  <span className="font-medium text-gray-500">Mô tả:</span>
                  <p className="mt-1 whitespace-pre-line">{selectedKit.description || 'Không có mô tả'}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-end gap-2">
                    {editingStatus?.kitID === selectedKit.kitID ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={editingStatus.currentStatus}
                          onChange={(e) => setEditingStatus({
                            kitID: selectedKit.kitID,
                            currentStatus: e.target.value as Kit['status']
                          })}
                          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Đã vận chuyển">Đã vận chuyển</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Đã lấy mẫu">Đã lấy mẫu</option>
                          <option value="Đã tới kho">Đã tới kho</option>
                          <option value="Đang chờ mẫu">Đang chờ mẫu</option>
                        </select>
                        <button
                          onClick={() => {
                            handleUpdateStatus(selectedKit.kitID, editingStatus.currentStatus);
                            setShowKitModal(false);
                          }}
                          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingStatus(null)}
                          className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingStatus({
                          kitID: selectedKit.kitID,
                          currentStatus: selectedKit.status
                        })}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Thay đổi trạng thái
                      </button>
                    )}
                  </div>
                </div>
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

  // Thêm hàm này vào component của bạn
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã vận chuyển':
        return 'bg-green-100 text-green-800';
      case 'Đang giao':
        return 'bg-blue-100 text-blue-800';
      case 'Đang giao':
        return 'bg-yellow-100 text-yellow-800'; // Thêm màu vàng cho "Đang giao"
      case 'Đã lấy mẫu':
        return 'bg-purple-100 text-purple-800';
      case 'Đã tới kho':
        return 'bg-orange-100 text-orange-800';
      case 'Đang chờ mẫu':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Có lỗi xảy ra</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => fetchKits()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Kit xét nghiệm</h1>
          <p className="text-slate-600">Quản lý tất cả kit xét nghiệm trong hệ thống</p>
        </div>        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm Kit</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-500">Tổng số kit</div>
            </div>
            <CubeIcon className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-slate-500">Đã vận chuyển</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.inUse}</div>
              <div className="text-sm text-slate-500">Đang giao</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
              <div className="text-sm text-slate-500">Đã lấy mẫu</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.expired}</div>
              <div className="text-sm text-slate-500">Đã tới kho</div>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-cyan-600">{stats.waiting}</div>
              <div className="text-sm text-slate-500">Đang chờ mẫu</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm kit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-400" />              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đã vận chuyển">Đã vận chuyển</option>
                <option value="Đang vận chuyển">Đang vận chuyển</option>
                <option value="Đã lấy mẫu">Đã lấy mẫu</option>
                <option value="Đã tới kho">Đã tới kho</option>
                <option value="Đang chờ mẫu">Đang chờ mẫu</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kit List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Kit ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày nhận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredKits.map((kit, index) => (
                <tr key={kit.kitID || `kit-${index}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CubeIcon className="h-5 w-5 text-slate-400 mr-2" />
                      <span className="text-sm font-medium text-slate-900">{kit.kitID}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <div>{kit.customerName || kit.customerID || '-'}</div>
                    {kit.customerName && kit.customerID && kit.customerName !== kit.customerID && (
                      <div className="text-xs text-slate-500 mt-1">{kit.customerID}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.staffName || kit.staffID || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.bookingId || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 max-w-xs truncate" title={kit.description || ''}>
                      {kit.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {editingStatus?.kitID === kit.kitID ? (
                        <select
                          value={editingStatus.currentStatus}
                          onChange={e =>
                            setEditingStatus({
                              kitID: kit.kitID,
                              currentStatus: e.target.value as Kit['status'],
                            })
                          }
                          className="px-2 py-1 text-xs rounded border border-blue-400 focus:ring-2 focus:ring-blue-500"
                          style={{ minWidth: 120 }}
                          autoFocus
                        >
                          <option value="Đã vận chuyển">Đã vận chuyển</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Đã lấy mẫu">Đã lấy mẫu</option>
                          <option value="Đã tới kho">Đã tới kho</option>
                          <option value="Đang chờ mẫu">Đang chờ mẫu</option>
                        </select>
                      ) : (
                        <button
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer border border-transparent ${getStatusColor(kit.status)}`}
                          title="Nhấn để đổi trạng thái"
                          onClick={() => setEditingStatus({ kitID: kit.kitID, currentStatus: kit.status })}
                        >
                          {kit.status}
                        </button>
                      )}
                      {editingStatus?.kitID === kit.kitID && (
                        <button
                          className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          onClick={async () => {
                            await handleUpdateStatus(kit.kitID, editingStatus.currentStatus);
                            setEditingStatus(null);
                          }}
                        >
                          Lưu
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.receivedate ? new Date(kit.receivedate).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleViewKit(kit.kitID)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                        title="Xem chi tiết kit"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button 
                        onClick={() => setEditingStatus({kitID: kit.kitID, currentStatus: kit.status})}
                        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                        title="Chỉnh sửa trạng thái"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredKits.length === 0 && (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">Không có kit nào</h3>
            <p className="mt-1 text-sm text-slate-500">
              Không tìm thấy kit nào phù hợp với bộ lọc hiện tại.
            </p>          </div>
        )}
      </div>

      {/* Add Kit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-900">Thêm Kit Mới</h3>
              <div className="flex items-center space-x-2">
                {searchParams.get('returnUrl') && (
                  <button
                    type="button"
                    onClick={() => router.push(searchParams.get('returnUrl') || '/staff/test-results')}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại
                  </button>
                )}
              <button
                onClick={handleCloseForm}
                  className="text-slate-400 hover:text-slate-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Customer ID */}
                <div>
                  <label htmlFor="customerID" className="block text-sm font-medium text-slate-700 mb-2">
                    Customer ID *
                  </label>
                  <input
                    type="text"
                    id="customerID"
                    name="customerID"
                    value={formData.customerID}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.customerID ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Nhập Customer ID"
                  />
                  {formErrors.customerID && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.customerID}</p>
                  )}
                </div>

                {/* Staff ID */}
                <div>
                  <label htmlFor="staffID" className="block text-sm font-medium text-slate-700 mb-2">
                    Staff ID *
                  </label>
                  <input
                    type="text"
                    id="staffID"
                    name="staffID"
                    value={formData.staffID}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.staffID ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Nhập Staff ID"
                  />
                  {formErrors.staffID && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.staffID}</p>
                  )}
                </div>

                {/* Booking ID */}
                <div>
                  <label htmlFor="bookingId" className="block text-sm font-medium text-slate-700 mb-2">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    id="bookingId"
                    name="bookingId"
                    value={formData.bookingId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập Booking ID"
                  />
                  {bookingMethod && (
                    <p className="mt-1 text-xs text-blue-500">
                      Phương thức: <span className="font-semibold">{bookingMethod}</span>
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={bookingMethod === 'Tự thu mẫu' || bookingMethod === 'Tại cơ sở y tế'} // Disable selection for both methods
                  >
                    {bookingMethod === 'Tự thu mẫu' ? (
                      <option value="Đang giao">Đang giao</option>
                    ) : bookingMethod === 'Tại cơ sở y tế' ? (
                      <option value="Đang lấy mẫu">Đang lấy mẫu</option>
                    ) : (
                      <>
                        <option value="Đã vận chuyển">Đã vận chuyển</option>
                        <option value="Đang vận chuyển">Đang vận chuyển</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Đã lấy mẫu">Đã lấy mẫu</option>
                        <option value="Đã tới kho">Đã tới kho</option>
                        <option value="Đang chờ mẫu">Đang chờ mẫu</option>
                      </>
                    )}
                  </select>
                  {bookingMethod === 'Tự thu mẫu' && (
                    <p className="mt-1 text-xs text-amber-500">
                      Phương thức "Tự thu mẫu" chỉ hỗ trợ trạng thái "Đang giao"
                    </p>
                  )}
                  {bookingMethod === 'Tại cơ sở y tế' && (
                    <p className="mt-1 text-xs text-cyan-500">
                      Phương thức "Tại cơ sở y tế" chỉ hỗ trợ trạng thái "Đang chờ mẫu"
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Địa chỉ sẽ tự động điền khi nhập Booking ID"
                    readOnly={!!formData.address && !!formData.bookingId}
                  />
                  {formData.bookingId && formData.address && (
                    <p className="mt-1 text-xs text-green-500">
                    </p>
                  )}
                </div>

                {/* Receive Date */}
                <div className="md:col-span-2">
                  <label htmlFor="receivedate" className="block text-sm font-medium text-slate-700 mb-2">
                    Ngày nhận *
                  </label>
                  <input
                    type="date"
                    id="receivedate"
                    name="receivedate"
                    value={formData.receivedate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.receivedate ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.receivedate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.receivedate}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.description ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Nhập mô tả chi tiết về kit..."
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {searchParams.get('returnUrl') ? 'Quay lại' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={
                    bookingMethod === 'Tại cơ sở y tế' && bookingStatus !== 'Đã check-in'
                  }
                  title={
                    bookingMethod === 'Tại cơ sở y tế' && bookingStatus !== 'Đã check-in'
                      ? 'Chỉ cho phép tạo kit khi lịch hẹn đã check-in'
                      : ''
                  }
                >
                  Thêm Kit
                </button>
              </div>
              {bookingMethod === 'Tại cơ sở y tế' && bookingStatus !== 'Đã check-in' && formData.bookingId && (
                <p className="mt-2 text-sm text-red-500">
                  Chỉ cho phép tạo kit khi lịch hẹn đã check-in. Trạng thái hiện tại: <b>{bookingStatus}</b>
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <KitDetailModal />  
    </div>
  );
}
