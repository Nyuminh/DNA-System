import { NextRequest, NextResponse } from 'next/server';

// GET /api/results/[id] - Lấy kết quả xét nghiệm
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // TODO: Get from database
    // TODO: Check user permission
    
    // Mock result data
    const mockResult = {
      id: id,
      bookingId: `BK${id}`,
      testType: 'father-child',
      status: 'completed',
      completedAt: '2024-01-20',
      result: {
        probability: 99.9999,
        conclusion: 'Kết quả xét nghiệm cho thấy mối quan hệ cha con với độ chính xác 99.9999%',
        participants: [
          {
            name: 'Nguyễn Văn A',
            role: 'father',
            sampleType: 'buccal'
          },
          {
            name: 'Nguyễn Văn B', 
            role: 'child',
            sampleType: 'buccal'
          }
        ],
        markers: [
          { name: 'D3S1358', child: '15,16', father: '14,15' },
          { name: 'D1S1656', child: '11,13', father: '11,12' },
          { name: 'D2S441', child: '10,14', father: '10,11' },
          // ... more markers
        ]
      },
      downloadUrl: `/api/results/${id}/download`
    };
    
    return NextResponse.json({
      success: true,
      result: mockResult
    });
    
  } catch (error) {
    console.error('Get result error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
