"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusIcon, ArrowLeftIcon, EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { fetchCourses, Course, fetchCourseById, deleteCourse, createCourse, updateCourse } from "@/lib/api/course";
import axios from "axios";

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 md:px-8 py-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-700 mb-1">Quản lý bài viết</h1>
          <p className="text-slate-500 text-sm">Danh sách tất cả bài viết đào tạo</p>
        </div>
        <div className="flex gap-2">
          {/* <Link
            href="/manager"
            className="inline-flex items-center px-3 py-2 bg-white text-emerald-700 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Về Dashboard
          </Link> */}
          <button
            type="button"
            onClick={handleAddCourse}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm bài viết
          </button>
        </div>
      </div>
      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên bài viết..."
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 w-full max-w-xs focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-100">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-500 uppercase">Tên bài viết</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-500 uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{course.title}</td>
                  <td className="px-6 py-4 text-slate-700">
                    {course.date && !isNaN(Date.parse(course.date))
                      ? new Date(course.date).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/manager/courses/${course.id}`}
                        className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                        title="Chi tiết"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Xem
                      </Link>
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        title="Sửa"
                      >
                        <PencilSquareIcon className="w-4 h-4 mr-1" />
                        Sửa
                      </button>
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
                        className="inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition"
                        title="Xóa"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400 italic">
                    Không tìm thấy bài viết phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal giữ nguyên */}
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
                    // Kiểm tra trùng tiêu đề
                    const isDuplicate = courses.some(
                      c =>
                        c.title.trim().toLowerCase() === editingCourse.title.trim().toLowerCase() &&
                        (isAddMode || c.id !== editingCourse.id)
                    );
                    if (isDuplicate) {
                      alert("Tiêu đề bài viết đã tồn tại. Vui lòng chọn tiêu đề khác!");
                      return;
                    }
                    // Lấy file ảnh từ input
                    const fileInput = document.getElementById("course-image-upload") as HTMLInputElement;
                    const file = fileInput?.files?.[0];

                    // Tạo FormData và append các trường
                    const formDataToSend = new FormData();
                    formDataToSend.append("ManagerId", managerId);
                    formDataToSend.append("Title", editingCourse.title);
                    formDataToSend.append("Date", editingCourse.date);
                    formDataToSend.append("Description", editingCourse.description);
                    formDataToSend.append("Image", file ? file.name : (editingCourse.image || ""));
                    if (file) {
                      formDataToSend.append("picture", file);
                    }

                    // Hiển thị các giá trị đã đưa vào payload (FormData)
                    for (const pair of formDataToSend.entries()) {
                      console.log(`[FormData] ${pair[0]}:`, pair[1]);
                    }

                    if (isAddMode) {
                      await createCourse(
                        {
                          managerId,
                          title: editingCourse.title,
                          date: editingCourse.date,
                          description: editingCourse.description,
                          image: file ? file.name : (editingCourse.image || ""),
                        },
                        token,
                        file
                      );
                      const res = await fetchCourses();
                      setCourses(Array.isArray(res) ? res : []);
                      alert("Thêm bài viết thành công!");
                    } else {
                      await updateCourse(
                        editingCourse.id,
                        {
                          managerId,
                          title: editingCourse.title,
                          date: editingCourse.date,
                          description: editingCourse.description,
                          image: file ? file.name : (editingCourse.image || ""),
                        },
                        token,
                        file
                      );
                      await axios.put(
                        `http://localhost:5198/api/Course/${editingCourse.id}`,
                        formDataToSend,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                    lang="vi"
                    autoComplete="off"
                    autoCorrect="on"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bài viết</label>
                  <div
                    className="w-full px-3 py-6 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer bg-slate-50 hover:bg-slate-100"
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
                      : <span className="text-slate-400">Kéo & thả ảnh vào đây hoặc click để chọn</span>
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
                    <label htmlFor="course-image-upload" className="block mt-2 text-emerald-600 underline cursor-pointer">
                      Chọn ảnh
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Kéo & thả hoặc chọn file ảnh.
                  </p>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
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
