"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { getAllBookings } from "@/lib/api/bookings"; 
import { getAllFeedbacks } from "@/lib/api/feedback"; // Đường dẫn có thể cần chỉnh lại
import { getServices } from "@/lib/api/services"; // Đảm bảo đúng đường dẫn
import { fetchCourses } from "@/lib/api/course";   // Đảm bảo đúng đường dẫn
import { getUserProfile } from "@/lib/api/auth"; // Đảm bảo đúng đường dẫn

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




export default function ManagerDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [satisfaction, setSatisfaction] = useState<number>(0);
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [blogCount, setBlogCount] = useState<number>(0);
  const [fullName, setFullName] = useState<string>("");

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

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token"); // hoặc "accessToken" nếu bạn lưu bằng key này
      if (!token) return;
      const user = await getUserProfile(token);
      setFullName(user?.fullname || "Người dùng");
    };
    const fetchBookingCount = async () => {
      try {
        const bookings = await getAllBookings();
        setBookingCount(bookings.length);
      } catch {
        setBookingCount(0);
      }
    };
    const fetchSatisfaction = async () => {
      try {
        const feedbacks = await getAllFeedbacks();
        if (feedbacks.length === 0) {
          setSatisfaction(0);
          return;
        }
        
        const avg =
          feedbacks.reduce((sum: number, fb: any) => sum + (fb.rating || 0), 0) /
          feedbacks.length;

        setSatisfaction(Math.round((avg / 5) * 100));
      } catch {
        setSatisfaction(0);
      }
    };
    const fetchServiceCount = async () => {
      try {
        const servicesResponse = await getServices();
        setServiceCount(servicesResponse.services ? servicesResponse.services.length : 0);
      } catch {
        setServiceCount(0);
      }
    };
    const fetchBlogCount = async () => {
      try {
        const blogs = await fetchCourses();
        setBlogCount(blogs.length);
      } catch {
        setBlogCount(0);
      }
    };
    fetchProfile();
    fetchBookingCount();
    fetchSatisfaction();
    fetchServiceCount();
    fetchBlogCount();
  }, []);

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-auto">
        <div className="container px-6 py-8">
          {/* Header with stats cards */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Xin chào, {fullName}!
            </h1>
            <p className="text-gray-600">Đây là tổng quan hoạt động của hệ thống hôm nay</p>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
            {/* Total Tests Card */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">+15%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{bookingCount}</h3>
                <p className="text-sm text-gray-500">Xét nghiệm tháng này</p>
              </div>
            </div>

            {/* Satisfaction Card */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2.5 py-0.5 rounded-full">+2%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{satisfaction}%</h3>
                <p className="text-sm text-gray-500">Độ hài lòng</p>
              </div>
            </div>

            {/* Total Services Card */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <BeakerIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{serviceCount}</h3>
                <p className="text-sm text-gray-500">Tổng dịch vụ</p>
              </div>
            </div>

            {/* Total Blog Posts Card */}
            <div className="col-span-1 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{blogCount}</h3>
                <p className="text-sm text-gray-500">Tổng bài viết</p>
              </div>
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

          
        </div>
      </div>
    </div>

  );
}