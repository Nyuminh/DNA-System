'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  UserIcon, 
  ArrowRightStartOnRectangleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardData, updateProfile, updateUserImage, type DashboardData, type UpdateProfileRequest } from '@/lib/api/auth';

const tabs = [
  { name: 'Hồ sơ cá nhân', icon: UserIcon, current: true },
  { name: 'Đổi mật khẩu', icon: KeyIcon, current: false },
 
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user: authUser, isLoggedIn } = useAuth();
  const [currentTab, setCurrentTab] = useState('Hồ sơ cá nhân');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // States for avatar upload
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  
  // States for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getDashboardData();
        if (data) {
          setDashboardData(data);
        } else {
          setError('Không thể tải dữ liệu dashboard');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLoggedIn]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.some(t => t.name === tab)) {
      setCurrentTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabName: string) => {
    setCurrentTab(tabName);
  };

  // Handle image upload immediately when file is selected
  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    setSubmitMessage(null);

    try {
      console.log('Uploading image:', file.name);
      const imageResult = await updateUserImage(file);
      
      if (imageResult.success) {
        setSubmitMessage({ type: 'success', text: 'Cập nhật ảnh đại diện thành công!' });
        
        // Reset selected image sau khi upload thành công
        setSelectedImage(null);
        setSelectedImageFile(null);
        
        // Refresh dashboard data để hiển thị ảnh mới
        const refreshedData = await getDashboardData();
        if (refreshedData) {
          setDashboardData(refreshedData);
        }
      } else {
        setSubmitMessage({ type: 'error', text: `Upload ảnh thất bại: ${imageResult.message}` });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setSubmitMessage({ type: 'error', text: 'Có lỗi xảy ra khi upload ảnh' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle image change - now with immediate upload option
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setSubmitMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 2MB.' });
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setSubmitMessage({ type: 'error', text: 'Chỉ hỗ trợ file ảnh định dạng JPG, PNG, GIF.' });
        return;
      }

      // Store both file object and preview URL
      setSelectedImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
  };

  // Handle form submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Lấy dữ liệu từ form
      const profileData: UpdateProfileRequest = {
        username: formData.get('username') as string || '',
        fullname: formData.get('fullname') as string || '',
        email: formData.get('email') as string || '',
        phone: formData.get('phone') as string || '',
        birthdate: formData.get('birthdate') as string || '',
        address: formData.get('address') as string || '',
      };

      console.log('Submitting profile data:', profileData);

      // Cập nhật thông tin profile
      const profileResult = await updateProfile(profileData);

      if (!profileResult.success) {
        setSubmitMessage({ type: 'error', text: profileResult.message });
        setIsSubmitting(false);
        return;
      }

      // Hiển thị kết quả thành công
      setSubmitMessage({ 
        type: 'success', 
        text: profileResult.message || 'Cập nhật thông tin thành công!'
      });
      
      // Refresh dashboard data để đảm bảo sync
      const refreshedData = await getDashboardData();
      if (refreshedData) {
        setDashboardData(refreshedData);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật thông tin' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get safe image URL
  const getSafeImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl || imageUrl.trim() === '') return '/images/default-avatar.jpg';
    
    // If it's a data URL (base64), return as is
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    // If it's already a valid absolute URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    
    // If it starts with /, it's a relative path from backend - convert to full URL
    if (imageUrl.startsWith('/')) {
      return `http://localhost:5198${imageUrl}`;
    }
    
    // If it's just a filename without extension or path, add to images folder
    if (imageUrl && !imageUrl.includes('/') && !imageUrl.includes('.')) {
      return '/images/default-avatar.jpg'; // Return default for invalid filenames
    }
    
    // If it's just a filename with extension, prepend full backend URL
    if (imageUrl && !imageUrl.includes('/') && imageUrl.includes('.')) {
      return `http://localhost:5198/images/${imageUrl}`;
    }
    
    // Default fallback for any other case
    return '/images/default-avatar.jpg';
  };
  // Use data from API or fallback to auth user
  const user = dashboardData?.user || authUser;
  const testHistory = dashboardData?.testHistory || [];
  // const notifications = dashboardData?.notifications || [];
  // const stats = dashboardData?.stats || {
  //   totalTests: 0,
  //   completedTests: 0,
  //   pendingTests: 0,
  //   unreadNotifications: 0
  // };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Hồ sơ cá nhân</h1>
          
          <div className="mt-8 lg:flex lg:gap-x-6">
            {/* Sidebar */}
            <aside className="lg:w-64">
              <nav className="flex flex-col space-y-1 bg-white p-3 rounded-lg shadow">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => handleTabChange(tab.name)}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-md
                      ${currentTab === tab.name
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <tab.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span>{tab.name}</span>
                  </button>
                ))}
                
              </nav>
            </aside>

            {/* Main content */}
            <div className="mt-8 lg:mt-0 lg:flex-auto">
              <div className="bg-white shadow rounded-lg overflow-hidden">                {currentTab === 'Hồ sơ cá nhân' && (
                  <div className="p-6">                    {isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Đang tải thông tin từ API...</span>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                            <p className="text-red-700 mt-1">{error}</p>
                            <p className="text-red-600 text-xs mt-1">
                              API Endpoint: http://localhost:5198/api/User/me
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              setError('');
                              setIsLoading(true);
                              try {
                                const data = await getDashboardData();
                                if (data) {
                                  setDashboardData(data);
                                } else {
                                  setError('Không thể kết nối đến API server');
                                }
                              } catch (err) {
                                console.error('Retry error:', err);
                                setError('Lỗi kết nối API');
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                            className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded-md border border-red-300"
                          >
                            Thử lại
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 -m-6 mb-8 px-6 py-8">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold text-white">Thông tin cá nhân</h2>
                              <p className="text-blue-100 mt-1">Quản lý và cập nhật thông tin tài khoản của bạn</p>
                            </div>
                            <div className="hidden sm:block">
                              <div className="flex items-center space-x-2 text-blue-100">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Hồ sơ người dùng</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <form className="space-y-8" onSubmit={handleSubmit}>
                          {/* Success/Error Message */}
                          {submitMessage && (
                            <div className={`p-4 rounded-lg border ${
                              submitMessage.type === 'success' 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                              <div className="flex items-center">
                                {submitMessage.type === 'success' ? (
                                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                )}
                                <span className="font-medium">{submitMessage.text}</span>
                                <button
                                  type="button"
                                  onClick={() => setSubmitMessage(null)}
                                  className="ml-auto text-gray-400 hover:text-gray-600"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                          {/* Avatar Section - Enhanced */}
                          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Ảnh đại diện
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">Cập nhật ảnh đại diện của bạn</p>
                            </div>
                            <div className="p-6">
                              <div className="flex items-center space-x-8">
                                <div className="flex-shrink-0">
                                  <div className="relative group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      className="h-24 w-24 object-cover rounded-full ring-4 ring-gray-100 shadow-lg transition-all duration-200 group-hover:ring-blue-200"
                                      src={selectedImage || getSafeImageUrl(user?.image)}
                                      alt="Ảnh đại diện"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/default-avatar.jpg';
                                      }}
                                    />
                                    {selectedImage && (
                                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-4 mb-4">
                                    <label
                                      htmlFor="avatar-upload"
                                      className="cursor-pointer inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      Chọn ảnh
                                    </label>
                                    <input
                                      id="avatar-upload"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                      className="hidden"
                                    />
                                    {selectedImageFile && (
                                      <button
                                        type="button"
                                        onClick={() => handleImageUpload(selectedImageFile)}
                                        disabled={isUploadingImage}
                                        className={`inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white shadow-sm transition-colors ${
                                          isUploadingImage
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                        }`}
                                      >
                                        {isUploadingImage ? (
                                          <>
                                            <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Đang tải...
                                          </>
                                        ) : (
                                          <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            Cập nhật ảnh
                                          </>
                                        )}
                                      </button>
                                    )}
                                    {(selectedImage || user?.image) && (
                                      <button
                                        type="button"
                                        onClick={removeImage}
                                        className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                      >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Xóa ảnh
                                      </button>
                                    )}
                                  </div>
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-start">
                                      <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                      </svg>
                                      <div className="text-sm text-blue-800">
                                        <p className="font-medium mb-1">Yêu cầu ảnh:</p>
                                        <ul className="space-y-1 text-blue-700">
                                          <li>• Định dạng: JPG, PNG, GIF</li>
                                          <li>• Kích thước tối đa: 2MB</li>
                                          <li>• Khuyến nghị: 400x400px, tỷ lệ vuông</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Personal Information Section */}
                          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Thông tin cá nhân
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">Thông tin cơ bản về tài khoản của bạn</p>
                            </div>
                            <div className="p-6">
                              <div className="grid grid-cols-1 gap-y-6 gap-x-6 lg:grid-cols-2">
                                <div className="group">
                                  <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      Tên đăng nhập
                                    </span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="username"
                                      name="username"
                                      defaultValue={user?.username || ''}
                                      className="block w-full rounded-lg border-2 border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 transition-colors bg-gray-50"
                                      readOnly
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                    </div>
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">Tên đăng nhập không thể thay đổi</p>
                                </div>

                                <div className="group">
                                  <label htmlFor="fullname" className="block text-sm font-semibold text-gray-900 mb-2">
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      Họ và tên
                                    </span>
                                  </label>
                                  <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    defaultValue={user?.fullname || ''}
                                    className="block w-full rounded-lg border-2 border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 transition-colors"
                                    placeholder="Nhập họ và tên của bạn"
                                  />
                                </div>

                                <div className="group">
                                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                      </svg>
                                      Email
                                    </span>
                                  </label>
                                  <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    defaultValue={user?.email || ''}
                                    className="block w-full rounded-lg border-2 border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 transition-colors"
                                    placeholder="example@domain.com"
                                  />
                                </div>

                                <div className="group">
                                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      Số điện thoại
                                    </span>
                                  </label>
                                  <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    defaultValue={user?.phone || ''}
                                    className="block w-full rounded-lg border-2 border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 transition-colors"
                                    placeholder="0987 654 321"
                                  />
                                </div>

                                <div className="group">
                                  <label htmlFor="birthdate" className="block text-sm font-semibold text-gray-900 mb-2">
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      Ngày sinh
                                    </span>
                                  </label>
                                  <input
                                    type="date"
                                    id="birthdate"
                                    name="birthdate"
                                    defaultValue={user?.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : ''}
                                    className="block w-full rounded-lg border-2 border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 transition-colors"
                                  />
                                </div>

                                <div className="lg:col-span-2 group">
                                  <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      Địa chỉ
                                    </span>
                                  </label>
                                  <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    defaultValue={user?.address || ''}
                                    className="block w-full rounded-lg border-2 border-gray-200 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 transition-colors resize-none"
                                    placeholder="Nhập địa chỉ của bạn..."
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
                            <div className="flex items-center space-x-4">
                              <button
                                type="button"
                                className="px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                Hủy bỏ
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 text-sm font-semibold rounded-lg text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                                  isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                }`}
                              >
                                {isSubmitting ? (
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Đang lưu...
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Lưu thông tin
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                )}

                {currentTab === 'Đổi mật khẩu' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Đổi mật khẩu</h2>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <KeyIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Lưu ý bảo mật
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              Để đảm bảo an toàn tài khoản, hãy sử dụng mật khẩu mạnh có ít nhất 8 ký tự, 
                              bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form className="space-y-6">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-gray-900">
                          Mật khẩu hiện tại
                        </label>
                        <div className="mt-2">
                          <input
                            type="password"
                            id="current-password"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="Nhập mật khẩu hiện tại"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
                          Mật khẩu mới
                        </label>
                        <div className="mt-2">
                          <input
                            type="password"
                            id="new-password"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="Nhập mật khẩu mới"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.
                        </p>
                      </div>

                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="mt-2">
                          <input
                            type="password"
                            id="confirm-password"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="Nhập lại mật khẩu mới"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          Cập nhật mật khẩu
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {currentTab === 'Lịch sử xét nghiệm' && (
                  <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold text-gray-900 p-6 pb-0">Lịch sử xét nghiệm</h2>
                    
                    {/* Debug information */}
                    <div className="px-6 pb-4">
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Debug: API Status - 
                        User: {dashboardData?.user ? 'Loaded' : 'Failed'}, 
                        Tests: {testHistory.length} items,
                        Loading: {isLoading ? 'Yes' : 'No'},
                        Error: {error || 'None'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Đang tải...</span>
            </div>
          </div>
        </div>
      </MainLayout>
    }>
      <DashboardContent />
    </Suspense>
  );
}
