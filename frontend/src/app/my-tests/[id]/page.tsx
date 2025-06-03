'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';

// Mock data for test history, we would normally fetch this from an API
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

export default function TestDetailPage() {
  const params = useParams();
  const testId = params?.id as string;
  
  // Find the test with the matching ID
  const test = testHistory.find((t) => t.id === testId);
  
  if (!test) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Không tìm thấy xét nghiệm</h1>
            <p className="mt-2 text-lg text-gray-600">Không tìm thấy xét nghiệm với mã {testId}</p>
            <div className="mt-6">
              <Link
                href="/my-tests"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <Link href="/my-tests" className="text-blue-600 font-medium hover:text-blue-800">
              ← Quay lại danh sách
            </Link>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Chi tiết xét nghiệm</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Mã xét nghiệm: {test.id}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
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
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Loại dịch vụ</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{test.serviceType}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Loại xét nghiệm</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{test.testType}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phương thức thu mẫu</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{test.sampleMethod}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Ngày yêu cầu</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{test.requestDate}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Ngày hoàn thành</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{test.completionDate}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Thành tiền</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{test.amount}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Người tham gia</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {test.participants.map((participant, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tuổi: {participant.age}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Tiến trình xét nghiệm</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {test.timeline.map((event, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-start">
                      <div className={`
                        flex-shrink-0 h-5 w-5 rounded-full mt-1
                        ${index === test.timeline.length - 1 ? 'bg-green-500' : 'bg-gray-200'}
                      `}></div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{event.status}</p>
                          <p className="text-sm text-gray-500">{event.date}</p>
                        </div>
                        <p className="text-sm text-gray-500">{event.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {test.status === 'Đã hoàn thành' && test.result && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Kết quả xét nghiệm</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-lg text-green-700 font-semibold">
                        Kết luận: {test.result.conclusion}
                      </p>
                      <p className="text-green-700">
                        Xác suất: {test.result.probability}
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  Bạn có thể tải xuống báo cáo đầy đủ bằng cách nhấp vào nút bên dưới.
                </p>
                
                <div className="mt-4">
                  <Link
                    href={test.result.reportUrl}
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    target="_blank"
                  >
                    Tải báo cáo PDF
                  </Link>
                </div>
              </div>
            </div>
          )}

          {test.status === 'Đã hoàn thành' && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Đánh giá dịch vụ</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Hãy chia sẻ ý kiến của bạn về dịch vụ xét nghiệm ADN của chúng tôi
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 mr-4">Đánh giá:</p>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.45 4.73-1.64 7.03z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                      Phản hồi của bạn
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="feedback"
                        name="feedback"
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Chia sẻ trải nghiệm của bạn với dịch vụ của chúng tôi"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Link
              href="/my-tests"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Quay lại
            </Link>
            
            {test.status === 'Đã hoàn thành' && (
              <Link
                href={`/my-tests/${test.id}/result`}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Xem kết quả chi tiết
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
