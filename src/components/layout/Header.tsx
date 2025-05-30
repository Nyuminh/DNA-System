'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '@/components/common/Logo';

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Dịch vụ', href: '/services' },
  { name: 'Về chúng tôi', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Liên hệ', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // This would normally be fetched from your auth state
  const isLoggedIn = false;

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
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {isLoggedIn ? (
            <>
              <Link 
                href="/my-tests" 
                className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200"
              >
                Xét nghiệm của tôi
              </Link>
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-200"
              >
                Tài khoản
              </Link>
              <button className="btn-secondary text-sm py-2 px-4">
                Đăng xuất
              </button>
            </>
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
                    <>
                      <Link
                        href="/my-tests"
                        className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Xét nghiệm của tôi
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tài khoản
                      </Link>
                      <button 
                        className="w-full text-left rounded-lg px-4 py-3 text-base font-medium text-secondary-700 hover:bg-secondary-100 hover:text-primary-600 transition-colors duration-200"
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
