"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  UserIcon, 
  EyeIcon, 
  PencilIcon, 
  LockClosedIcon, 
  LockOpenIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getAllUsers, AdminUser, updateUserById, UpdateUserRequest } from "@/lib/api/admin";

export default function AccountsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editFormData, setEditFormData] = useState<{
    username: string;
    password: string;
    fullname: string;
    roleId: string;
    email: string;
    phone: string;
    birthdate: string;
    address: string;
    image?: string;
  }>({
    username: '',
    password: '',
    fullname: '',
    roleId: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    image: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

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

  const toggleUserStatus = async (user: AdminUser) => {
    // Hiển thị xác nhận từ người dùng
    if (!confirm(`Bạn có chắc muốn ${user.status === "active" ? "khóa" : "mở khóa"} tài khoản ${user.fullname}?`)) {
      return;
    }

    try {
      // Đầu tiên, hỏi người dùng nhập mật khẩu cho tài khoản
      const password = prompt("Vui lòng nhập mật khẩu cho tài khoản này:", "");
      
      if (!password) {
        alert("Cần cung cấp mật khẩu để cập nhật trạng thái tài khoản!");
        return;
      }

      const result = await updateUserById(user.userID, {
        username: user.username,
        password: password,
        fullname: user.fullname,
        roleId: user.roleID,
        email: user.email,
        phone: user.phone,
        birthdate: user.birthdate,
        address: user.address,
        image: user.image,
      });
      
      if (result.success) {
        // Cập nhật danh sách người dùng - giả định backend đã xử lý chuyển đổi trạng thái
        const newStatus = user.status === "active" ? "suspended" : "active";
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.userID === user.userID
              ? { ...u, status: newStatus as "active" | "inactive" | "suspended" }
              : u
          )
        );
      } else {
        alert(result.message || 'Không thể thay đổi trạng thái người dùng');
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Đã xảy ra lỗi khi thay đổi trạng thái người dùng');
    }
  };

  const viewUserDetails = (user: AdminUser) => {
    alert(`Xem chi tiết người dùng: ${user.fullname}`);
  };

  const editUser = (user: AdminUser) => {
    console.log('Editing user:', user);
    setSelectedUser(user);
    
    // Format ngày tháng cho form input date
    let formattedBirthdate = user.birthdate;
    try {
      if (user.birthdate) {
        // Chuyển đổi sang định dạng YYYY-MM-DD cho input type="date"
        formattedBirthdate = new Date(user.birthdate).toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Error formatting date:', e);
    }
    
    setEditFormData({
      username: user.username,
      password: user.password || '', // Sử dụng password từ API nếu có
      fullname: user.fullname,
      roleId: user.roleID, // Chuyển đổi từ roleID sang roleId
      email: user.email,
      phone: user.phone,
      birthdate: formattedBirthdate,
      address: user.address,
      image: user.image
    });
    
    console.log('Setting form data:', {
      username: user.username,
      password: user.password ? '[PASSWORD FROM API]' : '[EMPTY]',
      fullname: user.fullname,
      roleId: user.roleID,
      email: user.email,
      phone: user.phone,
      birthdate: formattedBirthdate,
      address: user.address,
    });
    
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Kiểm tra password đã được nhập
    if (!editFormData.password) {
      setEditError('Vui lòng nhập mật khẩu để cập nhật thông tin!');
      return;
    }

    setIsSaving(true);
    setEditError(null);
    setSuccessMessage(null);

    try {      
      // Đảm bảo dữ liệu đầy đủ theo yêu cầu API
      const formData: UpdateUserRequest = {
        username: editFormData.username,
        password: editFormData.password,
        fullname: editFormData.fullname,
        roleId: editFormData.roleId,
        email: editFormData.email,
        phone: editFormData.phone,
        birthdate: editFormData.birthdate,
        address: editFormData.address,
        image: editFormData.image
      };
      
      console.log('Submitting user data:', {...formData, password: '[HIDDEN]'});
      const result = await updateUserById(selectedUser.userID, formData);
      
      if (result.success) {
        // Cập nhật danh sách người dùng
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.userID === selectedUser.userID
              ? { 
                  ...u, 
                  fullname: formData.fullname,
                  email: formData.email,
                  phone: formData.phone,
                  birthdate: formData.birthdate,
                  address: formData.address,
                  roleID: formData.roleId, // Chuyển đổi từ roleId sang roleID cho state
                }
              : u
          )
        );
        setSuccessMessage(result.message);
        
        // Đóng modal sau 1.5 giây
        setTimeout(() => {
          setIsEditModalOpen(false);
          setSuccessMessage(null);
        }, 1500);
      } else {
        setEditError(result.message);
      }
    } catch (err) {
      setEditError('Đã xảy ra lỗi khi cập nhật thông tin người dùng');
      console.error('Error updating user:', err);
    } finally {
      setIsSaving(false);
    }
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
  
  const roleOptions = [
    { value: "R01", label: "Quản trị viên" },
    { value: "R02", label: "Nhân viên" },
    { value: "R03", label: "Khách hàng" },
    { value: "R04", label: "Quản lí" },
  ];

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

      {/* Modal Edit User */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4" id="modal-title">
                    Chỉnh sửa thông tin người dùng
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    <span className="sr-only">Đóng</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="mb-4 bg-green-50 border border-green-100 rounded-md p-3 text-green-700 text-sm">
                    {successMessage}
                  </div>
                )}
                
                {editError && (
                  <div className="mb-4 bg-red-50 border border-red-100 rounded-md p-3 text-red-700 text-sm">
                    {editError}
                  </div>
                )}
                
                {/* Edit Form */}
                <form onSubmit={handleEditSubmit}>
                  <div className="grid grid-cols-1 gap-y-4">
                    {/* Username */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={editFormData.username}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Tên đăng nhập không thể thay đổi</p>
                    </div>
                    
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={editFormData.password}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                    
                    {/* Họ tên */}
                    <div>
                      <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        id="fullname"
                        value={editFormData.fullname}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    {/* Số điện thoại */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={editFormData.phone}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    {/* Địa chỉ */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={editFormData.address}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    {/* Ngày sinh */}
                    <div>
                      <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        name="birthdate"
                        id="birthdate"
                        value={editFormData.birthdate ? editFormData.birthdate.substring(0, 10) : ''}
                        onChange={(e) => {
                          console.log('Date value changed to:', e.target.value);
                          handleEditChange(e);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Định dạng: YYYY-MM-DD
                      </div>
                    </div>

                    {/* Vai trò */}
                    <div>
                      <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò
                      </label>
                      <select
                        name="roleId"
                        id="roleId"
                        value={editFormData.roleId}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:col-start-1 sm:text-sm"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
