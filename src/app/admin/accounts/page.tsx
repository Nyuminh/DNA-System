"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  UserIcon, 
  EyeIcon, 
  PencilIcon, 
  LockClosedIcon, 
  LockOpenIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { getAllUsers, AdminUser } from "@/lib/api/admin";

export default function AccountsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Danh sách ảnh mặc định theo vai trò
  const defaultImages = {
    'R01': '/images/doctor1.jpg', // Admin
    'R02': '/images/doctor3.jpg', // Nhân viên
    'R03': '/images/customer-1.jpg', // Khách Hàng
    'R04': '/images/doctor2.jpg', // Quản lí
    'default': '/images/default-avatar.jpg'
  };

  // Map roleID sang tên vai trò
  const roleNames = {
    'R01': 'Quản trị viên',
    'R02': 'Nhân viên',
    'R03': 'Khách Hàng',
    'R04': 'Quản lí',
    'default': 'Không xác định'
  };

  // Lấy tên vai trò từ roleID
  const getRoleName = (roleID: string): string => {
    return roleNames[roleID as keyof typeof roleNames] || roleNames.default;
  };

  // Lấy ảnh dựa theo roleID
  const getUserImage = (user: AdminUser): string => {
    if (user.image && user.image !== '') {
      return user.image;
    }
    return defaultImages[user.roleID as keyof typeof defaultImages] || defaultImages.default;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await getAllUsers();
        
        if (result.success && result.users) {
          setUsers(result.users);
          setError(null);
        } else {
          setError(result.message || 'Không thể lấy danh sách người dùng');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Hoạt động" },
      inactive: { color: "bg-gray-100 text-gray-800", text: "Không hoạt động" },
      suspended: { color: "bg-red-100 text-red-800", text: "Bị khóa" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };
  
  const getRoleBadge = (roleID: string) => {
    const roleConfig = {
      "R01": { color: "bg-purple-100 text-purple-800", text: "Quản trị viên" },
      "R02": { color: "bg-green-100 text-green-800", text: "Nhân viên" },
      "R03": { color: "bg-gray-100 text-gray-800", text: "Khách Hàng" },
      "R04": { color: "bg-blue-100 text-blue-800", text: "Quản lí" }
    };
    
    const config = roleConfig[roleID as keyof typeof roleConfig] || 
                  { color: "bg-gray-100 text-gray-800", text: "Không xác định" };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const toggleUserStatus = (user: AdminUser) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.userID === user.userID
          ? { ...u, status: u.status === "active" ? "suspended" : "active" as const }
          : u
      )
    );
  };

  const viewUserDetails = (user: AdminUser) => {
    alert(`Xem chi tiết người dùng: ${user.fullname}`);
  };

  const editUser = (user: AdminUser) => {
    alert(`Chỉnh sửa người dùng: ${user.fullname}`);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.roleID === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const suspendedUsers = users.filter(u => u.status === "suspended").length;
  const newUsersThisMonth = users.filter(u => {
    const userDate = new Date(u.createdAt);
    const currentDate = new Date();
    return userDate.getMonth() === currentDate.getMonth() && 
           userDate.getFullYear() === currentDate.getFullYear();
  }).length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Tài khoản</h1>
        <p className="text-gray-600 text-sm">Quản lý người dùng và phân quyền hệ thống</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl shadow-sm p-4 border border-blue-100/50">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <UserIcon className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{totalUsers}</h3>
          <p className="text-xs text-gray-500">Tổng số người dùng</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl shadow-sm p-4 border border-green-100/50">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{activeUsers}</h3>
          <p className="text-xs text-gray-500">Người dùng hoạt động</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl shadow-sm p-4 border border-red-100/50">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-red-500/10 p-2 rounded-lg">
              <LockClosedIcon className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{suspendedUsers}</h3>
          <p className="text-xs text-gray-500">Tài khoản bị khóa</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl shadow-sm p-4 border border-purple-100/50">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <PlusIcon className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{newUsersThisMonth}</h3>
          <p className="text-xs text-gray-500">Người dùng mới tháng này</p>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-5 mb-6 border border-white/20">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm text-sm"
            >
              <option value="">Tất cả vai trò</option>
              <option value="R001">Quản trị viên</option>
              <option value="R002">Quản lý</option>
              <option value="R003">Người dùng</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="suspended">Bị khóa</option>
            </select>
            
            <Link
              href="/admin/accounts/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center min-w-[120px]"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Thêm mới
            </Link>
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giới tính
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày sinh
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.userID || `user-${Math.random()}`} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.userID || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={getUserImage(user)}
                          alt={user.fullname} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/default-avatar.jpg";
                          }}
                        />
                      </div>
                      <div className="ml-3 text-sm text-gray-900">
                        {user.username || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.fullname || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.gender || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getRoleBadge(user.roleID)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.email || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {user.birthdate ? new Date(user.birthdate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-[200px] truncate">
                    {user.address || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => viewUserDetails(user)}
                        className="text-gray-600 hover:text-indigo-600"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => editUser(user)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`${user.status === "active" ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}`}
                      >
                        {user.status === "active" ? (
                          <LockClosedIcon className="h-5 w-5" />
                        ) : (
                          <LockOpenIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty state */}
          {filteredUsers.length === 0 && !loading && (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500 text-sm">Không tìm thấy người dùng nào phù hợp với bộ lọc</p>
            </div>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {!loading && filteredUsers.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-white/20 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{filteredUsers.length}</span> trong tổng số{" "}
            <span className="font-medium">{users.length}</span> người dùng
          </div>
          <div className="flex gap-1">
            <button className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
              Trước
            </button>
            <button className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1 text-sm text-indigo-700 font-medium">
              1
            </button>
            <button className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
              Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
