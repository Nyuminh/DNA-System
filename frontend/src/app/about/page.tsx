'use client';

import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>      <div className="bg-white">        {/* Hero section */}        
        <div className="relative hero-section h-[400px]">
          <div className="absolute inset-0">
            <Image
              className="h-full w-full object-cover object-center"
              src="/images/banner_about.jpeg"
              alt="DNA Testing Laboratory"
              width={1920}
              height={400}
              priority
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>            <div className="relative h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">Về chúng tôi</h1>
              <p className="mt-4 text-xl text-gray-100 drop-shadow-lg font-medium">
                Chúng tôi cung cấp dịch vụ xét nghiệm ADN chất lượng cao, độ chính xác tuyệt đối và bảo mật thông tin khách hàng.
              </p>
            </div>
          </div>
        </div>

        {/* Mission statement */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Cung cấp dịch vụ xét nghiệm ADN chính xác, bảo mật và chuyên nghiệp cho mọi đối tượng khách hàng, giúp họ xác định mối quan hệ huyết thống và đưa ra quyết định sáng suốt trong cuộc sống.
              </p>
              <div className="mt-6">
                <Link href="/services" className="text-base font-medium text-blue-600 hover:text-blue-500">
                  Xem các dịch vụ của chúng tôi &rarr;
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <dl className="space-y-10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-lg leading-6 font-medium text-gray-900">
                      Độ chính xác tuyệt đối
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">
                      Phương pháp xét nghiệm của chúng tôi đạt độ chính xác lên đến 99.9999% cho các mối quan hệ huyết thống.
                    </dd>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-lg leading-6 font-medium text-gray-900">
                      Bảo mật thông tin
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">
                      Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân và kết quả xét nghiệm của khách hàng.
                    </dd>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-lg leading-6 font-medium text-gray-900">
                      Thời gian nhanh chóng
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">
                      Kết quả xét nghiệm được trả trong thời gian từ 3-5 ngày làm việc, hoặc 24 giờ với dịch vụ xét nghiệm khẩn cấp.
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Lab facilities */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Cơ sở vật chất hiện đại</h2>
              <p className="mt-4 text-lg text-gray-500">
                Phòng thí nghiệm của chúng tôi được trang bị các thiết bị hiện đại nhất, đáp ứng tiêu chuẩn quốc tế về xét nghiệm ADN.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/images/may-xet-nghiem-giai-trinh-tu-gen-nextseq.jpg"
                  alt="Thiết bị phòng thí nghiệm"
                  width={500}
                  height={300}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-semibold text-white">Thiết bị hiện đại</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Máy xét nghiệm ADN thế hệ mới nhất với độ chính xác cao.
                  </p>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/images/quy-trinh-xet-nghiem.jpg"
                  alt="Quy trình xét nghiệm"
                  width={500}
                  height={300}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-semibold text-white">Quy trình chuyên nghiệp</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Quy trình xét nghiệm tuân thủ nghiêm ngặt các tiêu chuẩn quốc tế.
                  </p>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/images/hinh-doi-ngu-bac-si.jpg"
                  alt="Đội ngũ chuyên gia"
                  width={500}
                  height={300}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-semibold text-white">Đội ngũ chuyên gia</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Đội ngũ bác sĩ, chuyên gia xét nghiệm ADN có trình độ cao.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team section */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Đội ngũ chuyên gia của chúng tôi</h2>
            <p className="mt-4 text-lg text-gray-500">
              Đội ngũ bác sĩ, chuyên gia xét nghiệm ADN với trình độ chuyên môn cao và nhiều năm kinh nghiệm.
            </p>
          </div>
          <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="space-y-4">
              <div className="aspect-w-3 aspect-h-2">
                <Image
                  className="object-cover shadow-lg rounded-lg"
                  src="/images/doctor1.jpg"
                  alt="GS.TS. Nguyễn Văn A"
                  width={400}
                  height={300}
                />
              </div>
              <div className="space-y-2">
                <div className="text-lg leading-6 font-medium space-y-1">
                  <h3>GS.TS. Nguyễn Văn A</h3>
                  <p className="text-blue-600">Giám đốc Phòng xét nghiệm</p>
                </div>
                <div className="text-base text-gray-500">
                  <p>Hơn 20 năm kinh nghiệm trong lĩnh vực xét nghiệm di truyền. Tốt nghiệp Đại học Harvard và có nhiều công trình nghiên cứu quốc tế.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-w-3 aspect-h-2">
                <Image
                  className="object-cover shadow-lg rounded-lg"
                  src="/images/doctor2.jpg"
                  alt="TS. Trần Thị B"
                  width={400}
                  height={300}
                />
              </div>
              <div className="space-y-2">
                <div className="text-lg leading-6 font-medium space-y-1">
                  <h3>TS. Trần Thị B</h3>
                  <p className="text-blue-600">Trưởng phòng Xét nghiệm ADN</p>
                </div>
                <div className="text-base text-gray-500">
                  <p>Chuyên gia hàng đầu về xét nghiệm ADN với 15 năm kinh nghiệm. Tốt nghiệp Đại học Tokyo và là tác giả của nhiều bài báo khoa học.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-w-3 aspect-h-2">
                <Image
                  className="object-cover shadow-lg rounded-lg"
                  src="/images/doctor3.jpg"
                  alt="ThS. Lê Văn C"
                  width={400}
                  height={300}
                />
              </div>
              <div className="space-y-2">
                <div className="text-lg leading-6 font-medium space-y-1">
                  <h3>ThS. Lê Văn C</h3>
                  <p className="text-blue-600">Chuyên gia Tư vấn Di truyền</p>
                </div>
                <div className="text-base text-gray-500">
                  <p>10 năm kinh nghiệm tư vấn di truyền và xét nghiệm ADN. Chuyên gia trong lĩnh vực tư vấn di truyền và các vấn đề pháp lý liên quan đến xét nghiệm ADN.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-blue-600">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Bạn cần tư vấn thêm?</span>
              <span className="block text-blue-200">Liên hệ với chúng tôi ngay hôm nay.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                  Liên hệ ngay
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/services" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800">
                  Xem dịch vụ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
