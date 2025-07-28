'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { loginUser, debugToken } from '@/lib/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// Interface cho dữ liệu người dùng (đầy đủ các trường, đồng bộ với backend)
export interface User {
  userID: string;
  username: string;
  fullname: string;
  gender: string;
  roleID: string;
  email: string;
  phone: string;
  birthdate: string;
  image: string;
  address: string;
}

// Interface cho kết quả từ API
interface ApiResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  roleID?: string;
  redirectPath?: string;
}

// Interface cho token JWT
interface JwtPayload {
  nameid?: string;
  sub?: string;
  userId?: string;
  id?: string;
  name?: string;
  preferred_username?: string;
  unique_name?: string;
  email?: string;
  mail?: string;
  emailaddress?: string;
  role?: string;
  roleId?: string;
  username?: string;
  gender?: string;
  phone?: string;
  birthdate?: string;
  image?: string;
  address?: string;
  exp?: number;
  [key: string]: any;
}

// Interface cho kết quả của hàm fetchUserInfoFromToken
interface FetchUserResult {
  id: string;
  name: string;
  email: string;
  roleID: string;
  username?: string;
}

type LoginFormInputs = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const router = useRouter();
  const { login, isLoggedIn, isLoading, user } = useAuth();
    // Redirect nếu user đã đăng nhập
  useEffect(() => {
    if (!isLoading && isLoggedIn && user) {
      console.log('User already logged in, redirecting...', user);
      
      // Kiểm tra tài khoản bị khóa
      if (user.roleID === 'R05' || user.roleID === 'Ban') {
        // Đăng xuất nếu tài khoản bị khóa
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoginError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
        return;
      }
      
      // Redirect dựa trên role
      if (user.roleID === 'Admin' || user.roleID === 'R01') {
        router.push('/admin');
      } else if (user.roleID === 'Manager' || user.roleID === 'R04') {
        router.push('/manager');
      } else if (user.roleID === 'Staff' || user.roleID === 'R02') {
        router.push('/staff');
      } else {
        router.push('/');
      }
    }
  }, [isLoggedIn, isLoading, user, router]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoginError('');
      
      // Thêm await để chờ kết quả đăng nhập
      const result = await loginUser({
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.success && result.token) {
        // Debug token để xem cấu trúc
        debugToken(result.token);
        
        // Kiểm tra xem tài khoản có bị khóa không
        if (result.user && (result.user.roleID === 'R05' || result.user.roleID === 'Ban')) {
          setLoginError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
          return;
        }
        
        // Lưu token vào localStorage (đã được decode trong loginUser)
        localStorage.setItem('token', result.token);
        
        // Lưu thông tin user nếu có
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          // Sử dụng AuthContext để lưu trạng thái
          login(result.token, result.user);
        }
        
        // Hiển thị thông báo thành công bằng toast ở bên phải màn hình
        toast.success('Đăng nhập thành công!', {
          duration: 3000,
          position: 'top-right',
          icon: '✅',
        });
        
        console.log(' Login successful:');
        console.log('- User:', result.user);
        console.log('- Role ID:', result.roleID);
        console.log('- Redirect Path:', result.redirectPath);
        
        // Chuyển hướng ngay lập tức
        if (result.redirectPath) {
          router.push(result.redirectPath);
        } else {
          // Fallback nếu không có redirectPath
          router.push('/');
        }
        
      } else {
        setLoginError(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Đã xảy ra lỗi không mong muốn');
    }
  };

  // Cập nhật function xử lý Google Login để xử lý token tương tự như đăng nhập thông thường
  const handleGoogleLogin = async () => {
    try {
      // Hiển thị thông báo đang xử lý
      const loadingToast = toast.loading('Đang kết nối với Google...', {
        position: 'top-right',
      });
      
      // Tạo cửa sổ popup cho đăng nhập Google
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        'http://localhost:5198/api/AuthGoogle/signin-google',
        'GoogleLogin',
        `width=${width},height=${height},top=${top},left=${left}`
      );
      
      if (!popup) {
        toast.dismiss(loadingToast);
        toast.error('Popup bị chặn. Vui lòng cho phép popup để tiếp tục.', {
          duration: 3000,
          position: 'top-right',
        });
        return;
      }
      
      // Thiết lập hàm lắng nghe message từ popup
      const messageListener = async (event: MessageEvent) => {
        // Chỉ xử lý các message từ API server
        if (event.origin !== 'http://localhost:5198') return;
        
        if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
          try {
            // Xóa listener để tránh xử lý trùng lặp
            window.removeEventListener('message', messageListener);
            
            const token = event.data.token;
            if (!token) {
              throw new Error('Token không hợp lệ');
            }
            
            console.log("TOKEN nhận được:", token);
            
            // Log thông tin token để debug
            logToken(token);
            
            // Sử dụng token để lấy thông tin người dùng
            try {
              const userResponse = await fetch('http://localhost:5198/api/User/me', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              if (!userResponse.ok) {
                console.error(`Không thể lấy thông tin người dùng (${userResponse.status})`);
                
                // Log response để debug
                const responseText = await userResponse.text();
                console.log("API Response Error:", responseText);
                
                throw new Error(`Không thể lấy thông tin người dùng (${userResponse.status})`);
              }
              
              const userData = await userResponse.json();
              console.log("User data from API:", userData);
              
              // Định dạng lại dữ liệu user từ API để phù hợp với cấu trúc ứng dụng
              const user: User = {
                userID: userData.userID || userData.id || '',
                username: userData.username || '',
                fullname: userData.fullname || userData.name || '',
                gender: userData.gender || '',
                roleID: userData.roleID || '',
                email: userData.email || '',
                phone: userData.phone || '',
                birthdate: userData.birthdate || '',
                image: userData.image || '',
                address: userData.address || '',
              };
              
              console.log("Formatted user data:", user);
              
              // Kiểm tra xem tài khoản có bị khóa không
              if (user.roleID === 'R05' || user.roleID === 'Ban') {
                toast.dismiss(loadingToast);
                setLoginError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
                // Đóng popup
                if (popup && !popup.closed) {
                  popup.close();
                }
                return;
              }
              
              // Lưu token vào localStorage
              localStorage.setItem('token', token);
              
              // Lưu thông tin user
              localStorage.setItem('user', JSON.stringify(user));
              
              // Sử dụng AuthContext để lưu trạng thái
              login(token, user);
              
              // Đóng popup
              if (popup && !popup.closed) {
                popup.close();
              }
              
              // Hiển thị thông báo thành công
              toast.dismiss(loadingToast);
              toast.success('Đăng nhập với Google thành công!', {
                duration: 3000,
                position: 'top-right',
                icon: '✅',
              });
              
              console.log('Google login successful:');
              console.log('- User:', user);
              console.log('- Role ID:', user.roleID);
              
              // Chuyển hướng dựa trên vai trò
              navigateByRole(user.roleID);
              
            } catch (apiError) {
              console.error('API error:', apiError);
              
              // Kết hợp xử lý backup khi API lỗi - dùng thông tin từ token JWT
              try {
                // Giải mã token để lấy thông tin người dùng
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                  atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                  }).join('')
                );
                
                console.log("JSON Payload:", jsonPayload);
                const jwtData = JSON.parse(jsonPayload);
                
                // Thêm xử lý để log tất cả các trường trong payload
                console.log("JWT Data Fields:", Object.keys(jwtData));
                
                // Tìm kiếm trường chứa email trong payload (có thể khác trong mỗi provider)
                const email = jwtData.email || jwtData.mail || jwtData.emailaddress || 
                             jwtData.preferred_username || jwtData.unique_name || '';
                
                // Tạo một username dự phòng nếu không có email
                const fallbackUsername = email ? 
                  `google_${email.split('@')[0]}` : 
                  `google_${Math.random().toString(36).substring(2, 10)}`;
                
                // Tạo user object với cấu trúc giống như kết quả từ loginUser
                const user = {
                  id: jwtData.nameid || jwtData.sub || jwtData.userId || jwtData.id || 'U003',
                  name: jwtData.name || jwtData.preferred_username || jwtData.unique_name || 'Google User',
                  email: email || 'user@example.com', // Đảm bảo email không trống
                  roleID: jwtData.role || jwtData.roleId || 'R03', // R03 là Customer
                  username: jwtData.username || fallbackUsername
                };
                
                console.log("Constructed user from JWT:", user);
                
                // Lưu token và thông tin user vào local storage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Sử dụng AuthContext để lưu trạng thái

                
                // Đóng popup
                if (popup && !popup.closed) {
                  popup.close();
                }
                
                // Hiển thị thông báo thành công
                toast.dismiss(loadingToast);
                toast.success('Đăng nhập với Google thành công!', {
                  duration: 3000,
                  position: 'top-right',
                  icon: '✅',
                });
                
                // Chuyển hướng dựa trên vai trò (giống đăng nhập thông thường)
                if (user.roleID === 'R01') { // Admin
                  router.push('/admin');
                } else if (user.roleID === 'R04') { // Manager
                  router.push('/manager');
                } else if (user.roleID === 'R02') { // Staff
                  router.push('/staff');
                } else { // Customer hoặc vai trò khác
                  router.push('/');
                }
              } catch (tokenError) {
                console.error('Error decoding token:', tokenError);
                throw new Error('Không thể xác minh thông tin người dùng');
              }
            }
            
          } catch (error) {
            console.error('Error processing Google login token:', error);
            toast.dismiss(loadingToast);
            toast.error('Có lỗi khi xử lý đăng nhập Google', {
              duration: 3000,
              position: 'top-right',
            });
          }
        }
      };
      
      // Đăng ký lắng nghe message từ cửa sổ popup
      window.addEventListener('message', messageListener);
      
      // Kiểm tra nếu popup bị đóng
      const checkPopupClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopupClosed);
          window.removeEventListener('message', messageListener);
          toast.dismiss(loadingToast);
        }
      }, 1000);
      
      
    
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Có lỗi khi kết nối với Google', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  // Nơi bạn cần kiểm tra token
  const token = localStorage.getItem('token');
  if (token) {
    debugToken(token);
  }

  // Cập nhật hàm logToken
  function logToken(token: string): JwtPayload | null {
    try {
      // Phân tách token
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn("Token không có định dạng JWT chuẩn");
        return null;
      }
      
      // Phân tách header, payload, signature
      const [headerB64, payloadB64, signature] = parts;
      
      // Decode header
      const headerStr = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerStr);
      
      // Decode payload
      const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadStr) as JwtPayload;
      
      // Log thông tin chi tiết
      console.group("======= JWT TOKEN DETAILS =======");
      console.log("Header:", header);
      console.log("Payload:", payload);
      console.log("All Payload Fields:", Object.keys(payload));
      
      // Tìm kiếm trường email
      const possibleEmailFields = ['email', 'mail', 'emailaddress', 'preferred_username', 'unique_name', 'sub'];
      console.log("Possible email values:");
      possibleEmailFields.forEach(field => {
        if (payload[field]) {
          console.log(`- ${field}: ${payload[field]}`);
        }
      });
      
      console.groupEnd();
      
      // Lấy thông tin người dùng từ API
      fetchUserInfoFromToken(token);
      
      return payload;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  // Cập nhật hàm fetchUserInfoFromToken
  async function fetchUserInfoFromToken(token: string): Promise<FetchUserResult | null> {
    try {
      console.log("Fetching user info using token...");
      
      const userResponse = await fetch('http://localhost:5198/api/User/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        console.error(`Không thể lấy thông tin người dùng (${userResponse.status})`);
        const responseText = await userResponse.text();
        console.log("API Response Error:", responseText);
        return null;
      }
      
      const userData = await userResponse.json();
      console.log("User data from API:", userData);
      
      // Định dạng lại dữ liệu user từ API để phù hợp với cấu trúc ứng dụng
      const user: FetchUserResult = {
        id: userData.userID || userData.id,
        name: userData.fullname || userData.name,
        email: userData.email,
        roleID: userData.roleID,
        username: userData.username
      };
      
      console.log("Formatted user data:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }

  // Cập nhật hàm navigateByRole
  function navigateByRole(roleID: string): void {
    // Kiểm tra tài khoản bị khóa
    if (roleID === 'R05' || roleID === 'Ban') {
      setLoginError('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
      // Xóa thông tin đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }
    
    if (roleID === 'R01' || roleID === 'Admin') { // Admin
      router.push('/admin');
    } else if (roleID === 'R04' || roleID === 'Manager') { // Manager
      router.push('/manager');
    } else if (roleID === 'R02' || roleID === 'Staff') { // Staff
      router.push('/staff');
    } else { // Customer hoặc vai trò khác
      router.push('/');
    }
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex min-h-[calc(100vh-160px)] flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* DNA Helix Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>

            <h2 className="text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Chào mừng đến với DNA Testing VN
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              Đăng nhập để tiếp tục sử dụng dịch vụ xét nghiệm DNA
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Chưa có tài khoản?{' '}
              <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </div>          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-8 shadow-xl border border-white/20 sm:rounded-2xl sm:px-10">
              
              {/* Error Message */}
              {loginError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-800 font-medium">{loginError}</p>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Nhập tên đăng nhập"
                    className={`block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm transition-all duration-200 ${
                      errors.username ? 'ring-2 ring-red-400 bg-red-50' : ''
                    }`}
                    {...register('username', {
                      required: 'Tên đăng nhập là bắt buộc',
                      minLength: {
                        value: 3,
                        message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
                      },
                    })}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-12 py-3 border-0 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm transition-all duration-200 ${
                      errors.password ? 'ring-2 ring-red-400 bg-red-50' : ''
                    }`}
                    {...register('password', {
                      required: 'Mật khẩu là bắt buộc',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                      },
                    })}
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-2"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-white group-hover:text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    )}
                  </span>
                  {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
              </div>
            </form>

            {/* Social Login Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500 font-medium">Hoặc đăng nhập với</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="group relative w-full max-w-[360px] flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-white mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </span>
                  <span className="ml-6">Google</span>
                </button>
              </div>
            </div>          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
