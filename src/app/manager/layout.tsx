"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserIcon, 
  ChartBarIcon, 
  ArrowRightOnRectangleIcon,
  BeakerIcon,
  AcademicCapIcon,
  HomeIcon,
  BellIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userEmail, setUserEmail] = useState<string>('');

  // Fetch user email if not available in AuthContext
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!user?.email || user.email === 'manager@dnatest.com') {
        try {
          const { adminProfileAPI } = await import('@/lib/api/admin');
          const result = await adminProfileAPI.getProfile();
          if (result.success && result.profile?.email) {
            setUserEmail(result.profile.email);
          }
        } catch (error) {
          console.error('Error fetching user email:', error);
        }
      } else {
        setUserEmail(user.email);
      }
    };

    fetchUserEmail();
  }, [user]);

  const displayEmail = userEmail || user?.email || 'manager@dnatest.com';

  const isActive = (path: string) => {
    if (path === "/manager" && pathname === "/manager") return true;
    if (path !== "/manager" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('@/lib/api/auth');
      // Call logout API
      const result = await logoutUser();
      console.log('Manager logout result:', result.message);
      
      // Clear AuthContext state
      logout();
      
      // Redirect to login
      router.push('/auth/login');
    } catch (error) {
      console.error('Manager logout error:', error);
      // Force logout nếu API fails
      const { forceLogout } = await import('@/lib/api/auth');
      forceLogout();
      
      // Clear AuthContext state
      logout();
      
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <div className="hidden md:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      DNA Testing Service
                    </h1>
                    <p className="text-xs text-slate-500 -mt-1">Manager Dashboard</p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-4 px-4 py-2 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-700">25</div>
                  <div className="text-xs text-slate-500">Services</div>
                </div>
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-green-600">Active</div>
                  <div className="text-xs text-slate-500">Status</div>
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Manager Profile */}
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-50">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-700">{user?.username || 'manager'}</div>
                  <div className="text-xs text-slate-500">Quản lý dịch vụ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-slate-200 h-screen sticky top-0 flex flex-col">
          <nav className="flex-1 mt-6 px-4">
            <div className="space-y-1">              {/* Home Page Link */}
              <Link
                href="/"
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <HomeIcon className="mr-3 h-5 w-5" />
                Trang chủ
              </Link>

              {/* Profile Management - Moved up */}
              <Link
                href="/manager/profile"
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/manager/profile")
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <UserIcon className="mr-3 h-5 w-5" />
                Hồ sơ cá nhân
              </Link>

              {/* Dashboard */}
              <Link
                href="/manager"
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/manager") && pathname === "/manager"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <ChartBarIcon className="mr-3 h-5 w-5" />
                Dashboard
              </Link>

              {/* Service Management */}
              <div className="space-y-1">
                <Link
                  href="/manager/services"
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive("/manager/services")
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <BeakerIcon className="mr-3 h-5 w-5" />
                  Quản lý dịch vụ
                </Link>
                
                <Link
                  href="/manager/service-list"
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ml-6 ${
                    isActive("/manager/service-list")
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <ClipboardDocumentListIcon className="mr-3 h-4 w-4" />
                  Danh sách dịch vụ
                </Link>
                
                <Link
                  href="/manager/add-service"
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ml-6 ${
                    isActive("/manager/add-service")
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <BeakerIcon className="mr-3 h-4 w-4" />
                  Thêm dịch vụ
                </Link>
              </div>

              {/* Course Management */}
              <div className="space-y-1">
                <Link
                  href="/manager/courses"
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive("/manager/courses")
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <AcademicCapIcon className="mr-3 h-5 w-5" />
                  Quản lý khóa học
                </Link>
                
                <Link
                  href="/manager/course-list"
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ml-6 ${
                    isActive("/manager/course-list")
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <ClipboardDocumentListIcon className="mr-3 h-4 w-4" />
                  Danh sách khóa học
                </Link>
                
                <Link
                  href="/manager/add-course"
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ml-6 ${
                    isActive("/manager/add-course")
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <AcademicCapIcon className="mr-3 h-4 w-4" />
                  Thêm khóa học
                </Link>
              </div>

              {/* Notifications */}
              <Link
                href="/manager/notifications"
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/manager/notifications")
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <BellIcon className="mr-3 h-5 w-5" />                Thông báo
              </Link>
            </div>
          </nav>

          {/* User Info & Logout Section */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-slate-50">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                <UserIcon className="h-5 w-5 text-white" />
              </div>              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-700 truncate">{user?.username || 'manager'}</div>
                <div className="text-xs text-slate-500 truncate">{displayEmail}</div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <main className="py-8 px-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
