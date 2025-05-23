'use client';

import Image from "next/image";
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  const services = [
    {
      id: 'paternity',
      title: 'Xét nghiệm Huyết thống',
      description: 'Xác định mối quan hệ cha con, mẹ con thông qua xét nghiệm ADN với độ chính xác cao.',
      imageUrl: '/images/paternity-testing.svg',
      href: '/services#paternity',
    },
    {
      id: 'legal',
      title: 'Xét nghiệm ADN Hành chính',
      description: 'Dịch vụ xét nghiệm ADN được công nhận bởi cơ quan pháp lý, phục vụ các mục đích hành chính.',
      imageUrl: '/images/legal-dna.svg',
      href: '/services#legal',
    },
    {
      id: 'private',
      title: 'Xét nghiệm ADN Dân sự',
      description: 'Dịch vụ xét nghiệm ADN bảo mật, không cần thiết phải cung cấp thông tin cá nhân của người tham gia.',
      imageUrl: '/images/private-dna.svg',
      href: '/services#private',
    },
  ];

  const features = [
    {
      title: 'Tự thu mẫu tại nhà',
      description: 'Nhận bộ kit thu mẫu và tự thực hiện lấy mẫu tại nhà, sau đó gửi mẫu đến trung tâm xét nghiệm.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      ),
    },
    {
      title: 'Thu mẫu tại cơ sở y tế',
      description: 'Đặt lịch hẹn và đến cơ sở y tế của chúng tôi để được nhân viên chuyên nghiệp lấy mẫu xét nghiệm.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
        </svg>
      ),
    },
    {
      title: 'Thu mẫu tận nơi',
      description: 'Nhân viên của chúng tôi sẽ đến tận nhà hoặc địa điểm yêu cầu để thực hiện việc lấy mẫu xét nghiệm.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
          <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
          <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      ),
    },
  ];

  return (
    <MainLayout>
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Dịch vụ Xét nghiệm ADN Uy tín & Chính xác
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-100">
                Chúng tôi cung cấp dịch vụ xét nghiệm ADN chuyên nghiệp với kết quả chính xác lên đến 99.9999%.
                Bảo mật thông tin khách hàng và kết quả xét nghiệm là ưu tiên hàng đầu của chúng tôi.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/services"
                  className="rounded-md bg-white px-5 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Xem dịch vụ
                </Link>
                <Link href="/contact" className="text-lg font-semibold leading-6 text-white hover:text-gray-200">
                  Liên hệ <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-12 flex items-center justify-center">
              <div className="relative w-full max-w-lg h-80 sm:h-96">
                {/* Placeholder for image - will use proper image later */}
                <div className="w-full h-full rounded-lg bg-white/10 shadow-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="w-40 h-40 opacity-80">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Dịch vụ xét nghiệm ADN</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Chúng tôi cung cấp đa dạng các dịch vụ xét nghiệm ADN phù hợp với nhu cầu của khách hàng.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg">
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                  {/* Placeholder for image - will use proper images later */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gray-400">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <Link href={service.href} className="text-blue-600 font-medium hover:text-blue-800">
                    Tìm hiểu thêm <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample collection methods */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Phương thức thu mẫu</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Chúng tôi cung cấp nhiều phương thức thu mẫu khác nhau, giúp quá trình xét nghiệm trở nên thuận tiện nhất cho bạn.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sẵn sàng đặt dịch vụ xét nghiệm?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Đăng ký tài khoản ngay hôm nay để đặt dịch vụ xét nghiệm ADN và theo dõi kết quả một cách thuận tiện.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="rounded-md bg-blue-600 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Đăng ký ngay
              </Link>
              <Link
                href="/services"
                className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600"
              >
                Xem dịch vụ <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
