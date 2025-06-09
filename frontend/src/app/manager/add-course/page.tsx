"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function AddNewCourse() {  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    duration: '',
    instructor: '',
    level: 'beginner',
    category: 'genetics',
    modules: [''],
    objectives: [''],
    requirements: [''],
    skills: [''],
    certificate: true,
    status: 'active',
    isPopular: false,
    maxStudents: '',
    language: 'vietnamese'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categoryOptions = [
    { value: 'genetics', label: 'Di truyền học' },
    { value: 'molecular', label: 'Sinh học phân tử' },
    { value: 'forensic', label: 'ADN pháp y' },
    { value: 'research', label: 'Nghiên cứu ADN' },
    { value: 'basic', label: 'Kiến thức cơ bản' }
  ];

  const levelOptions = [
    { value: 'beginner', label: 'Cơ bản' },
    { value: 'intermediate', label: 'Trung cấp' },
    { value: 'advanced', label: 'Nâng cao' },
    { value: 'expert', label: 'Chuyên gia' }
  ];

  const languageOptions = [
    { value: 'vietnamese', label: 'Tiếng Việt' },
    { value: 'english', label: 'Tiếng Anh' },
    { value: 'both', label: 'Song ngữ' }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      // Validate required fields
    if (!formData.title || !formData.description || !formData.instructor) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Here you would typically send the data to your API
    console.log('Course data:', formData);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);      // Reset form or redirect
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        duration: '',
        instructor: '',
        level: 'beginner',
        category: 'genetics',
        modules: [''],
        objectives: [''],
        requirements: [''],
        skills: [''],
        certificate: true,
        status: 'active',
        isPopular: false,
        maxStudents: '',
        language: 'vietnamese'
      });
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckIcon className="w-5 h-5" />
          <span>Thêm khóa học thành công!</span>
        </div>
      )}

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
                <h1 className="text-3xl font-bold">Thêm Khóa Học Mới</h1>
                <p className="text-purple-100 mt-2">Tạo khóa học đào tạo chuyên nghiệp</p>
              </div>
            </div>            <Link
              href="/manager/courses"
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              Danh sách khóa học
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                currentStep >= step ? 'bg-purple-600' : 'bg-gray-300'
              }`}>
                {step}
              </div>
              <div className="ml-3">
                <div className={`font-medium ${currentStep >= step ? 'text-purple-600' : 'text-gray-400'}`}>
                  {step === 1 && 'Thông tin cơ bản'}
                  {step === 2 && 'Nội dung khóa học'}
                  {step === 3 && 'Cài đặt nâng cao'}
                </div>
              </div>
              {step < 3 && <div className={`w-20 h-1 mx-4 ${currentStep > step ? 'bg-purple-600' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin cơ bản</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên khóa học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập tên khóa học..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giảng viên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tên giảng viên..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời lượng
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="VD: 8 tuần, 40 giờ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trình độ
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {levelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngôn ngữ
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng học viên tối đa
                    </label>
                    <input
                      type="number"
                      name="maxStudents"
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="VD: 30"
                      min="1"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả ngắn
                    </label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Mô tả ngắn gọn về khóa học..."
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Mô tả chi tiết về nội dung, phương pháp giảng dạy, lợi ích..."
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Course Content */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Nội dung khóa học</h2>
                
                {/* Modules */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Các chương/module học
                  </label>
                  {formData.modules.map((module, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={module}
                        onChange={(e) => updateArrayItem('modules', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={`Chương ${index + 1}...`}
                      />
                      {formData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('modules', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('modules')}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mt-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Thêm chương</span>
                  </button>
                </div>

                {/* Learning Objectives */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mục tiêu học tập
                  </label>
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateArrayItem('objectives', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={`Mục tiêu ${index + 1}...`}
                      />
                      {formData.objectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('objectives', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('objectives')}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mt-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Thêm mục tiêu</span>
                  </button>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu cầu tiên quyết
                  </label>
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={`Yêu cầu ${index + 1}...`}
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mt-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Thêm yêu cầu</span>
                  </button>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kỹ năng đạt được
                  </label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateArrayItem('skills', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={`Kỹ năng ${index + 1}...`}
                      />
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('skills', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills')}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mt-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Thêm kỹ năng</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Advanced Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt nâng cao</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                      <option value="draft">Bản nháp</option>
                    </select>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isPopular"
                          checked={formData.isPopular}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Khóa học nổi bật</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="certificate"
                          checked={formData.certificate}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Cấp chứng chỉ</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Quay lại
                  </button>
                )}
              </div>
              
              <div className="space-x-4">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Tiếp theo
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  >
                    Tạo khóa học
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
