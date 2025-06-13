"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  UserCircleIcon, 
  CameraIcon,
  CheckIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

export default function PersonalProfile() {
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Thị B",
    email: "manager@dna-testing.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    birthDate: "1985-05-15",
    gender: "female",
    department: "Quản lý Dịch vụ",
    position: "Trưởng phòng Quản lý",
    employeeId: "MGR001",
    startDate: "2020-01-15",
    avatar: null
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/manager"
                className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Quay về Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hồ sơ cá nhân</h1>
                <p className="text-indigo-100">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
              </div>
            </div>
            <div className="flex space-x-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="container mx-auto px-6 pt-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-700">Thông tin đã được cập nhật thành công!</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-md p-6 text-center sticky top-8">
              <div className="relative inline-block mb-6">                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <Image 
                      src={profile.avatar} 
                      alt={profile.fullName}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-20 h-20 text-white" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition shadow-lg">
                    <CameraIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.fullName}</h2>
              <p className="text-indigo-600 font-medium mb-1">{profile.position}</p>
              <p className="text-gray-500 text-sm mb-4">{profile.department}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã NV:</span>
                  <span className="font-medium">{profile.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày vào:</span>
                  <span className="font-medium">{new Date(profile.startDate).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'basic'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Thông tin cơ bản
                  </button>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'contact'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Thông tin liên hệ
                  </button>
                  <button
                    onClick={() => setActiveTab('work')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'work'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Thông tin công việc
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-md p-6">
              {activeTab === 'basic' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                      <input
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                      <select
                        value={profile.gender}
                        onChange={(e) => setProfile({...profile, gender: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mã nhân viên</label>
                      <input
                        type="text"
                        value={profile.employeeId}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin liên hệ</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                      <textarea
                        value={profile.address}
                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'work' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin công việc</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phòng ban</label>
                      <input
                        type="text"
                        value={profile.department}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                      <input
                        type="text"
                        value={profile.position}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                      <input
                        type="date"
                        value={profile.startDate}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Thống kê hiệu suất</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">85</div>
                        <div className="text-sm text-blue-600">Dịch vụ quản lý</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">4.9</div>
                        <div className="text-sm text-green-600">Đánh giá TB</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">12</div>
                        <div className="text-sm text-purple-600">Nhân viên</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
