'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  UserIcon, 
  ClipboardDocumentListIcon, 
  Cog6ToothIcon, 
  BellIcon,
  ArrowRightStartOnRectangleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardData, testApiConnection, type DashboardData } from '@/lib/api/auth';

const tabs = [
  { name: 'Hồ sơ cá nhân', icon: UserIcon, current: true },
  { name: 'Lịch sử xét nghiệm', icon: ClipboardDocumentListIcon, current: false },
  { name: 'Đổi mật khẩu', icon: KeyIcon, current: false },
  { name: 'Cài đặt', icon: Cog6ToothIcon, current: false },
  { name: 'Thông báo', icon: BellIcon, current: false },
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
      <div className="bg-gray-50 min-h-screen">        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
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
                )}                {currentTab === 'Lịch sử xét nghiệm' && (
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
                      <div className="p-6">
                      <div className="flex justify-between items-center">
                        <Link
                          href="/services"
                          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                          Đặt xét nghiệm mới
                        </Link>
                          <button
                          onClick={async () => {
                            const result = await testApiConnection();
                            alert(`API Test: ${result.success ? 'SUCCESS' : 'FAILED'}\n${result.message}\nData: ${JSON.stringify(result.data, null, 2)}`);
                          }}
                          className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 ml-2"
                        >
                          Test API
                        </button>
                        
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
                              console.error('Manual refresh error:', err);
                              setError('Lỗi kết nối API');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 ml-2"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Đang tải...' : 'Làm mới API'}
                        </button>
                      </div>
                    </div>
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Đang tải lịch sử xét nghiệm từ API...</span>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-red-800">Lỗi API</h3>
                            <p className="text-red-700 mt-1">{error}</p>
                            <p className="text-red-600 text-xs mt-1">
                              Endpoints: /api/User/tests, /api/User/notifications
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : testHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có xét nghiệm nào</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {dashboardData ? 'API đã kết nối thành công nhưng chưa có dữ liệu xét nghiệm.' : 'Đang sử dụng dữ liệu mẫu.'}
                        </p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mã đơn
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Loại dịch vụ
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phương thức thu mẫu
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ngày yêu cầu
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thành tiền
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {testHistory.map((test) => (
                            <tr key={test.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>{test.serviceType}</div>
                              <div className="text-xs text-gray-400">{test.testType}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.sampleMethod}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.requestDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`
                                  inline-flex rounded-full px-2 text-xs font-semibold leading-5
                                  ${
                                    test.status === 'Đã hoàn thành'
                                      ? 'bg-green-100 text-green-800'
                                      : test.status === 'Đang xử lý'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }
                                `}
                              >
                                {test.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Link
                                href={`/my-tests/${test.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Xem chi tiết
                              </Link>
                              {test.status === 'Đã hoàn thành' && (
                                <Link
                                  href={`/my-tests/${test.id}/result`}
                                  className="ml-3 text-blue-600 hover:text-blue-900"
                                >                                  Xem kết quả
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    )}
                  </div>
                )}

                {currentTab === 'Cài đặt' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Cài đặt tài khoản</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Thông báo</h3>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="email-notifications"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="email-notifications" className="font-medium text-gray-700">
                                Nhận thông báo qua email
                              </label>
                              <p className="text-gray-500">Nhận thông báo về trạng thái xét nghiệm, kết quả, và cập nhật dịch vụ.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="sms-notifications"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="sms-notifications" className="font-medium text-gray-700">
                                Nhận thông báo qua SMS
                              </label>
                              <p className="text-gray-500">Nhận tin nhắn SMS về lịch hẹn và trạng thái xét nghiệm.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="marketing-notifications"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="marketing-notifications" className="font-medium text-gray-700">
                                Thông tin khuyến mãi
                              </label>
                              <p className="text-gray-500">Nhận thông tin về khuyến mãi, dịch vụ mới, và sự kiện.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900">Ngôn ngữ và khu vực</h3>
                        <div className="mt-4 max-w-md">
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Ngôn ngữ
                          </label>
                          <select
                            id="language"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            defaultValue="vi"
                          >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          Lưu cài đặt
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === 'Thông báo' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông báo</h2>
                    
                    <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
                      <ul role="list" className="divide-y divide-gray-200">
                        <li className="p-4 bg-blue-50">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Kết quả xét nghiệm mã TEST123 đã có
                              </p>
                              <p className="text-sm text-gray-500">
                                Kết quả xét nghiệm Huyết thống của bạn đã hoàn thành. Vui lòng đăng nhập vào tài khoản để xem kết quả.
                              </p>
                              <p className="mt-1 text-xs text-gray-400">15/05/2025</p>
                            </div>
                            <div>
                              <Link
                                href="/my-tests/TEST123/result"
                                className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white"
                              >
                                Xem kết quả
                              </Link>
                            </div>
                          </div>
                        </li>
                        <li className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Đơn hàng TEST124 đã được ghi nhận
                              </p>
                              <p className="text-sm text-gray-500">
                                Đơn đặt hàng xét nghiệm ADN Dân sự của bạn đã được ghi nhận và đang được xử lý.
                              </p>
                              <p className="mt-1 text-xs text-gray-400">20/05/2025</p>
                            </div>
                            <div>
                              <Link
                                href="/my-tests/TEST124"
                                className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700"
                              >
                                Xem chi tiết
                              </Link>
                            </div>
                          </div>
                        </li>
                        <li className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Chương trình khuyến mãi tháng 5
                              </p>
                              <p className="text-sm text-gray-500">
                                Giảm 10% cho tất cả các dịch vụ xét nghiệm ADN từ ngày 01/05 đến 31/05/2025.
                              </p>
                              <p className="mt-1 text-xs text-gray-400">01/05/2025</p>
                            </div>
                            <div>
                              <Link
                                href="/services"
                                className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700"
                              >
                                Xem dịch vụ
                              </Link>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>        </div>
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
