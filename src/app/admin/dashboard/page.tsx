"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  UserIcon, 
  ChartBarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  BellAlertIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { getAllUsers, getAdminDashboardStats, AdminUser } from "@/lib/api/admin";
import { getBookings } from "@/lib/api/bookings";
import { getServices, Service } from "@/lib/api/services";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0
  });

  // Hàm để lấy tên dịch vụ từ ID dịch vụ
  const getServiceNameById = (serviceId: string) => {
    if (!serviceId || !services.length) return "Dịch vụ xét nghiệm";
    
    const service = services.find(s => {
      // Kiểm tra cả hai ID đều tồn tại trước khi so sánh
      if (!s || !s.id) return false;
      
      return (
        s.id === serviceId || 
        (typeof s.id === 'string' && typeof serviceId === 'string' && 
         s.id.toLowerCase() === serviceId.toLowerCase())
      );
    });
    
    return service ? service.name : "Dịch vụ xét nghiệm";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch services first to have them available
        const servicesResult = await getServices();
        if (servicesResult.success && servicesResult.services) {
          setServices(servicesResult.services);
        }
        
        // Fetch users
        const usersResult = await getAllUsers();
        if (usersResult.success && usersResult.users) {
          setUsers(usersResult.users);
          
          // Calculate statistics
          const activeUsers = usersResult.users?.filter(u => u.roleID !== "R05" && u.roleID !== "Ban").length || 0;
          const currentDate = new Date();
          const newUsersThisMonth = usersResult.users?.filter(user => {
            const userDate = new Date(user.createdAt);
            return userDate.getMonth() === currentDate.getMonth() && 
                  userDate.getFullYear() === currentDate.getFullYear();
          }).length || 0;
          
          setStats(prev => ({
            ...prev,
            totalUsers: usersResult.users?.length || 0,
            activeUsers,
            newUsersThisMonth
          }));
        }
        
        // Fetch bookings
        const bookingsResult = await getBookings();
        if (bookingsResult && bookingsResult.length > 0) {
          setBookings(bookingsResult);
          
          const completedBookings = bookingsResult.filter((b: any) => 
            b.status === "Hoàn thành" || b.status === "Completed").length;
          const pendingBookings = bookingsResult.filter((b: any) => 
            b.status === "Đang chờ" || b.status === "Chờ xác nhận" || 
            b.status === "Pending" || b.status === "Waiting").length;
          
          setStats(prev => ({
            ...prev,
            totalBookings: bookingsResult.length,
            completedBookings,
            pendingBookings
          }));
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get recent users (5 most recent)
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Get recent bookings (5 most recent)
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate system uptime percentage (just an example)
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Tổng quan</h1>
        <p className="text-gray-600 text-sm">Tổng quan hệ thống DNA Testing Service Management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Users Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-blue-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500/10 p-2.5 rounded-lg">
              <UsersIcon className="h-5 w-5 text-blue-600" />
            </div>
            {stats.newUsersThisMonth > 0 && (
              <span className="text-xs font-medium text-blue-600 bg-blue-500/10 px-2 py-1 rounded-full">
                +{stats.newUsersThisMonth} mới
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">{stats.totalUsers}</h3>
          <p className="text-xs text-gray-500">Tổng số người dùng</p>
        </div>

        {/* Active Users Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-green-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500/10 p-2.5 rounded-lg">
              <UserIcon className="h-5 w-5 text-green-600" />
            </div>
            {stats.activeUsers > 0 && (
              <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">{stats.activeUsers}</h3>
          <p className="text-xs text-gray-500">Người dùng hoạt động</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-purple-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500/10 p-2.5 rounded-lg">
              <ClipboardDocumentListIcon className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-500/10 px-2 py-1 rounded-full">
              {stats.completedBookings} hoàn thành
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">{stats.totalBookings}</h3>
          <p className="text-xs text-gray-500">Lịch hẹn xét nghiệm</p>
        </div>

        {/* System Performance Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-indigo-100/50">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-indigo-500/10 p-2.5 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-500/10 px-2 py-1 rounded-full">
              {systemUptime}%
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-0.5">{systemUptime}%</h3>
          <p className="text-xs text-gray-500">Tỷ lệ hoạt động hệ thống</p>
        </div>
      </div>

      {/* Quick Actions and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="space-y-2">
            <Link
              href="/admin/accounts/new"
              className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150/50 rounded-lg transition-all duration-200 group border border-blue-100/30"
            >
              <div className="bg-blue-500/10 p-2 rounded-lg mr-3 group-hover:bg-blue-500/20 transition-colors">
                <UserIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Thêm người dùng mới</h3>
                <p className="text-xs text-gray-500">Tạo tài khoản cho người dùng mới</p>
              </div>
            </Link>
            <Link
              href="/admin/accounts"
              className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-150/50 rounded-lg transition-all duration-200 group border border-green-100/30"
            >
              <div className="bg-green-500/10 p-2 rounded-lg mr-3 group-hover:bg-green-500/20 transition-colors">
                <UsersIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Quản lý tài khoản</h3>
                <p className="text-xs text-gray-500">Xem và quản lý người dùng hệ thống</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Booking Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê đặt lịch</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-100/50">
              <div className="flex items-center">
                <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Tổng số lịch hẹn</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{stats.totalBookings}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-100/50">
              <div className="flex items-center">
                <div className="bg-green-500/10 p-2 rounded-lg mr-3">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Đã hoàn thành</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{stats.completedBookings}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-lg border border-yellow-100/50">
              <div className="flex items-center">
                <div className="bg-yellow-500/10 p-2 rounded-lg mr-3">
                  <ClockIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Đang chờ xử lý</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{stats.pendingBookings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Người dùng mới đăng ký</h2>
          <Link href="/admin/accounts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        
        {recentUsers.length > 0 ? (
          <div className="space-y-3">
            {recentUsers.map((user, index) => (
              <div key={user.userID || index} className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-100/50">
                <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-blue-100 mr-3 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.fullname}</p>
                  <p className="text-xs text-gray-500">Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Không có người dùng mới
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn gần đây</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </button>
        </div>
        
        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((booking, index) => {
              // Determine status color
              let statusColor = "bg-gray-100 text-gray-800";
              if (booking.status === "Hoàn thành" || booking.status === "Completed") {
                statusColor = "bg-green-100 text-green-800";
              } else if (booking.status === "Đang chờ" || booking.status === "Chờ xác nhận" || booking.status === "Pending" || booking.status === "Waiting") {
                statusColor = "bg-yellow-100 text-yellow-800";
              } else if (booking.status === "Hủy" || booking.status === "Canceled") {
                statusColor = "bg-red-100 text-red-800";
              }
              
              // Xác định tên dịch vụ an toàn
              const serviceName = booking && booking.serviceId ? 
                getServiceNameById(booking.serviceId) : "Dịch vụ xét nghiệm";
              
              return (
                <div key={booking.bookingId || index} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-lg border border-indigo-100/50">
                  <div className="flex items-center">
                    <div className="bg-indigo-500/10 p-2 rounded-lg mr-3">
                      <CalendarDaysIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {serviceName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.date).toLocaleDateString('vi-VN')}
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
  );
}
