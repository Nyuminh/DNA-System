'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCourseById, fetchCourses } from '@/lib/api/course';

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
      {/* Thêm nút quay lại trang blog ở đây */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex justify-start mb-6">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
      
      {/* Phần nội dung bài viết hiện tại */}
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
          <img
            src={
              post.image
                ? `http://localhost:5198/${post.image.replace(/^\/+/, '')}`
                : '/images/blog/blog-1.jpg'
            }
            alt={post.title || 'Ảnh'}
            className="rounded-lg object-cover w-full h-64"
            loading="lazy"
            width={800}
            height={400}
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

      {/* Phần bài viết liên quan */}
      <div className="max-w-3xl mx-auto px-4 py-12 border-t border-gray-200 mt-12">
        <h2 className="text-2xl font-bold mb-8">Bài viết liên quan</h2>
        
        <RelatedPosts currentPostId={String(id)} />
        
        <div className="mt-8 flex justify-center">
          <Link href="/blog" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

// Thêm component RelatedPosts vào đây
function RelatedPosts({ currentPostId }: { currentPostId: string }) {
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        // Lấy tất cả bài viết
        const allCourses = await fetchCourses();
        
        // Lọc ra những bài viết khác (không phải bài hiện tại)
        const otherCourses = allCourses.filter((course: any) => 
          String(course.id) !== currentPostId
        );
        
        // Lấy tối đa 3 bài viết ngẫu nhiên
        const randomCourses = otherCourses
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        setRelatedPosts(randomCourses);
      } catch (error) {
        console.error('Error fetching related posts:', error);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRelatedPosts();
  }, [currentPostId]);

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (relatedPosts.length === 0) {
    return <div className="text-center py-4 text-gray-500">Không có bài viết liên quan.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {relatedPosts.map((post) => (
        <Link href={`/blog/${post.id}`} key={post.id} className="group">
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="relative h-48">
              <img
    src={post.image ? `http://localhost:5198/${post.image.replace(/^\/+/, '')}` : '/images/blog/blog-1.jpg'}
    alt={post.title || 'Ảnh bài viết'}
    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
    loading="lazy"
  />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {post.title || 'Không có tiêu đề'}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {post.description || 'Không có mô tả.'}
              </p>
              <div className="mt-3 text-blue-600 font-medium text-sm flex items-center">
                Đọc tiếp
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}