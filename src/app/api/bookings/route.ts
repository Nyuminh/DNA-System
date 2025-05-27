import { NextRequest, NextResponse } from 'next/server';

// POST /api/bookings - Tạo booking mới
export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // TODO: Validate data
    // TODO: Save to database
    // TODO: Send confirmation email
    // TODO: Generate booking ID
    
    // Mock response for now
    const mockBooking = {
      id: `BK${Date.now()}`,
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      booking: mockBooking,
      message: 'Đặt lịch xét nghiệm thành công!'
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi đặt lịch' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Lấy danh sách booking của user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // TODO: Get from database
    const mockBookings = [
      {
        id: 'BK1001',
        testType: 'father-child',
        status: 'completed',
        createdAt: '2024-01-15',
        price: '4.000.000'
      },
      {
        id: 'BK1002', 
        testType: 'siblings',
        status: 'processing',
        createdAt: '2024-02-01',
        price: '5.500.000'
      }
    ];
    
    return NextResponse.json({
      success: true,
      bookings: mockBookings
    });
    
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
