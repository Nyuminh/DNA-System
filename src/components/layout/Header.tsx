'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Logo from '@/components/common/Logo';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Dịch vụ', href: '/services' },
 
  { name: 'Blog', href: '/blog' },
  { name: 'Liên hệ', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoggedIn, logout, isAdmin, isManager, isStaff } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowUserMenu(false);
  };

  const handleUserMenuClick = () => {
    // Điều hướng theo role
    if (isAdmin()) {
      router.push('/admin');
    } else if (isManager()) {
      router.push('/manager');
    } else if (isStaff()) {
      router.push('/staff');
    } else {
      router.push('/dashboard');
    }
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
      <nav className="container-max flex items-center justify-between py-4" aria-label="Global">        <div className="flex lg:flex-1">
          <Link href="/" className="group">            <Logo 
              variant="full" 
              size="lg"
              useCustomLogo={true}
              customLogoPath="/images/logo.jpg"
              className="group-hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Mở menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          ))}
        </div>          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-x-4">
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-x-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200 group"
                >                  <div className="flex items-center gap-x-2">                    {user?.image ? (
                      <div 
                        className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-primary-600"
                      >
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.fullname ? user.fullname.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : 'U')}
                        </span>
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-primary-600">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user?.fullname ? user.fullname.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-sm font-medium text-secondary-900">
                        Chào mừng, {user?.fullname || user?.username}
                      </div>
                      <div className="text-xs text-secondary-600 truncate max-w-32">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </button>                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
                    <button
                      onClick={handleUserMenuClick}
                      className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                    >
                      {isAdmin() ? 'Admin Dashboard' : isManager() ? 'Manager Dashboard' : isStaff() ? 'Staff Dashboard' : 'Xem hồ sơ'}
                    </button>
                      {/* Menu cho Customer */}
                    {!isAdmin() && !isManager() && !isStaff() && (
                      <>
                        <Link
                          href="/my-booking"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Lịch Sử Xét Nghiệm
                        </Link>
                        <Link
                          href="/dashboard?tab=Đổi mật khẩu"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Đổi mật khẩu
                        </Link>
                      </>
                    )}
                    
                    {/* Menu cho Manager */}
                    {isManager() && (
                      <>
                        <Link
                          href="/manager/services"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Quản lý dịch vụ
                        </Link>
                        <Link
                          href="/manager/profile"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Hồ sơ cá nhân
                        </Link>
                      </>
                    )}
                    
                    {/* Menu cho Staff */}
                    {isStaff() && (
                      <>
                        <Link
                          href="/staff/kits"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Quản lý kits
                        </Link>
                        <Link
                          href="/staff/test-results"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Quản lý kết quả
                        </Link>
                        <Link
                          href="/staff/profile"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Hồ sơ cá nhân
                        </Link>
                      </>
                    )}
                    
                    {/* Menu cho Admin */}
                    {isAdmin() && (
                      <>
                        <Link
                          href="/admin/accounts"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Quản lý tài khoản
                        </Link>
                        <Link
                          href="/admin/profile"
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Xem hồ sơ cá nhân
                        </Link>
                      </>
                    )}
                    
                    <div className="border-t border-secondary-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200"
              >
                Đăng nhập
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">
                Đăng ký ngay
              </Link>
            </>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-secondary-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-large animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">                <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <Logo 
                    variant="icon" 
                    size="sm"
                    useCustomLogo={true}
                    customLogoPath="/images/logo.jpg"
                  />
                  <span className="ml-2 text-lg font-bold text-secondary-900">DNA Testing VN</span>
                </Link>
                <button
                  type="button"
                  className="rounded-lg p-2 text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Đóng menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="flex flex-col h-full">
                <div className="flex-1 px-6 py-6 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                  <div className="border-t border-secondary-200 px-6 py-6 space-y-3">
                  {isLoggedIn ? (
                    <>                      {/* Menu cho Customer */}
                      {!isAdmin() && !isManager() && !isStaff() && (
                        <>
                          <Link
                            href="/my-tests"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Xét nghiệm của tôi
                          </Link>
                          <Link
                            href="/invoice"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Hóa đơn của tôi
                          </Link>
                          <Link
                            href="/dashboard?tab=Đổi mật khẩu"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Đổi mật khẩu
                          </Link>
                        </>
                      )}{/* Profile link */}
                      <button
                        onClick={() => {
                          handleUserMenuClick();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                      >
                        {isAdmin() ? 'Admin Dashboard' : isManager() ? 'Manager Dashboard' : isStaff() ? 'Staff Dashboard' : 'Xem hồ sơ'}
                      </button>
                      
                      {/* Menu cho Staff (Mobile) */}
                      {isStaff() && (
                        <>
                          <Link
                            href="/staff/kits"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Quản lý kits
                          </Link>
                          <Link
                            href="/staff/test-results"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Quản lý kết quả
                          </Link>
                          <Link
                            href="/staff/profile"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Hồ sơ cá nhân
                          </Link>
                        </>
                      )}
                      
                      {/* Menu cho Manager */}
                      {isManager() && (
                        <>
                          <Link
                            href="/manager/services"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Quản lý dịch vụ
                          </Link>
                          <Link
                            href="/manager/profile"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Hồ sơ cá nhân
                          </Link>
                        </>
                      )}
                      
                      {/* Menu cho Admin */}
                      {isAdmin() && (
                        <>
                          <Link
                            href="/admin/accounts"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Quản lý tài khoản
                          </Link>
                          <Link
                            href="/admin/profile"
                            className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Xem hồ sơ cá nhân
                          </Link>
                        </>
                      )}
                      
                      <button 
                        className="w-full text-left rounded-lg px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block btn-primary text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Đăng ký ngay
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
