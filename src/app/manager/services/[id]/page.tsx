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
  image?: string; // Thêm thuộc tính hình ảnh
}

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalAmount: number;
}

interface Review {
  id: string;
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
  const [reviews, setReviews] = useState<Review[]>([]);
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
          image: serviceData.image || serviceData.imageUrl || '', // Lấy ảnh từ API
        };

        setService(formattedService);
        
        // For now, keep using mock data for bookings and reviews
        // In a real implementation, you would have separate API calls for these
        const mockBookings: Booking[] = [
          {
            id: "1",
            customerName: "Nguyễn Văn A",
            customerEmail: "nguyenvana@email.com",
            bookingDate: "2024-03-15",
            status: "completed",
            totalAmount: 4500000
          },
          {
            id: "2",
            customerName: "Trần Thị B",
            customerEmail: "tranthib@email.com",
            bookingDate: "2024-03-14",
            status: "confirmed",
            totalAmount: 4500000
          },
          {
            id: "3",
            customerName: "Lê Văn C",
            customerEmail: "levanc@email.com",
            bookingDate: "2024-03-13",
            status: "pending",
            totalAmount: 4500000
          }
        ];

        const mockReviews: Review[] = [
          {
            id: "1",
            customerName: "Nguyễn Văn A",
            rating: 5,
            comment: "Dịch vụ tuyệt vời, nhân viên tư vấn rất nhiệt tình và chuyên nghiệp.",
            date: "2024-03-20"
          },
          {
            id: "2",
            customerName: "Trần Thị B",
            rating: 5,
            comment: "Quy trình rõ ràng, kết quả đáng tin cậy. Sẽ giới thiệu cho bạn bè.",
            date: "2024-03-18"
          },
          {
            id: "3",
            customerName: "Lê Văn D",
            rating: 4,
            comment: "Tốt, chỉ hơi chậm một chút so với dự kiến.",
            date: "2024-03-16"
          }
        ];

        setBookings(mockBookings);
        setReviews(mockReviews);
        
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
          headers: {
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
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện chức năng này.");
        return;
      }
      // Gọi API cập nhật dịch vụ với header Authorization
      await axios.put(
        `http://localhost:5198/api/Services/${serviceId}`,
        editData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setService(editData);
      setShowEditForm(false);
      alert("Cập nhật dịch vụ thành công!");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert("Bạn không có quyền cập nhật. Vui lòng đăng nhập lại.");
      } else {
        alert("Cập nhật thất bại!");
      }
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
                  src={service.image}
                  alt={service.name}
                  className="w-40 h-40 object-cover rounded-lg shadow"
                />
              </div>
            )}
            <div className="ml-6 text-right">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {service?.price !== undefined 
                  ? service.price.toLocaleString() 
                  : '0'} VNĐ
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{service?.rating || 0}</span>
                <span className="mx-1">•</span>
                <span>{service?.bookings || 0} đặt lịch</span>
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
                      service.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
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
                      service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
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
                      service.process.map((step, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
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
                      service.sampleTypes.map((type, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
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
                          Số tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                              <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.totalAmount.toLocaleString()} VNĐ
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
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-gray-500 ml-1">({reviews.length} đánh giá)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full space-y-6 relative"
          >
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa Dịch vụ</h2>
            {/* Tên dịch vụ */}
            <div>
              <label className="block text-sm font-medium mb-1">Tên dịch vụ</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
                required
              />
            </div>
            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
                required
              />
            </div>
            {/* Giá và Danh mục */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={editData.price}
                  onChange={e => setEditData({ ...editData, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Danh mục</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={editData.category}
                  onChange={e => setEditData({ ...editData, category: e.target.value })}
                >
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
            {/* Ảnh dịch vụ */}
            <div>
              <label className="block text-sm font-medium mb-1">Ảnh dịch vụ</label>
              <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center">
                {editData.image && (
                  <div className="mb-2 text-green-600 font-medium">
                    {typeof editData.image === "string" && editData.image.startsWith("data:")
                      ? "Đã chọn ảnh mới"
                      : editData.image.split("/").pop()}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="service-image-upload"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Đọc file thành base64 để preview hoặc gửi lên API
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setEditData({ ...editData, image: ev.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label
                  htmlFor="service-image-upload"
                  className="text-blue-600 cursor-pointer underline"
                >
                  Chọn ảnh
                </label>
              </div>
            </div>
            {/* Nút hành động */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
