"use client";

import { useState } from 'react';
import {
  BellIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
  actionRequired?: boolean;
}

export default function StaffNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Kit hết hạn sử dụng',
      message: 'Kit KIT004 sẽ hết hạn vào ngày 25/01/2024. Vui lòng kiểm tra và xử lý.',
      type: 'warning',
      isRead: false,
      createdAt: '2024-01-23T10:30:00Z',
      actionRequired: true
    },
    {
      id: '2',
      title: 'Kết quả xét nghiệm cần xử lý khẩn cấp',
      message: 'Test TEST005 của khách hàng Hoàng Thị E cần xử lý ưu tiên cao.',
      type: 'error',
      isRead: false,
      createdAt: '2024-01-23T09:15:00Z',
      actionRequired: true
    },
    {
      id: '3',
      title: 'Hoàn thành xét nghiệm',
      message: 'Bạn đã hoàn thành thành công kết quả xét nghiệm TEST003.',
      type: 'success',
      isRead: true,
      createdAt: '2024-01-22T16:45:00Z'
    },
    {
      id: '4',
      title: 'Cập nhật quy trình xét nghiệm',
      message: 'Quy trình xét nghiệm DNA đã được cập nhật. Vui lòng xem tài liệu mới.',
      type: 'info',
      isRead: true,
      createdAt: '2024-01-22T08:00:00Z'
    },
    {
      id: '5',
      title: 'Kit cần bổ sung',
      message: 'Số lượng kit loại Paternity Test đang thấp (< 10). Cần đặt hàng bổ sung.',
      type: 'warning',
      isRead: false,
      createdAt: '2024-01-21T14:20:00Z',
      actionRequired: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'action-required'>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-slate-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      case 'warning':
        return 'border-l-orange-500 bg-orange-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-slate-500 bg-slate-50';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('vi', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'action-required':
        return notification.actionRequired;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
          <p className="text-slate-600">Quản lý thông báo và cập nhật quan trọng</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{notifications.length}</div>
              <div className="text-sm text-slate-500">Tổng thông báo</div>
            </div>
            <BellIcon className="h-8 w-8 text-slate-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <div className="text-sm text-slate-500">Chưa đọc</div>
            </div>
            <InformationCircleIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{actionRequiredCount}</div>
              <div className="text-sm text-slate-500">Cần xử lý</div>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-slate-700">Lọc thông báo:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('action-required')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'action-required'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cần xử lý ({actionRequiredCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${getNotificationColor(notification.type)} ${
              !notification.isRead ? 'border-r-4 border-r-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notification.title}
                      {notification.actionRequired && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Cần xử lý
                        </span>
                      )}
                    </h3>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-slate-500">
                        {formatDate(notification.createdAt)}
                      </span>
                      
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className={`text-sm ${!notification.isRead ? 'text-slate-700' : 'text-slate-600'}`}>
                    {notification.message}
                  </p>
                  
                  {notification.actionRequired && (
                    <div className="mt-3 flex items-center space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                        Xử lý ngay
                      </button>
                      <button className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg hover:bg-slate-200 transition-colors">
                        Xem chi tiết
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <BellIcon className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">
            {filter === 'all' 
              ? 'Không có thông báo nào'
              : filter === 'unread'
              ? 'Không có thông báo chưa đọc'
              : 'Không có thông báo cần xử lý'
            }
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {filter === 'all' 
              ? 'Bạn sẽ nhận được thông báo khi có cập nhật mới.'
              : 'Tất cả thông báo đã được xử lý.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
