"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  UserIcon, 
  ChartBarIcon, 
  ArrowRightOnRectangleIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  BellIcon,
  DocumentTextIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { staffProfileAPI } from '@/lib/api/staff';

interface StaffLayoutProps {
  children: React.ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userEmail, setUserEmail] = useState<string>('');
  // Fetch user email if not available in AuthContext
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!user?.email || user.email === 'staff@dnatest.com') {
        try {
          // Kiểm tra token trước khi gọi API
          const token = localStorage.getItem('token');
          if (!token) {
            console.warn('No token found, redirecting to login');
            router.push('/auth/login');
            return;
          }

          // Kiểm tra token có hết hạn hay không
          const { isTokenValid } = await import('@/lib/api/auth');
          if (!isTokenValid(token)) {
            console.warn('Token is invalid or expired, redirecting to login');
            const { forceLogout } = await import('@/lib/api/auth');
            forceLogout();
            logout();
            router.push('/auth/login');
            return;
          }
          
          // Gọi API lấy profile
          const result = await staffProfileAPI.getProfile();
          if (result.success && result.profile?.email) {
            setUserEmail(result.profile.email);
          } else if (result.message?.includes('Phiên đăng nhập hết hạn')) {
            console.warn('Session expired message from API');
            const { forceLogout } = await import('@/lib/api/auth');
            forceLogout();
            logout();
            router.push('/auth/login');
          }
        } catch (error: any) {
          console.error('Error fetching staff profile:', error);
          // Xử lý lỗi 401 từ API
          if (error?.response?.status === 401) {
            console.warn('Received 401 error, logging out');
            const { forceLogout } = await import('@/lib/api/auth');
            forceLogout();
            logout();
            router.push('/auth/login');
          }
        }
      } else {
        setUserEmail(user.email);
      }
    };

    fetchUserEmail();
  }, [user, router, logout]);

  const displayEmail = userEmail || user?.email || 'staff@dnatest.com';

  const isActive = (path: string) => {
    if (path === "/staff" && pathname === "/staff") return true;
    if (path !== "/staff" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('@/lib/api/auth');
      // Call logout API
      const result = await logoutUser();
      console.log('Staff logout result:', result.message);
      
      // Hiển thị thông báo đăng xuất thành công
      toast.success('Đăng xuất thành công!');
      
      // Clear AuthContext state
      logout();
      
      // Redirect to login
      router.push('/auth/login');
    } catch (error) {
      console.error('Staff logout error:', error);
      // Force logout nếu API fails
      const { forceLogout } = await import('@/lib/api/auth');
      forceLogout();
      
      // Hiển thị thông báo đăng xuất thành công ngay cả khi API fails
      toast.success('Đăng xuất thành công!');
      
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
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <div className="hidden md:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      DNA Testing Service
                    </h1>
                    <p className="text-xs text-slate-500 -mt-1">Staff Dashboard</p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-4 px-4 py-2 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-700">15</div>
                  <div className="text-xs text-slate-500">Tests</div>
                </div>
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-600">Active</div>
                  <div className="text-xs text-slate-500">Status</div>
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Staff Profile */}
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-50">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-700">{user?.username || 'staff'}</div>
                  <div className="text-xs text-slate-500">Nhân viên xét nghiệm</div>
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
            <div className="space-y-1">
              {/* Home Page Link */}
              <Link
                href="/"
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <HomeIcon className="mr-3 h-5 w-5" />
                Trang chủ
              </Link>

              {/* Profile Management - Moved up */}
              <Link
                href="/staff/profile"
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/staff/profile")
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <UserIcon className="mr-3 h-5 w-5" />
                Hồ sơ cá nhân
              </Link>

              {/* Dashboard */}
              <Link
                href="/staff"
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/staff") && pathname === "/staff"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <ChartBarIcon className="mr-3 h-5 w-5" />
                Dashboard
              </Link>              {/* Kit Management */}
              <Link
                href="/staff/kits"
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive("/staff/kits")
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <CubeIcon className="mr-3 h-5 w-5" />
                Quản lý Kit
              </Link>

              {/* Test Result Management */}
              <div className="space-y-1">
                <Link
                  href="/staff/test-results"
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive("/staff/test-results")
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <BeakerIcon className="mr-3 h-5 w-5" />
                  Quản lý lịch xét nghiệm
                </Link>
              </div>

         
              
            </div>
          </nav>

          {/* User Info & Logout Section */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-slate-50">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-700 truncate">{user?.username || 'staff'}</div>
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
