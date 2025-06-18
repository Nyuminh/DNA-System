"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ArrowLeftIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  isRead: boolean;
  category: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Xét nghiệm mới được đặt",
      message: "Khách hàng Nguyễn Văn A đã đặt xét nghiệm ADN cha con. Mã đơn: #XN2025001",
      type: "info",
      timestamp: "2025-06-09T10:30:00Z",
      isRead: false,
      category: "Đơn hàng"
    },
    {
      id: "2",
      title: "Kết quả xét nghiệm đã sẵn sàng",
      message: "Kết quả xét nghiệm cho mã đơn #XN2025002 đã hoàn thành và sẵn sàng gửi cho khách hàng.",
      type: "success",
      timestamp: "2025-06-09T09:15:00Z",
      isRead: false,
      category: "Kết quả"
    },
    {
      id: "3",
      title: "Cảnh báo: Mẫu xét nghiệm cần xử lý",
      message: "Mẫu xét nghiệm #XN2025003 đã quá thời gian quy định. Vui lòng kiểm tra và xử lý.",
      type: "warning",
      timestamp: "2025-06-09T08:45:00Z",
      isRead: true,
      category: "Cảnh báo"
    },
    {
      id: "4",
      title: "Lỗi hệ thống",
      message: "Hệ thống thanh toán gặp sự cố tạm thời. Đang khắc phục.",
      type: "error",
      timestamp: "2025-06-08T16:20:00Z",
      isRead: true,
      category: "Hệ thống"
    },
    {
      id: "5",
      title: "Báo cáo doanh thu tháng 5",
      message: "Báo cáo doanh thu tháng 5/2025 đã được tạo và sẵn sàng để xem.",
      type: "info",
      timestamp: "2025-06-01T14:00:00Z",
      isRead: true,
      category: "Báo cáo"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XMarkIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const categories = ["all", "Đơn hàng", "Kết quả", "Cảnh báo", "Hệ thống", "Báo cáo"];
  
  const filteredNotifications = selectedCategory === "all" 
    ? notifications 
    : notifications.filter(notif => notif.category === selectedCategory);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link 
                href="/manager"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-gray-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category === "all" ? "Tất cả" : category}
                    {category !== "all" && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({notifications.filter(notif => notif.category === category).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Notifications */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <BellIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
                  <p className="text-gray-500">Bạn đã xem hết tất cả thông báo.</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg shadow-md border-l-4 p-6 transition-all hover:shadow-lg ${
                      getTypeColor(notification.type)
                    } ${!notification.isRead ? "bg-opacity-100" : "bg-opacity-50"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-semibold ${
                              !notification.isRead ? "text-gray-900" : "text-gray-700"
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatTime(notification.timestamp)}</span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {notification.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
