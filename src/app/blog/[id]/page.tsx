'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Image from 'next/image';
import { fetchCourseById } from '@/lib/api/course';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const course = await fetchCourseById(String(id));
        setPost(course);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-16 text-center text-gray-500">
          Đang tải bài viết...
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-16 text-center text-red-500">
          Không tìm thấy bài viết.
        </div>
      </MainLayout>
    );
  }

  // Hàm xử lý xuống dòng và khoảng trắng đúng như trong database
  function renderContentWithSpaces(content: string) {
    return content
      .split('\n')
      .map((line, idx) => (
        <p key={idx} style={{ whiteSpace: 'pre-wrap', marginBottom: '1em' }}>
          {line}
        </p>
      ));
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">{post.title || 'Không có tiêu đề'}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-6">
          <span>
            {post.date
              ? new Date(post.date).toLocaleDateString('vi-VN')
              : ''}
          </span>
        </div>
        <div className="mb-8">
          <Image
            src={post.image ? `/images/${post.image.split('/').pop()}` : '/images/blog/blog-1.jpg'}
            alt={post.title || 'Ảnh'}
            width={800}
            height={400}
            className="rounded-lg object-cover w-full h-64"
          />
        </div>
        <div className="prose max-w-none text-gray-800">
          {post.content
            ? renderContentWithSpaces(post.content)
            : post.description
            ? renderContentWithSpaces(post.description)
            : 'Không có nội dung.'}
        </div>
      </div>
    </MainLayout>
  );
}