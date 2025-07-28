"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import axios from 'axios';
import { getAppointmentsByServiceId } from '@/lib/api/services'; // Thêm nếu đã tạo hàm này
import { getUserById, getUsers } from '@/lib/api/users'; // Đảm bảo đã import
import { getFeedbacksByServiceId } from "@/lib/api/feedback";


interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  bookings: number;
  rating: number;
  duration: string;
  requirements: string[];
  benefits: string[];
  process: string[];
  sampleTypes: string[];
  turnaroundTime: string;
  accuracy: string;
  image?: string; 
}

interface Booking {
  bookingId: string;
  customerName: string;
  date: string;
  staffName: string;
  serviceId: string;
  status: string;
  totalAmount: number;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}
interface Feedback {
  feedbackId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

// Đưa hàm này ra khỏi component, đặt ở đầu file hoặc trong một file riêng biệt
function processApiResponse(data: any): any {
  // Handle null or undefined
  if (data === null || data === undefined) {
    return null;
  }
  
  // Handle .NET arrays with $values property
  if (data && typeof data === 'object' && '$values' in data) {
    const values = data.$values;
    if (Array.isArray(values)) {
        const result = [];
        for (let i = 0; i < values.length; i++) {
            result.push(processApiResponse(values[i]));
        }
        return result;
    }
    // Fallback nếu $values không phải là mảng
    return [];
  }
  
  // Handle plain arrays
  if (Array.isArray(data)) {
    return data.map(item => processApiResponse(item));
  }
  
  // Handle objects (but not Date objects)
  if (data && typeof data === 'object' && !(data instanceof Date)) {
    const result: Record<string, any> = {};
    
    // Process each property, skipping metadata properties
    Object.keys(data).forEach(key => {
      // Skip .NET metadata properties (properties starting with $)
      if (key.startsWith('$')) return;
      
      result[key] = processApiResponse(data[key]);
    });
    
    return result; // Return processed object
  }
  
  // Return primitives and other values as is
  return data;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState<Service | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        
        // Call API to get service details
        const response = await axios.get(`http://localhost:5198/api/Services/${serviceId}`);
        console.log('Raw API response:', response.data);
        
        // Process API response to remove .NET metadata
        const processedData = processApiResponse(response.data);
        console.log('Processed data:', processedData);
        
        // Handle the case where the API returns an array
        let serviceData = Array.isArray(processedData) ? processedData[0] : processedData;
        
        // If serviceData is still null or undefined, handle the error case
        if (!serviceData) {
          throw new Error('Không tìm thấy dữ liệu dịch vụ');
        }
        
        // Safely handle array properties by ensuring they're arrays
        const ensureArray = (value: any) => {
          if (Array.isArray(value)) return value;
          if (value === null || value === undefined) return [];
          return [value]; // Convert non-array to single item array
        };
        
        // Map the API data to our Service interface with safe fallbacks
        const formattedService: Service = {
          id: serviceData.id?.toString() || serviceId,
          name: serviceData.name || 'Không có tên',
          description: serviceData.description || 'Không có mô tả',
          price: typeof serviceData.price === 'number' ? serviceData.price : 
                 parseFloat(String(serviceData.price || '0').replace(/[^\d]/g, '')) || 0,
          category: serviceData.category || serviceData.type || 'Khác',
          bookings: Number.parseInt(String(serviceData.bookings || serviceData.bookingCount || '0'), 10) || 0,
          rating: Number.parseFloat(String(serviceData.rating || serviceData.averageRating || '0')) || 0,
          duration: serviceData.duration || serviceData.turnaroundTime || '5-7 ngày làm việc',
          requirements: ensureArray(serviceData.requirements || [
            "Giấy tờ tùy thân có ảnh",
            "Giấy tờ chứng minh mối quan hệ (nếu có)",
            "Đơn đề nghị xét nghiệm",
            "Thanh toán đầy đủ chi phí"
          ]),
          benefits: ensureArray(serviceData.benefits || [
            "Kết quả có giá trị pháp lý",
            "Độ chính xác cao 99.99%",
            "Được công nhận bởi tòa án",
            "Bảo mật thông tin tuyệt đối"
          ]),
          process: ensureArray(serviceData.process || [
            "Đăng ký và tư vấn",
            "Chuẩn bị giấy tờ cần thiết",
            "Lấy mẫu tại phòng lab",
            "Trả kết quả và tư vấn"
          ]),
          sampleTypes: ensureArray(serviceData.sampleTypes || [
            "Máu (ưu tiên)",
            "Nước bọt",
            "Tóc có chân",
            "Móng tay/chân"
          ]),
          turnaroundTime: serviceData.turnaroundTime || '5-7 ngày làm việc',
          accuracy: serviceData.accuracy || '99.99%',
          image: serviceData.image || serviceData.imageUrl || '', 
        };

        setService(formattedService);
      
   
        
      } catch (error: any) { // Thêm kiểu dữ liệu cho error
        console.error('Error fetching service details:', error);
        setError(`Không thể tải thông tin dịch vụ: ${error?.message || 'Lỗi không xác định'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  // Lấy danh mục khi mở form chỉnh sửa
  useEffect(() => {
  if (showEditForm) {
    axios.get("http://localhost:5198/api/Services/categories")
    
      .then(res => {
        let data = res.data;
        // Nếu có $values thì lấy ra
        if (data && data.$values) data = data.$values;
        setCategories(Array.isArray(data) ? data.map((c: any) => c.name || c) : []);
      })
      .catch((err) => {
        setCategories(["Hành chính", "Pháp lý", "Y tế", "Khác"]);
      });
  }
}, [showEditForm]);
  const handleDeleteService = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.')) {
      try {
        // Get authentication token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          alert('Bạn cần đăng nhập để thực hiện chức năng này.');
          return;
        }
        
        // Call API to delete service
        await axios.delete(`http://localhost:5198/api/Services/${serviceId}`, {
          headers:
           {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        alert('Dịch vụ đã được xóa thành công!');
        
        // Redirect to services list
        window.location.href = '/manager/services';
      } catch (error) {
        console.error('Error deleting service:', error);
        
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            alert('Không tìm thấy dịch vụ để xóa.');
          } else if (error.response?.status === 403) {
            alert('Bạn không có quyền xóa dịch vụ này.');
          } else {
            alert(`Không thể xóa dịch vụ: ${error.response?.data?.message || error.message}`);
          }
        } else {
          alert(`Không thể xóa dịch vụ: ${ 'Lỗi không xác định'}`);
        }
      }
    }
  };

  const handleEditClick = () => {
    setEditData(service);
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện chức năng này.");
        return;
      }

      const fileInput = document.getElementById("edit-image-upload") as HTMLInputElement;
      const file = fileInput?.files?.[0];


      const formData = new FormData();
      formData.append("Type", editData.category);
      formData.append("Name", editData.name);
      formData.append("Price", editData.price.toString());
      formData.append("Description", editData.description);
      formData.append("Image", file ? file.name : (editData.image || service?.image || ""));
      if (file) {
        formData.append("picture", file);
      }

      // Hiển thị dữ liệu nhập vào (FormData)
      for (const pair of formData.entries()) {
        console.log(`[FormData] ${pair[0]}:`, pair[1]);
      }

      await axios.put(
        `http://localhost:5198/api/Services/${editData.id}`,
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setService(editData);
      setShowEditForm(false);
      alert("Cập nhật dịch vụ thành công!");
    } catch (err: any) {
      alert("Cập nhật thất bại!");
    }
    finally{
      setShowEditForm(false);
       window.location.reload();
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Khi vào tab bookings hoặc khi serviceId thay đổi, call API lấy lịch hẹn
  useEffect(() => {
    if (activeTab === 'bookings' && serviceId) {
      (async () => {
        try {
          const res = await getAppointmentsByServiceId(serviceId);
          if (res.success && Array.isArray(res.appointments)) {
            // Gọi API lấy danh sách user
            const userRes = await axios.get('http://localhost:5198/api/User');
            const users = Array.isArray(userRes.data) ? userRes.data : (userRes.data?.$values || []);
            console.log('Users:', users.map((u: any) => u.userID));
const userMap: Record<string, string> = {};
users.forEach((u: any) => {
  userMap[String(u.userID).trim()] = u.fullname;
});

// Map lại bookings để lấy tên khách hàng và nhân viên
const bookingsWithNames = res.appointments.map((b: any) => {
  const customerId = String(b.customerId || b.customerID || '').trim();
  const staffId = String(b.staffId || b.staffID || '').trim();

  // Tìm user theo customerId
  const customer = users.find((u: any) =>
    String(u.userID || u.id || u.userId).trim() === customerId
  );
  // Tìm user theo staffId
  const staff = users.find((u: any) =>
    String(u.userID || u.id || u.userId).trim() === staffId
  );

  return {
    bookingId: b.bookingId || b.id,
    customerName: customer?.fullname || customer?.fullName || customer?.name || customer?.username || customer?.userName || 'Ẩn danh',
    date: b.date,
    staffName: staff?.fullname || staff?.fullName || staff?.name || staff?.username || staff?.userName || 'Chưa phân công',
    serviceId: b.serviceId || b.serviceID,
    status: b.status,
    totalAmount: b.totalAmount,
  };
});
setBookings(bookingsWithNames);
          } else {
            setBookings([]);
          }
        } catch (err) {
          setBookings([]);
          console.error('Error fetching bookings or users:', err);
        }
      })();
    }
  }, [activeTab, serviceId]);

  // Khi vào tab reviews, gọi API lấy đánh giá
  useEffect(() => {
    if (activeTab === "reviews" && serviceId) {
      (async () => {
        const feedbacks = await getFeedbacksByServiceId(serviceId);
        // Lấy danh sách users
        const userRes = await axios.get('http://localhost:5198/api/User');
        const users = Array.isArray(userRes.data) ? userRes.data : (userRes.data?.$values || []);
        // Map lại feedbacks để lấy tên khách hàng từ customerId
        const feedbacksWithNames = Array.isArray(feedbacks)
          ? feedbacks.map((fb: any, idx: number) => {
              const customerId = String(fb.customerId || fb.customerID || '').trim();
              const customer = users.find((u: any) =>
                String(u.userID || u.id || u.userId).trim() === customerId
              );
              return {
                feedbackId: String(fb.feedbackId || fb.id || idx),
                customerName: customer?.fullname || customer?.fullName || customer?.name || customer?.username || customer?.userName || "Ẩn danh",
                rating: fb.rating || 0,
                comment: fb.comment || "",
                date: fb.date || "",
              };
            })
          : [];
        setReviews(feedbacksWithNames);
      })();
    }
  }, [activeTab, serviceId]);

  // Tính trung bình đánh giá (thang điểm 5) và số lượt đặt dịch vụ này
  const averageRating = reviews.length
    ? Math.round(
        (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) * 10
      ) / 10
    : 0;

  const bookingCount = bookings.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin dịch vụ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/manager/service-list"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại danh sách dịch vụ
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Không tìm thấy dịch vụ.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link 
                href="/manager/services"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center">
                <EyeIcon className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Chi tiết dịch vụ</h1>
                  <p className="text-sm text-gray-500">{service.name}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleEditClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </button>
              <button
                onClick={handleDeleteService}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
            </div>
            {/* Hiển thị hình ảnh dịch vụ nếu có */}
            {service.image && (
              <div className="ml-6">
                <img
                  src={`http://localhost:5198/${service.image}`}
                  alt={service.name}
                  className="w-40 h-40 object-cover rounded-lg shadow"
                />
              </div>
            )}
            <div className="ml-6 text-right">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {typeof service?.price === 'number'
                  ? service.price.toLocaleString()
                  : Number(service?.price || 0).toLocaleString()} VNĐ
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{averageRating}</span>
                <span className="mx-1">•</span>
                <span>{bookingCount} đặt lịch</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Thời gian</p>
                  <p className="text-sm text-gray-600">{service.turnaroundTime}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Độ chính xác</p>
                  <p className="text-sm text-gray-600">{service.accuracy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Tổng quan', icon: DocumentTextIcon },
                { id: 'bookings', label: 'Đặt lịch', icon: CalendarIcon },
                { id: 'reviews', label: 'Đánh giá', icon: StarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Yêu cầu</h3>
                  <ul className="space-y-2">
                    {Array.isArray(service.requirements) ? (
                      service.requirements.map((req, idx) => (
                        <li key={String(req) + '-' + idx} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">✓</span>
                          <span className="text-gray-600">{String(req)}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">Không có yêu cầu</li>
                    )}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Lợi ích</h3>
                  <ul className="space-y-2">
                    {Array.isArray(service.benefits) ? 
                      service.benefits.map((benefit, idx) => (
                        <li key={String(benefit) + '-' + idx} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">★</span>
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      )) : 
                      <li className="text-gray-500">Không có thông tin lợi ích</li>
                    }
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quy trình</h3>
                  <div className="space-y-3">
                    {Array.isArray(service.process) && service.process.length > 0 ? 
                      service.process.map((step, idx) => (
                        <div key={String(step) + '-' + idx} className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {idx + 1}
                          </div>
                          <span className="text-gray-600 pt-1">{String(step || '')}</span>
                        </div>
                      )) :
                      <div className="text-gray-500">Không có thông tin quy trình</div>
                    }
                  </div>
                </div>

                {/* Sample Types */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Loại mẫu</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Array.isArray(service.sampleTypes) ? 
                      service.sampleTypes.map((type, idx) => (
                        <div key={String(type) + '-' + idx} className="bg-gray-50 rounded-lg p-3 text-center">
                          <span className="text-sm text-gray-700">{String(type)}</span>
                        </div>
                      )) :
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <span className="text-sm text-gray-700">Không có thông tin loại mẫu</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Đặt lịch gần đây</h3>
                  <span className="text-sm text-gray-500">{bookings.length} đặt lịch</span>
                </div>
                
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày đặt
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nhân viên
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking, idx) => (
                        <tr key={booking.bookingId || idx}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.customerName || 'Ẩn danh'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.date
                              ? new Date(booking.date).toLocaleDateString('vi-VN')
                              : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.staffName || 'Chưa phân công'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Đánh giá khách hàng</h3>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-medium">{averageRating}</span>
                    <span className="text-gray-500 ml-1">({reviews.length} đánh giá)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <div
          key={review.feedbackId || idx}
          className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-blue-50 shadow-sm hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center mb-2">
            {/* Avatar icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <UserGroupIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
              {/* Nếu muốn hiển thị ngày, thêm dòng dưới */}
              {/* <span className="text-xs text-gray-400">{review.date && new Date(review.date).toLocaleDateString('vi-VN')}</span> */}
            </div>
          </div>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
              />
            ))}
            <span className="ml-2 text-sm text-yellow-600 font-medium">{review.rating}/5</span>
          </div>
          <p className="text-gray-700 italic">{review.comment}</p>
        </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form chỉnh sửa dịch vụ dạng popup/modal */}
      {showEditForm && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa Dịch vụ</h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    lang="vi"
                    autoComplete="off"
                    autoCorrect="on"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={editData.description || ''}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    lang="vi"
                    autoComplete="off"
                    autoCorrect="on"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                    <input
                      type="number"
                      value={editData.price || ''}
                      onChange={e => setEditData({ ...editData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      value={editData.category || ""}
                      onChange={e =>
                        setEditData({
                          ...editData,
                          category: e.target.value as string,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="" disabled hidden>
                        -- Vui lòng chọn danh mục --
                      </option>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                      ) : (
                        <>
                          <option value="Hành chính">Hành chính</option>
                          <option value="Pháp lý">Pháp lý</option>
                          <option value="Y tế">Y tế</option>
                          <option value="Khác">Khác</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh dịch vụ</label>
                  <div
                    className="w-full px-3 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setEditData({ ...editData, image: file.name });
                      }
                    }}
                  >
                    {editData.image
                      ? <span className="text-green-600 font-medium">{editData.image}</span>
                      : <span className="text-gray-400">Kéo & thả ảnh vào đây hoặc click để chọn</span>
                    }
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="edit-image-upload"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditData({ ...editData, image: file.name });
                        }
                      }}
                    />
                    <label htmlFor="edit-image-upload" className="block mt-2 text-blue-600 underline cursor-pointer">
                      Chọn ảnh
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
