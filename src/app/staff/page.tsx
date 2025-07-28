"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng người dùng đến trang dashboard
    router.push('/staff/dashboard');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
