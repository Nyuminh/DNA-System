'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  CalendarIcon, 
  ClockIcon, 
  DocumentTextIcon,
  PowerIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

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
  {
    id: 'TEST125',
    serviceType: 'Xét nghiệm ADN Dân sự',
    testType: 'Xét nghiệm anh em ruột',
    status: 'Chờ thu mẫu',
    requestDate: '25/05/2025',
    completionDate: '-',
    sampleMethod: 'Thu mẫu tại trung tâm',
    amount: '3,200,000 VNĐ',
    participants: [
      { role: 'Anh', name: 'Trần Minh C', age: 28 },
      { role: 'Em', name: 'Trần Minh D', age: 25 },
    ],
    timeline: [
      { status: 'Đã đặt xét nghiệm', date: '25/05/2025', description: 'Đơn hàng đã được tạo và thanh toán' },
      { status: 'Chờ thu mẫu', date: '25/05/2025', description: 'Vui lòng đến trung tâm để thu mẫu theo lịch hẹn' },
    ],
    result: null,
  },
];

export default function MyTestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = () => {
    // Clear user session/token here
    localStorage.removeItem('userToken');
    sessionStorage.clear();
    router.push('/');
  };

  const filteredTests = testHistory.filter(test => {
    const matchesSearch = test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'Tất cả' || test.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'Đang xử lý':
      case 'Đang xét nghiệm':
        return 'bg-yellow-100 text-yellow-800';
      case 'Chờ thu mẫu':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Header with Logout Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lịch sử xét nghiệm</h1>
              <p className="mt-2 text-gray-600">Quản lý và theo dõi tất cả các xét nghiệm của bạn</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/services"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Đặt xét nghiệm mới
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              >
                <PowerIcon className="h-4 w-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Tổng xét nghiệm</dt>
                      <dd className="text-lg font-medium text-gray-900">{testHistory.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Đang xử lý</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {testHistory.filter(test => test.status === 'Đang xử lý' || test.status === 'Chờ thu mẫu').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Đã hoàn thành</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {testHistory.filter(test => test.status === 'Đã hoàn thành').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Tháng này</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {testHistory.filter(test => test.requestDate.includes('05/2025')).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã xét nghiệm, loại xét nghiệm..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Bộ lọc
                  <ChevronDownIcon className="h-5 w-5 ml-2" />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      {['Tất cả', 'Đã hoàn thành', 'Đang xử lý', 'Chờ thu mẫu'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status);
                            setShowFilters(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            filterStatus === status ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test History List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <li key={test.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600">{test.id}</p>
                            <span className={`ml-3 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {test.serviceType} • {test.testType}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{test.amount}</p>
                          <p className="text-sm text-gray-500">
                            <CalendarIcon className="inline h-4 w-4 mr-1" />
                            {test.requestDate}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link
                            href={`/my-tests/${test.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Xem chi tiết
                          </Link>
                          
                          {test.result && (
                            <button className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100">
                              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                              Tải báo cáo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Test Details */}
                    <div className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Phương thức thu mẫu:</span>
                          <p className="text-gray-900">{test.sampleMethod}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Người tham gia:</span>
                          <p className="text-gray-900">{test.participants.length} người</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Ngày hoàn thành:</span>
                          <p className="text-gray-900">{test.completionDate}</p>
                        </div>
                      </div>
                      
                      {test.result && (
                        <div className="mt-3 p-3 bg-green-50 rounded-md">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800">
                              Kết quả: {test.result.conclusion} ({test.result.probability})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {filteredTests.length === 0 && (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy xét nghiệm</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'Tất cả' 
                    ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                    : 'Bạn chưa có xét nghiệm nào. Hãy đặt xét nghiệm đầu tiên!'
                  }
                </p>
                {(!searchTerm && filterStatus === 'Tất cả') && (
                  <div className="mt-6">
                    <Link
                      href="/services"
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      Đặt xét nghiệm ngay
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
