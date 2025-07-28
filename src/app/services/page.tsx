'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { getServices, getServiceById, Service } from '@/lib/api/services';

export default function ServicesPage() {
  const [servicesByType, setServicesByType] = useState<Record<string, Service[]>>({});
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        console.log('Fetching services...');
        const response = await getServices();
        console.log('API response:', response);
        
        if (response.success && response.services) {
          console.log('Raw API Services:', response.services);
          
          // Extract services from response
          let servicesArray = [];
          
          // Check if response.services has a $values property that is an array
          if (response.services && typeof response.services === 'object' && 
              '$values' in response.services && Array.isArray(response.services.$values)) {
            servicesArray = response.services.$values;
            console.log('Extracted services from $values array:', servicesArray);
          }
          // Check if response.services itself is an array
          else if (Array.isArray(response.services)) {
            servicesArray = response.services;
            console.log('Using services array directly:', servicesArray);
          }
          // Handle case where response.services might be a single service object
          else if (response.services && typeof response.services === 'object') {
            servicesArray = [response.services];
            console.log('Converted single service object to array:', servicesArray);
          }
          
          // Safety check for services array
          if (!servicesArray.length) {
            console.warn('Services array is empty after extraction');
            setError('Không tìm thấy dịch vụ nào');
            setLoading(false);
            return;
          }
          
          // Format all services
          const formattedServices = servicesArray.map((service: any) => ({
            id: service.id ?? service.serviceId, // lấy đúng id gốc từ backend
            name: service.name,
            description: service.description,
            price: service.price,
            image: service.image,
            type: service.type,
            // ... các trường khác nếu cần ...
          }));

          // Group services by type
          const groupedByType: Record<string, Service[]> = {};
          formattedServices.forEach(service => {
            // Use a default type if none is provided
            const type = service.type || 'Khác';
            if (!groupedByType[type]) {
              groupedByType[type] = [];
            }
            groupedByType[type].push(service);
          });
          setServicesByType(groupedByType);
          // Get array of types for navigation
          const types = Object.keys(groupedByType);
          setServiceTypes(types);
          // Set the first type as selected by default
          if (types.length > 0) {
            setSelectedType(types[0]);
          }
          
        } else {
          console.error('API error response:', response);
          setError(response.message || 'Không thể lấy danh sách dịch vụ');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Có lỗi xảy ra khi tải dịch vụ');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  // Ví dụ gọi khi cần lấy chi tiết service S02
  useEffect(() => {
    async function fetchServiceDetail() {
      try {
        const data = await getServiceById('S02');
        console.log('Service S02:', data);
        // Xử lý dữ liệu ở đây
      } catch (error) {
        console.error('Lỗi lấy chi tiết dịch vụ:', error);
      }
    }
    fetchServiceDetail();
  }, []);

  return (
    <MainLayout>
      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-8 sm:py-10 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: "url('/images/services-banner.svg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-700/70 to-indigo-800/80" />
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating DNA helixes */}
          <div className="absolute top-10 left-10 w-16 h-16 opacity-15 animate-pulse">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <path d="M20 20 Q50 10, 80 20 T20 80" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M20 80 Q50 90, 80 80 T20 20" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="20" r="2" fill="currentColor"/>
              <circle cx="80" cy="80" r="2" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="absolute top-20 right-20 w-12 h-12 opacity-10 animate-bounce">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
          
          {/* Hexagon pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <defs>
                <pattern id="hexagons" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <polygon points="20,2 35,12 35,28 20,38 5,28 5,12" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)"/>
            </svg>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Service badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-white font-medium text-sm">Chứng nhận ISO 15189 & CAP</span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-4">
              Dịch vụ xét nghiệm ADN
            </h1>
            <p className="mt-2 text-base leading-6 text-blue-50 max-w-2xl mx-auto">
              Chúng tôi cung cấp nhiều loại dịch vụ xét nghiệm ADN khác nhau phù hợp với nhu cầu của bạn.
              <span className="block mt-1 text-sm text-blue-100">
                Tất cả các xét nghiệm đều được thực hiện với độ chính xác cao và bảo mật thông tin tuyệt đối.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Services section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10 text-center">
            Dịch vụ xét nghiệm
          </h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Đang tải dịch vụ...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center bg-red-50 p-8 rounded-lg ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Tải lại trang
              </button>
            </div>
          ) : serviceTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600">Không có dịch vụ nào khả dụng.</p>
            </div>
          ) : (
            <>
              {/* Service type tabs */}
              <div className="border-b border-gray-200 mb-8">
                <div className="overflow-x-auto -mb-px">
                  <nav className="flex space-x-8 whitespace-nowrap px-4 " aria-label="Tabs">
                    {serviceTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`
                          py-4 px-1 border-b-2 font-medium text-lg whitespace-nowrap
                          ${
                            selectedType === type
                              ? 'border-blue-600 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Selected type services */}
              {selectedType && servicesByType[selectedType] && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {selectedType === 'Khác' ? 'Các dịch vụ khác' : `Xét nghiệm ${selectedType}`}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicesByType[selectedType].map((service, index) => (
                      <div 
                        key={service.id ? `service-${service.id}` : `service-${selectedType}-${index}`} 
                        className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:ring-2 hover:ring-blue-500 transition-all duration-300 cursor-pointer"
                      >
                        {/* Hình ảnh dịch vụ với hiệu ứng khi hover */}
                        {service.image && (
                          <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                            <img
                              src={`http://localhost:5198/${service.image}`}
                              alt={service.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
                              loading="lazy"
                            />
                            {/* Overlay hiệu ứng khi hover */}
                            <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-20 bg-blue-600"></div>
                          </div>
                        )}
                        <div className="p-6 transition-all duration-300 group-hover:bg-blue-50 group-hover:scale-[1.03] group-hover:shadow-lg">
                          <h4 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-700">{service.name}</h4>
                          <div className="h-20 mb-4 overflow-hidden">
                            <p className="text-gray-600 line-clamp-3 transition-colors duration-300 group-hover:text-blue-600">{service.description}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-bold text-blue-600 transition-colors duration-300 group-hover:text-blue-800">
                              {new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(service.price))} ₫
                            </p>
                            <Link 
                              href={`/services/book?serviceId=${encodeURIComponent(String(service.id))}`}
                              className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300 group-hover:bg-blue-800"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Sample collection methods */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Phương thức thu mẫu</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tự thu mẫu tại nhà</h3>
                <p className="mt-2 text-gray-600">
                  Nhận bộ kit thu mẫu và tự thực hiện lấy mẫu tại nhà, sau đó gửi mẫu đến trung tâm xét nghiệm.
                  Phương pháp này tiện lợi và đảm bảo sự riêng tư.
                </p>
                <ul className="mt-4 text-sm text-gray-600 list-disc list-inside">
                  <li>Nhận kit qua đường bưu điện</li>
                  <li>Tự thu mẫu theo hướng dẫn</li>
                  <li>Gửi mẫu đến phòng xét nghiệm</li>
                  <li>Nhận kết quả qua email hoặc tài khoản</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                    <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thu mẫu tại cơ sở y tế</h3>
                <p className="mt-2 text-gray-600">
                  Đặt lịch hẹn và đến cơ sở y tế của chúng tôi để được nhân viên chuyên nghiệp lấy mẫu xét nghiệm.
                  Phương pháp này đảm bảo mẫu được thu thập chính xác.
                </p>
                <ul className="mt-4 text-sm text-gray-600 list-disc list-inside">
                  <li>Đặt lịch hẹn trực tuyến</li>
                  <li>Đến cơ sở y tế theo lịch hẹn</li>
                  <li>Nhân viên y tế thu mẫu</li>
                  <li>Nhận kết quả theo phương thức đã chọn</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-24 bg-blue-600 rounded-xl overflow-hidden">
            <div className="px-6 py-16 sm:px-12 sm:py-24 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="block">Bạn đã sẵn sàng?</span>
                <span className="block text-blue-200">Đặt dịch vụ xét nghiệm ADN ngay hôm nay.</span>
              </h2>
              <div className="mt-8 flex lg:mt-0 lg:shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Đăng ký ngay
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-700 px-5 py-3 text-base font-medium text-white hover:bg-blue-800"
                  >
                    Liên hệ tư vấn
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
