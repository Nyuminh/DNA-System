"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Category {
  id: string;
  name: string;
  value?: string;
}

export default function AddNewService() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: "",
    name: "",
    price: "",
    description: "",
    image: "",
    type: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get("http://localhost:5198/api/Services/categories");
        let categoriesData: Category[] = [];
        if (response.data && Array.isArray(response.data)) {
          categoriesData = response.data.map((cat: any) => ({
            id: cat.id || cat.value || cat,
            name: cat.name || cat.label || cat,
            value: cat.value || cat.id || cat,
          }));
        } else if (response.data && typeof response.data === "object" && "$values" in response.data) {
          categoriesData = response.data.$values.map((cat: any) => ({
            id: cat.id || cat.value || cat,
            name: cat.name || cat.label || cat,
            value: cat.value || cat.id || cat,
          }));
        }
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: categoriesData[0].value || categoriesData[0].id,
          }));
        }
      } catch {
        setCategories([
          { id: "paternity", name: "Xét nghiệm Huyết thống", value: "paternity" },
          { id: "forensic", name: "Xét nghiệm Tư pháp", value: "forensic" },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Bạn cần đăng nhập để thực hiện chức năng này.");
        return;
      }
      const payload = {
        serviceId: formData.serviceId,
        name: formData.name,
        price: Number(formData.price) || 0,
        description: formData.description,
        image: formData.image,
        type: formData.type, // Sử dụng 'type' nếu backend yêu cầu, nếu không thì giữ 'category'
      };
      await axios.post("http://localhost:5198/api/Services", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/manager/service-list");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Đã xảy ra lỗi khi tạo dịch vụ. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/manager/service-list"
              className="flex items-center px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm text-sm"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Danh sách dịch vụ
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Thêm Dịch vụ mới</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="container mx-auto px-6 pt-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-700">Dịch vụ đã được tạo thành công! Đang chuyển hướng...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="container mx-auto px-6 pt-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã dịch vụ *</label>
              <input
                type="text"
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="VD: S001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên dịch vụ *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tên dịch vụ"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VNĐ) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mô tả dịch vụ"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link ảnh</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
              {loadingCategories ? (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="animate-spin h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang tải danh mục...</span>
                </div>
              ) : (
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">Không có danh mục nào</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.value || category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Tạo dịch vụ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
