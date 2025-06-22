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
  userID: string;
  username: string;
  password: string;
  fullname: string;
  gender: "Nam" | "Nữ" | "Khác";
  roleID: string;
  email: string;
  phone: string;
  birthdate: string;
  image: string;
  address: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

export default function AccountsPage() {  const [users, setUsers] = useState<User[]>([
    {
      userID: "U001",
      username: "nguyenvana",
      password: "********",
      fullname: "Nguyễn Văn A",
      gender: "Nam",
      roleID: "R002",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      birthdate: "1990-05-15",
      image: "/images/customer-1.jpg",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      status: "active",
      createdAt: "2025-01-15",
      lastLogin: "2025-06-08"
    },
    {
      userID: "U002",
      username: "tranthib",
      password: "********",
      fullname: "Trần Thị B",
      gender: "Nữ",
      roleID: "R003",
      email: "tranthib@example.com",
      phone: "0987654321",
      birthdate: "1992-08-20",
      image: "/images/customer-2.jpg",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      status: "active",
      createdAt: "2025-02-20",
      lastLogin: "2025-06-07"
    },
    {
      userID: "U003",
      username: "khanhhd",
      password: "********",
      fullname: "Huỳnh Đức Khanh",
      gender: "Nam",
      roleID: "R003",
      email: "KhanhHDSE@fpt.edu.vn",
      phone: "0912345678",
      birthdate: "1995-03-10",
      image: "/images/customer-3.jpg",
      address: "789 Đường DEF, Quận 3, TP.HCM",
      status: "suspended",
      createdAt: "2025-03-10",
      lastLogin: "2025-06-05"
    },
    {
      userID: "U004",
      username: "phamthid",
      password: "********",
      fullname: "Phạm Thị D",
      gender: "Nữ",
      roleID: "R001",
      email: "phamthid@example.com",
      phone: "0923456789",
      birthdate: "1988-12-01",
      image: "/images/customer-1.jpg",
      address: "321 Đường GHI, Quận 4, TP.HCM",
      status: "active",
      createdAt: "2025-01-01",
      lastLogin: "2025-06-08"
    },
    {
      userID: "U005",
      username: "hoangvane",
      password: "********",
      fullname: "Hoàng Văn E",
      gender: "Nam",
      roleID: "R003",
      email: "hoangvane@example.com",
      phone: "0934567890",
      birthdate: "1993-07-15",
      image: "/images/customer-2.jpg",
      address: "654 Đường JKL, Quận 5, TP.HCM",
      status: "inactive",
      createdAt: "2025-04-15",
      lastLogin: "2025-05-20"
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
  const getRoleBadge = (roleID: string) => {
    const roleConfig = {
      "R001": { color: "bg-purple-100 text-purple-800", text: "Quản trị viên" },
      "R002": { color: "bg-blue-100 text-blue-800", text: "Quản lý" },
      "R003": { color: "bg-gray-100 text-gray-800", text: "Người dùng" }
    };
    
    const config = roleConfig[roleID as keyof typeof roleConfig] || 
                  { color: "bg-gray-100 text-gray-800", text: "Không xác định" };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const toggleUserStatus = (user: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.userID === user.userID
          ? { ...u, status: u.status === "active" ? "suspended" : "active" as const }
          : u
      )
    );
  };

  const viewUserDetails = (user: User) => {
    alert(`Xem chi tiết người dùng: ${user.fullname}`);
  };

  const editUser = (user: User) => {
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
          <div className="flex gap-3">            <select
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
                  ID
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tên đăng nhập
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giới tính
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày sinh
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/30 divide-y divide-gray-200/30">
              {filteredUsers.map((user) => (
                <tr key={user.userID} className="hover:bg-white/50 transition-colors duration-150">
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.userID}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">                        <img 
                          className="h-8 w-8 rounded-full object-cover" 
                          src={user.image || "/images/customer-1.jpg"} 
                          alt={user.fullname}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/customer-1.jpg";
                          }}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.gender === "Nam" ? "bg-blue-100 text-blue-800" : 
                      user.gender === "Nữ" ? "bg-pink-100 text-pink-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {user.gender}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {getRoleBadge(user.roleID)}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone}</div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.birthdate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={user.address}>
                      {user.address}
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {getStatusBadge(user.status)}
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
                        title="Chỉnh sửa"
                      >
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
        </div>
        {filteredUsers.length === 0 && (
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
