"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  BeakerIcon,
  CubeIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalKits: 0,
    availableKits: 0,
    usedKits: 0,
    pendingResults: 0,
    completedResults: 0,
    totalTests: 0
  });

  useEffect(() => {
    // Simulate fetching stats
    setStats({
      totalKits: 150,
      availableKits: 45,
      usedKits: 105,
      pendingResults: 12,
      completedResults: 93,
      totalTests: 105
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Chào mừng, {user?.username || 'Staff'}!
            </h1>
            <p className="text-blue-100">
              Quản lý kit xét nghiệm và kết quả cho khách hàng
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Kit Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CubeIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-slate-500">Kit xét nghiệm</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{stats.totalKits}</div>
            <div className="text-sm text-slate-500">Tổng số kit</div>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-green-600">{stats.availableKits} sẵn sàng</span>
              <span className="text-orange-600">{stats.usedKits} đã sử dụng</span>
            </div>
          </div>
        </div>

        {/* Pending Results */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm text-slate-500">Chờ xử lý</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{stats.pendingResults}</div>
            <div className="text-sm text-slate-500">Kết quả chờ</div>
            <div className="text-xs text-orange-600">Cần xử lý</div>
          </div>
        </div>

        {/* Completed Results */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">Hoàn thành</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{stats.completedResults}</div>
            <div className="text-sm text-slate-500">Kết quả hoàn thành</div>
            <div className="text-xs text-blue-600">Đã gửi khách hàng</div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kit Management Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Quản lý Kit</h3>
            <CubeIcon className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Kit sẵn sàng</div>
                  <div className="text-xs text-slate-500">Có thể sử dụng</div>
                </div>
              </div>
              <span className="text-lg font-semibold text-green-600">{stats.availableKits}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Kit cần bổ sung</div>
                  <div className="text-xs text-slate-500">Số lượng thấp</div>
                </div>
              </div>
              <span className="text-lg font-semibold text-orange-600">5</span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Xem tất cả Kit
          </button>
        </div>

        {/* Test Results Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Kết quả xét nghiệm</h3>
            <DocumentTextIcon className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Chờ xử lý</div>
                  <div className="text-xs text-slate-500">Cần nhập kết quả</div>
                </div>
              </div>
              <span className="text-lg font-semibold text-orange-600">{stats.pendingResults}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Hoàn thành</div>
                  <div className="text-xs text-slate-500">Đã gửi khách hàng</div>
                </div>
              </div>
              <span className="text-lg font-semibold text-blue-600">{stats.completedResults}</span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Xem kết quả chờ xử lý
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <CubeIcon className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Thêm Kit mới</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <DocumentTextIcon className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-slate-700">Nhập kết quả</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <BeakerIcon className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium text-slate-700">Xem mẫu xét nghiệm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
