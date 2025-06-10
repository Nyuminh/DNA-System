"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ArrowLeftIcon,
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,  KeyIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  label: string;
  description: string;  type: "toggle" | "select" | "input" | "password" | "action";
  value?: string | boolean;
  options?: { value: string; label: string }[];
  action?: () => void;
}

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: "Nguyễn Văn Manager",
    email: "manager@dnatest.com",
    phone: "0123456789",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    resultNotifications: true,
    systemNotifications: true,
    marketingEmails: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    autoLogout: true,
    
    // System Settings
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    currency: "VND",
    dateFormat: "dd/mm/yyyy",
    
    // Business Settings
    autoApproveOrders: false,
    requireSignature: true,
    defaultTestDuration: "7",
    labWorkingHours: "8-17"
  });

  const [activeTab, setActiveTab] = useState("profile");
  const handleSettingChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save settings
    alert("Cài đặt đã được lưu thành công!");
  };

  const handleResetPassword = () => {
    if (!settings.currentPassword || !settings.newPassword || !settings.confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin mật khẩu!");
      return;
    }
    
    if (settings.newPassword !== settings.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    
    // API call to change password
    alert("Mật khẩu đã được thay đổi thành công!");
    handleSettingChange("currentPassword", "");
    handleSettingChange("newPassword", "");
    handleSettingChange("confirmPassword", "");
  };

  const settingsSections: SettingsSection[] = [
    {
      id: "profile",
      title: "Thông tin cá nhân",
      description: "Quản lý thông tin tài khoản và mật khẩu",
      icon: <UserIcon className="h-6 w-6" />,
      items: [
        {
          id: "fullName",
          label: "Họ và tên",
          description: "Tên hiển thị của bạn trong hệ thống",
          type: "input",
          value: settings.fullName
        },
        {
          id: "email",
          label: "Email",
          description: "Địa chỉ email chính",
          type: "input",
          value: settings.email
        },
        {
          id: "phone",
          label: "Số điện thoại",
          description: "Số điện thoại liên hệ",
          type: "input",
          value: settings.phone
        }
      ]
    },
    {
      id: "notifications",
      title: "Thông báo",
      description: "Cấu hình các loại thông báo",
      icon: <BellIcon className="h-6 w-6" />,
      items: [
        {
          id: "emailNotifications",
          label: "Thông báo Email",
          description: "Nhận thông báo qua email",
          type: "toggle",
          value: settings.emailNotifications
        },
        {
          id: "smsNotifications",
          label: "Thông báo SMS",
          description: "Nhận thông báo qua tin nhắn",
          type: "toggle",
          value: settings.smsNotifications
        },
        {
          id: "orderNotifications",
          label: "Thông báo đơn hàng",
          description: "Thông báo khi có đơn hàng mới",
          type: "toggle",
          value: settings.orderNotifications
        },
        {
          id: "resultNotifications",
          label: "Thông báo kết quả",
          description: "Thông báo khi có kết quả xét nghiệm",
          type: "toggle",
          value: settings.resultNotifications
        },
        {
          id: "systemNotifications",
          label: "Thông báo hệ thống",
          description: "Thông báo về cập nhật hệ thống",
          type: "toggle",
          value: settings.systemNotifications
        },
        {
          id: "marketingEmails",
          label: "Email marketing",
          description: "Nhận email quảng cáo và khuyến mãi",
          type: "toggle",
          value: settings.marketingEmails
        }
      ]
    },
    {
      id: "security",
      title: "Bảo mật",
      description: "Cài đặt bảo mật tài khoản",
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      items: [
        {
          id: "twoFactorAuth",
          label: "Xác thực 2 bước",
          description: "Bảo mật tài khoản với xác thực 2 bước",
          type: "toggle",
          value: settings.twoFactorAuth
        },
        {
          id: "sessionTimeout",
          label: "Thời gian phiên làm việc",
          description: "Tự động đăng xuất sau (phút)",
          type: "select",
          value: settings.sessionTimeout,
          options: [
            { value: "15", label: "15 phút" },
            { value: "30", label: "30 phút" },
            { value: "60", label: "1 giờ" },
            { value: "120", label: "2 giờ" },
            { value: "480", label: "8 giờ" }
          ]
        },
        {
          id: "autoLogout",
          label: "Tự động đăng xuất",
          description: "Đăng xuất khi không hoạt động",
          type: "toggle",
          value: settings.autoLogout
        }
      ]
    },
    {
      id: "system",
      title: "Hệ thống",
      description: "Cài đặt ngôn ngữ và giao diện",
      icon: <GlobeAltIcon className="h-6 w-6" />,
      items: [
        {
          id: "language",
          label: "Ngôn ngữ",
          description: "Ngôn ngữ hiển thị",
          type: "select",
          value: settings.language,
          options: [
            { value: "vi", label: "Tiếng Việt" },
            { value: "en", label: "English" }
          ]
        },
        {
          id: "timezone",
          label: "Múi giờ",
          description: "Múi giờ địa phương",
          type: "select",
          value: settings.timezone,
          options: [
            { value: "Asia/Ho_Chi_Minh", label: "GMT+7 (Việt Nam)" },
            { value: "Asia/Bangkok", label: "GMT+7 (Bangkok)" },
            { value: "Asia/Singapore", label: "GMT+8 (Singapore)" }
          ]
        },
        {
          id: "currency",
          label: "Đơn vị tiền tệ",
          description: "Đơn vị tiền tệ hiển thị",
          type: "select",
          value: settings.currency,
          options: [
            { value: "VND", label: "VNĐ (Việt Nam Đồng)" },
            { value: "USD", label: "USD (US Dollar)" }
          ]
        },
        {
          id: "dateFormat",
          label: "Định dạng ngày",
          description: "Cách hiển thị ngày tháng",
          type: "select",
          value: settings.dateFormat,
          options: [
            { value: "dd/mm/yyyy", label: "DD/MM/YYYY" },
            { value: "mm/dd/yyyy", label: "MM/DD/YYYY" },
            { value: "yyyy-mm-dd", label: "YYYY-MM-DD" }
          ]
        }
      ]
    },
    {
      id: "business",
      title: "Cài đặt kinh doanh",
      description: "Cấu hình quy trình kinh doanh",
      icon: <DocumentTextIcon className="h-6 w-6" />,
      items: [
        {
          id: "autoApproveOrders",
          label: "Tự động duyệt đơn",
          description: "Tự động duyệt đơn hàng mới",
          type: "toggle",
          value: settings.autoApproveOrders
        },
        {
          id: "requireSignature",
          label: "Yêu cầu chữ ký",
          description: "Yêu cầu chữ ký điện tử cho kết quả",
          type: "toggle",
          value: settings.requireSignature
        },
        {
          id: "defaultTestDuration",
          label: "Thời gian xét nghiệm mặc định",
          description: "Số ngày làm việc dự kiến",
          type: "select",
          value: settings.defaultTestDuration,
          options: [
            { value: "3", label: "3 ngày" },
            { value: "5", label: "5 ngày" },
            { value: "7", label: "7 ngày" },
            { value: "10", label: "10 ngày" }
          ]
        },
        {
          id: "labWorkingHours",
          label: "Giờ làm việc phòng lab",
          description: "Khung giờ hoạt động",
          type: "select",
          value: settings.labWorkingHours,
          options: [
            { value: "8-17", label: "8:00 - 17:00" },
            { value: "7-16", label: "7:00 - 16:00" },
            { value: "9-18", label: "9:00 - 18:00" }
          ]
        }
      ]
    }
  ];

  const tabs = [
    { id: "profile", label: "Hồ sơ", icon: <UserIcon className="h-5 w-5" /> },
    { id: "notifications", label: "Thông báo", icon: <BellIcon className="h-5 w-5" /> },
    { id: "security", label: "Bảo mật", icon: <ShieldCheckIcon className="h-5 w-5" /> },
    { id: "system", label: "Hệ thống", icon: <GlobeAltIcon className="h-5 w-5" /> },
    { id: "business", label: "Kinh doanh", icon: <DocumentTextIcon className="h-5 w-5" /> }
  ];

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case "toggle":
        return (
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">{item.label}</label>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <button
              onClick={() => handleSettingChange(item.id, !item.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );      case "select":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">{item.label}</label>
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <select
              value={typeof item.value === 'string' ? item.value : ''}
              onChange={(e) => handleSettingChange(item.id, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {item.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "input":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">{item.label}</label>
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <input
              type="text"
              value={typeof item.value === 'string' ? item.value : ''}
              onChange={(e) => handleSettingChange(item.id, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        );

      case "password":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">{item.label}</label>
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={typeof item.value === 'string' ? item.value : ''}
                onChange={(e) => handleSettingChange(item.id, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        );

      case "action":
        return (
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">{item.label}</label>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <button
              onClick={item.action}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Thực hiện
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const activeSection = settingsSections.find(section => section.id === activeTab);

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
                <Cog6ToothIcon className="h-6 w-6 text-gray-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Danh mục cài đặt</h3>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-none transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-3">{tab.label}</span>
                    <ChevronRightIcon className="ml-auto h-4 w-4" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    {activeSection.icon}
                    <div className="ml-3">
                      <h2 className="text-xl font-semibold text-gray-900">{activeSection.title}</h2>
                      <p className="text-sm text-gray-500">{activeSection.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      {/* Profile Information */}
                      <div className="space-y-4">
                        {activeSection.items.map((item) => (
                          <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                            {renderSettingItem(item)}
                          </div>
                        ))}
                      </div>

                      {/* Password Change Section */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Đổi mật khẩu</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Mật khẩu hiện tại
                            </label>
                            <input
                              type="password"
                              value={settings.currentPassword}
                              onChange={(e) => handleSettingChange("currentPassword", e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Mật khẩu mới
                            </label>
                            <input
                              type="password"
                              value={settings.newPassword}
                              onChange={(e) => handleSettingChange("newPassword", e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Xác nhận mật khẩu mới
                            </label>
                            <input
                              type="password"
                              value={settings.confirmPassword}
                              onChange={(e) => handleSettingChange("confirmPassword", e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                          <button
                            onClick={handleResetPassword}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <KeyIcon className="h-4 w-4 mr-2" />
                            Đổi mật khẩu
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab !== "profile" && (
                    <div className="space-y-4">
                      {activeSection.items.map((item) => (
                        <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                          {renderSettingItem(item)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
