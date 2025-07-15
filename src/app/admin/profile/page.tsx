"use client";

import { useState, useEffect, useRef } from "react";
import { adminProfileAPI } from '@/lib/api/admin';
import { 
  CheckIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  XMarkIcon,
  CalendarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface AdminProfileData {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  lastLogin?: string;
  permissions?: string[];
  birthdate?: string; // Thêm trường birthdate
}

export default function AdminProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<AdminProfileData>({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    department: 'IT',
    position: 'Administrator',
    joinDate: '',
    lastLogin: '',
    birthdate: '' // Thêm birthdate vào state ban đầu
  });

  const [editedProfile, setEditedProfile] = useState<AdminProfileData>(profileData);

  // Tải thông tin cá nhân từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const result = await adminProfileAPI.getProfile();
        
        if (result.success && result.profile) {
          const profileInfo = {
            username: result.profile.username || '',
            fullname: result.profile.fullname || '',
            email: result.profile.email || '',
            phone: result.profile.phone || '',
            address: result.profile.address || '',
            avatar: result.profile.avatar || '',
            department: result.profile.department || 'IT',
            position: result.profile.position || 'Administrator',
            joinDate: result.profile.joinDate || new Date().toISOString(),
            lastLogin: result.profile.lastLogin || new Date().toISOString(),
            permissions: result.profile.permissions || ['admin'],
            birthdate: result.profile.birthdate || '' // Lấy trường birthdate từ API
          };
          
          setProfileData(profileInfo);
          setEditedProfile(profileInfo);
        } else {
          toast.error('Không thể tải thông tin cá nhân');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        toast.error('Đã xảy ra lỗi khi tải thông tin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profileData);
    setAvatarPreview(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profileData);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Validation trước khi gửi
      if (!editedProfile.fullname?.trim()) {
        toast.error('Họ và tên không được để trống');
        setIsSaving(false);
        return;
      }

      if (!editedProfile.phone?.trim()) {
        toast.error('Số điện thoại không được để trống');
        setIsSaving(false);
        return;
      }
      
      if (!editedProfile.email?.trim()) {
        toast.error('Email không được để trống');
        setIsSaving(false);
        return;
      }
      
      if (!editedProfile.address?.trim()) {
        toast.error('Địa chỉ không được để trống');
        setIsSaving(false);
        return;
      }
      
      if (!editedProfile.birthdate) {
        toast.error('Ngày sinh không được để trống');
        setIsSaving(false);
        return;
      }
      
      // Kiểm tra username - bắt buộc theo API
      if (!profileData.username) {
        toast.error('Không tìm thấy thông tin username. Vui lòng tải lại trang.');
        setIsSaving(false);
        return;
      }
      
      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedProfile.email)) {
        toast.error('Email không đúng định dạng');
        setIsSaving(false);
        return;
      }
      
      // Kiểm tra ngày sinh hợp lệ
      const birthDate = new Date(editedProfile.birthdate);
      const today = new Date();
      if (isNaN(birthDate.getTime()) || birthDate > today) {
        toast.error('Ngày sinh không hợp lệ');
        setIsSaving(false);
        return;
      }

      // Chuẩn bị dữ liệu để gửi đi
      const updateData = {
        username: profileData.username,
        fullname: editedProfile.fullname.trim(),
        email: editedProfile.email.trim(),
        phone: editedProfile.phone.trim(),
        address: editedProfile.address.trim(),
        birthdate: editedProfile.birthdate
      };

      console.log('Sending profile update with data:', updateData);
      
      const result = await adminProfileAPI.updateProfile(updateData);
      
      if (result.success) {
        setProfileData(prev => ({ 
          ...prev,
          fullname: updateData.fullname,
          email: updateData.email,
          phone: updateData.phone,
          address: updateData.address,
          birthdate: updateData.birthdate
        }));
        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công!');
      } else {
        console.error('Update profile failed:', result.message);
        
        // Hiển thị thông báo lỗi chi tiết
        if (result.message?.includes('Username') || result.message?.includes('userName')) {
          toast.error('Lỗi: Username là bắt buộc và không thể thay đổi', { duration: 5000 });
        } else if (result.message?.includes('-')) {
          // Nếu có thông tin lỗi chi tiết, hiển thị toast với thời gian dài hơn
          toast.error(result.message, { duration: 5000 });
        } else {
          toast.error(result.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        }
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof AdminProfileData, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
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

      // Show preview
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
      const response = await adminProfileAPI.uploadAvatar(file);
      
      if (response.success) {
        // Update profile with new avatar URL if provided
        if (response.avatarUrl) {
          setProfileData(prev => ({ ...prev, avatar: response.avatarUrl }));
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                  alt={profileData.fullname}
                  className="w-full h-full object-cover"
                />
              ) : profileData.avatar ? (
                <img 
                  src={getSafeImageUrl(profileData.avatar)} 
                  alt={profileData.fullname}
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
              <h1 className="text-2xl font-bold text-center sm:text-left">{profileData.fullname}</h1>
              <p className="text-blue-100 text-center sm:text-left">{profileData.position}</p>
              <p className="text-blue-200 text-sm text-center sm:text-left">Phòng ban: {profileData.department}</p>
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
                disabled={isSaving}
              >
                <CheckIcon className="h-4 w-4" />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu'}</span>
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
              <CameraIcon className="h-4 w-4 mr-2" />
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
            <p className="text-slate-900">{profileData.username}</p>
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <EnvelopeIcon className="h-4 w-4 inline mr-1" />
              Email <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="example@email.com"
                required
              />
            ) : (
              <p className="text-slate-900">{profileData.email || 'Chưa cập nhật'}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <UserIcon className="h-4 w-4 inline mr-1" />
              Họ và tên <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.fullname || ''}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập họ và tên"
                required
              />
            ) : (
              <p className="text-slate-900">{profileData.fullname || 'Chưa cập nhật'}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <PhoneIcon className="h-4 w-4 inline mr-1" />
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số điện thoại"
                required
              />
            ) : (
              <p className="text-slate-900">{profileData.phone || 'Chưa cập nhật'}</p>
            )}
          </div>
          
          {/* Birthdate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedProfile.birthdate || ''}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            ) : (
              <p className="text-slate-900">
                {profileData.birthdate 
                  ? new Date(profileData.birthdate).toLocaleDateString('vi-VN') 
                  : 'Chưa cập nhật'}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPinIcon className="h-4 w-4 inline mr-1" />
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập địa chỉ của bạn"
                required
              />
            ) : (
              <p className="text-slate-900">{profileData.address || 'Chưa cập nhật'}</p>
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
              <BriefcaseIcon className="h-4 w-4 inline mr-1" />
              Phòng ban
            </label>
            <p className="text-slate-900">{profileData.department}</p>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <BriefcaseIcon className="h-4 w-4 inline mr-1" />
              Chức vụ
            </label>
            <p className="text-slate-900">{profileData.position}</p>
          </div>

          {/* Join Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Ngày vào làm
            </label>
            <p className="text-slate-900">
              {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString('vi-VN') : 'Không có dữ liệu'}
            </p>
          </div>

          {/* Last Login */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Đăng nhập gần đây
            </label>
            <p className="text-slate-900">
              {profileData.lastLogin ? new Date(profileData.lastLogin).toLocaleDateString('vi-VN') : 'Không có dữ liệu'}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Thống kê hoạt động</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">245</div>
            <div className="text-sm text-slate-500">Người dùng quản lý</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">128</div>
            <div className="text-sm text-slate-500">Dịch vụ hoạt động</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">32</div>
            <div className="text-sm text-slate-500">Báo cáo mới</div>
          </div>
        </div>
      </div>
    </div>
  );
}
