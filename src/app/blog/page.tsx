'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';

const blogPosts = [
  {
    id: 'understanding-dna-testing',
    title: 'Hiểu về xét nghiệm ADN: Tất cả những gì bạn cần biết',
    excerpt: 'Một bài viết toàn diện về cách thức hoạt động của xét nghiệm ADN, các loại xét nghiệm hiện có và khi nào bạn nên cân nhắc xét nghiệm.',
    category: 'Kiến thức cơ bản',
    date: '15/05/2025',
    author: 'TS. Nguyễn Văn A',
    authorRole: 'Giám đốc Phòng xét nghiệm',
    readTime: '8 phút đọc',
    imageUrl: '/images/blog/dna-basics.jpg',
    featured: true,
    content: '',
  },
  {
    id: 'paternity-testing-guide',
    title: 'Hướng dẫn đầy đủ về xét nghiệm huyết thống cha con',
    excerpt: 'Tìm hiểu quá trình xét nghiệm huyết thống cha con, độ chính xác, chi phí và những điều cần lưu ý trước khi thực hiện xét nghiệm.',
    category: 'Hướng dẫn xét nghiệm',
    date: '10/05/2025',
    author: 'ThS. Lê Văn C',
    authorRole: 'Chuyên gia Tư vấn Di truyền',
    readTime: '10 phút đọc',
    imageUrl: '/images/blog/paternity-test.jpg',
    featured: true,
    content: '',
  },
  {
    id: 'dna-test-for-immigration',
    title: 'Xét nghiệm ADN cho mục đích di trú: Điều kiện và yêu cầu',
    excerpt: 'Bài viết này giải thích về các yêu cầu xét nghiệm ADN cho mục đích di trú, quy trình và tài liệu cần thiết để đáp ứng yêu cầu của cơ quan di trú.',
    category: 'ADN hành chính',
    date: '05/05/2025',
    author: 'TS. Trần Thị B',
    authorRole: 'Trưởng phòng Xét nghiệm ADN',
    readTime: '7 phút đọc',
    imageUrl: '/images/blog/immigration-dna.jpg',
    featured: false,
    content: '',
  },
  {
    id: 'privacy-in-dna-testing',
    title: 'Bảo mật và riêng tư trong xét nghiệm ADN',
    excerpt: 'Tìm hiểu cách thông tin di truyền của bạn được bảo vệ và những biện pháp mà các phòng xét nghiệm thực hiện để đảm bảo quyền riêng tư của khách hàng.',
    category: 'Quyền riêng tư',
    date: '01/05/2025',
    author: 'TS. Nguyễn Văn A',
    authorRole: 'Giám đốc Phòng xét nghiệm',
    readTime: '6 phút đọc',
    imageUrl: '/images/blog/dna-privacy.jpg',
    featured: false,
    content: '',
  },
  {
    id: 'dna-collection-methods',
    title: 'Các phương pháp thu thập mẫu ADN hiện đại',
    excerpt: 'Khám phá các phương pháp thu thập mẫu ADN khác nhau, từ que bông ngoáy má đến các phương pháp không xâm lấn khác.',
    category: 'Công nghệ',
    date: '25/04/2025',
    author: 'TS. Trần Thị B',
    authorRole: 'Trưởng phòng Xét nghiệm ADN',
    readTime: '5 phút đọc',
    imageUrl: '/images/blog/collection-methods.jpg',
    featured: false,
    content: '',
  },
  {
    id: 'dna-testing-myths',
    title: 'Những hiểu lầm phổ biến về xét nghiệm ADN',
    excerpt: 'Bài viết này làm rõ những hiểu lầm phổ biến về xét nghiệm ADN và cung cấp thông tin chính xác về quá trình, kết quả và ý nghĩa của chúng.',
    category: 'Kiến thức cơ bản',
    date: '20/04/2025',
    author: 'ThS. Lê Văn C',
    authorRole: 'Chuyên gia Tư vấn Di truyền',
    readTime: '8 phút đọc',
    imageUrl: '/images/blog/dna-myths.jpg',
    featured: false,
    content: '',
  },
];

const categories = [
  'Tất cả',
  'Kiến thức cơ bản',
  'Hướng dẫn xét nghiệm',
  'ADN hành chính',
  'Quyền riêng tư',
  'Công nghệ',
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    // Filter by category
    const categoryMatch = activeCategory === 'Tất cả' || post.category === activeCategory;
    
    // Filter by search term
    const searchMatch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Hero section */}
        <div className="relative bg-blue-600">
          <div className="absolute inset-0">
            <div className="h-full w-full object-cover opacity-30 bg-blue-800" />
            <div className="absolute inset-0 bg-blue-600 mix-blend-multiply" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Blog</h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl">
              Khám phá kiến thức về xét nghiệm ADN, hướng dẫn và thông tin mới nhất trong lĩnh vực di truyền.
            </p>
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
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-90 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gray-400">
                          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{post.category}</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">
                      <Link href={`/blog/${post.id}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-500">{post.author.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.authorRole}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and filter */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="mt-4 sm:mt-0">
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
            <div className="mt-4 sm:mt-0">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy kết quả</h3>
              <p className="mt-1 text-sm text-gray-500">Không có bài viết nào phù hợp với tìm kiếm của bạn.</p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setActiveCategory('Tất cả');
                    setSearchTerm('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <div key={post.id} className="group relative">
                  <div className="relative h-60 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-90">
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-400">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{post.category}</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">
                    <Link href={`/blog/${post.id}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-500">{post.author.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.authorRole}</p>
                    </div>
                  </div>
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