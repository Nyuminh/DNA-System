"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  BeakerIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  status: "active" | "inactive";
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

  // Mock data for services
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Xét nghiệm ADN cha con",
      description: "Xác định mối quan hệ huyết thống giữa cha và con với độ chính xác 99.9%",
      price: 2500000,
      status: "active"
    },
    {
      id: "2", 
      name: "Xét nghiệm ADN anh chị em",
      description: "Xác định mối quan hệ huyết thống giữa anh chị em",
      price: 3000000,
      status: "active"
    },
    {
      id: "3",
      name: "Xét nghiệm ADN pháp y",
      description: "Xét nghiệm ADN phục vụ mục đích pháp lý",
      price: 4000000,
      status: "inactive"
    }
  ]);

  // Mock data for blog posts
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

  // Function to toggle service status
  const toggleServiceStatus = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, status: service.status === "active" ? "inactive" : "active" }
        : service
    ));
  };

  // Function to toggle blog post status
  const toggleBlogStatus = (postId: string) => {
    setBlogPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, status: post.status === "published" ? "draft" : "published" }
        : post
    ));
  };return (
    <div className="space-y-8">
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
          <Link
            href="/manager/add-service"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <BeakerIcon className="h-4 w-4" />
            Thêm Dịch vụ Mới
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
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
                      {service.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/manager/services/edit/${service.id}`}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`${
                        service.status === 'active' 
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {service.status === 'active' ? 'Ẩn' : 'Hiện'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Quản lý Blog</h2>
          <Link
            href="/manager/blog/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <AcademicCapIcon className="h-4 w-4" />
            Thêm Bài Viết Mới
          </Link>
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
  );
}