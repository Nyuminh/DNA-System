'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  UserIcon, 
  ArrowRightStartOnRectangleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardData, type DashboardData } from '@/lib/api/auth';

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
                <button
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <ArrowRightStartOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>Đăng xuất</span>
                </button>
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
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>
                        <form className="space-y-6">
                          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                            <div>
                              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Tên đăng nhập
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="username"
                                  defaultValue={user?.username || ''}
                                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900">
                                Họ và tên
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="fullname"
                                  defaultValue={user?.fullname || ''}
                                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                                  defaultValue={user?.email || ''}
                                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                Số điện thoại
                              </label>
                              <div className="mt-2">
                                <input
                                  type="tel"
                                  id="phone"
                                  defaultValue={user?.phone || ''}
                                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                Địa chỉ
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="address"
                                  defaultValue={user?.address || ''}
                                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                              Lưu thay đổi
                            </button>
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
