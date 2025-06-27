'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { getServiceById } from '@/lib/api/services';
import axios from 'axios';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

interface Participant {
  name: string;
  phone: string;
  dob: string;
  gender: string;
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



function BookServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const [service, setService] = useState<any>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [errorService, setErrorService] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    setLoadingService(true);
    fetchFullServiceById(serviceId)
      .then((data) => {
        setService(data);
        setLoadingService(false);
      })
      .catch((err) => {
        setErrorService('Không tìm thấy dịch vụ!');
        setLoadingService(false);
      });
  }, [serviceId]);

  // Khởi tạo formData với dữ liệu từ service (nếu có)
  const [formData, setFormData] = useState<FormData>({
    serviceType: 'standard',
    collectionMethod: 'self',
    appointmentDate: '',
    appointmentTime: '',
    address: '',
    cityProvince: '',
    participants: [
      { name: '', phone: '', dob: '', gender: '' }
    ],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
    },
    termsAccepted: false,
  });

  // Cập nhật lại formData khi service thay đổi (nếu muốn prefill)
  useEffect(() => {
    if (service) {
      setFormData((prev) => ({
        ...prev,
        // Có thể prefill thêm nếu cần
      }));
    }
  }, [service]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        { name: '', phone: '', dob: '', gender: '' }
      ]
    });
  };
  const removeParticipant = (index: number) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants.splice(index, 1);
    setFormData({ ...formData, participants: updatedParticipants });
  };  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lấy username từ localStorage (nếu đã lưu sau login)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username;
    if (!username) {
      alert("Bạn cần đăng nhập để đặt lịch!");
      router.push('/auth/login');
      return;
    }
    const customerId = await getUserIdByUsername(username);
    if (!customerId) {
      alert("Không tìm thấy tài khoản người dùng!");
      return;
    }

    try {
      const { createBooking } = await import('@/lib/api/bookings');
      // const customerId = "U03"; // TODO: Lấy từ user đăng nhập thực tế

      // Xử lý giờ theo lựa chọn
      let time = formData.appointmentTime || '08:00'; // fallback nếu chưa chọn
      // Ghép ngày và giờ thành ISO string
      let date = '';
      if (formData.appointmentDate && time) {
        const localDate = new Date(`${formData.appointmentDate}T${time}:00`);
        // Cộng thêm 7 tiếng (7 * 60 * 60 * 1000 ms)
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        date = utcDate.toISOString();
      } else {
        date = new Date().toISOString();
      }

      const address =
        formData.collectionMethod === 'facility'
          ? '123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội'
          : formData.address;

      const method =
        formData.collectionMethod === 'self'
          ? 'Tự thu mẫu'
          : formData.collectionMethod === 'facility'
            ? 'Tại cơ sở y tế'
            : formData.collectionMethod;


      const staffId = await getLeastLoadedStaffId();
      if (!staffId) {
        alert("Không tìm thấy nhân viên phù hợp!");
        return;
      }

      const result = await createBooking({
        customerId,
        date,
        staffId,
        serviceId: serviceId ?? "",
        address,
        method,
        status: "Đã xác nhận", // Thêm dòng này để gửi status lên API
      });

      console.log('Dữ liệu gửi lên API:', {
        customerId,
        date,
        staffId: "",
        serviceId: serviceId ?? "",
        address,
        method,
      });
      console.log('Kết quả trả về:', result);

      if (result.success) {
        alert(`Đặt xét nghiệm thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.`);
        router.push('/');
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
              {loadingService ? (
                <p className="mt-3 text-blue-200">Đang tải thông tin dịch vụ...</p>
              ) : errorService ? (
                <p className="mt-3 text-red-200">{errorService}</p>
              ) : (
                <p className="mt-3 max-w-2xl mx-auto text-xl text-blue-200 sm:mt-4">
                  Đặt lịch xét nghiệm {service?.name} với quy trình đơn giản và bảo mật
                </p>
              )}
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
                  <div className="mt-6 space-y-4">
                    
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Tên dịch vụ:</dt>
                      <dd className="text-sm font-medium text-gray-900">{service?.name || "Không có tên"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Loại dịch vụ:</dt>
                      <dd className="text-sm font-medium text-gray-900">{service?.type || "Không xác định"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Giá dịch vụ:</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {(service?.price !== undefined && service?.price !== null)
                          ? service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                          : "Liên hệ"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500 w-2/5">Mô tả:</dt>
                        <dd className="text-sm font-medium text-gray-900 w-3/5 text-right">
                          {service?.description || "Không có mô tả"}
                        </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Thời gian xét nghiệm:</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {service?.duration || "3 - 5 ngày"}
                      </dd>
                    </div>
                  </div>
                  {/* Thêm các bước thực hiện và hotline ở đây */}
                  <div className="mt-8 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Các bước thực hiện:</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 mb-4">
                      <li>Điền thông tin và chọn phương thức thu mẫu</li>
                      <li>Thanh toán phí dịch vụ</li>
                      <li>Thực hiện thu mẫu theo phương thức đã chọn</li>
                      <li>Nhận kết quả sau khi hoàn thành xét nghiệm</li>
                    </ol>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-sm text-gray-600">
                        Để được hỗ trợ và tư vấn thêm, vui lòng liên hệ hotline:{" "}
                        <a href="tel:19001234" className="font-medium text-blue-600 hover:text-blue-500">
                          1900 1234
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="mt-12 lg:mt-0 lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-8">
               {/* Collection method */}
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
                  )}
                </div>

                {/* Participants information */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  
                  
                  {formData.participants.map((participant, index) => (
                    <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Người tham gia </h4>
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
                        {/* Thêm số điện thoại */}
                        <div>
                          <label htmlFor={`phone-${index}`} className="block text-sm font-medium text-gray-700">
                            Số điện thoại
                          </label>
                          <div className="mt-1">
                            <input
                              type="tel"
                              id={`phone-${index}`}
                              value={participant.phone || ''}
                              onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)}
                              className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              placeholder="Nhập số điện thoại"
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
                        
                      </div>
                    </div>
                  ))}
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

async function fetchFullServiceById(id: string) {
  const response = await axios.get(`http://localhost:5198/api/Services/${id}`);
  // Nếu response.data là object dịch vụ, trả về luôn
  return response.data;
}

async function getRandomStaffId(): Promise<string | null> {
  try {
    const res = await fetch('http://localhost:5198/api/User');
    let users = await res.json();
    if (!Array.isArray(users)) {
      if (users.$values && Array.isArray(users.$values)) {
        users = users.$values;
      } else {
        console.error('API không trả về mảng user:', users);
        return null;
      }
    }
    // Lấy tất cả phần tử, không phân biệt gì cả
    console.log('Tất cả phần tử trong danh sách user:', users);
    // Ví dụ: random bất kỳ user nào
    if (users.length === 0) return null;
    const realUsers = users.filter((u: any) => u.userID);
    console.log('Danh sách tài khoản thực:', realUsers);
    const randomUser = realUsers[Math.floor(Math.random() * realUsers.length)];
    console.log('User random được chọn:', randomUser);
    return randomUser.userID || null;
  } catch (e) {
    console.error('Lỗi lấy user:', e);
    return null;
  }
}

async function getUserIdByUsername(username: string): Promise<string | null> {
  try {
    const res = await fetch('http://localhost:5198/api/User');
    let users = await res.json();
    if (!Array.isArray(users)) {
      if (users.$values && Array.isArray(users.$values)) {
        users = users.$values;
      } else {
        return null;
      }
    }
    // Resolve $ref nếu có
    const idMap: Record<string, any> = {};
    users.forEach((u: any) => { if (u.$id) idMap[u.$id] = u; });
    users = users.map((u: any) => (u.$ref ? idMap[u.$ref] : u));

    // Log để kiểm tra dữ liệu thực tế
    console.log('Username cần tìm:', username);
    console.log('Danh sách user:', users);

    // So sánh không phân biệt hoa thường và trim
    const found = users.find((u: any) =>
      (u.username || u.userName || u.UserName)?.toLowerCase().trim() === username.toLowerCase().trim()
    );
    console.log('User tìm được:', found);
    return found?.userID || found?.id || found?.userId || null;
  } catch (e) {
    return null;
  }
}

async function getLeastLoadedStaffId(): Promise<string | null> {
  try {
    // Lấy danh sách staff
    const res = await fetch('http://localhost:5198/api/User');
    let users = await res.json();
    if (!Array.isArray(users)) {
      if (users.$values && Array.isArray(users.$values)) {
        users = users.$values;
      } else {
        return null;
      }
    }
    const idMap: Record<string, any> = {};
    users.forEach((u: any) => { if (u.$id) idMap[u.$id] = u; });
    users = users.map((u: any) => (u.$ref ? idMap[u.$ref] : u));
    const staffList = users.filter((u: any) =>
      (u.roleID || u.roleId || u.RoleID) === 'R02'
    );
    if (staffList.length === 0) return null;

    // Lấy danh sách booking
    const bookingRes = await fetch('http://localhost:5198/api/Appointments');
    let bookings = await bookingRes.json();
    if (!Array.isArray(bookings)) {
      if (bookings.$values && Array.isArray(bookings.$values)) {
        bookings = bookings.$values;
      } else {
        bookings = [];
      }
    }

    // Đếm số booking của từng staff
    const staffBookingCount: Record<string, number> = {};
    staffList.forEach((staff: any) => {
      const staffId = staff.userID || staff.id || staff.userId;
      staffBookingCount[staffId] = bookings.filter(
        (b: any) => (b.staffID || b.staffId) === staffId
      ).length;
    });

    // Lọc ra staff có booking = 0
    const neverPickedStaff = Object.keys(staffBookingCount).filter(
      (staffId) => staffBookingCount[staffId] === 0
    );
    if (neverPickedStaff.length > 0) {
      // Random giữa các staff chưa từng được chọn
      const randomIdx = Math.floor(Math.random() * neverPickedStaff.length);
      return neverPickedStaff[randomIdx];
    }

    // Nếu tất cả đều đã có booking, chọn staff ít booking nhất (chỉ random nếu có nhiều staff cùng min)
    const minCount = Math.min(...Object.values(staffBookingCount));
    const leastLoadedStaffIds = Object.keys(staffBookingCount).filter(
      (staffId) => staffBookingCount[staffId] === minCount
    );
    if (leastLoadedStaffIds.length === 1) {
      return leastLoadedStaffIds[0];
    } else {
      const selectedStaffId =
        leastLoadedStaffIds[Math.floor(Math.random() * leastLoadedStaffIds.length)];
      return selectedStaffId;
    }
  } catch (e) {
    return null;
  }
}

export interface BookingRequest {
  bookingId?: string;
  customerId: string;
  date: string;
  staffId?: string;
  serviceId: string;
  address: string;
  method: string;
}

export default BookServiceContent;
