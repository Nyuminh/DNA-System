"use client";

import { useState, useEffect } from 'react';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  EyeIcon,
  XMarkIcon,
  MapPinIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  bookingID: string;
  customerID: string;
  date: string;
  staffID: string;
  serviceID: string;
  address: string;
  method: 'self-collection' | 'facility-collection' | 'home-collection';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
  customerName?: string;
  serviceName?: string;
  staffName?: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock data - replace with actual API call
      const mockOrders: Order[] = [
        {
          id: '1',
          bookingID: 'BK001',
          customerID: 'CUST001',
          date: '2024-01-20',
          staffID: 'STAFF001',
          serviceID: 'SRV001',
          address: '123 Nguyễn Văn Cừ, Quận 1, TP.HCM',
          method: 'facility-collection',
          status: 'pending',
          priority: 'high',
          customerName: 'Nguyễn Văn A',
          serviceName: 'Xét nghiệm huyết thống cha con',
          staffName: 'Nguyễn Thị Staff'
        },
        {
          id: '2',
          bookingID: 'BK002',
          customerID: 'CUST002',
          date: '2024-01-18',
          staffID: 'STAFF002',
          serviceID: 'SRV002',
          address: '456 Lê Lợi, Quận 3, TP.HCM',
          method: 'home-collection',
          status: 'in-progress',
          priority: 'normal',
          customerName: 'Trần Thị B',
          serviceName: 'Xét nghiệm tổ tiên',
          staffName: 'Lê Văn Staff'
        },
        {
          id: '3',
          bookingID: 'BK003',
          customerID: 'CUST003',
          date: '2024-01-15',
          staffID: 'STAFF001',
          serviceID: 'SRV003',
          address: '789 Võ Văn Tần, Quận 10, TP.HCM',
          method: 'self-collection',
          status: 'completed',
          priority: 'normal',
          customerName: 'Lê Văn C',
          serviceName: 'Xét nghiệm sức khỏe',
          staffName: 'Nguyễn Thị Staff'
        },
        {
          id: '4',
          bookingID: 'BK004',
          customerID: 'CUST004',
          date: '2024-01-12',
          staffID: 'STAFF003',
          serviceID: 'SRV001',
          address: '321 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM',
          method: 'facility-collection',
          status: 'cancelled',
          priority: 'urgent',
          customerName: 'Phạm Thị D',
          serviceName: 'Xét nghiệm huyết thống cha con',
          staffName: 'Trần Văn Staff'
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-orange-500" />;
      case 'in-progress':
        return <ShoppingBagIcon className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XMarkIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'in-progress':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return '';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodText = (method: Order['method']) => {
    switch (method) {
      case 'self-collection':
        return 'Tự lấy mẫu';
      case 'facility-collection':
        return 'Lấy tại cơ sở';
      case 'home-collection':
        return 'Lấy tại nhà';
      default:
        return '';
    }
  };

  const getMethodColor = (method: Order['method']) => {
    switch (method) {
      case 'self-collection':
        return 'bg-blue-100 text-blue-800';
      case 'facility-collection':
        return 'bg-green-100 text-green-800';
      case 'home-collection':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.bookingID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.serviceName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || order.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleEditOrder = (order: Order) => {
    // Navigate to edit page or open edit modal
    console.log('Edit order:', order);
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Mock API call
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
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
    <div className="space-y-6">      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý đơn hàng</h1>
          <p className="text-slate-600">Quản lý các đơn đặt dịch vụ xét nghiệm của khách hàng</p>
        </div>
        <button
          onClick={handleCreateOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tạo đơn mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-500">Tổng số đơn</div>
            </div>
            <ShoppingBagIcon className="h-8 w-8 text-slate-400" />
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
            <ShoppingBagIcon className="h-8 w-8 text-blue-400" />
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
      </div>      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
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
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả phương thức</option>
              <option value="self-collection">Tự lấy mẫu</option>
              <option value="facility-collection">Lấy tại cơ sở</option>
              <option value="home-collection">Lấy tại nhà</option>
            </select>
          </div>
        </div>
      </div>      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Phương thức
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShoppingBagIcon className="h-5 w-5 text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">{order.bookingID}</div>
                        <div className="text-sm text-slate-500">ID: {order.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-slate-900">{order.customerName || 'N/A'}</div>
                      <div className="text-sm text-slate-500">{order.customerID}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-slate-900">{order.serviceName || 'N/A'}</div>
                      <div className="text-sm text-slate-500">Service ID: {order.serviceID}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(order.method)}`}>
                      {getMethodText(order.method)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(order.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-green-600 hover:text-green-900"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'in-progress')}
                          className="text-orange-600 hover:text-orange-900 text-xs"
                        >
                          Bắt đầu
                        </button>
                      )}
                      {order.status === 'in-progress' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Hoàn thành
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'in-progress') && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 text-xs"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">Không có đơn hàng nào</h3>
            <p className="mt-1 text-sm text-slate-500">
              Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        )}
      </div>      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Chi tiết đơn hàng - {selectedOrder.bookingID}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Booking ID</label>
                    <p className="text-slate-900">{selectedOrder.bookingID}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Customer ID</label>
                    <p className="text-slate-900">{selectedOrder.customerID}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Tên khách hàng</label>
                    <p className="text-slate-900">{selectedOrder.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Dịch vụ</label>
                    <p className="text-slate-900">{selectedOrder.serviceName || 'N/A'}</p>
                    <p className="text-sm text-slate-500">Service ID: {selectedOrder.serviceID}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Staff ID</label>
                    <p className="text-slate-900">{selectedOrder.staffID}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Nhân viên phụ trách</label>
                    <p className="text-slate-900">{selectedOrder.staffName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Ngày đặt</label>
                    <p className="text-slate-900">{new Date(selectedOrder.date).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phương thức</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(selectedOrder.method)}`}>
                      {getMethodText(selectedOrder.method)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Địa chỉ</label>
                  <div className="flex items-start space-x-2">
                    <MapPinIcon className="h-5 w-5 text-slate-400 mt-1" />
                    <p className="text-slate-900">{selectedOrder.address}</p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Ghi chú</label>
                    <p className="text-slate-900">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => handleEditOrder(selectedOrder)}
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

      {/* Create Order Modal (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Tạo đơn hàng mới</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-slate-600 mb-4">
                Tính năng tạo đơn hàng mới sẽ được phát triển trong phiên bản tiếp theo.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
