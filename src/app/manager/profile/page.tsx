"use client";

import { useEffect, useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { getUserProfile, updateProfile, updateUserImage, User } from "@/lib/api/auth";

export default function ManagerProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const user = await getUserProfile(token);
      setProfile(user);
    };
    fetchProfile();
  }, []);

  // Hàm gọi updateProfile
  const handleUpdateProfile = async () => {
    if (!profile) return;
    setIsUpdating(true);
    try {
      // Gọi hàm updateProfile với dữ liệu profile hiện tại
      const result = await updateProfile({
        username: profile.username,
        fullname: profile.fullname,
        email: profile.email,
        phone: profile.phone,
        birthdate: profile.birthdate,
        address: profile.address,
      });
      if (result.success) {
        alert("Cập nhật thông tin thành công!");
      } else {
        alert(result.message || "Cập nhật thất bại!");
      }
    } catch (e) {
      alert("Có lỗi khi cập nhật thông tin!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !profile) return;
    const file = e.target.files[0];
    if (!file) return;
    setIsUpdating(true);
    
    try {
      // Gọi hàm updateUserImage chỉ với file ảnh mới
      const result = await updateUserImage(file);
      if (result.success && result.imageUrl) {
        setProfile({ ...profile, image: result.imageUrl });
        alert("Cập nhật ảnh đại diện thành công!");
      } else {
        alert(result.message || "Cập nhật ảnh thất bại!");
      }
    } catch (e) {
      alert("Có lỗi khi cập nhật ảnh!");
    } finally {
      setIsUpdating(false);
      window.location.reload();
    }
  };

  if (!profile) {
    return null; // Hoặc có thể hiển thị một loader ở đây
  }

  return (
    <div className="min-h-screen bg-[#f6fafd] py-10">
      {/* Header */}
      <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[#099D67] to-[#0fbf7f] p-8 flex flex-col md:flex-row items-center justify-between relative">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl bg-white/30 flex items-center justify-center overflow-hidden relative group">
            {profile.image ? (
              <img
                src={`http://localhost:5198/${profile.image}`}
                alt={profile.fullname}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-14 h-14 text-white" />
            )}
            <label className="absolute bottom-1 right-1 bg-white/80 rounded-full p-1 cursor-pointer shadow group-hover:opacity-100 opacity-80 transition">
              <PencilIcon className="w-5 h-5 text-green-700" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isUpdating}
              />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{profile.fullname}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium text-white bg-white/20 px-3 py-1 rounded-full text-sm">
                Mã nhân viên: <span className="font-semibold">{profile.userID}</span>
              </span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Thông tin cá nhân
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <UserIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Tên đăng nhập</span>
            </div>
            <div className="text-gray-900">{profile.username}</div>
          </div>
          
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Email</span>
            </div>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-gray-900"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              disabled={isUpdating}
            />
          </div>
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <span className="font-medium">Giới tính</span>
            </div>
            <div className="text-gray-900">{profile.gender || "Chưa cập nhật"}</div>
          </div>
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <PhoneIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Số điện thoại</span>
            </div>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-gray-900"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={isUpdating}
            />
          </div>
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Ngày sinh</span>
            </div>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-gray-900"
              value={profile.birthdate ? profile.birthdate.slice(0, 10) : ""}
              onChange={(e) =>
                setProfile({ ...profile, birthdate: e.target.value })
              }
              disabled={isUpdating}
            />
          </div>
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Địa chỉ</span>
            </div>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-gray-900"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              disabled={isUpdating}
            />
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={handleUpdateProfile}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            {isUpdating ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </button>
        </div>
      </div>
    </div>
  );
}
