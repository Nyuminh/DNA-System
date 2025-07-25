"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { getUserProfile, User } from "@/lib/api/auth"; // Đảm bảo đúng đường dẫn

export default function ManagerProfile() {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const user = await getUserProfile(token);
      setProfile(user);
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return null; // Hoặc có thể hiển thị một loader ở đây
  }

  return (
    <div className="min-h-screen bg-[#f6fafd] py-10">
      {/* Header */}
      <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[#099D67] to-[#0fbf7f] p-8 flex flex-col md:flex-row items-center justify-between relative">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl bg-white/30 flex items-center justify-center overflow-hidden">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={profile.fullname}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-14 h-14 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{profile.fullname}</h1>

          
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
            <div className="text-gray-900">{profile.email}</div>
          </div>
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <UserIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Họ và tên</span>
            </div>
            <div className="text-gray-900">{profile.fullname}</div>
          </div>
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <PhoneIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Số điện thoại</span>
            </div>
            <div className="text-gray-900">{profile.phone}</div>
          </div>
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Ngày sinh</span>
            </div>
            <div className="text-gray-900">
              {profile.birthdate
                ? new Date(profile.birthdate).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </div>
          </div>
          <div>
            <div className="flex items-center text-gray-500 mb-1">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Địa chỉ</span>
            </div>
            <div className="text-gray-900">{profile.address}</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
