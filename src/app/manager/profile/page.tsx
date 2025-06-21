"use client";

import { useState, useEffect } from "react";
import { adminProfileAPI } from '@/lib/api/admin';
import { 
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ProfileFormData {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
}

export default function ManagerProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    address: ''
  });  // Tải thông tin cá nhân từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const result = await adminProfileAPI.getProfile();
        
        if (result.success && result.profile) {
          setProfileData({
            username: result.profile.username || '',
            fullname: result.profile.fullname || '',
            email: result.profile.email || '',
            phone: result.profile.phone || '',
            address: result.profile.address || ''
          });
        } else {
          setError('Không thể tải thông tin cá nhân');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Đã xảy ra lỗi khi tải thông tin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await adminProfileAPI.updateProfile({
        fullname: profileData.fullname,
        phone: profileData.phone,
        address: profileData.address
      });

      if (result.success) {
        setSuccess('Cập nhật thông tin thành công!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Hồ sơ cá nhân</h1>
        
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6 mb-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 m-6 mb-4">
                <div className="flex">
                  <CheckIcon className="h-5 w-5 text-green-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                  <button
                    onClick={() => setSuccess(null)}
                    className="ml-auto text-green-400 hover:text-green-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Profile Form */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2">Đang tải thông tin từ API...</span>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>
                  <form className="space-y-6" onSubmit={handleSaveProfile}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                          Tên đăng nhập
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="username"
                            value={profileData.username}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-500 bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            readOnly
                          />
                        </div>
                      </div>                      <div>
                        <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900">
                          Họ và tên
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={profileData.fullname}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                          Email
                        </label>
                        <div className="mt-2">
                          <input
                            type="email"
                            id="email"
                            value={profileData.email}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-500 bg-gray-50 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            readOnly
                          />
                        </div>
                      </div>                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                          Số điện thoại
                        </label>
                        <div className="mt-2">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                          Địa chỉ
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
