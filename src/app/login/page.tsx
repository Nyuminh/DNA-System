"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { saveToken } from '@/lib/auth/tokenStorage';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gọi API đăng nhập
      const response = await axios.post('http://localhost:5198/api/Authentication/login', {
        username,
        password
      });

      // Kiểm tra kết quả và lưu token
      if (response.data && response.data.token) {
        // Lưu token sử dụng utility function
        saveToken(response.data.token);
        
        // Lưu thông tin người dùng (nếu có)
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        console.log('Token đã được lưu thành công!');
        
        // Chuyển hướng dựa vào vai trò
        const redirectPath = response.data.redirectPath || '/dashboard';
        router.push(redirectPath);
      } else {
        setError('Đăng nhập không thành công');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  // UI code...
}