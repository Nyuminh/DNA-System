import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // TODO: Validate credentials
    // TODO: Check database
    // TODO: Generate JWT token
    // TODO: Set secure cookies
    
    // Mock authentication
    if (email && password) {
      const mockUser = {
        id: 'user123',
        email,
        name: 'Nguyễn Văn A',
        phone: '0123456789'
      };
      
      return NextResponse.json({
        success: true,
        user: mockUser,
        message: 'Đăng nhập thành công!'
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Email hoặc mật khẩu không đúng' },
      { status: 401 }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
