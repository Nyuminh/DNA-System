"use client";

import { useState, useEffect } from 'react';
import {
  ClockIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface PendingResult {
  id: string;
  testId: string;
  kitId: string;
  customerName: string;
  customerId: string;
  testType: string;
  submittedDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: string;
}

export default function PendingResults() {
  const [pendingResults, setPendingResults] = useState<PendingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchPendingResults();
  }, []);

  const fetchPendingResults = async () => {
    try {
      // Mock data - replace with actual API call
      const mockResults: PendingResult[] = [
        {
          id: '1',
          testId: 'TEST001',
          kitId: 'KIT002',
          customerName: 'Nguyễn Văn A',
          customerId: 'CUST001',
          testType: 'Xét nghiệm huyết thống cha con',
          submittedDate: '2024-01-20',
          priority: 'high',
          assignedTo: 'staff'
        },
        {
          id: '2',
          testId: 'TEST005',
          kitId: 'KIT008',
          customerName: 'Hoàng Thị E',
          customerId: 'CUST005',
          testType: 'Xét nghiệm tổ tiên',
          submittedDate: '2024-01-21',
          priority: 'urgent',
          notes: 'Khách hàng yêu cầu gấp'
        },
        {
          id: '3',
          testId: 'TEST006',
          kitId: 'KIT009',
          customerName: 'Đỗ Văn F',
          customerId: 'CUST006',
          testType: 'Xét nghiệm sức khỏe',
          submittedDate: '2024-01-19',
          priority: 'normal'
        }
      ];
      
      setPendingResults(mockResults);
    } catch (error) {
      console.error('Error fetching pending results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: PendingResult['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-slate-100 text-slate-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: PendingResult['priority']) => {
    switch (priority) {
      case 'low':
        return 'Thấp';
      case 'normal':
        return 'Bình thường';
      case 'high':
        return 'Cao';
      case 'urgent':
        return 'Khẩn cấp';
      default:
        return '';
    }
  };

  const filteredResults = pendingResults.filter(result => {
    const matchesSearch = 
      result.testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || result.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  const startProcessing = async (resultId: string) => {
    try {
      // Mock API call to start processing
      console.log('Starting processing for result:', resultId);
      // Remove from pending list
      setPendingResults(prev => prev.filter(result => result.id !== resultId));
      // Show success message
      alert('Đã bắt đầu xử lý kết quả!');
    } catch (error) {
      console.error('Error starting processing:', error);
      alert('Có lỗi xảy ra khi bắt đầu xử lý!');
    }
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
          <h1 className="text-2xl font-bold text-slate-900">Kết quả chờ xử lý</h1>
          <p className="text-slate-600">Danh sách các kết quả xét nghiệm đang chờ được xử lý</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-orange-100 rounded-lg">
          <ClockIcon className="h-5 w-5 text-orange-600" />
          <span className="text-orange-800 font-medium">{pendingResults.length} kết quả chờ xử lý</span>
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
              placeholder="Tìm kiếm test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Cao</option>
                <option value="normal">Bình thường</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BeakerIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{result.testId}</h3>
                  <p className="text-sm text-slate-500">Kit: {result.kitId}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(result.priority)}`}>
                {getPriorityText(result.priority)}
              </span>
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

              <div>
                <p className="text-sm font-medium text-slate-700">Ngày nộp</p>
                <p className="text-slate-900">{new Date(result.submittedDate).toLocaleDateString('vi-VN')}</p>
              </div>

              {result.notes && (
                <div>
                  <p className="text-sm font-medium text-slate-700">Ghi chú</p>
                  <p className="text-sm text-orange-600">{result.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm">
                  <EyeIcon className="h-4 w-4" />
                  <span>Xem chi tiết</span>
                </button>
              </div>
              <button
                onClick={() => startProcessing(result.id)}
                className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Bắt đầu xử lý</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <ClockIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">Không có kết quả chờ xử lý</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchTerm || priorityFilter !== 'all' 
              ? 'Không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại.'
              : 'Tất cả kết quả đã được xử lý.'}
          </p>
        </div>
      )}

      {/* Quick Actions */}
      {filteredResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
              <ClockIcon className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Xử lý tất cả khẩn cấp</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              <BeakerIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Xem hướng dẫn xử lý</span>
            </button>
            
            <button className="flex items-center justify-center space-x-2 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <PencilIcon className="h-5 w-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Tạo báo cáo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
