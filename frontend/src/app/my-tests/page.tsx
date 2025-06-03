'use client';

import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

// Mock data for test history
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
    participants: [
      { role: 'Cha giả định', name: 'Nguyễn Văn A', age: 45 },
      { role: 'Con', name: 'Nguyễn Văn B', age: 15 },
    ],
    timeline: [
      { status: 'Đã đặt xét nghiệm', date: '12/05/2025', description: 'Đơn hàng đã được tạo và thanh toán' },
      { status: 'Đã gửi kit thu mẫu', date: '13/05/2025', description: 'Kit thu mẫu đã được gửi đến địa chỉ của bạn' },
      { status: 'Đã nhận mẫu', date: '14/05/2025', description: 'Phòng xét nghiệm đã nhận được mẫu' },
      { status: 'Đang xét nghiệm', date: '14/05/2025', description: 'Mẫu đang được xét nghiệm' },
      { status: 'Đã hoàn thành', date: '15/05/2025', description: 'Kết quả xét nghiệm đã có' },
    ],
    result: {
      conclusion: 'Có quan hệ huyết thống',
      probability: '99.9999%',
      reportUrl: '/reports/TEST123.pdf',
    },
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
    participants: [
      { role: 'Cha giả định', name: 'Ẩn danh', age: 'Không cung cấp' },
      { role: 'Con', name: 'Ẩn danh', age: 'Không cung cấp' },
    ],
    timeline: [
      { status: 'Đã đặt xét nghiệm', date: '20/05/2025', description: 'Đơn hàng đã được tạo và thanh toán' },
      { status: 'Đã đặt lịch thu mẫu', date: '21/05/2025', description: 'Lịch hẹn thu mẫu đã được xác nhận: 22/05/2025, 10:00' },
      { status: 'Đã thu mẫu', date: '22/05/2025', description: 'Nhân viên đã thu mẫu thành công' },
      { status: 'Đang xét nghiệm', date: '22/05/2025', description: 'Mẫu đang được xét nghiệm' },
    ],
    result: null,
  },
];

export default function MyTestsPage() {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Xét nghiệm của tôi</h1>
            <Link
              href="/services"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Đặt xét nghiệm mới
            </Link>
          </div>

          <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {testHistory.map((test) => (
                <li key={test.id}>
                  <Link href={`/my-tests/${test.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="truncate text-sm font-medium text-blue-600">{test.id}</p>
                          <span
                            className={`ml-4 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              test.status === 'Đã hoàn thành'
                                ? 'bg-green-100 text-green-800'
                                : test.status === 'Đang xử lý'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {test.status}
                          </span>
                        </div>
                        <div className="ml-2 flex flex-shrink-0">
                          <p className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                            {test.amount}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {test.serviceType}
                            <span className="mx-1 text-gray-400">•</span>
                            {test.testType}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>{test.requestDate}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
