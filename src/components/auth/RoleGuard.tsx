'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/auth/login' 
}: RoleGuardProps) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasChecked) {
      setHasChecked(true);
      
      if (!isLoggedIn) {
        console.log('Not logged in, redirecting to login');
        router.push('/auth/login');
        return;
      }

      if (user && !allowedRoles.includes(user.roleID)) {
        console.log(`Access denied. User role: ${user.roleID}, Required: ${allowedRoles.join(', ')}`);
        router.push(fallbackPath);
        return;
      }

      console.log(`Access granted. User role: ${user?.roleID}`);
    }
  }, [isLoggedIn, user, isLoading, allowedRoles, router, fallbackPath, hasChecked]);
  // Loading state
  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang kiểm tra quyền truy cập</p>
        </div>
      </div>
    );
  }

  // Access denied or not logged in
  if (!isLoggedIn || (user && !allowedRoles.includes(user.roleID))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang chuyển hướng</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
