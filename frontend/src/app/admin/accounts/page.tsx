"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  UserIcon, 
  EyeIcon, 
  PencilIcon, 
  LockClosedIcon, 
  LockOpenIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin: string;
}

export default function AccountsPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      role: "manager",
      status: "active",
      createdAt: "2025-01-15",
      lastLogin: "2025-06-08"
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      role: "user",
      status: "active",
      createdAt: "2025-02-20",
      lastLogin: "2025-06-07"
    },
    {
      id: "3",
      name: "Huyn Duc Khanh",
      email: "KhanhHDSE@fpt.edu.vn",
      role: "user",
      status: "suspended",
      createdAt: "2025-03-10",
      lastLogin: "2025-06-05"
    },
    {
      id: "4",
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      role: "admin",
      status: "active",
      createdAt: "2025-01-01",
      lastLogin: "2025-06-08"
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      role: "user",
      status: "inactive",
      createdAt: "2025-04-15",
      lastLogin: "2025-05-20"
    },
    {
      id: "4",
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      role: "user",
      status: "active",
      createdAt: "2025-04-12",
      lastLogin: "2025-06-06"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: "bg-purple-100 text-purple-800", text: "Quản trị viên" },
      manager: { color: "bg-blue-100 text-blue-800", text: "Quản lý" },
      user: { color: "bg-gray-100 text-gray-800", text: "Người dùng" }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const toggleUserStatus = (user: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === user.id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" as const }
          : u
      )
    );
  };

  const viewUserDetails = (user: User) => {
    alert(`Xem chi tiết người dùng: ${user.name}`);
  };

  const editUser = (user: User) => {
    alert(`Chỉnh sửa người dùng: ${user.name}`);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
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
      </div>      {/* Statistics Cards */}
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
      </div>      {/* Filters and Search */}
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
              <option value="admin">Quản trị viên</option>
              <option value="manager">Quản lý</option>
              <option value="user">Người dùng</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="suspended">Bị khóa</option>
            </select>
            <Link
              href="/admin/accounts/new"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm shadow-sm"
            >
              <PlusIcon className="h-4 w-4" />
              Thêm người dùng
            </Link>
          </div>
        </div>
      </div>      {/* Users Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-white/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Đăng nhập cuối
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/30 divide-y divide-gray-200/30">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/50 transition-colors duration-150">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(user.lastLogin).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => viewUserDetails(user)}
                        className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-150 group relative"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Xem chi tiết
                        </span>
                      </button>
                      <button
                        onClick={() => editUser(user)}
                        className="text-yellow-600 hover:text-yellow-900 p-1.5 rounded-lg hover:bg-yellow-50 transition-all duration-150 group relative"
                        title="Chỉnh sửa"                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Chỉnh sửa
                        </span>
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`p-1.5 rounded-lg transition-all duration-150 group relative ${
                          user.status === "active"
                            ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                            : "text-green-600 hover:text-green-900 hover:bg-green-50"
                        }`}
                        title={user.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                      >
                        {user.status === "active" ? (
                          <LockClosedIcon className="h-4 w-4" />
                        ) : (
                          <LockOpenIcon className="h-4 w-4" />
                        )}
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {user.status === "active" ? "Khóa" : "Mở khóa"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <UserIcon className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy người dùng</h3>
            <p className="mt-1 text-xs text-gray-500">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
