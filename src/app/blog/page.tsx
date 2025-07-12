'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import axios from 'axios';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get('http://localhost:5198/api/Course');
        let postsArray = [];

        // Xử lý dữ liệu trả về dạng array hoặc có $values
        if (response.data && typeof response.data === 'object' && '$values' in response.data && Array.isArray(response.data.$values)) {
          postsArray = response.data.$values;
        } else if (Array.isArray(response.data)) {
          postsArray = response.data;
        } else if (response.data && typeof response.data === 'object') {
          postsArray = [response.data];
        }

        // Map dữ liệu cho phù hợp giao diện blog
        const mapped = postsArray.map((item: any, idx: number) => ({
          id: item.courseId?.toString() || item.id?.toString() || `course-${idx}`,
          title: item.title || item.name || 'Không có tiêu đề',
          date: item.createdAt || item.date || '01/01/2025',
          imageUrl: item.image
            ? `http://localhost:5198/${item.image}`
            : '/images/blog/blog-1.jpg',
          featured: idx < 2,
          content: item.content || '',
          excerpt: item.excerpt || '', // thêm nếu cần
          author: item.author || '',   // thêm nếu cần
        }));
        setPosts(mapped);

        const filteredPosts = posts.filter((post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } catch (err) {
        setPosts([]);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const searchMatch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const featuredPosts = posts.filter(post => post.featured);

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Hero section */}
        <div className="relative hero-section h-[400px]">
          <div className="absolute inset-0">
            <Image
              src="/images/blog/blog_banner.jpg"
              alt="Blog Banner"
              className="h-full w-full object-cover object-center"
              width={1920}
              height={400}
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-blue-400 sm:text-5xl md:text-6xl">
                Blog DNA Testing VN
              </h1>
              <p className="mt-4 text-xl text-blue-200">
                Khám phá kiến thức về xét nghiệm ADN và di truyền học
              </p>
            </div>
          </div>
        </div>

        {/* Featured posts */}
        {featuredPosts.length > 0 && (
          <div className="bg-white pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-8">Bài viết nổi bật</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
                {featuredPosts.map((post) => (
                  <div key={post.id} className="group relative">
                    {post.imageUrl && (
                      <div className="h-48 w-full bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-90">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                      <span>
                        {post.date && !isNaN(Date.parse(post.date))
                          ? new Date(post.date).toLocaleDateString('vi-VN')
                          : post.date}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">
                      <Link href={`/blog/${post.id}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="mt-4 sm:mt-0 w-full">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog posts grid */}
        <div className="max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy bài viết nào</h3>
              <p className="mt-1 text-sm text-gray-500">Rất tiếc, chúng tôi không tìm thấy bài viết nào phù hợp với điều kiện tìm kiếm của bạn.</p>
              <div className="mt-6">
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <div key={post.id} className="group relative">
                  <div className="relative h-60 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-90">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                    <span>
                      {post.date && !isNaN(Date.parse(post.date))
                        ? new Date(post.date).toLocaleDateString('vi-VN')
                        : post.date}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter subscription */}
        <div className="bg-blue-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Đăng ký nhận bản tin
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-600">
                  Nhận thông tin mới nhất về xét nghiệm ADN, công nghệ di truyền và các bài viết hữu ích qua email.
                </p>
              </div>
              <div className="mt-8 lg:mt-0">
                <form className="sm:flex">
                  <label htmlFor="email-address" className="sr-only">
                    Địa chỉ email
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-5 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs rounded-md"
                    placeholder="Nhập địa chỉ email"
                  />
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Đăng ký
                    </button>
                  </div>
                </form>
                <p className="mt-3 text-sm text-gray-500">
                  Chúng tôi tôn trọng quyền riêng tư của bạn. Xem{' '}
                  <Link href="#" className="font-medium text-blue-600 underline">
                    Chính sách bảo mật
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}