"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function AddNewService() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    duration: '',
    accuracy: '',
    category: 'paternity',
    sampleTypes: [''],
    features: [''],
    requirements: [''],
    process: [''],
    deliverables: [''],
    status: 'active',
    isPopular: false,
    discount: 0
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categoryOptions = [
    { value: 'paternity', label: 'Xét nghiệm Huyết thống' },
    { value: 'forensic', label: 'Xét nghiệm Tư pháp' },
    { value: 'ancestry', label: 'Xét nghiệm Nguồn gốc' },
    { value: 'health', label: 'Xét nghiệm Sức khỏe' }
  ];

  const addArrayItem = (field: string) => {
    setFormData({
      ...formData,
      [field]: [...formData[field as keyof typeof formData] as string[], '']
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const items = formData[field as keyof typeof formData] as string[];
    setFormData({
      ...formData,
      [field]: items.filter((_, i) => i !== index)
    });
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    const items = [...formData[field as keyof typeof formData] as string[]];
    items[index] = value;
    setFormData({
      ...formData,
      [field]: items
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Service data:', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form or redirect
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">            <div className="flex items-center space-x-4">
              <Link
                href="/manager"
                className="flex items-center px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm text-sm"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              <Link
                href="/manager/service-list"
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Quay về danh sách dịch vụ"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Thêm Dịch vụ mới</h1>
                <p className="text-green-100">Tạo dịch vụ xét nghiệm ADN mới cho hệ thống</p>
              </div>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-white text-green-600' 
                      : 'bg-green-500 text-white'
                  }`}>
                    {step < currentStep ? <CheckIcon className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-1 mx-2 ${
                      step < currentStep ? 'bg-white' : 'bg-green-500'
                    }`} />
                  )}
                </div>
              ))}
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
              <p className="text-green-700">Dịch vụ đã được tạo thành công!</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Bước 1: Thông tin cơ bản</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên dịch vụ *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ví dụ: Xét nghiệm ADN Hành chính"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn *</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Mô tả ngắn gọn về dịch vụ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết về dịch vụ, quy trình, lợi ích..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isPopular" className="ml-2 text-sm text-gray-700">
                    Đánh dấu là dịch vụ phổ biến
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Bước 2: Giá cả & Chi tiết</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá hiện tại (VNĐ) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="4500000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá gốc (VNĐ)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="5000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian thực hiện *</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="5-7 ngày làm việc"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Độ chính xác *</label>
                    <input
                      type="text"
                      value={formData.accuracy}
                      onChange={(e) => setFormData({...formData, accuracy: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="99,99%"
                      required
                    />
                  </div>
                </div>

                {/* Sample Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại mẫu xét nghiệm</label>
                  {formData.sampleTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={type}
                        onChange={(e) => updateArrayItem('sampleTypes', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ví dụ: Máu, Nước bọt, Tóc"
                      />
                      {formData.sampleTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('sampleTypes', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('sampleTypes')}
                    className="flex items-center text-green-600 hover:text-green-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Thêm loại mẫu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features & Process */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Bước 3: Tính năng & Quy trình</h2>
              
              <div className="space-y-6">
                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tính năng nổi bật</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateArrayItem('features', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ví dụ: Kết quả nhanh chóng"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('features', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('features')}
                    className="flex items-center text-green-600 hover:text-green-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Thêm tính năng
                  </button>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu chuẩn bị</label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ví dụ: Giấy tờ tùy thân"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="flex items-center text-green-600 hover:text-green-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Thêm yêu cầu
                  </button>
                </div>

                {/* Process */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quy trình thực hiện</label>
                  {formData.process.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateArrayItem('process', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ví dụ: Lấy mẫu xét nghiệm"
                      />
                      {formData.process.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('process', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('process')}
                    className="flex items-center text-green-600 hover:text-green-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Thêm bước
                  </button>
                </div>

                {/* Deliverables */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kết quả giao nộp</label>
                  {formData.deliverables.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem('deliverables', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ví dụ: Báo cáo kết quả PDF"
                      />
                      {formData.deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('deliverables', index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('deliverables')}
                    className="flex items-center text-green-600 hover:text-green-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Thêm kết quả
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Quay lại
              </button>
            )}
            
            <div className="ml-auto">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Tiếp theo
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Tạo dịch vụ
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
