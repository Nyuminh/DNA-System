import { NextResponse } from 'next/server';

let courses = [
  // Example initial data
  {
    id: '1',
    title: 'Hiểu về xét nghiệm ADN: Tất cả những gì bạn cần biết',
    excerpt: 'Một bài viết toàn diện về cách thức hoạt động của xét nghiệm ADN, các loại xét nghiệm hiện có và khi nào bạn nên cân nhắc xét nghiệm.',
    category: 'Kiến thức cơ bản',
    date: '15/05/2025',
    author: 'TS. Nguyễn Văn A',
    authorRole: 'Giám đốc Phòng xét nghiệm',
    readTime: '8 phút đọc',
    imageUrl: '/images/blog/blog-1.jpg',
    featured: true,
    content: '',
  }
];

export async function GET() {
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCourse = {
      ...body,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('vi-VN'),
    };
    courses.unshift(newCourse);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
