"use client";

import { useState, useEffect } from 'react';
import {
  CubeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Kit {
  id: string;
  kitId: string;
  customerID: string;
  staffID: string;
  description: string;
  status: 'available' | 'used' | 'expired' | 'damaged';
  receivedate: string;
  // Keep some old fields for compatibility
  type?: string;
  customerId?: string;
  customerName?: string;
  testType?: string;
  createdDate?: string;
  usedDate?: string;
  expiryDate?: string;
  location?: string;
}

interface NewKitForm {
  kitID: string;
  customerID: string;
  staffID: string;
  description: string;
  status: 'available' | 'used' | 'expired' | 'damaged';
  receivedate: string;
}

export default function KitManagement() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<NewKitForm>({
    kitID: '',
    customerID: '',
    staffID: '',
    description: '',
    status: 'available',
    receivedate: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchKits();
  }, []);
  const fetchKits = async () => {
    try {      // Mock data - replace with actual API call
      const mockKits: Kit[] = [
        {
          id: '1',
          kitId: 'KIT001',
          customerID: 'CUST001',
          staffID: 'STAFF001',
          description: 'Kit xét nghiệm huyết thống cha con',
          status: 'available',
          receivedate: '2024-01-15',
          type: 'Paternity Test',
          testType: 'Xét nghiệm huyết thống cha con',
          createdDate: '2024-01-15',
          expiryDate: '2025-01-15',
          location: 'Kho A1'
        },
        {
          id: '2',
          kitId: 'KIT002',
          customerID: 'CUST002',
          staffID: 'STAFF001',
          description: 'Kit xét nghiệm tổ tiên',
          status: 'used',
          receivedate: '2024-01-10',
          customerId: 'CUST002',
          customerName: 'Nguyễn Văn A',
          type: 'Ancestry Test',
          testType: 'Xét nghiệm tổ tiên',
          createdDate: '2024-01-10',
          usedDate: '2024-01-20',
          expiryDate: '2025-01-10',
          location: 'Phòng lab'
        },
        {
          id: '3',
          kitId: 'KIT003',
          customerID: 'CUST003',
          staffID: 'STAFF002',
          description: 'Kit xét nghiệm sức khỏe',
          status: 'available',
          receivedate: '2024-01-12',
          type: 'Health Test',
          testType: 'Xét nghiệm sức khỏe',
          createdDate: '2024-01-12',
          expiryDate: '2025-01-12',
          location: 'Kho A2'
        },
        {
          id: '4',
          kitId: 'KIT004',
          customerID: 'CUST004',
          staffID: 'STAFF001',
          description: 'Kit xét nghiệm huyết thống cha con đã hết hạn',
          status: 'expired',
          receivedate: '2023-01-15',
          type: 'Paternity Test',
          testType: 'Xét nghiệm huyết thống cha con',
          createdDate: '2023-01-15',
          expiryDate: '2024-01-15',
          location: 'Kho B1'
        },
        {
          id: '5',
          kitId: 'KIT005',
          customerID: 'CUST005',
          staffID: 'STAFF003',
          description: 'Kit xét nghiệm tổ tiên bị hư hỏng',
          status: 'damaged',
          receivedate: '2024-01-08',
          type: 'Ancestry Test',
          testType: 'Xét nghiệm tổ tiên',
          createdDate: '2024-01-08',
          expiryDate: '2025-01-08',
          location: 'Kho A1'
        }
      ];
      
      setKits(mockKits);
    } catch (error) {
      console.error('Error fetching kits:', error);
    } finally {
      setLoading(false);
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
    
    if (!formData.kitID.trim()) {
      errors.kitID = 'Kit ID là bắt buộc';
    }
    
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
      // TODO: Replace with actual API call
      console.log('Creating new kit:', formData);
        // Mock success - add new kit to list
      const newKit: Kit = {
        id: Date.now().toString(),
        kitId: formData.kitID,
        customerID: formData.customerID,
        staffID: formData.staffID,
        description: formData.description,
        status: formData.status,
        receivedate: formData.receivedate,
        type: 'DNA Test Kit',
        customerId: formData.customerID,
        customerName: `Customer ${formData.customerID}`,
        testType: formData.description,
        createdDate: formData.receivedate,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        location: 'Kho mới'
      };
      
      setKits(prev => [...prev, newKit]);
      
      // Reset form and close modal
      setFormData({
        kitID: '',
        customerID: '',
        staffID: '',
        description: '',
        status: 'available',
        receivedate: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
      
      alert('Thêm kit thành công!');
    } catch (error) {
      console.error('Error creating kit:', error);
      alert('Có lỗi xảy ra khi thêm kit. Vui lòng thử lại.');
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setFormData({
      kitID: '',
      customerID: '',
      staffID: '',
      description: '',
      status: 'available',
      receivedate: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
  };

  const getStatusIcon = (status: Kit['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'used':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'damaged':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Kit['status']) => {
    switch (status) {
      case 'available':
        return 'Sẵn sàng';
      case 'used':
        return 'Đã sử dụng';
      case 'expired':
        return 'Hết hạn';
      case 'damaged':
        return 'Hư hỏng';
      default:
        return '';
    }
  };

  const getStatusColor = (status: Kit['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const filteredKits = kits.filter(kit => {
    const matchesSearch = kit.kitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kit.customerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kit.staffID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (kit.testType && kit.testType.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (kit.customerName && kit.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || kit.status === statusFilter;
    const matchesType = typeFilter === 'all' || (kit.type && kit.type === typeFilter);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: kits.length,
    available: kits.filter(k => k.status === 'available').length,
    used: kits.filter(k => k.status === 'used').length,
    expired: kits.filter(k => k.status === 'expired').length,
    damaged: kits.filter(k => k.status === 'damaged').length
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
              <div className="text-sm text-slate-500">Sẵn sàng</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.used}</div>
              <div className="text-sm text-slate-500">Đã sử dụng</div>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.expired}</div>
              <div className="text-sm text-slate-500">Hết hạn</div>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.damaged}</div>
              <div className="text-sm text-slate-500">Hư hỏng</div>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-400" />
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
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">Sẵn sàng</option>
                <option value="used">Đã sử dụng</option>
                <option value="expired">Hết hạn</option>
                <option value="damaged">Hư hỏng</option>
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả loại kit</option>
              <option value="Paternity Test">Xét nghiệm cha con</option>
              <option value="Ancestry Test">Xét nghiệm tổ tiên</option>
              <option value="Health Test">Xét nghiệm sức khỏe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kit List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">            <thead className="bg-slate-50">
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
            </thead>            <tbody className="bg-white divide-y divide-slate-200">
              {filteredKits.map((kit) => (
                <tr key={kit.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CubeIcon className="h-5 w-5 text-slate-400 mr-2" />
                      <span className="text-sm font-medium text-slate-900">{kit.kitId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.customerID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {kit.staffID}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 max-w-xs truncate" title={kit.description}>
                      {kit.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(kit.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(kit.status)}`}>
                        {getStatusText(kit.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(kit.receivedate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Xem
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Chỉnh sửa
                      </button>
                    </div>
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
                {/* Kit ID */}
                <div>
                  <label htmlFor="kitID" className="block text-sm font-medium text-slate-700 mb-2">
                    Kit ID *
                  </label>
                  <input
                    type="text"
                    id="kitID"
                    name="kitID"
                    value={formData.kitID}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.kitID ? 'border-red-300' : 'border-slate-300'
                    }`}
                    placeholder="Nhập Kit ID"
                  />
                  {formErrors.kitID && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.kitID}</p>
                  )}
                </div>

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
                    <option value="available">Sẵn sàng</option>
                    <option value="used">Đã sử dụng</option>
                    <option value="expired">Hết hạn</option>
                    <option value="damaged">Hư hỏng</option>
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
