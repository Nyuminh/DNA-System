"use client";

import { useState, useEffect, useRef } from "react";
import {
  UserCircleIcon,
  CameraIcon,
  CheckIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

// Giả lập API, bạn thay bằng API thật của manager
const managerProfileAPI = {
  getProfile: async () => ({
    success: true,
    profile: {
      username: "manager2",
      fullname: "Võ Thị Thanh Trúc",
      email: "TrucVTT@gmail.com",
      phone: "0945123789",
      address: "101 Nguyễn Huệ, TP.Huế",
    },
  }),
  updateProfile: async (data: any) => ({
    success: true,
  }),
};

export default function ManagerProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Thông tin cơ bản
  const [profile, setProfile] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
    avatar: null as string | null,
    birthDate: "1990-01-01",
    gender: "female",
    department: "Quản lý Dịch vụ",
    position: "Trưởng phòng Quản lý",
    employeeId: "MGR001",
    startDate: "2020-01-15",
    status: "active",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "contact" | "work">(
    "basic"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const result = await managerProfileAPI.getProfile();
        if (result.success && result.profile) {
          setProfile((prev) => ({
            ...prev,
            ...result.profile,
          }));
        } else {
          setError("Không thể tải thông tin cá nhân");
        }
      } catch {
        setError("Đã xảy ra lỗi khi tải thông tin");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatar: url }));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const result = await managerProfileAPI.updateProfile({
        fullname: profile.fullname,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        birthDate: profile.birthDate,
        gender: profile.gender,
      });

      if (result.success) {
        setSuccess("Cập nhật thông tin thành công!");
        setTimeout(() => setSuccess(null), 3000);
        setIsEditing(false);
      } else {
        setError(result.message || "Có lỗi xảy ra khi cập nhật thông tin");
      }
    } catch {
      setError("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-8">
          <Link
            href="/manager"
            className="flex items-center px-4 py-2 bg-white/80 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all duration-200 shadow"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Quay về Dashboard
          </Link>
          <h1 className="ml-6 text-3xl font-bold text-indigo-900 tracking-tight">
            Hồ sơ cá nhân
          </h1>
        </div>

        {/* Toast messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600 text-lg"
            >
              ×
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center">
            <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm text-green-700">{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-400 hover:text-green-600 text-lg"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center relative">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.fullname}
                    width={128}
                    height={128}
                    className="rounded-full object-cover border-4 border-indigo-200 shadow"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <UserCircleIcon className="w-20 h-20 text-white" />
                  </div>
                )}
                {isEditing && (
                  <>
                    <button
                      className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                    >
                      <CameraIcon className="h-5 w-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {profile.fullname}
              </h2>
              <p className="text-indigo-600 font-medium mb-1">
                {profile.position}
              </p>
              <p className="text-gray-500 text-sm mb-4">{profile.department}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã NV:</span>
                  <span className="font-medium">{profile.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày vào:</span>
                  <span className="font-medium">
                    {new Date(profile.startDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đang hoạt động
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg mb-6">
              <div className="border-b border-gray-200 flex space-x-8 px-8 pt-6">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`py-3 px-1 border-b-2 font-medium text-base transition-all ${
                    activeTab === "basic"
                      ? "border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-200"
                  }`}
                >
                  Thông tin cơ bản
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`py-3 px-1 border-b-2 font-medium text-base transition-all ${
                    activeTab === "contact"
                      ? "border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-200"
                  }`}
                >
                  Thông tin liên hệ
                </button>
                <button
                  onClick={() => setActiveTab("work")}
                  className={`py-3 px-1 border-b-2 font-medium text-base transition-all ${
                    activeTab === "work"
                      ? "border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-200"
                  }`}
                >
                  Thông tin công việc
                </button>
                <div className="flex-1" />
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <form onSubmit={handleSaveProfile} className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
                    >
                      {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </form>
                )}
              </div>
              <div className="p-8">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2">Đang tải thông tin...</span>
                  </div>
                ) : (
                  <>
                    {activeTab === "basic" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            value={profile.fullname}
                            onChange={(e) =>
                              setProfile({ ...profile, fullname: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày sinh
                          </label>
                          <input
                            type="date"
                            value={profile.birthDate}
                            onChange={(e) =>
                              setProfile({ ...profile, birthDate: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính
                          </label>
                          <select
                            value={profile.gender}
                            onChange={(e) =>
                              setProfile({ ...profile, gender: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên đăng nhập
                          </label>
                          <input
                            type="text"
                            value={profile.username}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                          />
                        </div>
                      </div>
                    )}
                    {activeTab === "contact" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({ ...profile, phone: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ
                          </label>
                          <input
                            type="text"
                            value={profile.address}
                            onChange={(e) =>
                              setProfile({ ...profile, address: e.target.value })
                            }
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                              isEditing
                                ? "border-gray-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          />
                        </div>
                      </div>
                    )}
                    {activeTab === "work" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phòng ban
                          </label>
                          <input
                            type="text"
                            value={profile.department}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chức vụ
                          </label>
                          <input
                            type="text"
                            value={profile.position}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày bắt đầu
                          </label>
                          <input
                            type="date"
                            value={profile.startDate}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                          </label>
                          <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Đang hoạt động
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
