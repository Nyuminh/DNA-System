"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserIcon, 
  CubeIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { getAllKits, kitApi } from "@/lib/api/staff";
import { getAppointments } from "@/lib/api/staff";
import { toast } from "react-hot-toast";

// Interface cho kit
interface Kit {
  kitID: string;
  status: string;
  customerName?: string;
  receivedate?: string;
  bookingId?: string;
}

// Interface cho appointment
interface Appointment {
  id?: string;
  bookingId: string;
  customerId: string;
  date: string;
  status: string;
  customerName?: string;
  method?: string;
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [kits, setKits] = useState<Kit[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalKits: 0,
    availableKits: 0,
    usedKits: 0,
    pendingResults: 0,
    completedResults: 0,
    kitsNeedingSupply: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    processingBookings: 0
  });
  const [kitStatusCounts, setKitStatusCounts] = useState<Record<string, number>>({});
  const [bookingStatusCounts, setBookingStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch kits data
        const kitsData = await getAllKits();
        setKits(kitsData);
        
        // Fetch appointments data
        const appointmentsData = await getAppointments();
        setAppointments(appointmentsData);
        
        // Calculate kit statistics
        const availableKits = kitsData.filter(kit => 
          kit.status === 'Đã vận chuyển' || kit.status === 'available').length;
        const usedKits = kitsData.filter(kit => 
          kit.status === 'Đang vận chuyển' || 
          kit.status === 'Đã lấy mẫu' || 
          kit.status === 'Đang lấy mẫu' || 
          kit.status === 'Đã tới kho' || 
          kit.status === 'Đang tới kho').length;
          
        // Calculate appointment statistics
        // Lấy từ kits data vì kits cũng chứa thông tin về appointments
        const pendingResults = kitsData.filter(kit => 
          kit.status === 'Đã tới kho' || 
          kit.status === 'Đã lấy mẫu').length;
        const completedResults = kitsData.filter(kit => 
          kit.status === 'Đã hoàn thành' || 
          kit.status === 'completed').length;
        
        // Thực tế 5 là một con số cần monitor cho kits cần bổ sung
        const kitsNeedingSupply = 5;
        
        // Calculate booking statistics
        const totalBookings = appointmentsData.length;
        const completedBookings = appointmentsData.filter(app => 
          app.status === 'Hoàn thành' || app.status === 'Completed').length;
        const pendingBookings = appointmentsData.filter(app => 
          app.status === 'Đang chờ' || app.status === 'Chờ xác nhận').length;
        const processingBookings = appointmentsData.filter(app => 
          app.status === 'Đang thực hiện' || app.status === 'Đang xử lý').length;
        
        setStats({
          totalKits: kitsData.length,
          availableKits,
          usedKits,
          pendingResults,
          completedResults,
          kitsNeedingSupply,
          totalBookings,
          completedBookings,
          pendingBookings,
          processingBookings
        });
        
        // Tính số lượng kit theo từng trạng thái
        const kitStatusObj: Record<string, number> = {};
        kitsData.forEach(kit => {
          const status = kit.status || 'Không xác định';
          kitStatusObj[status] = (kitStatusObj[status] || 0) + 1;
        });
        setKitStatusCounts(kitStatusObj);
        
        // Tính số lượng booking theo từng trạng thái
        const bookingStatusObj: Record<string, number> = {};
        appointmentsData.forEach(app => {
          const status = app.status || 'Không xác định';
          bookingStatusObj[status] = (bookingStatusObj[status] || 0) + 1;
        });
        setBookingStatusCounts(bookingStatusObj);
        
        // Lọc những kit có thông tin khách hàng để coi như appointment nếu không có appointment data
        if (appointmentsData.length === 0) {
          const appointmentsFromKits = kitsData
            .filter(kit => kit.customerName)
            .map(kit => ({
              bookingId: kit.bookingId || kit.kitID,
              customerId: '',
              customerName: kit.customerName,
              date: kit.receivedate || new Date().toISOString(),
              status: kit.status
            }));
            
          setAppointments(appointmentsFromKits);
        }
        
      } catch (error) {
        console.error('Error fetching staff dashboard data:', error);
        toast.error('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate recent kits (5 most recent)
  const recentKits = [...kits]
    .sort((a, b) => {
      if (a.receivedate && b.receivedate) {
        return new Date(b.receivedate).getTime() - new Date(a.receivedate).getTime();
      }
      return 0;
    })
    .slice(0, 5);
    
  // Calculate recent appointments (5 most recent)
  const recentAppointments = [...appointments]
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    })
    .slice(0, 5);

  // Calculate system uptime percentage
  const systemUptime = 99.8;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Nhân viên</h1>
        <p className="text-gray-600 text-sm">Quản lý xét nghiệm và kết quả khách hàng</p>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600/90 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-blue-100/50 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-blue-500/10 p-2.5 rounded-lg">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-0.5">Chào mừng, {user?.username || 'Staff'}!</h3>
        <p className="text-xs text-blue-100">Quản lý kit xét nghiệm và kết quả cho khách hàng</p>
      </div>

      {/* Main Stats Summary */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng kết hoạt động</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kit Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-100/50">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                <CubeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Thống kê Kit</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tổng số kit:</span>
                <span className="font-semibold">{stats.totalKits}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Kit đang sử dụng:</span>
                <span className="font-semibold text-yellow-600">{stats.usedKits}</span>
              </div>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg p-4 border border-purple-100/50">
            <div className="flex items-center mb-3">
              <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Thống kê Lịch hẹn</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tổng số lịch hẹn:</span>
                <span className="font-semibold">{stats.totalBookings}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Đã hoàn thành:</span>
                <span className="font-semibold text-green-600">{stats.completedBookings}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Đang thực hiện:</span>
                <span className="font-semibold text-yellow-600">{stats.processingBookings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kit Status Breakdown */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <div className="flex items-center mb-4">
            <div className="bg-green-500/10 p-2.5 rounded-lg mr-3">
              <ChartPieIcon className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Trạng thái Kit</h2>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {Object.entries(kitStatusCounts).map(([status, count], idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">{status}</span>
                <span className="text-sm font-bold px-2 py-1 bg-green-100 text-green-800 rounded-full">{count}</span>
              </div>
            ))}
            {Object.keys(kitStatusCounts).length === 0 && (
              <p className="text-center text-gray-500 py-4">Không có dữ liệu trạng thái kit</p>
            )}
          </div>
        </div>
        
        {/* Booking Status Breakdown */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <div className="flex items-center mb-4">
            <div className="bg-purple-500/10 p-2.5 rounded-lg mr-3">
              <DocumentChartBarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Trạng thái Lịch hẹn</h2>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {Object.entries(bookingStatusCounts).map(([status, count], idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                <span className="text-sm font-medium text-gray-700">{status}</span>
                <span className="text-sm font-bold px-2 py-1 bg-purple-100 text-purple-800 rounded-full">{count}</span>
              </div>
            ))}
            {Object.keys(bookingStatusCounts).length === 0 && (
              <p className="text-center text-gray-500 py-4">Không có dữ liệu trạng thái lịch hẹn</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Kit Stats Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-green-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500/10 p-2.5 rounded-lg">
              <CubeIcon className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
              {stats.availableKits} sẵn sàng
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">{stats.totalKits}</h3>
          <p className="text-xs text-gray-500">Tổng số kit xét nghiệm</p>
        </div>

        {/* Booking Stats Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-purple-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500/10 p-2.5 rounded-lg">
              <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-500/10 px-2 py-1 rounded-full">
              {stats.completedBookings} hoàn thành
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">{stats.totalBookings}</h3>
          <p className="text-xs text-gray-500">Tổng số lịch hẹn</p>
        </div>

        {/* Results Stats Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-blue-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500/10 p-2.5 rounded-lg">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-500/10 px-2 py-1 rounded-full">
              {stats.pendingResults} chờ xử lý
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">{stats.completedResults + stats.pendingResults}</h3>
          <p className="text-xs text-gray-500">Tổng số kết quả xét nghiệm</p>
        </div>
      </div>

      {/* Quick Actions and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="space-y-2">
            <Link
              href="/staff/kits"
              className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150/50 rounded-lg transition-all duration-200 group border border-blue-100/30"
            >
              <div className="bg-blue-500/10 p-2 rounded-lg mr-3 group-hover:bg-blue-500/20 transition-colors">
                <CubeIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Quản lý kit xét nghiệm</h3>
                <p className="text-xs text-gray-500">Theo dõi và cập nhật trạng thái kit</p>
              </div>
            </Link>
            <Link
              href="/staff/test-results"
              className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-150/50 rounded-lg transition-all duration-200 group border border-green-100/30"
            >
              <div className="bg-green-500/10 p-2 rounded-lg mr-3 group-hover:bg-green-500/20 transition-colors">
                <DocumentTextIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Quản lý kết quả</h3>
                <p className="text-xs text-gray-500">Cập nhật và gửi kết quả cho khách hàng</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Kit Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê kit</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-100/50">
              <div className="flex items-center">
                <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <CubeIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Tổng số kit</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{stats.totalKits}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities - Kit + Bookings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Recent Kits */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Kit xét nghiệm gần đây</h2>
            <Link href="/staff/kits" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          
          {recentKits.length > 0 ? (
            <div className="space-y-3">
              {recentKits.map((kit, index) => {
                // Determine status color
                let statusColor = "bg-gray-100 text-gray-800";
                if (kit.status === "Đã vận chuyển" || kit.status === "available") {
                  statusColor = "bg-green-100 text-green-800";
                } else if (kit.status === "Đang vận chuyển" || kit.status === "in-use") {
                  statusColor = "bg-yellow-100 text-yellow-800";
                } else if (kit.status === "Hết hạn" || kit.status === "expired") {
                  statusColor = "bg-red-100 text-red-800";
                }
                
                return (
                  <div key={kit.kitID || index} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-lg border border-indigo-100/50">
                    <div className="flex items-center">
                      <div className="bg-indigo-500/10 p-2 rounded-lg mr-3">
                        <CubeIcon className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Kit: {kit.kitID}
                        </p>
                        <p className="text-xs text-gray-500">
                          {kit.customerName || 'Chưa gán'} - {kit.receivedate ? new Date(kit.receivedate).toLocaleDateString('vi-VN') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {kit.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Không có kit xét nghiệm gần đây
            </div>
          )}
        </div>
        
        {/* Recent Bookings */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn gần đây</h2>
            <Link href="/staff/test-results" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          
          {recentAppointments.length > 0 ? (
            <div className="space-y-3">
              {recentAppointments.map((booking, index) => {
                // Determine status color
                let statusColor = "bg-gray-100 text-gray-800";
                if (booking.status === "Hoàn thành" || booking.status === "Completed") {
                  statusColor = "bg-green-100 text-green-800";
                } else if (booking.status === "Đang chờ" || booking.status === "Chờ xác nhận") {
                  statusColor = "bg-yellow-100 text-yellow-800";
                } else if (booking.status === "Hủy" || booking.status === "Canceled") {
                  statusColor = "bg-red-100 text-red-800";
                }
                
                return (
                  <div key={booking.bookingId || index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-100/50">
                    <div className="flex items-center">
                      <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                        <CalendarDaysIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Booking: {booking.bookingId}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.customerName || 'Khách hàng'} - {new Date(booking.date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {booking.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Không có lịch hẹn gần đây
            </div>
          )}
        </div>
      </div>

      {/* Results Status */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tình trạng kết quả xét nghiệm</h2>
          <Link href="/staff/test-results" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-100/50">
            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-blue-100 mr-3 flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{stats.completedResults} kết quả đã hoàn thành</p>
              <p className="text-xs text-gray-500">Đã gửi cho khách hàng</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-100/50">
            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-orange-100 mr-3 flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{stats.pendingResults} kết quả đang chờ xử lý</p>
              <p className="text-xs text-gray-500">Cần được cập nhật và hoàn thành</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/staff/kits" className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-150/50 rounded-lg transition-all duration-200 group border border-gray-200">
              <CubeIcon className="h-5 w-5 text-gray-700 mr-2" />
              <span className="text-sm font-medium text-gray-700">Quản lý Kit</span>
            </Link>
            
            <Link href="/staff/test-results" className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-150/50 rounded-lg transition-all duration-200 group border border-gray-200">
              <DocumentTextIcon className="h-5 w-5 text-gray-700 mr-2" />
              <span className="text-sm font-medium text-gray-700">Quản lý kết quả</span>
            </Link>
            
            <Link href="/staff/profile" className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-150/50 rounded-lg transition-all duration-200 group border border-gray-200">
              <UserIcon className="h-5 w-5 text-gray-700 mr-2" />
              <span className="text-sm font-medium text-gray-700">Hồ sơ cá nhân</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-indigo-100/50">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-indigo-500/10 p-2.5 rounded-lg">
            <ChartBarIcon className="h-5 w-5 text-indigo-600" />
          </div>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-500/10 px-2 py-1 rounded-full">
            {systemUptime}%
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-0.5">Hiệu suất hệ thống</h3>
        <p className="text-xs text-gray-500">Đang hoạt động tốt</p>
      </div>
    </div>
  );
} 