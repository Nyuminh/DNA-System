'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { getServiceById } from '@/lib/api/services';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getFeedbacksByServiceId } from '@/lib/api/feedback';
import { getUsers } from '@/lib/api/users';
import { getUserProfile } from '@/lib/api/auth';
import {getAllBookings} from '@/lib/api/bookings';
import { createRelative } from '@/lib/api/relatives';

interface Participant {
  name: string;
  phone: string;
  dob: string;
  gender: string;
  role: string;
  address: string;
}

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  gender:string;
  dob: string;
  address: string;
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
  
  // Kiểm tra đăng nhập từ localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedInUser = !!user.username;
    setIsLoggedIn(isLoggedInUser);
    
    // Nếu đã đăng nhập, gọi API lấy thông tin profile
    if (isLoggedInUser) {
      getUserProfile(user.username)
        .then(profileData => {
          setUserProfile(profileData);
          
          // Cập nhật form với thông tin profile
          setFormData(prev => ({
            ...prev,
            contactInfo: {
              name:  profileData?.fullname || '',
              phone: profileData?.phone  || '',
              email: profileData?.email || '',
              dob: formatDateForInput(profileData?.birthdate || ''),
              gender: mapGenderValue(profileData?.gender || ''),
              address: profileData?.address || '',
            }
          }));
        })
        .catch(error => {
          console.error('Lỗi khi lấy thông tin profile:', error);
        });
    }
  }, []);
  
  // Hàm hỗ trợ format ngày tháng cho input date
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    try {
      // Xử lý các format ngày tháng phổ biến
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Format sang yyyy-MM-dd cho input type="date"
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '';
    }
  };
  
  // Hàm chuyển đổi giới tính từ API sang giá trị form
  const mapGenderValue = (gender: string): string => {
    gender = gender.toLowerCase();
    if (gender === 'nam' || gender === 'male' || gender === 'm') return 'male';
    if (gender === 'nữ' || gender === 'nu' || gender === 'female' || gender === 'f') return 'female';
    return '';
  };

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
      { name: '', phone: '', dob: '', gender: '', role: '' ,address: '' }
    ],
    contactInfo: {
      name: '',
      phone: '',
      email: '',
      gender: '',
      dob: '',
      address: '',
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

  // Chạy effect để khôi phục dữ liệu đặt lịch nếu có
  useEffect(() => {
    // Kiểm tra xem có dữ liệu đặt lịch đang chờ không
    const pendingData = localStorage.getItem('pendingBookingData');
    if (pendingData) {
      try {
        const { formData: savedFormData, serviceId: savedServiceId } = JSON.parse(pendingData);
        // Chỉ khôi phục nếu đang ở đúng trang đặt lịch cho dịch vụ tương ứng
        if (savedServiceId === serviceId) {
          setFormData(savedFormData);
          // Đã khôi phục xong, xóa dữ liệu đã lưu
          localStorage.removeItem('pendingBookingData');
        }
      } catch (error) {
        console.error('Error restoring form data:', error);
        localStorage.removeItem('pendingBookingData');
      }
    }
  }, [serviceId]); // Chỉ chạy khi serviceId thay đổi

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
    // Nếu sửa trường địa chỉ, luôn lấy theo userProfile.address nếu có
    if (field === 'address') {
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        address: userProfile?.address || value || ''
      };
    } else {
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        [field]: value
      };
    }
    setFormData({ ...formData, participants: updatedParticipants });
  };


  const removeParticipant = (index: number) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants.splice(index, 1);
    setFormData({ ...formData, participants: updatedParticipants });
  };  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Kiểm tra lại dữ liệu booking mới nhất trước khi submit
      const currentBookings = await getAllBookings();
      
      // Xử lý giờ theo lựa chọn
      const [startTime] = formData.appointmentTime.split('-');
      const dateStr = formData.appointmentDate;
      
      // Đếm lại số lượng booking cho khung giờ này
      let bookingCount = 0;
      currentBookings.forEach(booking => {
        const bookingDate = new Date(booking.date);
        const bookingDateStr = bookingDate.toISOString().split('T')[0];
        const bookingTimeStr = bookingDate.toTimeString().slice(0, 5);
        
        if (bookingDateStr === dateStr && bookingTimeStr === startTime) {
          bookingCount++;
        }
      });
      
      // Kiểm tra số lượng booking
      if (bookingCount >= 3) {
        alert("Ca làm việc này đã đầy. Vui lòng chọn thời gian khác.");
        
        // Cập nhật lại bookingCounts
        const newCounts = {...bookingCounts};
        if (!newCounts[dateStr]) newCounts[dateStr] = {};
        newCounts[dateStr][startTime] = bookingCount;
        setBookingCounts(newCounts);
        
        return;
      }
      
      // Lấy username từ localStorage (nếu đã lưu sau login)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const username = user.username;
      
      if (!username) {
        // Lưu form data vào localStorage trước khi chuyển hướng
        localStorage.setItem('pendingBookingData', JSON.stringify({
          formData,
          serviceId
        }));
        // Chuyển hướng đến trang đăng nhập với returnUrl
        router.push(`/auth/login?returnUrl=${encodeURIComponent('/services/book?serviceId=' + serviceId)}`);
        return;
      }
      
      // Code xử lý đặt lịch nếu đã đăng nhập
      const customerId = await getUserIdByUsername(username);
      if (!customerId) {
        alert("Không tìm thấy tài khoản người dùng!");
        return;
      }

      try {
        const { createBooking } = await import('@/lib/api/bookings');

        // Xử lý giờ theo lựa chọn - Lấy thời gian đầu từ khung giờ
        let timeRange = formData.appointmentTime || '08:00-08:30'; // fallback nếu chưa chọn
        let startTime = timeRange.split('-')[0]; // Lấy phần đầu của khung giờ (ví dụ: "08:00" từ "08:00-08:30")
        
        // Ghép ngày và giờ thành ISO string
        let date = '';
        if (formData.collectionMethod === 'self') {
          // Sử dụng thời gian hiện tại theo giờ Việt Nam cho phương thức tự thu mẫu
          const vietnamTime = new Date();
          
          // Log thông tin để debug
          console.log('Thời gian hiện tại (tự thu mẫu):', vietnamTime.toString());
          
          // Đảm bảo múi giờ UTC+7 khi lưu vào database
          const offset = vietnamTime.getTimezoneOffset();
          const vietnamUTCTime = new Date(vietnamTime.getTime() - (offset * 60 * 1000));
          date = vietnamUTCTime.toISOString();
        } else if (formData.appointmentDate && startTime) {
          // Vẫn giữ nguyên cách xử lý giờ được chọn cho phương thức tại cơ sở y tế
          const localDate = new Date(`${formData.appointmentDate}T${startTime}:00`);
          // Điều chỉnh múi giờ
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

        // Đặt trạng thái booking theo phương thức thu mẫu
        const bookingStatus =
          formData.collectionMethod === 'self'
            ? 'Đang chờ mẫu'
            : formData.collectionMethod === 'facility'
              ? 'Đang chờ check-in'
              : 'Đang chờ mẫu';

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
          status: bookingStatus // Sử dụng trạng thái động
        });

        console.log('Dữ liệu gửi lên API:', {
          customerId,
          date,
          staffId,
          serviceId: serviceId ?? "",
          address,
          method,
        });

        // Log toàn bộ response để kiểm tra cấu trúc
        console.log('Toàn bộ kết quả trả về:', JSON.stringify(result, null, 2));

        if (result.success) {
          // Trích xuất bookingId từ kết quả trả về (kiểm tra nhiều vị trí có thể chứa ID)
          const bookingId = result.bookingId  || 
                           (result.booking && (result.booking.bookingId || result.booking.id));
          

          
          // Nếu đặt lịch thành công và có lưu người tham gia
          if (saveAsRelatives) {
            try {
              // Truyền bookingId vào hàm saveParticipantsAsRelatives
              await saveParticipantsAsRelatives(customerId, bookingId);
            } catch (error) {
              console.error('Lỗi khi lưu người thân:', error);
            }
          }
          
          alert(`Đặt xét nghiệm thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.`);
          router.push('/');
        } else {
          alert(result.message || 'Có lỗi xảy ra khi đặt lịch');
        }
      } catch (error) {
        console.error('Submit error:', error);
        alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Có lỗi xảy ra. Vui lòng kiểm tra lại dữ liệu và thử lại.');
    }
  };

  // Thêm state để lưu trữ các tùy chọn thời gian có sẵn
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Thêm một mảng cố định chứa tất cả các tùy chọn thời gian
  const ALL_TIME_SLOTS = [

    "08:00", "09:00", "10:00", "11:00", 
    "13:30", "14:30", "15:30", "16:30"
  ];

  // Thay đổi cách hiển thị khung giờ 
  // Thêm vào ngay sau phần khai báo mảng ALL_TIME_SLOTS
  // Thêm một mảng cố định chứa các khung giờ 30 phút
  const TIME_SLOTS_30MIN = [
    "08:00-08:30", "08:30-09:00", 
    "09:00-09:30", "09:30-10:00", 
    "10:00-10:30", "10:30-11:00",
    "11:00-11:30", "11:30-12:00",
    "13:30-14:00", "14:00-14:30",
    "14:30-15:00", "15:00-15:30",
    "15:30-16:00", "16:00-16:30",
    "16:30-17:00", "17:00-17:30"
  ];

  // Thêm state để lưu các khung giờ có sẵn cho ngày đã chọn
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Thêm useEffect để cập nhật tùy chọn thời gian khi ngày thay đổi
  useEffect(() => {
    if (!formData.appointmentDate) {
      setAvailableTimeSlots(TIME_SLOTS_30MIN);
      return;
    }

    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    
    // Nếu đây không phải là ngày hiện tại, hiển thị tất cả các tùy chọn
    if (selectedDate.toDateString() !== today.toDateString()) {
      setAvailableTimeSlots(TIME_SLOTS_30MIN);
      return;
    }
    
    // Nếu là ngày hiện tại, chỉ hiển thị các tùy chọn thời gian trong tương lai
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    const availableSlots = TIME_SLOTS_30MIN.filter(timeSlot => {
      const [startTime] = timeSlot.split('-');
      const [hours, minutes] = startTime.split(':').map(Number);
      
      // So sánh thời gian
      if (hours > currentHour) return true;
      if (hours === currentHour && minutes > currentMinute) return true;
      return false;
    });
    
    setAvailableTimeSlots(availableSlots);
    
    // Nếu thời gian đã chọn không còn trong danh sách có sẵn, đặt lại về rỗng
    if (formData.appointmentTime && !availableSlots.includes(formData.appointmentTime)) {
      setFormData({
        ...formData,
        appointmentTime: ''
      });
    }
  }, [formData.appointmentDate]);

  // Thêm hàm để lưu thông tin form và chuyển hướng đến trang đăng nhập
  const saveDataAndRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    // Lưu form data vào localStorage trước khi chuyển hướng
    localStorage.setItem('pendingBookingData', JSON.stringify({
      formData,
      serviceId
    }));
    
    // Chuyển hướng đến trang đăng nhập với returnUrl
    router.push(`/auth/login?returnUrl=${encodeURIComponent('/services/book?serviceId=' + serviceId)}`);
  };

  // Thêm state để lưu trữ số lượng booking theo ngày và giờ
  const [bookingCounts, setBookingCounts] = useState<Record<string, Record<string, number>>>({});
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(true);

  // Thêm useEffect để lấy tất cả booking khi component mount hoặc khi ngày thay đổi
  useEffect(() => {
    const fetchAllBookings = async () => {
      setIsLoadingBookings(true);
      const fetchedBookings = await getAllBookings();
      
      // Xử lý đếm booking theo ngày và giờ
      const counts: Record<string, Record<string, number>> = {};
      
      fetchedBookings.forEach(booking => {
        try {
          const bookingDate = new Date(booking.date);
          const dateStr = bookingDate.toISOString().split('T')[0];
          const timeStr = bookingDate.toTimeString().slice(0, 5);
          
          if (!counts[dateStr]) {
            counts[dateStr] = {};
          }
          
          if (!counts[dateStr][timeStr]) {
            counts[dateStr][timeStr] = 0;
          }
          
          counts[dateStr][timeStr]++;
        } catch (error) {
          console.error('Error processing booking date:', booking.date, error);
        }
      });
      
      setBookingCounts(counts);
      setIsLoadingBookings(false);
    };
    
    fetchAllBookings();
  }, [formData.appointmentDate]); // Chạy lại khi ngày thay đổi

  // Thêm effect để tự động điền địa chỉ khi chọn phương thức tự thu mẫu
  useEffect(() => {
    if (formData.collectionMethod === 'self' && userProfile?.address) {
      // Tự động điền địa chỉ từ thông tin người dùng đã đăng nhập
      setFormData(prev => ({
        ...prev,
        address: userProfile.address
      }));
    }
  }, [formData.collectionMethod, userProfile]);

  // Thêm state theo dõi việc lưu người thân
  const [saveAsRelatives, setSaveAsRelatives] = useState<boolean>(true);

  // Hàm để lưu người tham gia như là người thân
  const saveParticipantsAsRelatives = async (userId: string, bookingId?: string) => {
    try {
      // Filter ra những người tham gia thực sự (có đầy đủ thông tin)
      const validParticipants = formData.participants.filter(
        p => p.name && p.phone && p.dob && p.gender && p.role
      );
      
      // Nếu không có người tham gia hợp lệ, không làm gì cả
      if (validParticipants.length === 0) return;
      

      
      // Lưu từng người tham gia như là người thân
      const savePromises = validParticipants.map(async (participant) => {
        // Tạo object dữ liệu người thân ĐÚNG với cấu trúc API yêu cầu
        const relativeData = {
          userId: userId,
          fullname: participant.name,
          relationship: participant.role,
          gender: participant.gender === 'male' ? 'Nam' : 'Nữ',
          birthdate: participant.dob,
          phone: participant.phone,
          address: participant.address || formData.address || '',
          // Thêm bookingId nếu có
          bookingId: bookingId
        };
        

        
        // Gọi API để lưu người thân
        const result = await createRelative(relativeData);
        return result;
      });
      
      // Chờ tất cả các request hoàn thành
      const results = await Promise.all(savePromises);

      return results;
    } catch (error) {
      console.error('Lỗi khi lưu người thân:', error);
      return null;
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

        {/* Thêm nút đặt dịch vụ khác */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex justify-between items-center">
            <Link
              href="/services"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Đặt dịch vụ khác
            </Link>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Phương thức thu mẫu</h3>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    {/* Nếu là dịch vụ dân sự thì hiển thị cả 2 phương thức, ngược lại chỉ hiển thị tại cơ sở */}
                    {(service?.type === 'Dân sự' || service?.type === 'dan su' || service?.type?.toLowerCase().includes('dân sự')) ? (
                      <>
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
                      </>
                    ) : (
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
                    )}
                  </div>

                  {/* Thông tin liên hệ người đặt mẫu */}
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Thông tin người đặt dịch vụ</h4>
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
                          Họ và tên
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="contactInfo.name"
                            id="contact-name"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="Nhập họ và tên"
                            value={formData.contactInfo.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">
                          Số điện thoại
                        </label>
                        <div className="mt-1">
                          <input
                            type="tel"
                            name="contactInfo.phone"
                            id="contact-phone"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="Nhập số điện thoại"
                            value={formData.contactInfo.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="contact-dob" className="block text-sm font-medium text-gray-700">
                          Ngày sinh
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="contactInfo.dob"
                            id="contact-dob"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            value={formData.contactInfo.dob || ''}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="contact-gender" className="block text-sm font-medium text-gray-700">
                          Giới tính
                        </label>
                        <div className="mt-1">
                          <select
                            name="contactInfo.gender"
                            id="contact-gender"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            value={formData.contactInfo.gender || ''}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="contactInfo.email"
                            id="contact-email"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="Nhập địa chỉ email"
                            value={formData.contactInfo.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conditional fields based on collection method */}
                  {formData.collectionMethod === 'facility' && (
                    <div className="mt-6">
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 mb-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Địa chỉ cơ sở y tế
                          </label>
                          <div className="mt-1 flex items-center">
                            <div className="py-3 px-4 block w-full bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                              123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội
                            </div>
                            <span className="ml-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Vui lòng đến đúng địa chỉ trên vào ngày và giờ đã đặt lịch
                          </p>
                        </div>
                      </div>

                      {/* Chọn ngày và khung giờ 30 phút */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Chọn ngày và giờ lấy mẫu
                        </label>
                        <div>
                          <div className="mb-4">
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
                                min={new Date().toISOString().split('T')[0]}
                                required
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chọn khung giờ
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {availableTimeSlots.map((timeSlot) => {
                                const [startTime] = timeSlot.split('-');
                                const dateStr = formData.appointmentDate;
                                const count = bookingCounts[dateStr]?.[startTime] || 0;
                                const isUnavailable = count >= 3;
                                
                                return (
                                  <div key={timeSlot} className="relative">
                                    <input
                                      type="radio"
                                      id={`time-slot-${timeSlot}`}
                                      name="appointmentTime"
                                      value={timeSlot}
                                      checked={formData.appointmentTime === timeSlot}
                                      onChange={handleInputChange}
                                      className="sr-only peer"
                                      disabled={isUnavailable}
                                      required
                                    />
                                    <label
                                      htmlFor={`time-slot-${timeSlot}`}
                                      className={`flex items-center justify-center p-3 h-14 border rounded-lg cursor-pointer focus:outline-none 
                                      ${isUnavailable 
                                        ? 'border-gray-200 bg-gray-100 opacity-75 cursor-not-allowed' 
                                        : 'border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50'
                                      }`}
                                    >
                                      <div className="text-center">
                                        {isUnavailable ? (
                                          <div className="text-sm font-medium text-gray-400">{timeSlot}</div>
                                        ) : (
                                          <div className="text-sm font-medium text-gray-900">{timeSlot}</div>
                                        )}
                                        
                                        {/* Hiển thị thông báo nếu hết chỗ */}
                                        {/* {isUnavailable && (
                                          <div className="text-xs text-red-400">Đã đầy</div>
                                        )} */}
                                      </div>
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {isLoadingBookings && (
                              <div className="mt-2 text-sm text-blue-600 flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang kiểm tra các ca làm việc còn trống...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>)}
                  
                  {(formData.collectionMethod === 'self') && (
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
                            placeholder={userProfile?.address ? "Địa chỉ từ hồ sơ của bạn" : "Số nhà, đường, phường/xã"}
                            value={formData.address}
                            onChange={handleInputChange}
                            required={formData.collectionMethod === 'self'}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Kit xét nghiệm sẽ được giao đến địa chỉ này trong thời gian sớm nhất
                        </p>
                      </div>
                      
                      {/* Thông báo về thời gian */}
                      <div className="sm:col-span-2">
                        <div className="bg-blue-50 rounded-md p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-blue-700">
                                Thời gian đặt lịch sẽ được ghi nhận tự động khi bạn nhấn nút "Xác nhận đặt dịch vụ".
                                Nhân viên sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận thời gian giao kit xét nghiệm.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Participants information */}
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin người tham gia xét nghiệm</h3>
                  
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
                              placeholder=''
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
                              max={new Date().toISOString().split('T')[0]}
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
                        
                        {/* Thêm trường vai trò */}
                        <div>
                          <label htmlFor={`role-${index}`} className="block text-sm font-medium text-gray-700">
                            Vai trò
                          </label>
                          <div className="mt-1">
                            <select
                              id={`role-${index}`}
                              value={participant.role || ''}
                              onChange={(e) => handleParticipantChange(index, 'role', e.target.value)}
                              className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                              required
                            >
                              <option value="">Chọn vai trò</option>
                              {(service?.name?.toLowerCase().includes('cha con') || service?.type?.toLowerCase().includes('cha con')) ? (
                                <>
                                  <option value="Cha">Cha</option>
                                  <option value="Con">Con</option>
                                </>
                              ) :(service?.name?.toLowerCase().includes('mẹ con') ||
                                  service?.type?.toLowerCase().includes('mẹ con')) ? (
                                  <>
                                    <option value="Mẹ">Mẹ</option>
                                    <option value="Con">Con</option>
                                  </>
                              ) :(service?.name?.toLowerCase().includes('anh chị em') ||
                                  service?.type?.toLowerCase().includes('anh chị em')) ? (
                                  <>
                                    <option value="Anh">Anh</option>
                                    <option value="Chị">Chị</option>
                                    <option value="Em">Em</option>
                                  </>
                              ):(
                                <>
                                  <option value="Cha">Cha</option>
                                  <option value="Mẹ">Mẹ</option>
                                  <option value="Con">Con</option>
                                  <option value="Anh">Anh</option>
                                  <option value="Chị">Chị</option>
                                  <option value="Em">Em</option>
                                  <option value="Ông">Ông</option>\
                                  <option value="Bà">Bà</option>
                                  <option value="Khác">Khác</option>
                                </>
                              )}
                            </select>
                          </div>
                        </div>
                        
                        {/* Thêm trường địa chỉ */}
                        
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
                <div className="flex flex-col space-y-4">
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
                  
                  {/* Thông báo đăng nhập dưới nút xác nhận */}
                  {!isLoggedIn && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            <strong>Lưu ý:</strong> Bạn cần đăng nhập để hoàn tất đặt dịch vụ. Hệ thống sẽ tự động lưu thông tin bạn đã nhập và chuyển đến trang đăng nhập khi bạn nhấn nút xác nhận.{' '}
                            <a 
                              href="#" 
                              onClick={saveDataAndRedirect}
                              className="font-medium underline text-blue-700 hover:text-blue-500"
                            >
                              Đăng nhập ngay
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Thêm component đánh giá dịch vụ */}
        {serviceId && <ServiceReviews serviceId={serviceId} />}
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

    // Ví dụ: random bất kỳ user nào
    if (users.length === 0) return null;
    const realUsers = users.filter((u: any) => u.userID);

    const randomUser = realUsers[Math.floor(Math.random() * realUsers.length)];

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


    // So sánh không phân biệt hoa thường và trim
    const found = users.find((u: any) =>
      (u.username || u.userName || u.UserName)?.toLowerCase().trim() === username.toLowerCase().trim()
    );

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

// Thêm component này vào file page.tsx
function ServiceReviews({ serviceId }: { serviceId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        
        // Lấy dữ liệu đánh giá
        const feedbacks = await getFeedbacksByServiceId(serviceId);
        
        // Lấy danh sách users
        const userRes = await axios.get('http://localhost:5198/api/User');
        const users = Array.isArray(userRes.data) 
          ? userRes.data 
          : (userRes.data?.$values || []);
        
        // Map lại feedbacks để lấy tên khách hàng từ customerId
        const feedbacksWithNames = Array.isArray(feedbacks)
          ? feedbacks.map((fb: any, idx: number) => {
              const customerId = String(fb.customerId || fb.customerID || '').trim();
              const customer = users.find((u: any) =>
                String(u.userID || u.id || u.userId).trim() === customerId
              );
              
              return {
                feedbackId: String(fb.feedbackId || fb.id || idx),
                customerName: customer?.fullname || customer?.fullName || customer?.name || 
                              customer?.username || customer?.userName || "Khách hàng ẩn danh",
                rating: fb.rating || 0,
                comment: fb.comment || "",
                date: fb.date || new Date().toISOString(),
              };
            })
          : [];
          
        setReviews(feedbacksWithNames);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Không thể tải đánh giá dịch vụ');
        setLoading(false);
      }
    }

    if (serviceId) {
      fetchReviews();
    }
  }, [serviceId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-4 px-4">
        <div className="text-center py-4">
          <span className="text-blue-600">Đang tải đánh giá...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-4 px-4">
        <div className="text-center py-4 text-red-500">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8">
      <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Đánh giá từ khách hàng ({reviews.length})
        </h3>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div 
                key={review.id || index} 
                className="border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {(review.customerName || 'K').charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {review.customerName}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <svg 
                              key={rating}
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${rating < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(review.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-100">
                  <p className="italic">
                    {review.comment || 'Khách hàng không để lại bình luận.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 mt-3 text-lg">Chưa có đánh giá nào cho dịch vụ này.</p>
            <p className="text-gray-400 mt-1">Hãy là người đầu tiên đánh giá sau khi sử dụng dịch vụ.</p>
          </div>
        )}
      </div>
    </div>
  );
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
