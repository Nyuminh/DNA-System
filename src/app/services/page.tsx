'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

const services = [
  {
    id: 'paternity',
    title: 'Xét nghiệm Huyết thống',
    description: 'Xét nghiệm ADN để xác định mối quan hệ cha con, mẹ con và các mối quan hệ huyết thống khác.',
    price: 'Từ 4.000.000 VNĐ',
    testTypes: [
      {
        id: 'father-child',
        name: 'Xét nghiệm cha con',
        description: 'Xác định mối quan hệ cha con thông qua ADN, độ chính xác 99.9999%.',
        price: '4.000.000 VNĐ',
        duration: '3-5 ngày làm việc',
      },
      {
        id: 'mother-child',
        name: 'Xét nghiệm mẹ con',
        description: 'Xác định mối quan hệ mẹ con thông qua ADN, độ chính xác 99.9999%.',
        price: '4.000.000 VNĐ',
        duration: '3-5 ngày làm việc',
      },
      {
        id: 'siblings',
        name: 'Xét nghiệm anh chị em ruột',
        description: 'Xác định mối quan hệ anh chị em ruột thông qua ADN, độ chính xác 99.9%.',
        price: '5.500.000 VNĐ',
        duration: '7-10 ngày làm việc',
      },
    ],
  },
  {
    id: 'legal',
    title: 'Xét nghiệm ADN Hành chính',
    description: 'Dịch vụ xét nghiệm ADN được công nhận bởi cơ quan pháp lý, sử dụng cho các thủ tục hành chính.',
    price: 'Từ 5.500.000 VNĐ',
    testTypes: [
      {
        id: 'immigration',
        name: 'Xét nghiệm ADN cho di trú',
        description: 'Chứng minh mối quan hệ huyết thống cho mục đích xin visa, quốc tịch, định cư nước ngoài.',
        price: '6.500.000 VNĐ',
        duration: '5-7 ngày làm việc',
      },
      {
        id: 'birth-certificate',
        name: 'Xét nghiệm ADN cho khai sinh',
        description: 'Xác định mối quan hệ huyết thống cho việc đăng ký khai sinh.',
        price: '5.500.000 VNĐ',
        duration: '3-5 ngày làm việc',
      },
      {
        id: 'legal-inheritance',
        name: 'Xét nghiệm ADN cho thừa kế',
        description: 'Xác định mối quan hệ huyết thống cho mục đích pháp lý liên quan đến thừa kế.',
        price: '6.000.000 VNĐ',
        duration: '3-5 ngày làm việc',
      },
    ],
  },
  {
    id: 'private',
    title: 'Xét nghiệm ADN Dân sự',
    description: 'Dịch vụ xét nghiệm ADN bảo mật, không yêu cầu cung cấp thông tin cá nhân.',
    price: 'Từ 3.500.000 VNĐ',
    testTypes: [
      {
        id: 'anonymous-paternity',
        name: 'Xét nghiệm cha con ẩn danh',
        description: 'Xác định mối quan hệ cha con thông qua ADN mà không cần cung cấp thông tin cá nhân.',
        price: '3.500.000 VNĐ',
        duration: '3-5 ngày làm việc',
      },
      
      {
        id: 'prenatal',
        name: 'Xét nghiệm ADN trước sinh không xâm lấn',
        description: 'Xét nghiệm ADN thai nhi thông qua máu mẹ, không xâm lấn.',
        price: '15.000.000 VNĐ',
        duration: '7-12 ngày làm việc',
      },
    ],
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(services[0]);

  return (
    <MainLayout>      {/* Hero section */}
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
              {/* Key features */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Độ chính xác 99.99%</h3>
                <p className="text-blue-100 text-xs">Công nghệ tiên tiến nhất hiện nay</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Bảo mật tuyệt đối</h3>
                <p className="text-blue-100 text-xs">Thông tin được mã hóa và bảo vệ</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg mb-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Kết quả nhanh</h3>
                <p className="text-blue-100 text-xs">Từ 3-5 ngày làm việc</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Service tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg
                    ${
                      selectedService.id === service.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {service.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Service details */}
          <div className="mt-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">{selectedService.title}</h2>
                <p className="mt-4 text-lg text-gray-500">{selectedService.description}</p>
                <p className="mt-2 text-lg font-semibold text-gray-700">Giá: {selectedService.price}</p>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Các loại xét nghiệm:</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedService.testTypes.map((test) => (
                    <div key={test.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-lg font-bold text-gray-900">{test.name}</h4>
                        <p className="mt-2 text-gray-600">{test.description}</p>
                        <div className="mt-4 text-sm text-gray-500">
                          <p><span className="font-medium">Giá:</span> {test.price}</p>
                          <p><span className="font-medium">Thời gian:</span> {test.duration}</p>
                        </div>
                        <div className="mt-4">
                          <Link 
                            href={`/services/book?type=${test.id}`}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                          >
                            Đặt dịch vụ
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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

          {/* FAQs */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Câu hỏi thường gặp</h2>
            <dl className="space-y-6 divide-y divide-gray-200">
              <div className="pt-6">
                <dt className="text-lg font-medium text-gray-900">Độ chính xác của xét nghiệm ADN là bao nhiêu?</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Độ chính xác của xét nghiệm ADN của chúng tôi đạt 99.9999% đối với xét nghiệm xác định quan hệ cha con và mẹ con. 
                  Đối với các loại xét nghiệm khác, độ chính xác có thể dao động từ 95% đến 99.9% tùy thuộc vào loại xét nghiệm và mối quan hệ cần xác định.
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg font-medium text-gray-900">Xét nghiệm ADN có đau không?</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Quá trình lấy mẫu ADN hoàn toàn không gây đau đớn. Các phương pháp thu mẫu phổ biến nhất bao gồm lấy tế bào má (bằng tăm bông), 
                  lấy mẫu nước bọt hoặc lấy mẫu máu (chỉ cần một vài giọt máu từ đầu ngón tay).
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg font-medium text-gray-900">Thông tin và kết quả xét nghiệm có được bảo mật không?</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân và kết quả xét nghiệm của khách hàng. Kết quả xét nghiệm chỉ được 
                  cung cấp cho người yêu cầu hoặc người được ủy quyền. Đối với xét nghiệm dân sự (không chính thức), chúng tôi có 
                  dịch vụ xét nghiệm ẩn danh nếu bạn không muốn cung cấp thông tin cá nhân.
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg font-medium text-gray-900">Mất bao lâu để có kết quả xét nghiệm ADN?</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Thời gian trả kết quả tùy thuộc vào loại xét nghiệm. Đối với xét nghiệm ADN huyết thống cơ bản, kết quả thường có 
                  sau 3-5 ngày làm việc kể từ khi mẫu được gửi đến phòng xét nghiệm. Đối với các xét nghiệm phức tạp hơn như xét nghiệm 
                  ADN trước sinh hoặc xét nghiệm quan hệ họ hàng xa, thời gian có thể kéo dài từ 7-12 ngày làm việc.
                </dd>
              </div>
            </dl>
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
