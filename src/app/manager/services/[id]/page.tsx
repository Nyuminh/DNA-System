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

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "inactive";
  bookings: number;
  rating: number;
  createdAt: string;
  duration: string;
  requirements: string[];
  benefits: string[];
  process: string[];
  sampleTypes: string[];
  turnaroundTime: string;
  accuracy: string;
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

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Mock data - trong thực tế sẽ gọi API
    const mockService: Service = {
      id: serviceId,
      name: "Xét nghiệm ADN Hành chính",
      description: "Xét nghiệm ADN xác định quan hệ huyết thống phục vụ các thủ tục hành chính như xin visa, khai sinh, thừa kế, và các vấn đề pháp lý khác. Kết quả có giá trị pháp lý được công nhận bởi các cơ quan chức năng.",
      price: 4500000,
      category: "Huyết thống",
      status: "active",
      bookings: 245,
      rating: 4.8,
      createdAt: "2024-01-15",
      duration: "5-7 ngày làm việc",
      requirements: [
        "Giấy tờ tùy thân có ảnh",
        "Giấy tờ chứng minh mối quan hệ (nếu có)",
        "Đơn đề nghị xét nghiệm",
        "Thanh toán đầy đủ chi phí"
      ],
      benefits: [
        "Kết quả có giá trị pháp lý",
        "Độ chính xác cao 99.99%",
        "Được công nhận bởi tòa án",
        "Hỗ trợ tư vấn miễn phí",
        "Bảo mật thông tin tuyệt đối"
      ],
      process: [
        "Đăng ký và tư vấn",
        "Chuẩn bị giấy tờ cần thiết",
        "Lấy mẫu tại phòng lab",
        "Tiến hành phân tích",
        "Trả kết quả và tư vấn"
      ],
      sampleTypes: [
        "Máu (ưu tiên)",
        "Nước bọt",
        "Tóc có chân",
        "Móng tay/chân"
      ],
      turnaroundTime: "5-7 ngày làm việc",
      accuracy: "99.99%"
    };

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
        comment: "Dịch vụ tuyệt vời, nhân viên tư vấn rất nhiệt tình và chuyên nghiệp. Kết quả chính xác và nhanh chóng.",
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

    setService(mockService);
    setBookings(mockBookings);
    setReviews(mockReviews);
  }, [serviceId]);

  const handleDeleteService = () => {
    if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.')) {
      // API call to delete service
      alert('Dịch vụ đã được xóa thành công!');
      // Redirect to services list
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getBookingStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin dịch vụ...</p>
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
                href="/manager/service-list"
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
              <Link
                href={`/manager/services/edit/${service.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
            </div>
            <div className="ml-6 text-right">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {service.price.toLocaleString()} VNĐ
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{service.rating}</span>
                <span className="mx-1">•</span>
                <span>{service.bookings} đặt lịch</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Đã đặt</p>
                  <p className="text-sm text-gray-600">{service.bookings} lượt</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Ngày tạo</p>
                  <p className="text-sm text-gray-600">{new Date(service.createdAt).toLocaleDateString('vi-VN')}</p>
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
                    {service.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">✓</span>
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Lợi ích</h3>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">★</span>
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quy trình</h3>
                  <div className="space-y-3">
                    {service.process.map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </div>
                        <span className="text-gray-600 pt-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Types */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Loại mẫu</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {service.sampleTypes.map((type, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                        <span className="text-sm text-gray-700">{type}</span>
                      </div>
                    ))}
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                              {getBookingStatusText(booking.status)}
                            </span>
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
    </div>
  );
}
