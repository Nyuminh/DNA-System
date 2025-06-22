"use client";

import { useState, useEffect } from 'react';
import {
  BeakerIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface TestResult {
  id: string;
  testId: string;
  kitId: string;
  customerName: string;
  customerId: string;
  testType: string;
  status: 'pending' | 'in-progress' | 'completed' | 'reviewed';
  submittedDate: string;
  completedDate?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: string;
  results?: {
    conclusion: string;
    details: string;
    confidence: number;
  };
}

export default function TestResultManagement() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      // Mock data - replace with actual API call
      const mockResults: TestResult[] = [
        {
          id: '1',
          testId: 'TEST001',
          kitId: 'KIT002',
          customerName: 'Nguyễn Văn A',
          customerId: 'CUST001',
          testType: 'Xét nghiệm huyết thống cha con',
          status: 'pending',
          submittedDate: '2024-01-20',
          priority: 'high',
          assignedTo: 'staff'
        },
        {
          id: '2',
          testId: 'TEST002',
          kitId: 'KIT005',
          customerName: 'Trần Thị B',
          customerId: 'CUST002',
          testType: 'Xét nghiệm tổ tiên',
          status: 'in-progress',
          submittedDate: '2024-01-18',
          priority: 'normal',
          assignedTo: 'staff'
        },
        {
          id: '3',
          testId: 'TEST003',
          kitId: 'KIT003',
          customerName: 'Lê Văn C',
          customerId: 'CUST003',
          testType: 'Xét nghiệm sức khỏe',
          status: 'completed',
          submittedDate: '2024-01-15',
          completedDate: '2024-01-22',
          priority: 'normal',
          assignedTo: 'staff',
          results: {
            conclusion: 'Không phát hiện bất thường',
            details: 'Tất cả các chỉ số đều trong giới hạn bình thường',
            confidence: 99.5
          }
        },
        {
          id: '4',
          testId: 'TEST004',
          kitId: 'KIT007',
          customerName: 'Phạm Thị D',
          customerId: 'CUST004',
          testType: 'Xét nghiệm huyết thống cha con',
          status: 'reviewed',
          submittedDate: '2024-01-12',
          completedDate: '2024-01-19',
          priority: 'urgent',
          assignedTo: 'staff',
          results: {
            conclusion: 'Xác nhận mối quan hệ huyết thống',
            details: 'Khả năng là cha ruột: 99.99%',
            confidence: 99.99
          }
        }
      ];
      
      setTestResults(mockResults);
    } catch (error) {
      console.error('Error fetching test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-orange-500" />;
      case 'in-progress':
        return <BeakerIcon className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'reviewed':
        return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'in-progress':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'reviewed':
        return 'Đã duyệt';
      default:
        return '';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'reviewed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TestResult['priority']) => {
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

  const getPriorityText = (priority: TestResult['priority']) => {
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

  const filteredResults = testResults.filter(result => {
    const matchesSearch = 
      result.testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || result.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: testResults.length,
    pending: testResults.filter(r => r.status === 'pending').length,
    inProgress: testResults.filter(r => r.status === 'in-progress').length,
    completed: testResults.filter(r => r.status === 'completed').length,
    reviewed: testResults.filter(r => r.status === 'reviewed').length
  };

  const handleViewResult = (result: TestResult) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

  const handleEditResult = (result: TestResult) => {
    // Navigate to edit page or open edit modal
    console.log('Edit result:', result);
  };

  const updateResultStatus = async (resultId: string, newStatus: TestResult['status']) => {
    try {
      // Mock API call
      setTestResults(prev => 
        prev.map(result => 
          result.id === resultId 
            ? { ...result, status: newStatus, completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : result.completedDate }
            : result
        )
      );
    } catch (error) {
      console.error('Error updating result status:', error);
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
          <h1 className="text-2xl font-bold text-slate-900">Quản lý kết quả xét nghiệm</h1>
          <p className="text-slate-600">Nhập và quản lý kết quả xét nghiệm cho khách hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-500">Tổng số test</div>
            </div>
            <BeakerIcon className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-sm text-slate-500">Chờ xử lý</div>
            </div>
            <ClockIcon className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-slate-500">Đang xử lý</div>
            </div>
            <BeakerIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-slate-500">Hoàn thành</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.reviewed}</div>
              <div className="text-sm text-slate-500">Đã duyệt</div>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-purple-400" />
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
              placeholder="Tìm kiếm test..."
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="in-progress">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="reviewed">Đã duyệt</option>
              </select>
            </div>

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

      {/* Results List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Test ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Loại xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Mức độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày nộp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BeakerIcon className="h-5 w-5 text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">{result.testId}</div>
                        <div className="text-sm text-slate-500">Kit: {result.kitId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{result.customerName}</div>
                    <div className="text-sm text-slate-500">{result.customerId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{result.testType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                        {getStatusText(result.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(result.priority)}`}>
                      {getPriorityText(result.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(result.submittedDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewResult(result)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditResult(result)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {result.status === 'pending' && (
                        <button
                          onClick={() => updateResultStatus(result.id, 'in-progress')}
                          className="text-orange-600 hover:text-orange-900 text-xs"
                        >
                          Bắt đầu
                        </button>
                      )}
                      {result.status === 'in-progress' && (
                        <button
                          onClick={() => updateResultStatus(result.id, 'completed')}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <BeakerIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">Không có kết quả nào</h3>
            <p className="mt-1 text-sm text-slate-500">
              Không tìm thấy kết quả xét nghiệm nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        )}
      </div>

      {/* Result Detail Modal */}
      {showResultModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Chi tiết kết quả - {selectedResult.testId}
                </h3>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Khách hàng</label>
                    <p className="text-slate-900">{selectedResult.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Loại xét nghiệm</label>
                    <p className="text-slate-900">{selectedResult.testType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedResult.status)}`}>
                      {getStatusText(selectedResult.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Mức độ ưu tiên</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedResult.priority)}`}>
                      {getPriorityText(selectedResult.priority)}
                    </span>
                  </div>
                </div>

                {selectedResult.results && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-slate-900 mb-2">Kết quả xét nghiệm</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Kết luận</label>
                        <p className="text-slate-900">{selectedResult.results.conclusion}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Chi tiết</label>
                        <p className="text-slate-900">{selectedResult.results.details}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Độ tin cậy</label>
                        <p className="text-slate-900">{selectedResult.results.confidence}%</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => handleEditResult(selectedResult)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
