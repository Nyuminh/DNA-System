"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
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
import { updateCourse, deleteCourse } from "@/lib/api/course";

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
  image?: string;
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

async function fetchCourseDetail(id: string): Promise<Course | null> {
  try {
    const response = await axios.get(`http://localhost:5198/api/Course/${id}`);
    const data = response.data;
    const course = data?.$values ? data.$values[0] : data;
    return {
      id: course.id?.toString() || course.courseId?.toString() || "",
      title: course.title || course.name || "Không có tên",
      description: course.description || "Không có mô tả",
      instructor: course.instructor || "Không rõ",
      duration: course.duration || "",
      category: course.category || "",
      status: course.status || "inactive",
      students: course.students || 0,
      rating: course.rating || 0,
      level: course.level || "",
      createdAt: course.createdAt || course.date || "",
      objectives: course.objectives || [],
      curriculum: course.curriculum || [],
      requirements: course.requirements || [],
      benefits: course.benefits || [],
      totalLessons: course.totalLessons || 0,
      totalHours: course.totalHours || "",
      price: course.price || 0,
      image: course.image, // <-- Đảm bảo có dòng này!
    };
  } catch (error) {
    return null;
  }
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  // Thêm dữ liệu giả cho students và reviews nếu chưa có API thực tế
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "a@example.com",
      enrolledDate: "2024-06-01T10:00:00Z",
      progress: 80,
      status: "active",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "b@example.com",
      enrolledDate: "2024-05-15T10:00:00Z",
      progress: 100,
      status: "completed",
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "c@example.com",
      enrolledDate: "2024-04-20T10:00:00Z",
      progress: 30,
      status: "dropped",
    },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "r1",
      studentName: "Nguyễn Văn A",
      rating: 5,
      comment: "Bài viết rất hữu ích!",
      date: "2024-06-10T10:00:00Z",
    },
    {
      id: "r2",
      studentName: "Trần Thị B",
      rating: 4,
      comment: "Giảng viên nhiệt tình, nội dung dễ hiểu.",
      date: "2024-06-12T10:00:00Z",
    },
    {
      id: "r3",
      studentName: "Lê Văn C",
      rating: 3,
      comment: "Bài viết ổn, nhưng cần thêm ví dụ thực tế.",
      date: "2024-06-15T10:00:00Z",
    },
  ]);

  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourseDetail(courseId).then(setCourse);

    // Nếu sau này có API thực tế, hãy gọi API ở đây để setStudents và setReviews
    // setStudents(data.students);
    // setReviews(data.reviews);
  }, [courseId]);


  const handleDeleteCourse = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập hoặc thiếu token!");
        return;
      }
      try {
        await deleteCourse(courseId, token);
        alert('Bài viết đã được xóa thành công!');
        router.push("/manager/courses");
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc thiếu token!");
      return;
    }
    try {
      // Lấy file ảnh từ input
      const fileInput = document.getElementById("course-image-upload") as HTMLInputElement;
      const file = fileInput?.files?.[0];

      // Tạo FormData và append các trường
      const formDataToSend = new FormData();
      formDataToSend.append("Title", editData.title);
      formDataToSend.append("Description", editData.description);
      formDataToSend.append("Date", editData.createdAt);
      formDataToSend.append("Image", file ? file.name : (editData.image || ""));
      if (file) {
        formDataToSend.append("picture", file);
      }

      // Hiển thị các giá trị đã đưa vào payload (FormData)
      for (const pair of formDataToSend.entries()) {
        console.log(`[FormData] ${pair[0]}:`, pair[1]);
      }

      // Gửi dữ liệu lên API bằng axios PUT
      await axios.put(
        `http://localhost:5198/api/Course/${courseId}`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Cập nhật bài viết thành công!");
      setIsEditMode(false);
      fetchCourseDetail(courseId).then(setCourse);
    } catch (err: any) {
      if (err.response) {
        alert("Cập nhật thất bại!\n" + JSON.stringify(err.response.data));
      } else {
        alert("Cập nhật thất bại!");
      }
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin bài viết...</p>
        </div>
      </div>
    );
  }

  // Nếu đang chỉnh sửa, hiển thị form
  if (isEditMode && editData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-8">
          <h2 className="text-xl font-bold mb-4">Chỉnh sửa bài viết</h2>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên bài viết</label>
              <input
                type="text"
                value={editData.title}
                onChange={e => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={10}
                required
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium mb-1">Ngày tạo</label>
              <input
                type="date"
                value={editData.createdAt?.slice(0, 10) || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
                readOnly
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium mb-1">Ảnh bài viết</label>
              <div
                className="w-full px-3 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    setEditData({ ...editData, image: file.name });
                  }
                }}
              >
                {editData.image
                  ? <span className="text-green-600 font-medium">{editData.image}</span>
                  : <span className="text-gray-400">Kéo & thả ảnh vào đây hoặc click để chọn</span>
                }
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="course-image-upload"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditData({ ...editData, image: file.name });
                    }
                  }}
                />
                <label htmlFor="course-image-upload" className="block mt-2 text-indigo-600 underline cursor-pointer">
                  Chọn ảnh
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kéo & thả hoặc chọn file ảnh.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dữ liệu giả cho mục tiêu và lợi ích
  const fakeObjectives = [
    "Hiểu được quy trình xét nghiệm DNA",
    "Nắm vững kiến thức cơ bản về di truyền học",
    "Áp dụng kiến thức vào thực tế"
  ];

  const fakeBenefits = [
    "Nhận chứng chỉ hoàn thành bài viết",
    "Hỗ trợ tư vấn chuyên môn miễn phí",
    "Cơ hội thực tập tại phòng lab"
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/manager/courses"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center">
                <EyeIcon className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Chi tiết bài viết</h1>
                  <p className="text-sm text-gray-500">{course.title}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => { setEditData(course); setIsEditMode(true); }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </button>
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


      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-4xl w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            {/* Thông tin bên trái */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
              </div>
              <p className="text-gray-600 mb-4 whitespace-pre-line">
                {(() => {
                  let dashCount = 0;
                  return course.description
                    .split('\n')
                    .map((line, idx) => {
                      if (line.trim().startsWith('-')) {
                        dashCount++;
                        if (dashCount === 1) {
                          return <span key={idx}>{line.trim()}</span>;
                        }
                        return (
                          <span key={idx}>
                            <br />
                            {line.trim()}
                          </span>
                        );
                      }
                      return (
                        <span key={idx}>
                          {idx !== 0 && <br />}
                          {line}
                        </span>
                      );
                    });
                })()}
              </p>
              <div className="flex items-center text-sm text-gray-500 space-x-4 mt-2">
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
            {/* Ảnh bên phải */}
            {course.image && (
              <div className="flex-shrink-0 flex items-center justify-center mt-6 md:mt-0 md:ml-8">
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white p-2">
                  <img
                    src={`http://localhost:5198/${course.image}`}
                    alt={course.title}
                    className="w-48 h-48 object-cover rounded-lg"
                    onError={e => { e.currentTarget.src = "/images/default-avatar.jpg"; }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tổng quan */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="space-y-6">
              {/* Objectives */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mục tiêu bài viết</h3>
                <ul className="space-y-2">
                  {(course.objectives.length ? course.objectives : fakeObjectives).map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-600">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lợi ích</h3>
                <ul className="space-y-2">
                  {(course.benefits.length ? course.benefits : fakeBenefits).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5">★</span>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
