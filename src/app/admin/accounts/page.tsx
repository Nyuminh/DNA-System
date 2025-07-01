"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { 
  UserIcon, 
  EyeIcon, 
  PencilIcon, 
  LockClosedIcon, 
  LockOpenIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { getAllUsers, getUserById, updateUser, AdminUser, UpdateUserRequest } from "@/lib/api/admin";

export default function AccountsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [rawUserData, setRawUserData] = useState<any>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !formData) return;
    
    setUpdateLoading(true);
    setUpdateMessage(null);
    
    try {
      // Ensure we're sending all required fields and preserving existing data
      const updateData: UpdateUserRequest = {
        fullname: formData.fullname.trim() || selectedUser.fullname,
        gender: formData.gender || selectedUser.gender || 'Khác',
        roleID: formData.roleID || selectedUser.roleID,
        email: formData.email.trim() || selectedUser.email,
        phone: formData.phone.trim() || selectedUser.phone,
        birthdate: formData.birthdate || selectedUser.birthdate,
        image: formData.image?.trim() || selectedUser.image,
        address: formData.address?.trim() || selectedUser.address,
        status: formData.status || selectedUser.status || 'active'
      };
      
      console.log('Dữ liệu form trước khi gửi:', updateData);
      const result = await updateUser(selectedUser.userID, updateData);
      
      if (result.success && result.user) {
        // Update user in the list
        setUsers(prev => 
          prev.map(user => 
            user.userID === selectedUser.userID ? result.user! : user
          )
        );
        
        // Update selected user
        setSelectedUser(result.user);
        
        // Update form data with the latest values
        setFormData({
          fullname: result.user.fullname || '',
          gender: result.user.gender || 'Khác',
          roleID: result.user.roleID || 'R03',
          email: result.user.email || '',
          phone: result.user.phone || '',
          birthdate: result.user.birthdate || '',
          image: result.user.image || '',
          address: result.user.address || '',
          status: result.user.status || 'active'
        });
        
        // Show success message
        setUpdateMessage({
          text: result.message || 'Cập nhật thành công',
          type: 'success'
        });
        
        // Exit edit mode after success
        setIsEditMode(false);
      } else {
        // Show error message
        setUpdateMessage({
          text: result.message || 'Cập nhật thất bại',
          type: 'error'
        });
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      setUpdateMessage({
        text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật',
        type: 'error'
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const editUser = async (user: AdminUser) => {
    try {
      setModalLoading(true);
      setIsModalOpen(true);
      setIsEditMode(false);
      setUpdateMessage(null);
      
      // Gọi API để lấy thông tin chi tiết của user
      const result = await getUserById(user.userID);
      
      if (result.success && result.user) {
        // Lưu dữ liệu gốc từ API
        setRawUserData(result.rawData);
        
        // Đảm bảo hiển thị đầy đủ thông tin của account
        const completeUser = {
          ...user,
          ...result.user,
          // Đảm bảo các trường quan trọng luôn có giá trị
          userID: result.user.userID || user.userID,
          username: result.user.username || user.username,
          fullname: result.user.fullname || user.fullname,
          gender: result.user.gender || user.gender,
          roleID: result.user.roleID || user.roleID,
          email: result.user.email || user.email,
          phone: result.user.phone || user.phone,
          birthdate: result.user.birthdate || user.birthdate,
          image: result.user.image || user.image,
          address: result.user.address || user.address,
          status: result.user.status || user.status,
          createdAt: result.user.createdAt || user.createdAt,
          lastLogin: result.user.lastLogin || user.lastLogin
        };
        
        setSelectedUser(completeUser);
        
        // Initialize form data with all fields from the API response
        setFormData({
          fullname: completeUser.fullname || '',
          gender: completeUser.gender || 'Khác',
          roleID: completeUser.roleID || 'R03',
          email: completeUser.email || '',
          phone: completeUser.phone || '',
          birthdate: completeUser.birthdate || '',
          image: completeUser.image || '',
          address: completeUser.address || '',
          status: completeUser.status || 'active'
        });
      } else {
        // Nếu không lấy được từ API, hiển thị thông tin hiện có
        setRawUserData(null);
        setSelectedUser(user);
        
        // Initialize form data with current user data
        setFormData({
          fullname: user.fullname || '',
          gender: user.gender || 'Khác',
          roleID: user.roleID || 'R03',
          email: user.email || '',
          phone: user.phone || '',
          birthdate: user.birthdate || '',
          image: user.image || '',
          address: user.address || '',
          status: user.status || 'active'
        });
        
        console.error('Không thể lấy thông tin chi tiết:', result.message);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      // Nếu có lỗi, hiển thị thông tin hiện có
      setRawUserData(null);
      setSelectedUser(user);
      
      // Initialize form data with current user data
      setFormData({
        fullname: user.fullname || '',
        gender: user.gender || 'Khác',
        roleID: user.roleID || 'R03',
        email: user.email || '',
        phone: user.phone || '',
        birthdate: user.birthdate || '',
        image: user.image || '',
        address: user.address || '',
        status: user.status || 'active'
      });
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData(null);
    setIsEditMode(false);
    setUpdateMessage(null);
    setRawUserData(null);
  };

  const resetForm = () => {
    if (!selectedUser) return;
    
    // Reset form data to original user values
    setFormData({
      fullname: selectedUser.fullname || '',
      gender: selectedUser.gender || 'Khác',
      roleID: selectedUser.roleID || 'R03',
      email: selectedUser.email || '',
      phone: selectedUser.phone || '',
      birthdate: selectedUser.birthdate || '',
      image: selectedUser.image || '',
      address: selectedUser.address || '',
      status: selectedUser.status || 'active'
    });
    
    setUpdateMessage(null);
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
              <option value="R01">Quản trị viên</option>
              <option value="R02">Nhân viên</option>
              <option value="R03">Khách Hàng</option>
              <option value="R04">Quản lí</option>
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
      
      {/* User Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditMode ? 'Chỉnh sửa thông tin người dùng' : 'Thông tin chi tiết người dùng'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {modalLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : selectedUser && formData ? (
                <>
                  {updateMessage && (
                    <div className={`mb-4 p-3 rounded-lg ${updateMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      <p className="text-sm">{updateMessage.text}</p>
                    </div>
                  )}
                  
                  {isEditMode ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={getUserImage(selectedUser)}
                            alt={selectedUser.fullname} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/default-avatar.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="mb-3">
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              id="fullname"
                              name="fullname"
                              value={formData.fullname}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">User ID:</span> {selectedUser.userID} (không thể chỉnh sửa)
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Username:</span> {selectedUser.username} (không thể chỉnh sửa)
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span></label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                          <input
                            type="date"
                            id="birthdate"
                            name="birthdate"
                            value={formData.birthdate ? formData.birthdate.split('T')[0] : ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="roleID" className="block text-sm font-medium text-gray-700 mb-1">Vai trò <span className="text-red-500">*</span></label>
                          <select
                            id="roleID"
                            name="roleID"
                            value={formData.roleID}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          >
                            <option value="R01">Quản trị viên</option>
                            <option value="R02">Nhân viên</option>
                            <option value="R03">Khách Hàng</option>
                            <option value="R04">Quản lí</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                          <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                            <option value="suspended">Bị khóa</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
                          <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="https://example.com/image.jpg"
                          />
                          <p className="text-xs text-gray-500 mt-1">Để trống để sử dụng ảnh mặc định theo vai trò</p>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                          <textarea
                            id="address"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-4">
                          <span className="text-red-500">*</span> Trường bắt buộc
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium flex items-center gap-1"
                            disabled={updateLoading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            <span>Khôi phục</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditMode(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                            disabled={updateLoading}
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-1"
                            disabled={updateLoading}
                          >
                            {updateLoading ? (
                              <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                <span>Đang lưu...</span>
                              </>
                            ) : (
                              <>
                                <CheckIcon className="h-4 w-4" />
                                <span>Lưu thay đổi</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={getUserImage(selectedUser)}
                            alt={selectedUser.fullname} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/default-avatar.jpg";
                            }}
                          />
                        </div>
                        <div className="text-center sm:text-left">
                          <h4 className="text-xl font-bold text-gray-900">{selectedUser.fullname}</h4>
                          <p className="text-gray-500">{selectedUser.username}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {getRoleBadge(selectedUser.roleID)}
                            {getStatusBadge(selectedUser.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">User ID</h5>
                          <p className="text-gray-900">{selectedUser.userID}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Username</h5>
                          <p className="text-gray-900">{selectedUser.username}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Email</h5>
                          <p className="text-gray-900">{selectedUser.email}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</h5>
                          <p className="text-gray-900">{selectedUser.phone}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Giới tính</h5>
                          <p className="text-gray-900">{selectedUser.gender}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Ngày sinh</h5>
                          <p className="text-gray-900">
                            {selectedUser.birthdate ? new Date(selectedUser.birthdate).toLocaleDateString('vi-VN') : '-'}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Vai trò</h5>
                          <p className="text-gray-900">{getRoleName(selectedUser.roleID)}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Trạng thái tài khoản</h5>
                          <div>{getStatusBadge(selectedUser.status)}</div>
                        </div>
                        <div className="sm:col-span-2">
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</h5>
                          <p className="text-gray-900">{selectedUser.address || '-'}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Ngày tạo tài khoản</h5>
                          <p className="text-gray-900">
                            {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : '-'}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Đăng nhập gần nhất</h5>
                          <p className="text-gray-900">
                            {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString('vi-VN') : '-'}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">URL Hình ảnh</h5>
                          <p className="text-gray-900 break-all">
                            {selectedUser.image || '-'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={closeModal}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                        >
                          Đóng
                        </button>
                        <button
                          onClick={() => setIsEditMode(true)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-1"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Không thể tải thông tin người dùng
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
