"use client";

import { useState } from 'react';
import Image from 'next/image';
import { UserCircleIcon, KeyIcon, BellIcon, ShieldCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  department: string;
  position: string;
  joinDate: string;
}

export default function ManagerProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    fullName: "Nguyễn Thị B",
    email: "manager@dna-testing.com",
    phone: "0901234568",
    role: "Manager",
    department: "Quản lý Dịch vụ",
    position: "Trưởng phòng Quản lý",
    joinDate: "2024-01-15"
  });

  const [activeTab, setActiveTab] = useState('profile');
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header Section with Background */}
      <div className="relative mb-8">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"></div>
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">              {profile.avatar ? (
                <Image 
                  src={profile.avatar} 
                  alt={profile.fullName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <UserCircleIcon className="w-20 h-20 text-blue-400" />
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div className="ml-6 mb-4">
            <h1 className="text-3xl font-bold text-white">{profile.fullName}</h1>
            <p className="text-blue-100">{profile.position}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-20">        <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dịch vụ quản lý</p>
              <h3 className="text-2xl font-bold text-gray-900">85</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nhân viên</p>
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Báo cáo</p>
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đánh giá</p>
              <h3 className="text-2xl font-bold text-gray-900">4.9</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">            <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
              {profile.avatar ? (
                <Image 
                  src={profile.avatar} 
                  alt={profile.fullName}
                  width={128}
                  height={128}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-24 h-24 text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{profile.fullName}</h2>
            <p className="text-sm text-gray-500">{profile.position}</p>
          </div>

          <nav className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full px-4 py-3 text-left flex items-center ${
                activeTab === 'profile' 
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <UserCircleIcon className="w-5 h-5 mr-3" />
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full px-4 py-3 text-left flex items-center ${
                activeTab === 'security' 
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <KeyIcon className="w-5 h-5 mr-3" />
              Bảo mật
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full px-4 py-3 text-left flex items-center ${
                activeTab === 'notifications' 
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BellIcon className="w-5 h-5 mr-3" />
              Thông báo
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full px-4 py-3 text-left flex items-center ${
                activeTab === 'privacy' 
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShieldCheckIcon className="w-5 h-5 mr-3" />
              Quyền riêng tư
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Cập nhật thông tin cá nhân của bạn để quản lý dịch vụ hiệu quả hơn
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phòng ban</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                    <input
                      type="text"
                      value={profile.position}
                      onChange={(e) => setProfile({...profile, position: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày vào làm</label>
                    <input
                      type="date"
                      value={profile.joinDate}
                      onChange={(e) => setProfile({...profile, joinDate: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Bảo mật</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cài đặt thông báo</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="flex-grow flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Email thông báo</span>
                        <span className="text-sm text-gray-500">Nhận thông báo qua email</span>
                      </span>
                      <button
                        type="button"
                        className="bg-blue-500 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="flex-grow flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Thông báo trên web</span>
                        <span className="text-sm text-gray-500">Hiển thị thông báo trên trình duyệt</span>
                      </span>
                      <button
                        type="button"
                        className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quyền riêng tư</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="flex-grow flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Hiển thị thông tin cá nhân</span>
                        <span className="text-sm text-gray-500">Cho phép người khác xem thông tin của bạn</span>
                      </span>
                      <button
                        type="button"
                        className="bg-blue-500 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="flex-grow flex flex-col">
                        <span className="text-sm font-medium text-gray-900">Dữ liệu hoạt động</span>
                        <span className="text-sm text-gray-500">Thu thập dữ liệu để cải thiện trải nghiệm</span>
                      </span>
                      <button
                        type="button"
                        className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
