"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { staffProfileAPI, type StaffProfile } from '@/lib/api/staff';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function StaffProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<StaffProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real profile data using API
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await staffProfileAPI.getProfile();
        
        if (response.success && response.profile) {
          setProfile(response.profile);
          setEditedProfile(response.profile);
        } else {
          console.error('Failed to fetch profile:', response.message);
          toast.error(response.message || 'Không thể tải thông tin hồ sơ');
          
          // Fallback to user data from auth context if API fails
          if (user) {
            const fallbackProfile: StaffProfile = {
              id: user.userID || '1',
              username: user.username || 'staff',
              email: user.email || 'staff@dnatest.com',
              fullName: user.fullname || 'Nhân viên',
              phone: user.phone || '',
              address: user.address || '',
              department: 'Phòng xét nghiệm',
              position: 'Kỹ thuật viên xét nghiệm',
              employeeId: 'EMP001',
              joinDate: new Date().toISOString(),
              avatar: user.image || ''
            };
            setProfile(fallbackProfile);
            setEditedProfile(fallbackProfile);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Có lỗi xảy ra khi tải thông tin hồ sơ');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile || {});
  };

  const handleSave = async () => {
    try {
      const response = await staffProfileAPI.updateProfile(editedProfile);
      
      if (response.success) {
        setProfile(prev => prev ? { ...prev, ...editedProfile } : null);
        setIsEditing(false);
        toast.success(response.message || 'Cập nhật hồ sơ thành công!');
      } else {
        toast.error(response.message || 'Cập nhật hồ sơ thất bại!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật hồ sơ!');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile || {});
  };

  const handleInputChange = (field: keyof StaffProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Không thể tải thông tin hồ sơ</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <UserIcon className="h-8 w-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.fullName}</h1>
              <p className="text-blue-100">{profile.position}</p>
              <p className="text-blue-200 text-sm">Mã nhân viên: {profile.employeeId}</p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Lưu</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Hủy</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Thông tin cá nhân</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Họ và tên
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900">{profile.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên đăng nhập
            </label>
            <p className="text-slate-900">{profile.username}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <EnvelopeIcon className="h-4 w-4 inline mr-1" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900">{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <PhoneIcon className="h-4 w-4 inline mr-1" />
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900">{profile.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPinIcon className="h-4 w-4 inline mr-1" />
              Địa chỉ
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900">{profile.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Thông tin công việc</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phòng ban
            </label>
            <p className="text-slate-900">{profile.department}</p>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Chức vụ
            </label>
            <p className="text-slate-900">{profile.position}</p>
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mã nhân viên
            </label>
            <p className="text-slate-900">{profile.employeeId}</p>
          </div>

          {/* Join Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ngày vào làm
            </label>
            <p className="text-slate-900">
              {new Date(profile.joinDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Thống kê hoạt động</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">150</div>
            <div className="text-sm text-slate-500">Kit đã quản lý</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">93</div>
            <div className="text-sm text-slate-500">Kết quả đã xử lý</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-sm text-slate-500">Đang chờ xử lý</div>
          </div>
        </div>
      </div>
    </div>
  );
}
