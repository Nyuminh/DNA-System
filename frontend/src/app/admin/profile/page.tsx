"use client";

import { useState } from "react";
import { 
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  CameraIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@dnatesting.com',
    phone: '+84 123 456 789',
    role: 'Quản trị viên hệ thống',
    joinDate: '2025-01-01',
    lastLogin: '2025-06-08T10:30:00'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsSaving(false);
    alert('Cập nhật thông tin thành công!');
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsSaving(false);
    alert('Đổi mật khẩu thành công!');
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
        <p className="text-gray-600 text-sm">Quản lý thông tin cá nhân và cài đặt bảo mật</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 mb-6 border border-white/20">
        <div className="flex items-center space-x-5 mb-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center border border-indigo-100/50">
              <UserIcon className="h-10 w-10 text-indigo-600" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-white/50">
              <CameraIcon className="h-3 w-3 text-gray-600" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
            <p className="text-gray-600 text-sm">{profileData.role}</p>            <p className="text-xs text-gray-500">
              Tham gia từ {new Date(profileData.joinDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200/50 mb-5">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'security'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bảo mật
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <div className="relative">                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                      !isEditing ? 'bg-gray-50/50 text-gray-600' : 'bg-white/50'
                    }`}
                  />
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                      !isEditing ? 'bg-gray-50/50 text-gray-600' : 'bg-white/50'
                    }`}
                  />
                  <EnvelopeIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                    !isEditing ? 'bg-gray-50/50 text-gray-600' : 'bg-white/50'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <input
                  type="text"
                  value={profileData.role}
                  disabled
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50/50 text-gray-600 text-sm"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100/50">
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Thông tin hoạt động</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Đăng nhập lần cuối: {new Date(profileData.lastLogin).toLocaleString('vi-VN')}</p>
                <p>Ngày tham gia: {new Date(profileData.joinDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>            <div className="flex justify-end space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-sm shadow-sm"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 text-sm shadow-sm"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-3 w-3" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <KeyIcon className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">
                    Đổi mật khẩu
                  </h3>
                  <div className="text-xs text-yellow-700">
                    <p>Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh có ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm text-sm transition-all duration-200"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm text-sm transition-all duration-200"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm text-sm transition-all duration-200"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-sm"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <KeyIcon className="h-3 w-3" />
                    Đổi mật khẩu
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
