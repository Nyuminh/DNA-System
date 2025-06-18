"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon
} from "@heroicons/react/24/outline";

interface ServiceForm {
  name: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "inactive";
  duration: string;
  requirements: string[];
  benefits: string[];
  process: string[];
  sampleTypes: string[];
  turnaroundTime: string;
  accuracy: string;
}

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [formData, setFormData] = useState<ServiceForm>({
    name: "",
    description: "",
    price: 0,
    category: "",
    status: "active",
    duration: "",
    requirements: [""],
    benefits: [""],
    process: [""],
    sampleTypes: [""],
    turnaroundTime: "",
    accuracy: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    "Huyết thống",
    "Tư pháp", 
    "Nguồn gốc",
    "Sức khỏe",
    "Khác"
  ];

  useEffect(() => {
    // Mock data - trong thực tế sẽ gọi API để lấy thông tin dịch vụ
    const mockService = {
      name: "Xét nghiệm ADN Hành chính",
      description: "Xét nghiệm ADN xác định quan hệ huyết thống phục vụ các thủ tục hành chính như xin visa, khai sinh, thừa kế, và các vấn đề pháp lý khác. Kết quả có giá trị pháp lý được công nhận bởi các cơ quan chức năng.",
      price: 4500000,
      category: "Huyết thống",
      status: "active" as const,
      duration: "5-7 ngày làm việc",
      requirements: [
        "Giấy tờ tùy thân có ảnh",
        "Giấy tờ chứng minh mối quan hệ (nếu có)",
        "Đơn đề nghị xét nghiệm",
        "Thanh toán đầy đủ chi phí"
      ],
      benefits: [
        "Kết quả có giá trị pháp lý",
        "Độ chính xác cao 99.99%",
        "Được công nhận bởi tòa án",
        "Hỗ trợ tư vấn miễn phí",
        "Bảo mật thông tin tuyệt đối"
      ],
      process: [
        "Đăng ký và tư vấn",
        "Chuẩn bị giấy tờ cần thiết",
        "Lấy mẫu tại phòng lab",
        "Tiến hành phân tích",
        "Trả kết quả và tư vấn"
      ],
      sampleTypes: [
        "Máu (ưu tiên)",
        "Nước bọt",
        "Tóc có chân",
        "Móng tay/chân"
      ],
      turnaroundTime: "5-7 ngày làm việc",
      accuracy: "99.99%"
    };

    setFormData(mockService);
    setIsLoading(false);
  }, [serviceId]);
  const handleInputChange = (field: keyof ServiceForm, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof ServiceForm, index: number, value: string) => {
    const newArray = [...(formData[field] as string[])];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field: keyof ServiceForm) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""]
    }));
  };

  const removeArrayItem = (field: keyof ServiceForm, index: number) => {
    const newArray = (formData[field] as string[]).filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      // Filter out empty items from arrays
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(item => item.trim() !== ""),
        benefits: formData.benefits.filter(item => item.trim() !== ""),
        process: formData.process.filter(item => item.trim() !== ""),
        sampleTypes: formData.sampleTypes.filter(item => item.trim() !== "")
      };

      // API call to update service
      console.log("Updating service:", cleanedData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Dịch vụ đã được cập nhật thành công!");
      router.push(`/manager/services/${serviceId}`);
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Có lỗi xảy ra khi cập nhật dịch vụ!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin dịch vụ...</p>
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
            <div className="flex items-center">
              <Link 
                href={`/manager/services/${serviceId}`}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa dịch vụ</h1>
                <p className="text-sm text-gray-500">Cập nhật thông tin dịch vụ xét nghiệm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá dịch vụ (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as "active" | "inactive")}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian thực hiện
                </label>
                <input
                  type="text"
                  value={formData.turnaroundTime}
                  onChange={(e) => handleInputChange("turnaroundTime", e.target.value)}
                  placeholder="Ví dụ: 5-7 ngày làm việc"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ chính xác
                </label>
                <input
                  type="text"
                  value={formData.accuracy}
                  onChange={(e) => handleInputChange("accuracy", e.target.value)}
                  placeholder="Ví dụ: 99.99%"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả dịch vụ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Yêu cầu</h2>
            
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                  placeholder="Nhập yêu cầu..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("requirements", index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  disabled={formData.requirements.length === 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem("requirements")}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Thêm yêu cầu
            </button>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lợi ích</h2>
            
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
                  placeholder="Nhập lợi ích..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("benefits", index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  disabled={formData.benefits.length === 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem("benefits")}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Thêm lợi ích
            </button>
          </div>

          {/* Process */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quy trình thực hiện</h2>
            
            {formData.process.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleArrayChange("process", index, e.target.value)}
                  placeholder="Nhập bước thực hiện..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("process", index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  disabled={formData.process.length === 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem("process")}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Thêm bước
            </button>
          </div>

          {/* Sample Types */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Loại mẫu xét nghiệm</h2>
            
            {formData.sampleTypes.map((sampleType, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={sampleType}
                  onChange={(e) => handleArrayChange("sampleTypes", index, e.target.value)}
                  placeholder="Nhập loại mẫu..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("sampleTypes", index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  disabled={formData.sampleTypes.length === 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem("sampleTypes")}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Thêm loại mẫu
            </button>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end space-x-4">
              <Link
                href={`/manager/services/${serviceId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Hủy
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
