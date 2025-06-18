"use client";

import Link from "next/link";
import { useState } from "react";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  status: "active" | "inactive";
}

export default function CoursesList() {  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Kiến thức cơ bản về ADN",
      description: "Tìm hiểu về cấu trúc và chức năng của ADN",
      instructor: "TS. Nguyễn Văn A",
      duration: "8 tuần",
      status: "active",
    },
    {
      id: "2",
      title: "Phương pháp xét nghiệm ADN",
      description: "Các kỹ thuật và quy trình xét nghiệm ADN hiện đại",
      instructor: "PGS. Trần Thị B",
      duration: "12 tuần",
      status: "active",
    }
  ]);

  const toggleCourseStatus = (id: string) => {
    setCourses(courses.map(course => 
      course.id === id 
        ? { ...course, status: course.status === 'active' ? 'inactive' : 'active' }
        : course
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/manager"
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Quản lý Khóa học</h1>
                <p className="text-purple-100 mt-2">Danh sách tất cả khóa học đào tạo</p>
              </div>
            </div>
            <Link
              href="/manager/add-course"
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Thêm khóa học</span>
            </Link>
          </div>
        </div>
      </div>      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Tên khóa học
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Giảng viên
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Thời lượng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.instructor}</div>
                  </td>                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      course.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {course.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        href={`/manager/courses/${course.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Chi tiết
                      </Link>
                      <Link
                        href={`/manager/courses/edit/${course.id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => toggleCourseStatus(course.id)}
                        className={`font-medium ${
                          course.status === 'active' 
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {course.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>          </table>
        </div>
      </div>
    </div>
  );
}
