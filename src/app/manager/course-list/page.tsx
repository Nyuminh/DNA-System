"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon
} from "@heroicons/react/24/outline";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  category: string;
  status: "active" | "inactive";
  students: number;
  rating: number;
  level: string;
  createdAt: string;
}

export default function CourseList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Kiến thức cơ bản về ADN",
      description: "Tìm hiểu về cấu trúc, chức năng và vai trò của ADN trong di truyền học. Khóa học cung cấp nền tảng vững chắc về sinh học phân tử.",
      instructor: "TS. Nguyễn Văn A",
      duration: "8 tuần",
      category: "basic",
      status: "active",
      students: 45,
      rating: 4.8,
      level: "Cơ bản",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      title: "Phương pháp xét nghiệm ADN",
      description: "Các kỹ thuật và quy trình xét nghiệm ADN hiện đại, bao gồm PCR, sequencing và phân tích dữ liệu gen.",
      instructor: "PGS. Trần Thị B",
      duration: "12 tuần",
      category: "advanced",
      status: "active",
      students: 32,
      rating: 4.9,
      level: "Nâng cao",
      createdAt: "2024-02-10"
    },
    {
      id: "3",
      title: "Ứng dụng ADN trong Pháp y",
      description: "Tìm hiểu cách sử dụng ADN trong điều tra tội phạm và nhận dạng. Khóa học dành cho chuyên gia pháp y.",
      instructor: "ThS. Lê Minh C",
      duration: "10 tuần",
      category: "forensic",
      status: "inactive",
      students: 28,
      rating: 4.7,
      level: "Chuyên nghiệp",
      createdAt: "2024-03-05"
    },
    {
      id: "4",
      title: "Di truyền học y học",
      description: "Nghiên cứu về các bệnh di truyền, tư vấn gen và liệu pháp gen. Khóa học cho bác sĩ và chuyên gia y tế.",
      instructor: "GS. Phạm Thu D",
      duration: "16 tuần",
      category: "medical",
      status: "active",
      students: 18,
      rating: 4.9,
      level: "Chuyên nghiệp",
      createdAt: "2024-04-20"
    }
  ]);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  // Statistics
  const stats = {
    total: courses.length,
    active: courses.filter(c => c.status === 'active').length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    avgRating: (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link 
                href="/manager"
                className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Quay về Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Danh sách Khóa học</h1>
                <p className="text-purple-100">Quản lý và theo dõi tất cả khóa học đào tạo</p>
              </div>
            </div>            <Link
              href="/manager/add-course"
              className="flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm khóa học mới
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Khóa học</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Học viên</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="basic">Cơ bản</option>
                <option value="advanced">Nâng cao</option>
                <option value="forensic">Pháp y</option>
                <option value="medical">Y học</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                  <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Giảng viên:</span>
                    <span className="font-medium text-gray-900 text-sm">{course.instructor}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Thời lượng:</span>
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-medium text-gray-900 text-sm">{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Học viên:</span>
                    <div className="flex items-center">
                      <UserGroupIcon className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-medium text-gray-900 text-sm">{course.students} người</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Đánh giá:</span>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-1">{course.rating}</span>
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Tạo: {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/manager/courses/${course.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    <Link 
                      href={`/manager/courses/edit/${course.id}`}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa khóa học"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy khóa học</h3>
            <p className="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  );
}
