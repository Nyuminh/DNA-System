"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PlayIcon,
  CheckCircleIcon
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
  objectives: string[];
  curriculum: CourseModule[];
  requirements: string[];
  benefits: string[];
  totalLessons: number;
  totalHours: string;
  price: number;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: string[];
  duration: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  progress: number;
  status: "active" | "completed" | "dropped";
}

interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Mock data - trong thực tế sẽ gọi API
    const mockCourse: Course = {
      id: courseId,
      title: "Kiến thức cơ bản về ADN",
      description: "Tìm hiểu về cấu trúc, chức năng và vai trò của ADN trong di truyền học. Khóa học cung cấp nền tảng vững chắc về sinh học phân tử và các ứng dụng thực tiễn trong xét nghiệm ADN.",
      instructor: "TS. Nguyễn Văn A",
      duration: "8 tuần",
      category: "basic",
      status: "active",
      students: 45,
      rating: 4.8,
      level: "Cơ bản",
      createdAt: "2024-01-15",
      totalLessons: 24,
      totalHours: "32 giờ",
      price: 2500000,
      objectives: [
        "Hiểu cấu trúc và tính chất của ADN",
        "Nắm vững các nguyên lý di truyền học cơ bản",
        "Áp dụng kiến thức vào phân tích ADN",
        "Hiểu các phương pháp xét nghiệm ADN hiện đại",
        "Phát triển tư duy khoa học trong nghiên cứu"
      ],
      curriculum: [
        {
          id: "1",
          title: "Giới thiệu về ADN",
          lessons: [
            "Lịch sử khám phá ADN",
            "Cấu trúc phân tử ADN",
            "Các loại ADN"
          ],
          duration: "1 tuần"
        },
        {
          id: "2", 
          title: "Di truyền học cơ bản",
          lessons: [
            "Nguyên lý di truyền Mendel",
            "Nhiễm sắc thể và gene",
            "Đột biến và biến dị"
          ],
          duration: "2 tuần"
        },
        {
          id: "3",
          title: "Kỹ thuật phân tích ADN",
          lessons: [
            "PCR và các ứng dụng",
            "Giải trình tự ADN",
            "Phân tích đa hình ADN"
          ],
          duration: "2 tuần"
        },
        {
          id: "4",
          title: "Ứng dụng thực tiễn",
          lessons: [
            "Xét nghiệm ADN trong y học",
            "Pháp y ADN",
            "Nghiên cứu nguồn gốc"
          ],
          duration: "3 tuần"
        }
      ],
      requirements: [
        "Kiến thức sinh học cơ bản ở trình độ phổ thông",
        "Có khả năng đọc hiểu tiếng Anh cơ bản",
        "Máy tính có kết nối internet",
        "Thời gian học ít nhất 4-6 giờ/tuần"
      ],
      benefits: [
        "Chứng chỉ hoàn thành khóa học",
        "Kiến thức nền tảng vững chắc về ADN",
        "Hỗ trợ tư vấn từ giảng viên",
        "Tài liệu học tập đầy đủ",
        "Cơ hội thực tập tại phòng lab"
      ]
    };

    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Nguyễn Thị B",
        email: "nguyenthib@email.com",
        enrolledDate: "2024-03-01",
        progress: 85,
        status: "active"
      },
      {
        id: "2",
        name: "Trần Văn C",
        email: "tranvanc@email.com",
        enrolledDate: "2024-02-15",
        progress: 100,
        status: "completed"
      },
      {
        id: "3",
        name: "Lê Thị D",
        email: "lethid@email.com",
        enrolledDate: "2024-03-10",
        progress: 45,
        status: "active"
      }
    ];

    const mockReviews: Review[] = [
      {
        id: "1",
        studentName: "Nguyễn Thị B",
        rating: 5,
        comment: "Khóa học rất hữu ích, giảng viên giải thích dễ hiểu. Tài liệu đầy đủ và chi tiết.",
        date: "2024-03-20"
      },
      {
        id: "2",
        studentName: "Trần Văn C",
        rating: 5,
        comment: "Nội dung phong phú, có nhiều ví dụ thực tế. Rất phù hợp cho người mới bắt đầu.",
        date: "2024-03-18"
      },
      {
        id: "3",
        studentName: "Lê Thị D",
        rating: 4,
        comment: "Khóa học tốt, chỉ có điều tiến độ hơi nhanh một chút.",
        date: "2024-03-15"
      }
    ];

    setCourse(mockCourse);
    setStudents(mockStudents);
    setReviews(mockReviews);
  }, [courseId]);

  const handleDeleteCourse = () => {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác.')) {
      // API call to delete course
      alert('Khóa học đã được xóa thành công!');
      // Redirect to courses list
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStudentStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'active':
        return 'Đang học';
      case 'dropped':
        return 'Đã bỏ học';
      default:
        return 'Không xác định';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'basic':
        return 'Cơ bản';
      case 'advanced':
        return 'Nâng cao';
      case 'professional':
        return 'Chuyên nghiệp';
      default:
        return 'Khác';
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">              <Link 
                href="/manager/courses"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center">
                <EyeIcon className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Chi tiết khóa học</h1>
                  <p className="text-sm text-gray-500">{course.title}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/manager/courses/edit/${course.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
              <button
                onClick={handleDeleteCourse}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {course.status === 'active' ? 'Đang mở' : 'Đã đóng'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getCategoryText(course.category)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {course.level}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 mr-1" />
                  {course.instructor}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {course.duration}
                </span>
              </div>
            </div>
            <div className="ml-6 text-right">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {course.price.toLocaleString()} VNĐ
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{course.rating}</span>
                <span className="mx-1">•</span>
                <span>{course.students} học viên</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <PlayIcon className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Tổng bài học</p>
                  <p className="text-sm text-gray-600">{course.totalLessons} bài</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Thời lượng</p>
                  <p className="text-sm text-gray-600">{course.totalHours}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Học viên</p>
                  <p className="text-sm text-gray-600">{course.students} người</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Ngày tạo</p>
                  <p className="text-sm text-gray-600">{new Date(course.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Tổng quan', icon: DocumentTextIcon },
                { id: 'students', label: 'Học viên', icon: UserGroupIcon },
                { id: 'reviews', label: 'Đánh giá', icon: StarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Objectives */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mục tiêu khóa học</h3>
                  <ul className="space-y-2">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Curriculum */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Chương trình học</h3>
                  <div className="space-y-4">
                    {course.curriculum.map((module, index) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900">
                            Chương {index + 1}: {module.title}
                          </h4>
                          <span className="text-sm text-gray-500">{module.duration}</span>
                        </div>
                        <ul className="space-y-1">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-center text-sm text-gray-600">
                              <PlayIcon className="h-3 w-3 mr-2 text-blue-500" />
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Yêu cầu</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-orange-500 mr-2 mt-0.5">⚠</span>
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Lợi ích</h3>
                  <ul className="space-y-2">
                    {course.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5">★</span>
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Danh sách học viên</h3>
                  <span className="text-sm text-gray-500">{students.length} học viên</span>
                </div>
                
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Học viên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày đăng ký
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiến độ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(student.enrolledDate).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStudentStatusColor(student.status)}`}>
                              {getStudentStatusText(student.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Đánh giá học viên</h3>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-gray-500 ml-1">({reviews.length} đánh giá)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.studentName}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
