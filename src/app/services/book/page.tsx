'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

interface TestType {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  expedited: {
    available: boolean;
    price?: string;
    duration?: string;
  };
}

interface Participant {
  role: string;
  name: string;
  dob: string;
  gender: string;
  relationship?: string;
  sampleType: string;
}

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

interface FormData {
  serviceType: string;
  collectionMethod: string;
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  cityProvince: string;
  participants: Participant[];
  contactInfo: ContactInfo;
  termsAccepted: boolean;
}

type TestTypes = {
  [key: string]: TestType;
};

// Mock data for test types - would come from API in real implementation
const testTypes: TestTypes = {
  'father-child': {
    id: 'father-child',
    name: 'Xét nghiệm Huyết thống Cha - Con',
    description: 'Xác định mối quan hệ huyết thống giữa cha và con',
    price: '4,000,000 VNĐ',
    duration: '3-5 ngày làm việc',
    expedited: {
      available: true,
      price: '6,000,000 VNĐ',
      duration: '24-48 giờ'
    }
  },
  'mother-child': {
    id: 'mother-child',
    name: 'Xét nghiệm Huyết thống Mẹ - Con',
    description: 'Xác định mối quan hệ huyết thống giữa mẹ và con',
    price: '4,000,000 VNĐ',
    duration: '3-5 ngày làm việc',
    expedited: {
      available: true,
      price: '6,000,000 VNĐ',
      duration: '24-48 giờ'
    }
  },
  'siblings': {
    id: 'siblings',
    name: 'Xét nghiệm Anh Chị Em',
    description: 'Xác định mối quan hệ huyết thống giữa anh chị em ruột',
    price: '5,000,000 VNĐ',
    duration: '5-7 ngày làm việc',
    expedited: {
      available: true,
      price: '7,500,000 VNĐ',
      duration: '48-72 giờ'
    }
  },
  'grandparent': {
    id: 'grandparent',
    name: 'Xét nghiệm ông bà cháu',
    description: 'Xác định mối quan hệ ông bà cháu thông qua ADN, độ chính xác 99.9%.',
    price: '5,500,000 VNĐ',
    duration: '5-7 ngày làm việc',
    expedited: {
      available: false,
    },
  },
  'immigration': {
    id: 'immigration',
    name: 'Xét nghiệm ADN cho di trú',
    description: 'Chứng minh mối quan hệ huyết thống cho mục đích xin visa, quốc tịch, định cư nước ngoài.',
    price: '6,500,000 VNĐ',
    duration: '5-7 ngày làm việc',
    expedited: {
      available: true,
      price: '10,000,000 VNĐ',
      duration: '3-5 ngày làm việc',
    },
  },
  'birth-certificate': {
    id: 'birth-certificate',
    name: 'Xét nghiệm ADN cho khai sinh',
    description: 'Xác định mối quan hệ huyết thống cho việc đăng ký khai sinh.',
    price: '5,500,000 VNĐ',
    duration: '3-5 ngày làm việc',
    expedited: {
      available: true,
      price: '8,000,000 VNĐ',
      duration: '24-48 giờ',
    },
  },
  'legal-inheritance': {
    id: 'legal-inheritance',
    name: 'Xét nghiệm ADN cho thừa kế',
    description: 'Xác định mối quan hệ huyết thống cho mục đích pháp lý liên quan đến thừa kế.',
    price: '6,000,000 VNĐ',
    duration: '3-5 ngày làm việc',
    expedited: {
      available: true,
      price: '9,000,000 VNĐ',
      duration: '24-48 giờ',
    },
  },
  'anonymous-paternity': {
    id: 'anonymous-paternity',
    name: 'Xét nghiệm cha con ẩn danh',
    description: 'Xác định mối quan hệ cha con thông qua ADN mà không cần cung cấp thông tin cá nhân.',
    price: '3,500,000 VNĐ',
    duration: '3-5 ngày làm việc',
    expedited: {
      available: true,
      price: '5,500,000 VNĐ',
      duration: '24-48 giờ',
    },
  },
  'prenatal': {
    id: 'prenatal',
    name: 'Xét nghiệm ADN trước sinh không xâm lấn',
    description: 'Xét nghiệm ADN thai nhi thông qua máu mẹ, không xâm lấn.',
    price: '15,000,000 VNĐ',
    duration: '7-12 ngày làm việc',
    expedited: {
      available: true,
      price: '20,000,000 VNĐ',
      duration: '5-7 ngày làm việc',
    },
  },
};

export default function BookServicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookServiceContent />
    </Suspense>
  );
}

function BookServiceContent() {
  const searchParams = useSearchParams();
  const testType = searchParams.get('type') || 'father-child';
  const [selectedTest, setSelectedTest] = useState<TestType>(testTypes[testType as keyof typeof testTypes] || testTypes['father-child']);
  const [formData, setFormData] = useState<FormData>({
    serviceType: 'standard', // standard or expedited
    collectionMethod: 'self', // self, facility, or home
    appointmentDate: '',
    appointmentTime: '',
    address: '',
    cityProvince: '',
    participants: [
      { role: '', name: '', dob: '', gender: '', relationship: '', sampleType: 'buccal' }
    ],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
    },
    termsAccepted: false,
  });

  // Update selected test whenever URL param changes
  useEffect(() => {
    if (testType in testTypes) {
      setSelectedTest(testTypes[testType]);
    }
  }, [testType]);  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    // Handle checkbox
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      return;
    }    // Handle nested fields (contactInfo)
    if (name.includes('.')) {
      const [parent, child] = name.split('.') as [keyof FormData, string];
      if (parent === 'contactInfo') {
        setFormData({
          ...formData,
          contactInfo: {
            ...formData.contactInfo,
            [child]: value
          }
        });
      }
      return;
    }
    
    // Handle regular fields
    setFormData({ ...formData, [name]: value });
  };
  const handleParticipantChange = (index: number, field: string, value: string) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };
    setFormData({ ...formData, participants: updatedParticipants });
  };

  const addParticipant = () => {
    setFormData({
      ...formData,
      participants: [
        ...formData.participants,
        { role: '', name: '', dob: '', gender: '', relationship: '', sampleType: 'buccal' }
      ]
    });
  };
  const removeParticipant = (index: number) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants.splice(index, 1);
    setFormData({ ...formData, participants: updatedParticipants });
  };  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          testType: selectedTest.id,
          price: formData.serviceType === 'expedited' 
            ? selectedTest.expedited.price 
            : selectedTest.price
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Đặt xét nghiệm thành công! Mã đặt lịch: ${result.booking.id}. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.`);
        // TODO: Redirect to booking confirmation page
      } else {
        alert(result.message || 'Có lỗi xảy ra khi đặt lịch');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    }
  };

  return (
    <MainLayout>
      <div className="bg-white">
        {/* Header section */}
        <div className="bg-blue-600 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Đặt dịch vụ xét nghiệm ADN
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-blue-200 sm:mt-4">
                Đặt lịch xét nghiệm {selectedTest.name} với quy trình đơn giản và bảo mật
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Service info */}
            <div className="lg:col-span-4">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông tin dịch vụ</h2>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedTest.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{selectedTest.description}</p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Thời gian xét nghiệm:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedTest.duration}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Giá dịch vụ tiêu chuẩn:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedTest.price}</dd>
                    </div>
                    {selectedTest.expedited.available && (
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Giá dịch vụ nhanh:</dt>
                        <dd className="text-sm font-medium text-gray-900">{selectedTest.expedited.price}</dd>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900">Các bước thực hiện:</h4>
                    <ol className="mt-2 text-sm text-gray-600 space-y-2 list-decimal list-inside">
                      <li>Điền thông tin và chọn phương thức thu mẫu</li>
                      <li>Thanh toán phí dịch vụ</li>
                      <li>Thực hiện thu mẫu theo phương thức đã chọn</li>
                      <li>Nhận kết quả sau khi hoàn thành xét nghiệm</li>
                    </ol>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">
                      Để được hỗ trợ và tư vấn thêm, vui lòng liên hệ hotline:{' '}
                      <a href="tel:19001234" className="font-medium text-blue-600 hover:text-blue-500">
                        1900 1234
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="mt-12 lg:mt-0 lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Service type selection */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn loại dịch vụ</h3>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="relative flex border rounded-lg overflow-hidden">
                      <input
                        type="radio"
                        name="serviceType"
                        id="standard-service"
                        value="standard"
                        className="sr-only"
                        checked={formData.serviceType === 'standard'}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="standard-service"
                        className={`flex-1 cursor-pointer p-4 ${
                          formData.serviceType === 'standard'
                            ? 'bg-blue-50 border-blue-500'
                            : 'border-transparent'
                        }`}
                      >
                        <span className="flex items-center">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-2">
                            {formData.serviceType === 'standard' && (
                              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                            )}
                          </span>
                          <span className="text-sm font-medium text-gray-900">Dịch vụ tiêu chuẩn</span>
                        </span>
                        <span className="block mt-1 text-sm text-gray-500">
                          Kết quả trong {selectedTest.duration}
                        </span>
                        <span className="block mt-1 text-sm font-medium text-gray-900">{selectedTest.price}</span>
                      </label>
                    </div>

                    {selectedTest.expedited.available && (
                      <div className="relative flex border rounded-lg overflow-hidden">
                        <input
                          type="radio"
                          name="serviceType"
                          id="expedited-service"
                          value="expedited"
                          className="sr-only"
                          checked={formData.serviceType === 'expedited'}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="expedited-service"
                          className={`flex-1 cursor-pointer p-4 ${
                            formData.serviceType === 'expedited'
                              ? 'bg-blue-50 border-blue-500'
                              : 'border-transparent'
                          }`}
                        >
                          <span className="flex items-center">
                            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-2">
                              {formData.serviceType === 'expedited' && (
                                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                              )}
                            </span>
                            <span className="text-sm font-medium text-gray-900">Dịch vụ nhanh</span>
                          </span>
                          <span className="block mt-1 text-sm text-gray-500">
                            Kết quả trong {selectedTest.expedited.duration}
                          </span>
                          <span className="block mt-1 text-sm font-medium text-gray-900">{selectedTest.expedited.price}</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>                {/* Collection method */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Phương thức thu mẫu</h3>                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="relative flex border rounded-lg overflow-hidden">
                      <input
                        type="radio"
                        name="collectionMethod"
                        id="self-collection"
                        value="self"
                        className="sr-only"
                        checked={formData.collectionMethod === 'self'}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="self-collection"
                        className={`flex-1 cursor-pointer p-4 ${
                          formData.collectionMethod === 'self'
                            ? 'bg-blue-50 border-blue-500'
                            : 'border-transparent'
                        }`}
                      >
                        <span className="flex items-center">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-2">
                            {formData.collectionMethod === 'self' && (
                              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                            )}
                          </span>
                          <span className="text-sm font-medium text-gray-900">Tự thu mẫu</span>
                        </span>
                        <span className="block mt-1 text-sm text-gray-500">
                          Nhận kit và tự thu mẫu tại nhà
                        </span>
                      </label>
                    </div>

                    <div className="relative flex border rounded-lg overflow-hidden">
                      <input
                        type="radio"
                        name="collectionMethod"
                        id="facility-collection"
                        value="facility"
                        className="sr-only"
                        checked={formData.collectionMethod === 'facility'}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="facility-collection"
                        className={`flex-1 cursor-pointer p-4 ${
                          formData.collectionMethod === 'facility'
                            ? 'bg-blue-50 border-blue-500'
                            : 'border-transparent'
                        }`}
                      >
                        <span className="flex items-center">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 mr-2">
                            {formData.collectionMethod === 'facility' && (
                              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                            )}
                          </span>
                          <span className="text-sm font-medium text-gray-900">Tại cơ sở y tế</span>
                        </span>
                        <span className="block mt-1 text-sm text-gray-500">
                          Đến cơ sở y tế để thu mẫu
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Conditional fields based on collection method */}
                  {formData.collectionMethod === 'facility' && (
                    <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                          Ngày lấy mẫu
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="appointmentDate"
                            id="appointmentDate"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            value={formData.appointmentDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                          Thời gian lấy mẫu
                        </label>
                        <div className="mt-1">
                          <select
                            id="appointmentTime"
                            name="appointmentTime"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            value={formData.appointmentTime}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Chọn thời gian</option>
                            <option value="08:00">08:00</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:30">14:30</option>
                            <option value="15:30">15:30</option>
                            <option value="16:30">16:30</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}                  {(formData.collectionMethod === 'self') && (
                    <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Địa chỉ nhận kit xét nghiệm
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="address"
                            id="address"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="Số nhà, đường, phường/xã"
                            value={formData.address}
                            onChange={handleInputChange}
                            required={formData.collectionMethod === 'self'}
                          />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="cityProvince" className="block text-sm font-medium text-gray-700">
                          Tỉnh/Thành phố
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="cityProvince"
                            id="cityProvince"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="Tỉnh/Thành phố"
                            value={formData.cityProvince}
                            onChange={handleInputChange}
                            required={formData.collectionMethod === 'self'}
                          />
                        </div>
                      </div>
                        <div>
                        <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                          Ngày nhận kit
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="appointmentDate"
                            id="appointmentDate"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            value={formData.appointmentDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required={formData.collectionMethod === 'self'}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                          Thời gian nhận kit
                        </label>
                        <div className="mt-1">
                          <select
                            id="appointmentTime"
                            name="appointmentTime"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            value={formData.appointmentTime}
                            onChange={handleInputChange}
                            required={formData.collectionMethod === 'self'}
                          >
                            <option value="">Chọn thời gian</option>
                            <option value="buổi sáng">Buổi sáng (8:00 - 12:00)</option>
                            <option value="buổi chiều">Buổi chiều (13:30 - 17:30)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Participants information */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Thông tin người tham gia xét nghiệm</h3>
                    <button
                      type="button"
                      onClick={addParticipant}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Thêm người tham gia
                    </button>
                  </div>
                  
                  {formData.participants.map((participant, index) => (
                    <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Người tham gia #{index + 1}</h4>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeParticipant(index)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Xóa
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                          <label htmlFor={`role-${index}`} className="block text-sm font-medium text-gray-700">
                            Vai trò
                          </label>
                          <div className="mt-1">
                            <select
                              id={`role-${index}`}
                              value={participant.role}
                              onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                              className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              required
                            >
                              <option value="">Chọn vai trò</option>
                              <option value="father">Cha (giả định)</option>
                              <option value="mother">Mẹ</option>
                              <option value="child">Con</option>
                              <option value="sibling">Anh/Chị/Em</option>
                              <option value="grandparent">Ông/Bà</option>
                              <option value="other">Khác</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor={`name-${index}`} className="block text-sm font-medium text-gray-700">
                            Họ và tên
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id={`name-${index}`}
                              value={participant.name}
                              onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                              className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor={`dob-${index}`} className="block text-sm font-medium text-gray-700">
                            Ngày sinh
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              id={`dob-${index}`}
                              value={participant.dob}
                              onChange={(e) => handleParticipantChange(index, 'dob', e.target.value)}
                              className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor={`gender-${index}`} className="block text-sm font-medium text-gray-700">
                            Giới tính
                          </label>
                          <div className="mt-1">
                            <select
                              id={`gender-${index}`}
                              value={participant.gender}
                              onChange={(e) => handleParticipantChange(index, 'gender', e.target.value)}
                              className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              required
                            >
                              <option value="">Chọn giới tính</option>
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor={`sampleType-${index}`} className="block text-sm font-medium text-gray-700">
                            Loại mẫu
                          </label>
                          <div className="mt-1">
                            <select
                              id={`sampleType-${index}`}
                              value={participant.sampleType}
                              onChange={(e) => handleParticipantChange(index, 'sampleType', e.target.value)}
                              className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              required
                            >
                              <option value="buccal">Tế bào má (Swab)</option>
                              <option value="blood">Máu</option>
                              <option value="hair">Tóc (có gốc)</option>
                              <option value="other">Khác</option>
                            </select>
                          </div>
                        </div>
                        
                        {participant.role === 'other' && (
                          <div>
                            <label htmlFor={`relationship-${index}`} className="block text-sm font-medium text-gray-700">
                              Mối quan hệ
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id={`relationship-${index}`}
                                value={participant.relationship || ''}
                                onChange={(e) => handleParticipantChange(index, 'relationship', e.target.value)}
                                placeholder="Vui lòng ghi rõ mối quan hệ"
                                className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                                required={participant.role === 'other'}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact information */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin liên hệ</h3>
                  
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                        Họ và tên người liên hệ
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="contactName"
                          name="contactInfo.name"
                          value={formData.contactInfo.name}
                          onChange={handleInputChange}
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id="contactPhone"
                          name="contactInfo.phone"
                          value={formData.contactInfo.phone}
                          onChange={handleInputChange}
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="contactEmail"
                          name="contactInfo.email"
                          value={formData.contactInfo.email}
                          onChange={handleInputChange}
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and conditions */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <input
                        id="terms"
                        name="termsAccepted"
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        Tôi đã đọc và đồng ý với{' '}
                        <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                          Điều khoản dịch vụ
                        </Link>{' '}
                        và{' '}
                        <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                          Chính sách bảo mật
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!formData.termsAccepted}
                    className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white 
                      ${formData.termsAccepted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    Xác nhận đặt dịch vụ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
