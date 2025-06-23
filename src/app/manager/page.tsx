"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
  UserIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BeakerIcon,
  AcademicCapIcon,
  HomeIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { deleteServiceById } from "@/lib/api";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number | string;
  status?: "active" | "inactive";
  type?: string;
  image?: string;
}

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  status: "published" | "draft";
}

export default function ManagerDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Tìm hiểu về xét nghiệm ADN và ứng dụng trong đời sống",
      summary: "Xét nghiệm ADN là một phương pháp khoa học hiện đại giúp xác định mối quan hệ huyết thống...",
      author: "Dr. Nguyễn Văn A",
      publishDate: "2024-01-15",
      status: "published"
    },
    {
      id: "2",
      title: "Quy trình lấy mẫu ADN an toàn và chính xác",
      summary: "Việc lấy mẫu ADN đúng cách là yếu tố quan trọng quyết định độ chính xác của kết quả...",
      author: "Dr. Trần Thị B",
      publishDate: "2024-01-10",
      status: "published"
    },
    {
      id: "3",
      title: "Những lưu ý quan trọng khi xét nghiệm ADN",
      summary: "Trước khi thực hiện xét nghiệm ADN, có nhiều điều cần lưu ý để đảm bảo kết quả chính xác...",
      author: "Dr. Lê Văn C",
      publishDate: "2024-01-05",
      status: "draft"
    }
  ]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5198/api/Services');
        let servicesArray = [];
        if (response.data && typeof response.data === 'object') {
          if ('$values' in response.data && Array.isArray(response.data.$values)) {
            servicesArray = response.data.$values;
          } else if (Array.isArray(response.data)) {
            servicesArray = response.data;
          } else {
            servicesArray = [response.data];
          }
        }
        const formattedServices = servicesArray.map((service: any, index: number) => ({
          id: service.id || `temp-id-${index}-${Date.now()}`,
          name: service.name || service.serviceName || 'Không có tên',
          description: service.description || 'Không có mô tả',
          price: typeof service.price === 'number' ? service.price :
            typeof service.price === 'string' ?
              (parseFloat(service.price.replace(/[^\d.-]/g, '')) || 0) :
              0,
          status: service.status || 'active',
          type: service.type || service.category || '',
          image: service.image || ''
        }));
        setServices(formattedServices);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách dịch vụ');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const toggleBlogStatus = (id: string) => {
    setBlogPosts(posts => posts.map(post =>
      post.id === id
        ? { ...post, status: post.status === 'published' ? 'draft' : 'published' }
        : post
    ));
  };

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('@/lib/api/auth');
      await logoutUser();
      logout();
      router.push('/auth/login');
    } catch (error) {
      const { forceLogout } = await import('@/lib/api/auth');
      forceLogout();
      logout();
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <div className="hidden md:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      DNA Testing Service
                    </h1>
                    <p className="text-xs text-slate-500 -mt-1">Manager Dashboard</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-50">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-700">manager</div>
                  <div className="text-xs text-slate-500">Quản lý dịch vụ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-slate-200 h-screen sticky top-0 flex flex-col">
          <nav className="flex-1 mt-6 px-4">
            <div className="space-y-1">
              <Link href="/" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <HomeIcon className="mr-3 h-5 w-5" />
                Trang chủ
              </Link>
              <Link href="/manager/profile" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <UserIcon className="mr-3 h-5 w-5" />
                Hồ sơ cá nhân
              </Link>
              <Link href="/manager" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                <ChartBarIcon className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <div className="space-y-1">
                <Link href="/manager/services" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                  <BeakerIcon className="mr-3 h-5 w-5" />
                  Quản lý dịch vụ
                </Link>
               
              </div>
              <div className="space-y-1">
                <Link href="/manager/courses" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                  <AcademicCapIcon className="mr-3 h-5 w-5" />
                  Quản lý khóa học
                </Link>
                
              </div>
              <Link href="/manager/settings" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <Cog6ToothIcon className="mr-3 h-5 w-5" />
                Cài đặt
              </Link>
              <Link href="/manager/notifications" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <BellIcon className="mr-3 h-5 w-5" />
                Thông báo
              </Link>
              <div className="border-t border-slate-200 my-4"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Đăng xuất
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen overflow-auto">
          <div className="container px-6 py-8">
            {/* Header with stats cards */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Xin chào, Manager!</h1>
              <p className="text-gray-600">Đây là tổng quan hoạt động của hệ thống hôm nay</p>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Tests Card */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">+15%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">248</h3>
                <p className="text-sm text-gray-500">Xét nghiệm tháng này</p>
              </div>
              {/* Customers Card */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">1,423</h3>
                <p className="text-sm text-gray-500">Khách hàng</p>
              </div>
              {/* Revenue Card */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">+8%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">125.4M</h3>
                <p className="text-sm text-gray-500">Doanh thu (VNĐ)</p>
              </div>
              {/* Satisfaction Card */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2.5 py-0.5 rounded-full">+2%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">98%</h3>
                <p className="text-sm text-gray-500">Độ hài lòng</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
                <button className="text-sm text-green-600 hover:text-green-700">Xem tất cả</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Xét nghiệm ADN #12345 đã hoàn thành</p>
                    <p className="text-sm text-gray-500">2 giờ trước</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Khách hàng mới đăng ký dịch vụ</p>
                    <p className="text-sm text-gray-500">5 giờ trước</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý Dịch vụ</h2>
               
              </div>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu dịch vụ...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-500">
                    <p>{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên Dịch vụ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mô tả
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá (VNĐ)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            Không có dịch vụ nào được tìm thấy
                          </td>
                        </tr>
                      ) : (
                        services.map((service) => (
                          <tr key={service.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {service.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {service.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {typeof service.price === 'number'
                                  ? service.price.toLocaleString()
                                  : Number(service.price).toLocaleString() || '0'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                <Link
                                  href={`/manager/services/${service.id}`}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Xem chi tiết"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                  </svg>
                                </Link>
                                <Link
                                  href={`/manager/services/edit/${service.id}`}
                                  className="text-green-600 hover:text-green-800"
                                  title="Chỉnh sửa"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                </Link>
                                <button
                                  onClick={() => deleteServiceById(service.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Xóa dịch vụ"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* Blog Posts Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý Blog</h2>
                
              </div>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tóm tắt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tác giả
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đăng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {post.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {post.summary}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {post.author}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/manager/blog/edit/${post.id}`}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Sửa
                          </Link>
                          <button
                            onClick={() => toggleBlogStatus(post.id)}
                            className={`${
                              post.status === 'published'
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {post.status === 'published' ? 'Chuyển nháp' : 'Đăng bài'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}