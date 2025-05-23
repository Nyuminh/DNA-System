'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  UserIcon, 
  ClipboardDocumentListIcon, 
  Cog6ToothIcon, 
  BellIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';

// Mocked user data
const user = {
  id: '1',
  firstName: 'Nguyễn',
  lastName: 'Văn A',
  email: 'nguyen.vana@example.com',
  phone: '0912345678',
  address: '123 Đường XYZ, Quận ABC, TP. HCM',
};

// Mocked test history
const testHistory = [
  {
    id: 'TEST123',
    serviceType: 'Xét nghiệm Huyết thống',
    testType: 'Xét nghiệm cha con',
    status: 'Đã hoàn thành',
    requestDate: '12/05/2025',
    completionDate: '15/05/2025',
    sampleMethod: 'Tự thu mẫu',
    amount: '4,000,000 VNĐ',
  },
  {
    id: 'TEST124',
    serviceType: 'Xét nghiệm ADN Dân sự',
    testType: 'Xét nghiệm cha con ẩn danh',
    status: 'Đang xử lý',
    requestDate: '20/05/2025',
    completionDate: '-',
    sampleMethod: 'Thu mẫu tận nơi',
    amount: '3,500,000 VNĐ',
  },
];

const tabs = [
  { name: 'Hồ sơ cá nhân', icon: UserIcon, current: true },
  { name: 'Lịch sử xét nghiệm', icon: ClipboardDocumentListIcon, current: false },
  { name: 'Cài đặt', icon: Cog6ToothIcon, current: false },
  { name: 'Thông báo', icon: BellIcon, current: false },
];

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState('Hồ sơ cá nhân');

  const handleTabChange = (tabName: string) => {
    setCurrentTab(tabName);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Tài khoản của tôi</h1>
          
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
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {currentTab === 'Hồ sơ cá nhân' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                            Họ
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              id="firstName"
                              defaultValue={user.firstName}
                              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                            Tên
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              id="lastName"
                              defaultValue={user.lastName}
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
                              defaultValue={user.email}
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
                              defaultValue={user.phone}
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
                              defaultValue={user.address}
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

                    <div className="mt-10 border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900">Đổi mật khẩu</h3>
                      <form className="mt-4 space-y-6">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-gray-900">
                            Mật khẩu hiện tại
                          </label>
                          <div className="mt-2">
                            <input
                              type="password"
                              id="current-password"
                              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                            />
                          </div>
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
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          >
                            Cập nhật mật khẩu
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {currentTab === 'Lịch sử xét nghiệm' && (
                  <div className="overflow-x-auto">
                    <h2 className="text-xl font-semibold text-gray-900 p-6 pb-0">Lịch sử xét nghiệm</h2>
                    <div className="p-6">
                      <Link
                        href="/services"
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                      >
                        Đặt xét nghiệm mới
                      </Link>
                    </div>
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
                                >
                                  Xem kết quả
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
