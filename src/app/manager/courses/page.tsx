"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusIcon, ArrowLeftIcon, EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { fetchCourses, Course, fetchCourseById, deleteCourse, createCourse, updateCourse } from "@/lib/api/course";

import { jwtDecode } from "jwt-decode";

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  // Thêm state xác định là đang thêm mới hay sửa
  const [isAddMode, setIsAddMode] = useState(false);

  useEffect(() => {
    fetchCourses()
      .then((res) => {
        setCourses(Array.isArray(res) ? res : []);
      })
      .catch(() => setError("Không thể tải danh sách bài viết"))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }


  const handleAddCourse = () => {
    setEditingCourse({
      id: "",
      title: "",
      date: new Date().toISOString(),
      description: "",
      instructor: "",
      duration: "",
      image: "", // Đảm bảo trường image là string
    });
    setIsAddMode(true);
    setShowEditForm(true);
  };

  // Khi nhấn Sửa
  const handleEditCourse = (course: Course) => {
    setEditingCourse({
      ...course,
      image: course.image || "", // Đảm bảo luôn là string, không undefined
    });
    setIsAddMode(false);
    setShowEditForm(true);
  };

  // Ví dụ gọi khi cần lấy chi tiết:
  const handleShowDetail = async (id: string) => {
    const course = await fetchCourseById(id);
    // Xử lý hiển thị chi tiết ở đây
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
                <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
                <p className="text-purple-100 mt-2">
                  Danh sách tất cả bài viết đào tạo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddCourse} 
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Thêm bài viết</span>
            </button>
          </div>
          {/* Search box */}
          <div className="mt-6 flex justify-end">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bài viết..."
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Tên bài viết
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {course.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.date && !isNaN(Date.parse(course.date))
                      ? new Date(course.date).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        href={`/manager/courses/${course.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Chi tiết"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          handleEditCourse(course);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Sửa"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
                            const token = localStorage.getItem("token");
                            if (!token) {
                              alert("Bạn chưa đăng nhập hoặc thiếu token!");
                              return;
                            }
                            try {
                              await deleteCourse(course.id, token);
                              setCourses(courses.filter(c => c.id !== course.id));
                              alert("Xóa bài viết thành công!");
                            } catch (err) {
                              alert("Xóa thất bại!");
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400 italic">
                    Không tìm thấy bài viết phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showEditForm && editingCourse && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {isAddMode ? "Thêm bài viết" : "Chỉnh sửa bài viết"}
              </h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  if (!token) {
                    alert("Bạn chưa đăng nhập hoặc thiếu token!");
                    return;
                  }
                  try {
                    const decoded: any = jwtDecode(token);
                    const managerId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                    if (!managerId) {
                      alert("Không lấy được managerId từ token!");
                      return;
                    }
                    // Kiểm tra trùng tiêu đề (không phân biệt hoa thường)
                    const isDuplicate = courses.some(
                      c =>
                        c.title.trim().toLowerCase() === editingCourse.title.trim().toLowerCase() &&
                        (isAddMode || c.id !== editingCourse.id)
                    );
                    if (isDuplicate) {
                      alert("Tiêu đề bài viết đã tồn tại. Vui lòng chọn tiêu đề khác!");
                      return;
                    }
                    if (isAddMode) {
                      await createCourse({
                        courseId: editingCourse.id || "",
                        managerId,
                        title: editingCourse.title,
                        date: editingCourse.date,
                        description: editingCourse.description,
                        image: editingCourse.image || "",
                      }, token);
                      const res = await fetchCourses();
                      setCourses(Array.isArray(res) ? res : []);
                      alert("Thêm bài viết thành công!");
                    } else {
                      await updateCourse(editingCourse.id, {
                        managerId,
                        title: editingCourse.title,
                        date: editingCourse.date,
                        description: editingCourse.description,
                        image: editingCourse.image || "",
                      }, token);
                      const res = await fetchCourses();
                      setCourses(Array.isArray(res) ? res : []);
                      alert("Cập nhật bài viết thành công!");
                    }
                    setShowEditForm(false);
                  } catch (err) {
                    alert(`${isAddMode ? "Thêm" : "Cập nhật"} bài viết thất bại!`);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài viết</label>
                  <input
                    type="text"
                    value={editingCourse.title}
                    onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                    lang="vi"
                    autoComplete="off"
                    autoCorrect="on"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={editingCourse.description}
                    onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                    lang="vi"
                    autoComplete="off"
                    autoCorrect="on"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                    <input
                      type="date"
                      value={editingCourse.date?.slice(0, 10) || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                      readOnly
                    />
                  </div> */}
                  {/* Có thể thêm các trường khác nếu cần */}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bài viết</label>
                  <div
                    className="w-full px-3 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && editingCourse) {
                        setEditingCourse({ ...editingCourse, image: file.name });
                      }
                    }}
                  >
                    {editingCourse?.image
                      ? <span className="text-green-600 font-medium">{editingCourse.image}</span>
                      : <span className="text-gray-400">Kéo & thả ảnh vào đây hoặc click để chọn</span>
                    }
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="course-image-upload"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file && editingCourse) {
                          setEditingCourse({ ...editingCourse, image: file.name });
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
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {isAddMode ? "Thêm" : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
