"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function NewAccountPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'admin' | 'manager' | 'user',
    status: 'active' as 'active' | 'inactive',
    sendWelcomeEmail: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Tạo tài khoản thành công cho ${formData.name}`);
      router.push('/admin/accounts');
    } catch  {
      alert('Có lỗi xảy ra khi tạo tài khoản');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/accounts"
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors p-2 hover:bg-white/50 rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Quay lại
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thêm người dùng mới</h1>
              <p className="text-gray-600 mt-1">Tạo tài khoản người dùng mới trong hệ thống</p>
            </div>
          </div>
        </div>

        {/* Centered Form Container */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
            
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <UserIcon className="h-5 w-5 text-indigo-600" />
                </div>
                Thông tin cơ bản
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm text-sm transition-all duration-200 ${
                      errors.name ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm text-sm transition-all duration-200 ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Nhập địa chỉ email"
                    />
                    <EnvelopeIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
                <div className="p-2 bg-green-100 rounded-lg">
                  <KeyIcon className="h-5 w-5 text-green-600" />
                </div>
                Mật khẩu
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm text-sm transition-all duration-200 ${
                      errors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Nhập mật khẩu"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm text-sm transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Mật khẩu phải có ít nhất 6 ký tự
              </p>
            </div>

            {/* Role and Status */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserGroupIcon className="h-5 w-5 text-purple-600" />
                </div>
                Phân quyền và trạng thái
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Vai trò
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm text-sm transition-all duration-200"
                  >
                    <option value="user">Người dùng</option>
                    <option value="manager">Quản lý</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm text-sm transition-all duration-200"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tùy chọn bổ sung</h2>
              
              <div className="bg-gray-50/50 rounded-lg p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendWelcomeEmail"
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sendWelcomeEmail" className="ml-3 block text-sm font-medium text-gray-700">
                    Gửi email chào mừng cho người dùng mới
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  Email sẽ chứa thông tin đăng nhập và hướng dẫn sử dụng hệ thống
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              <Link
                href="/admin/accounts"
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 border border-transparent rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang tạo...
                  </div>
                ) : (
                  'Tạo tài khoản'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
