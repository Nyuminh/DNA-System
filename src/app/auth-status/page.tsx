'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AuthStatusPage() {
  const { user, token, isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Trạng thái đăng nhập</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <strong>Đã đăng nhập:</strong> {isLoggedIn ? 'Có' : 'Không'}
        </div>
        
        <div>
          <strong>Token:</strong> {token ? 'Có' : 'Không'}
        </div>
        
        <div>
          <strong>Thông tin user:</strong>
          {user ? (
            <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <span> Không có</span>
          )}
        </div>
        
        <div>
          <strong>LocalStorage token:</strong> {localStorage.getItem('token') || 'Không có'}
        </div>
        
        <div>
          <strong>LocalStorage user:</strong>
          <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">
            {localStorage.getItem('user') || 'Không có'}
          </pre>
        </div>
      </div>
    </div>
  );
}
