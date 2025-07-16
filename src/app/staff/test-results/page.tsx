"use client";

import { useState, useEffect } from 'react';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  MapPinIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getAppointments, updateAppointment } from '@/lib/api/staff';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  bookingId: string;
  customerId: string;
  date: string;
  staffId: string;
  serviceId: string;
  address: string;
  method: string;
  status: string;
  priority: string;
  customerName?: string;
  serviceName?: string;
  staffName?: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiAppointments = await getAppointments();
      const mappedOrders: Order[] = apiAppointments.map((appointment) => {
        const customerName = appointment.customer?.fullname || appointment.customerName || appointment.customerId;
        const staffName = appointment.staffName || appointment.staffId;
        const serviceName = appointment.service?.name || appointment.serviceName || appointment.serviceId;

        return {
          id: appointment.id || appointment.bookingId,
          bookingId: appointment.bookingId,
          customerId: appointment.customerId,
          date: appointment.date,
          staffId: appointment.staffId,
          serviceId: appointment.serviceId,
          address: appointment.address,
          method: appointment.method,
          status: appointment.status,
          priority: 'Bình thường',
          customerName,
          serviceName,
          staffName
        };
      });

      // Sort orders by bookingId in descending order (from largest to smallest)
      const sortedOrders = mappedOrders.sort((a, b) => {
        // Remove any non-numeric prefix like '#' if present
        const bookingIdA = a.bookingId.replace(/\D/g, '');
        const bookingIdB = b.bookingId.replace(/\D/g, '');
        
        // Convert to numbers for proper comparison
        const numA = parseInt(bookingIdA, 10);
        const numB = parseInt(bookingIdB, 10);
        
        // Descending order (b - a)
        return numB - numA;
      });

      setOrders(sortedOrders);
    } catch (error) {
      setError('Không thể tải danh sách đơn đặt xét nghiệm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Đã xác nhận') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Đang thực hiện') return 'bg-blue-100 text-blue-800';
    if (status === 'Hoàn thành') return 'bg-green-100 text-green-800';
    if (status === 'Hủy') return 'bg-red-100 text-red-800';
    if (status === 'Đang chờ check-in') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Đã check-in') return 'bg-blue-100 text-blue-800';
    if (status === 'Đang chờ mẫu') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getMethodColor = (method: string) => {
    if (method === 'Tự thu mẫu') return 'bg-blue-100 text-blue-800';
    if (method === 'Tại cơ sở') return 'bg-green-100 text-green-800';
    if (method === 'Tại nhà') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getMethodText = (method: string) => method;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'all' || order.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Đã xác nhận').length,
    inProgress: orders.filter(o => o.status === 'Đang thực hiện').length,
    completed: orders.filter(o => o.status === 'Hoàn thành').length,
    cancelled: orders.filter(o => o.status === 'Hủy').length
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!token) return false;
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) {
        toast.error('Không tìm thấy đơn hàng cần cập nhật');
        return false;
      }
      const updateData = {
        ...orderToUpdate,
        status: newStatus
      };
      const updatedOrder = await updateAppointment(token, orderId, updateData);
      if (updatedOrder) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus }
              : order
          )
        );
        toast.success(`Đã cập nhật trạng thái đơn hàng #${orderId} thành ${newStatus}`);
        return true;
      } else {
        toast.error('Không thể cập nhật trạng thái đơn hàng');
        return false;
      }
    } catch (error: any) {
      let errorMessage = 'Đã xảy ra lỗi khi cập nhật trạng thái';
      if (error.response && error.response.data) {
        errorMessage += `: ${error.response.data.message || JSON.stringify(error.response.data)}`;
      }
      toast.error(errorMessage);
      return false;
    }
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
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XMarkIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={fetchOrders}
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
          <h1 className="text-2xl font-bold text-slate-900">Danh sách Booking</h1>
          <p className="text-slate-600">Quản lý thông tin booking của khách hàng</p>
          <p className="text-sm text-slate-500 mt-1">Đã tải {orders.length} booking</p>
        </div>
        <button
          onClick={handleCreateOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tạo booking mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-500">Tổng số booking</div>
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
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm booking ID, tên khách hàng..."
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
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả phương thức</option>
                <option value="Tự thu mẫu">Tự thu mẫu</option>
                <option value="Tại cơ sở">Tại cơ sở</option>
                <option value="Tại nhà">Tại nhà</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Orders List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày hẹn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương thức
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{order.bookingId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customerName || order.customerId}
                  </div>
                  {/* {order.customerName && order.customerId && order.customerName !== order.customerId && (
                    <div className="text-xs text-gray-500">ID: {order.customerId}</div>
                  )} */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(order.date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getMethodText(order.method)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={order.address}>
                    {order.address || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link href={`/staff/test-results/${order.bookingId}`} className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-4 w-4" />
                    </Link>
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
      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Chi tiết Booking - {selectedOrder.bookingId}
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
                    <p className="text-slate-900">{selectedOrder.bookingId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Customer ID</label>
                    <p className="text-slate-900">
                      {selectedOrder.customerName || selectedOrder.customerId}
                      {selectedOrder.customerName && selectedOrder.customerId && selectedOrder.customerName !== selectedOrder.customerId && (
                        <span className="text-xs text-gray-500 ml-2">ID: {selectedOrder.customerId}</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Ngày đặt</label>
                    <p className="text-slate-900">{new Date(selectedOrder.date).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Staff ID</label>
                    <p className="text-slate-900">{selectedOrder.staffId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Service ID</label>
                    <p className="text-slate-900">{selectedOrder.serviceId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Phương thức</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(selectedOrder.method)}`}>
                      {getMethodText(selectedOrder.method)}
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
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Đóng
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
