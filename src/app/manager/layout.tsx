"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  UserIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BeakerIcon,
  AcademicCapIcon,
  HomeIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    // {
    //   href: "/",
    //   label: "Trang chủ",
    //   icon: <HomeIcon className="h-6 w-6" />, // nhỏ hơn
    //   match: (p: string) => p === "/",
    // },
    {
      href: "/manager/profile",
      label: "Hồ sơ cá nhân",
      icon: <UserIcon className="h-6 w-6" />,
      match: (p: string) => p === "/manager/profile",
    },
    {
      href: "/manager",
      label: "Dashboard",
      icon: <ChartBarIcon className="h-6 w-6" />,
      match: (p: string) => p === "/manager",
    },
    {
      href: "/manager/services",
      label: "Quản lý dịch vụ",
      icon: <BeakerIcon className="h-6 w-6" />,
      match: (p: string) => p.startsWith("/manager/services"),
    },
    {
      href: "/manager/courses",
      label: "Quản lý bài viết",
      icon: <AcademicCapIcon className="h-6 w-6" />,
      match: (p: string) => p.startsWith("/manager/courses"),
    },
   
  ];

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`h-screen sticky top-0 z-40 flex flex-col bg-white border-r border-slate-200 shadow-lg transition-all duration-200
          ${collapsed ? "w-16" : "w-52"}`} // nhỏ lại như staff
      >
        <div className="flex items-center justify-between px-2 py-3 border-b border-slate-100">
          <span className="flex items-center gap-2">
            <span className="h-8 w-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-base">D</span>
            {!collapsed && (
              <span className="text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">DNA Manager</span>
            )}
          </span>
          <button
            className="p-1 rounded hover:bg-slate-100 transition"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Thu gọn sidebar"
          >
            <Bars3Icon className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1 mt-2">
          {menu.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-2 px-3 py-2 my-1 rounded-lg transition-all duration-200
                  ${active
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100 hover:text-emerald-700"}
                  relative
                `}
              >
                {item.icon}
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {collapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 rounded bg-slate-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="flex-1"></div>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-2 px-3 py-2 mb-3 rounded-lg transition-all duration-200
              text-red-600 hover:bg-red-50
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            {!collapsed && <span className="text-sm font-medium">Đăng xuất</span>}
            {collapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 rounded bg-slate-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-50">
                Đăng xuất
              </span>
            )}
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2 px-2 py-1 rounded-xl bg-slate-50">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-slate-700">manager</div>
                    <div className="text-xs text-slate-500">Quản lý dịch vụ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-auto">{children}</main>
      </div>
    </div>
  );
}