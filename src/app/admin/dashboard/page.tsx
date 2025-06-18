"use client";

import Link from "next/link";
import { 
  UserIcon, 
  ChartBarIcon,
  UsersIcon,
  PlusIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Tổng quan</h1>
        <p className="text-gray-600 text-sm">Tổng quan hệ thống DNA Testing Service Management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">        {/* Total Users Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-blue-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500/10 p-2.5 rounded-lg">
              <UsersIcon className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-500/10 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">1,234</h3>
          <p className="text-xs text-gray-500">Tổng số người dùng</p>
        </div>

        {/* Active Users Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-green-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500/10 p-2.5 rounded-lg">
              <UserIcon className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">+8%</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">1,156</h3>
          <p className="text-xs text-gray-500">Người dùng hoạt động</p>
        </div>

        {/* New Users This Month */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-purple-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500/10 p-2.5 rounded-lg">
              <PlusIcon className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-500/10 px-2 py-1 rounded-full">+24</span>          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">89</h3>
          <p className="text-xs text-gray-500">Người dùng mới tháng này</p>
        </div>

        {/* System Performance Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-indigo-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-indigo-500/10 p-2.5 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-500/10 px-2 py-1 rounded-full">99.8%</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">99.8%</h3>
          <p className="text-xs text-gray-500">Tỷ lệ hoạt động hệ thống</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="space-y-2">            <Link
              href="/admin/accounts/new"
              className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150/50 rounded-lg transition-all duration-200 group border border-blue-100/30"
            >
              <div className="bg-blue-500/10 p-2 rounded-lg mr-3 group-hover:bg-blue-500/20 transition-colors">
                <PlusIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Thêm người dùng mới</h3>
                <p className="text-xs text-gray-500">Tạo tài khoản cho người dùng mới</p>
              </div>
            </Link>
            <Link
              href="/admin/accounts"
              className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-150/50 rounded-lg transition-all duration-200 group border border-green-100/30"
            >
              <div className="bg-green-500/10 p-2 rounded-lg mr-3 group-hover:bg-green-500/20 transition-colors">
                <UsersIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Quản lý tài khoản</h3>
                <p className="text-xs text-gray-500">Xem và quản lý người dùng hệ thống</p>
              </div>
            </Link>
          </div>
        </div>        {/* System Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê hôm nay</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-100/50">
              <div className="flex items-center">
                <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Đăng nhập mới</span>
              </div>
              <span className="text-sm font-bold text-gray-900">47</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-100/50">
              <div className="flex items-center">
                <div className="bg-green-500/10 p-2 rounded-lg mr-3">
                  <PlusIcon className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Tài khoản mới</span>
              </div>
              <span className="text-sm font-bold text-gray-900">5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-100/50">
              <div className="flex items-center">
                <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Hoạt động tăng</span>
              </div>
              <span className="text-sm font-bold text-green-600">+12%</span>
            </div>
          </div>
        </div>
      </div>      {/* System Activity */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Hoạt động hệ thống gần đây</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Xem tất cả</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-100/50">
            <div className="flex-shrink-0 bg-green-500/10 rounded-lg p-2">
              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Người dùng mới đăng ký: nguyenvand@example.com</p>
              <p className="text-xs text-gray-500">30 phút trước</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-100/50">
            <div className="flex-shrink-0 bg-blue-500/10 rounded-lg p-2">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Backup hệ thống hoàn thành thành công</p>
              <p className="text-xs text-gray-500">1 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-lg border border-yellow-100/50">
            <div className="flex-shrink-0 bg-yellow-500/10 rounded-lg p-2">
              <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Cảnh báo: Dung lượng server đạt 85%</p>
              <p className="text-xs text-gray-500">2 giờ trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
