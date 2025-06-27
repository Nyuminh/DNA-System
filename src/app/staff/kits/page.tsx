"use client";

import { useState, useEffect } from 'react';
import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { kitApi, Kit } from '@/lib/api/staff';

interface NewKitForm {
  customerID: string;
  staffID: string;
  bookingId: string;
  description: string;
  status: 'available' | 'in-use' | 'completed' | 'expired';
  receivedate: string;
}

export default function KitManagement() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<NewKitForm>({
    customerID: '',
    staffID: '',
    bookingId: '',
    description: '',
    status: 'available',
    receivedate: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingStatus, setEditingStatus] = useState<{kitID: string, currentStatus: Kit['status']} | null>(null);

  useEffect(() => {
    fetchKits();
  }, []);  const fetchKits = async () => {
    console.log('🔄 Starting to fetch kits...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Calling kitApi.getAllKits()...');
      const kitsData = await kitApi.getAllKits();
      console.log('✅ Received kits data:', kitsData);
      console.log('📊 Number of kits:', kitsData.length);
      
      setKits(kitsData);
      
      if (kitsData.length === 0) {
        console.log('⚠️ No kits found in the response');
      } else {
        console.log('🎉 Successfully loaded', kitsData.length, 'kits');
      }
    } catch (error) {
      console.error('❌ Error in fetchKits:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách kit. Vui lòng thử lại.';
      setError(errorMessage);
      setKits([]); // Clear any existing data
    } finally {
      setLoading(false);
      console.log('🏁 fetchKits completed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.customerID.trim()) {
      errors.customerID = 'Customer ID là bắt buộc';
    }
    
    if (!formData.staffID.trim()) {
      errors.staffID = 'Staff ID là bắt buộc';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Mô tả là bắt buộc';
    }
    
    if (!formData.receivedate) {
      errors.receivedate = 'Ngày nhận là bắt buộc';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log('🚀 Creating new kit:', formData);
      // Create kit data without kitID - let backend auto-generate it
      const kitDataToCreate = {
        ...formData,
        // Backend will auto-generate kitID
      };
      
      await kitApi.createKit(kitDataToCreate);
      
      // Reset form and refresh list
      setFormData({
        customerID: '',
        staffID: '',
        bookingId: '',
        description: '',
        status: 'available',
        receivedate: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
      await fetchKits(); // Refresh the list
      
      console.log('✅ Kit created successfully');
    } catch (error) {
      console.error('❌ Error creating kit:', error);
      setError('Không thể tạo kit mới. Vui lòng thử lại.');
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setFormData({
      customerID: '',
      staffID: '',
      bookingId: '',
      description: '',
      status: 'available',
      receivedate: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
  };

  const handleUpdateStatus = async (kitID: string, newStatus: Kit['status']) => {
    try {
      console.log(`🔄 Updating status for kit ${kitID} to ${newStatus}`);
      
      // Find the kit object from current state
      const kitToUpdate = kits.find(kit => kit.kitID === kitID);
      if (!kitToUpdate) {
        throw new Error(`Kit with ID ${kitID} not found in current state`);
      }
      
      // Create updated kit object
      const updatedKit = { ...kitToUpdate, status: newStatus };
      
      await kitApi.updateKitStatus(updatedKit);
      
      // Update local state
      setKits(prev => prev.map(kit => 
        kit.kitID === kitID ? { ...kit, status: newStatus } : kit
      ));
      
      setEditingStatus(null);
      console.log('✅ Kit status updated successfully');
    } catch (error) {
      console.error('❌ Error updating kit status:', error);
      setError('Không thể cập nhật trạng thái kit. Vui lòng thử lại.');
    }
  };
  const getStatusIcon = (status: Kit['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in-use':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-purple-500" />;
      case 'expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Kit['status']) => {
    switch (status) {
      case 'available':
        return 'Đã vận chuyển';
      case 'in-use':
        return 'Đang vận chuyển';
      case 'completed':
        return 'Đã lấy mẫu';
      case 'expired':
        return 'Đã tới kho';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: Kit['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };  const filteredKits = kits.filter(kit => {
    const matchesSearch = kit.kitID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (kit.description && kit.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.customerID && kit.customerID.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.staffID && kit.staffID.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.bookingId && kit.bookingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.customerName && kit.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.staffName && kit.staffName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || kit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: kits.length,
    available: kits.filter(k => k.status === 'available').length,
    inUse: kits.filter(k => k.status === 'in-use').length,
    completed: kits.filter(k => k.status === 'completed').length,
    expired: kits.filter(k => k.status === 'expired').length
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Có lỗi xảy ra</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => fetchKits()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Kit xét nghiệm</h1>
          <p className="text-slate-600">Quản lý tất cả kit xét nghiệm trong hệ thống</p>
        </div>        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm Kit</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-500">Tổng số kit</div>
            </div>
            <CubeIcon className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-slate-500">Đã vận chuyển</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.inUse}</div>
              <div className="text-sm text-slate-500">Đang vận chuyển</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
              <div className="text-sm text-slate-500">Đã lấy mẫu</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.expired}</div>
              <div className="text-sm text-slate-500">Đã tới kho</div>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-400" />
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
              placeholder="Tìm kiếm kit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-400" />              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">Đã vận chuyển</option>
                <option value="in-use">Đang vận chuyển</option>
                <option value="completed">Đã lấy mẫu</option>
                <option value="expired">Đã tới kho</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kit List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Kit ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày nhận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredKits.map((kit, index) => (
                <tr key={kit.kitID || `kit-${index}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CubeIcon className="h-5 w-5 text-slate-400 mr-2" />
                      <span className="text-sm font-medium text-slate-900">{kit.kitID}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.customerID || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.staffID || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.bookingId || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 max-w-xs truncate" title={kit.description || ''}>
                      {kit.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(kit.status)}
                      {editingStatus && editingStatus.kitID === kit.kitID ? (
                        <select
                          value={kit.status}
                          onChange={(e) => handleUpdateStatus(kit.kitID, e.target.value as Kit['status'])}
                          onBlur={() => setEditingStatus(null)}
                          className="text-xs font-semibold rounded-full px-2 py-1 border focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option value="available">Đã vận chuyển</option>
                          <option value="in-use">Đang vận chuyển</option>
                          <option value="completed">Đã lấy mẫu</option>
                          <option value="expired">Đã tới kho</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingStatus({kitID: kit.kitID, currentStatus: kit.status})}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 transition-opacity ${getStatusColor(kit.status)}`}
                        >
                          {getStatusText(kit.status)}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.receivedate ? new Date(kit.receivedate).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setEditingStatus({kitID: kit.kitID, currentStatus: kit.status})}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      title="Chỉnh sửa trạng thái"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredKits.length === 0 && (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">Không có kit nào</h3>
            <p className="mt-1 text-sm text-slate-500">
              Không tìm thấy kit nào phù hợp với bộ lọc hiện tại.
            </p>          </div>
        )}
      </div>

      {/* Add Kit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Thêm Kit Mới</h2>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer ID */}
                <div>
                  <label htmlFor="customerID" className="block text-sm font-medium text-slate-700 mb-2">
                    Customer ID *
                  </label>
                  <input
                    type="text"
                    id="customerID"
                    name="customerID"
                    value={formData.customerID}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.customerID ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Nhập Customer ID"
                  />
                  {formErrors.customerID && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.customerID}</p>
                  )}
                </div>

                {/* Staff ID */}
                <div>
                  <label htmlFor="staffID" className="block text-sm font-medium text-slate-700 mb-2">
                    Staff ID *
                  </label>
                  <input
                    type="text"
                    id="staffID"
                    name="staffID"
                    value={formData.staffID}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.staffID ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Nhập Staff ID"
                  />
                  {formErrors.staffID && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.staffID}</p>
                  )}
                </div>

                {/* Booking ID */}
                <div>
                  <label htmlFor="bookingId" className="block text-sm font-medium text-slate-700 mb-2">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    id="bookingId"
                    name="bookingId"
                    value={formData.bookingId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập Booking ID"
                  />
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="available">Đã vận chuyển</option>
                    <option value="in-use">Đang vận chuyển</option>
                    <option value="completed">Đã lấy mẫu</option>
                    <option value="expired">Đã tới kho</option>
                  </select>
                </div>

                {/* Receive Date */}
                <div className="md:col-span-2">
                  <label htmlFor="receivedate" className="block text-sm font-medium text-slate-700 mb-2">
                    Ngày nhận *
                  </label>
                  <input
                    type="date"
                    id="receivedate"
                    name="receivedate"
                    value={formData.receivedate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.receivedate ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.receivedate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.receivedate}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.description ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Nhập mô tả chi tiết về kit..."
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thêm Kit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
