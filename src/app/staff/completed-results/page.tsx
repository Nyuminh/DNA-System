"use client";

import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface CompletedResult {
  id: string;
  testId: string;
  kitId: string;
  customerName: string;
  customerId: string;
  testType: string;
  submittedDate: string;
  completedDate: string;
  assignedTo: string;
  results: {
    conclusion: string;
    details: string;
    confidence: number;
  };
  sentToCustomer: boolean;
  customerNotified: boolean;
}

export default function CompletedResults() {
  const [completedResults, setCompletedResults] = useState<CompletedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [notificationFilter, setNotificationFilter] = useState<string>('all');

  useEffect(() => {
    fetchCompletedResults();
  }, []);

  const fetchCompletedResults = async () => {
    try {
      // Mock data - replace with actual API call
      const mockResults: CompletedResult[] = [
        {
          id: '1',
          testId: 'TEST003',
          kitId: 'KIT003',
          customerName: 'Lê Văn C',
          customerId: 'CUST003',
          testType: 'Xét nghiệm sức khỏe',
          submittedDate: '2024-01-15',
          completedDate: '2024-01-22',
          assignedTo: 'staff',
          results: {
            conclusion: 'Không phát hiện bất thường',
            details: 'Tất cả các chỉ số đều trong giới hạn bình thường',
            confidence: 99.5
          },
          sentToCustomer: true,
          customerNotified: true
        },
        {
          id: '2',
          testId: 'TEST004',
          kitId: 'KIT007',
          customerName: 'Phạm Thị D',
          customerId: 'CUST004',
          testType: 'Xét nghiệm huyết thống cha con',
          submittedDate: '2024-01-12',
          completedDate: '2024-01-19',
          assignedTo: 'staff',
          results: {
            conclusion: 'Xác nhận mối quan hệ huyết thống',
            details: 'Khả năng là cha ruột: 99.99%',
            confidence: 99.99
          },
          sentToCustomer: true,
          customerNotified: true
        },
        {
          id: '3',
          testId: 'TEST007',
          kitId: 'KIT010',
          customerName: 'Vũ Thị G',
          customerId: 'CUST007',
          testType: 'Xét nghiệm tổ tiên',
          submittedDate: '2024-01-14',
          completedDate: '2024-01-21',
          assignedTo: 'staff',
          results: {
            conclusion: 'Phân tích tổ tiên hoàn tất',
            details: 'Nguồn gốc: 60% Đông Á, 25% Đông Nam Á, 15% khác',
            confidence: 95.8
          },
          sentToCustomer: false,
          customerNotified: false
        }
      ];
      
      setCompletedResults(mockResults);
    } catch (error) {
      console.error('Error fetching completed results:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = completedResults.filter(result => {
    const matchesSearch = 
      result.testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const resultDate = new Date(result.completedDate);
      const today = new Date();
      switch (dateFilter) {
        case 'today':
          matchesDate = resultDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = resultDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = resultDate >= monthAgo;
          break;
      }
    }

    let matchesNotification = true;
    if (notificationFilter !== 'all') {
      matchesNotification = notificationFilter === 'sent' ? result.sentToCustomer : !result.sentToCustomer;
    }
    
    return matchesSearch && matchesDate && matchesNotification;
  });

  const sendToCustomer = async (resultId: string) => {
    try {
      // Mock API call to send result to customer
      setCompletedResults(prev => 
        prev.map(result => 
          result.id === resultId 
            ? { ...result, sentToCustomer: true, customerNotified: true }
            : result
        )
      );
      alert('Kết quả đã được gửi tới khách hàng!');
    } catch (error) {
      console.error('Error sending result to customer:', error);
      alert('Có lỗi xảy ra khi gửi kết quả!');
    }
  };

  const stats = {
    total: completedResults.length,
    sent: completedResults.filter(r => r.sentToCustomer).length,
    pending: completedResults.filter(r => !r.sentToCustomer).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kết quả hoàn thành</h1>
          <p className="text-slate-600">Danh sách các kết quả xét nghiệm đã hoàn thành</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-500">Tổng hoàn thành</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
              <div className="text-sm text-slate-500">Đã gửi khách hàng</div>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-sm text-slate-500">Chờ gửi</div>
            </div>
            <CalendarIcon className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm kết quả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>

            <select
              value={notificationFilter}
              onChange={(e) => setNotificationFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="sent">Đã gửi khách hàng</option>
              <option value="pending">Chờ gửi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResults.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{result.testId}</h3>
                  <p className="text-sm text-slate-500">Kit: {result.kitId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {result.sentToCustomer ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Đã gửi
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    Chờ gửi
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm font-medium text-slate-700">Khách hàng</p>
                <p className="text-slate-900">{result.customerName}</p>
                <p className="text-sm text-slate-500">{result.customerId}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">Loại xét nghiệm</p>
                <p className="text-slate-900">{result.testType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Ngày nộp</p>
                  <p className="text-slate-900">{new Date(result.submittedDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Ngày hoàn thành</p>
                  <p className="text-slate-900">{new Date(result.completedDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">Kết luận</p>
                <p className="text-slate-900 text-sm">{result.results.conclusion}</p>
                <p className="text-xs text-slate-500 mt-1">Độ tin cậy: {result.results.confidence}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm">
                <EyeIcon className="h-4 w-4" />
                <span>Xem chi tiết</span>
              </button>
              
              {!result.sentToCustomer && (
                <button
                  onClick={() => sendToCustomer(result.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Gửi khách hàng</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">Không có kết quả hoàn thành</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchTerm || dateFilter !== 'all' || notificationFilter !== 'all'
              ? 'Không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại.'
              : 'Chưa có kết quả xét nghiệm nào hoàn thành.'}
          </p>
        </div>
      )}

      {/* Summary Report */}
      {filteredResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Báo cáo tổng hợp</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{filteredResults.length}</div>
              <div className="text-sm text-slate-500">Kết quả hiển thị</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(filteredResults.reduce((sum, r) => sum + r.results.confidence, 0) / filteredResults.length).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-500">Độ tin cậy trung bình</div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredResults.filter(r => r.sentToCustomer).length}
              </div>
              <div className="text-sm text-slate-500">Đã gửi khách hàng</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {filteredResults.filter(r => !r.sentToCustomer).length}
              </div>
              <div className="text-sm text-slate-500">Chờ gửi khách hàng</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
