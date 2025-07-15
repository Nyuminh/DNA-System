"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { staffProfileAPI, type StaffProfile } from '@/lib/api/staff';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  CameraIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function StaffProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<StaffProfile>>({});
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              birthdate: '',
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
    setAvatarPreview(null);
  };

  const handleSave = async () => {
    try {
      // Validate dữ liệu trước khi gửi
      if (!editedProfile.fullName?.trim()) {
        toast.error('Họ và tên không được để trống');
        return;
      }

      if (!editedProfile.phone?.trim()) {
        toast.error('Số điện thoại không được để trống');
        return;
      }
      
      if (!editedProfile.email?.trim()) {
        toast.error('Email không được để trống');
        return;
      }
      
      if (!editedProfile.address?.trim()) {
        toast.error('Địa chỉ không được để trống');
        return;
      }
      
      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedProfile.email)) {
        toast.error('Email không đúng định dạng');
        return;
      }

      // Gửi dữ liệu không cần chuyển đổi
      const response = await staffProfileAPI.updateProfile(editedProfile);
      
      if (response.success) {
        setProfile(prev => prev ? { ...prev, ...editedProfile } : null);
        setIsEditing(false);
        setAvatarFile(null);
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
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleInputChange = (field: keyof StaffProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file
      if (!file.type.includes('image/')) {
        toast.error('Vui lòng chọn tệp hình ảnh');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 2MB');
        return;
      }

      // Show file preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setAvatarFile(file);
      
      // Upload immediately
      await handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    
    try {
      const response = await staffProfileAPI.updateAvatar(file);
      
      if (response.success) {
        // Update profile with new avatar URL if provided
        if (response.imageUrl) {
          setProfile(prev => prev ? { ...prev, avatar: response.imageUrl } : null);
        }
        
        toast.success(response.message || 'Cập nhật ảnh đại diện thành công!');
      } else {
        toast.error(response.message || 'Cập nhật ảnh đại diện thất bại!');
        
        // Revert preview if upload failed
        setAvatarPreview(null);
        setAvatarFile(null);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Có lỗi xảy ra khi upload ảnh');
      
      // Revert preview on error
      setAvatarPreview(null);
      setAvatarFile(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Helper function to safely get image URL
  const getSafeImageUrl = (imageUrl?: string): string => {
    if (!imageUrl || imageUrl.trim() === '') return '/images/default-avatar.jpg';
    
    // If it's a data URL (base64), return as is
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    // If it's already a valid absolute URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    
    // If it starts with /, it's a relative path from backend - convert to full URL
    if (imageUrl.startsWith('/')) {
      return `http://localhost:5198${imageUrl}`;
    }
    
    // Default fallback for any other case
    return '/images/default-avatar.jpg';
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
      {/* Header with Avatar Upload */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4 sm:mb-0">
            <div 
              className={`h-24 w-24 rounded-xl flex items-center justify-center mb-4 sm:mb-0 relative overflow-hidden
                ${isEditing ? 'cursor-pointer hover:opacity-90 border-2 border-white' : 'bg-white/20'}`}
              onClick={handleAvatarClick}
            >
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : profile.avatar ? (
                <img 
                  src={getSafeImageUrl(profile.avatar)} 
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-avatar.jpg';
                  }}
                />
              ) : (
                <UserIcon className="h-12 w-12 text-white" />
              )}
              
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-center">
                    {isUploadingAvatar ? (
                      <div className="animate-spin h-8 w-8 border-2 border-white rounded-full border-t-transparent"></div>
                    ) : (
                      <>
                        <CameraIcon className="h-8 w-8 text-white" />
                        <span className="text-xs text-white mt-1">Thay đổi ảnh</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-center sm:text-left">{profile.fullName}</h1>
              <p className="text-blue-100 text-center sm:text-left">{profile.position}</p>
              <p className="text-blue-200 text-sm text-center sm:text-left">Mã nhân viên: {profile.employeeId}</p>
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
        
        {isEditing && (
          <div className="mt-4 bg-white/10 p-3 rounded-lg text-sm">
            <div className="flex items-center">
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              <span>Kéo thả ảnh hoặc nhấp vào để chọn. (JPG, PNG, tối đa 2MB)</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Thông tin cá nhân</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <UserIcon className="h-4 w-4 inline mr-1" />
              Tên đăng nhập
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900">{profile.username}</p>
            )}
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

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <UserIcon className="h-4 w-4 inline mr-1" />
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

          {/* Birthdate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Ngày sinh
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedProfile.birthdate || ''}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900">
                {profile.birthdate ? new Date(profile.birthdate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
              </p>
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
