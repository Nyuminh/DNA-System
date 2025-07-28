'use client';

import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import { 
  CheckCircleIcon, 
  ShieldCheckIcon, 
  HomeIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { getAllFeedbacks } from '@/lib/api/feedback';
import { getAllUsers } from '@/lib/api/auth'; // Thêm import

// Define TestimonialType if not imported from elsewhere
type TestimonialType = {
  name: string;
  role: string;
  rating: number;
  content: string;
  imageUrl: string;
};

export default function Home() {    const services = [
    
    {
      id: 'legal',
      title: 'Xét nghiệm ADN Hành chính',
      description: 'Dịch vụ xét nghiệm ADN được công nhận bởi cơ quan pháp lý, phục vụ các mục đích hành chính và pháp lý.',
      imageUrl: '/images/adn-hanh-chinh.jpg',
      href: '/services#legal',
      features: ['Giá trị pháp lý', 'Quy trình chuẩn', 'Chứng nhận hợp lệ'],
    },
    {
      id: 'private',
      title: 'Xét nghiệm ADN Dân sự',
      description: 'Dịch vụ xét nghiệm ADN bảo mật, không cần thiết phải cung cấp thông tin cá nhân của người tham gia.',
      imageUrl: '/images/128d5103151t89325l0.jpg',
      href: '/services#private',
      features: ['Hoàn toàn bảo mật', 'Ẩn danh tùy chọn', 'Nhanh chóng'],
    },
  ];
  const features = [
    {
      title: 'Tự thu mẫu tại nhà',
      description: 'Nhận bộ kit thu mẫu chuyên nghiệp và tự thực hiện lấy mẫu tại nhà theo hướng dẫn chi tiết, sau đó gửi mẫu về trung tâm.',
      icon: HomeIcon,
      benefits: ['Tiện lợi, riêng tư', 'Hướng dẫn chi tiết', 'Kit chuyên nghiệp']
    },
    {
      title: 'Thu mẫu tại cơ sở y tế',
      description: 'Đặt lịch hẹn và đến cơ sở y tế của chúng tôi để được nhân viên y tế chuyên nghiệp lấy mẫu xét nghiệm.',
      icon: BuildingOfficeIcon,
      benefits: ['Nhân viên chuyên nghiệp', 'Trang thiết bị hiện đại', 'An toàn tuyệt đối']
    },
  ];

  const stats = [
    { number: '99.9999%', label: 'Độ chính xác' },
    { number: '10+', label: 'Năm kinh nghiệm' },
    { number: '50,000+', label: 'Khách hàng tin tưởng' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' },
  ];
  const [feedbacks, setFeedbacks] = useState<TestimonialType[]>([]);

  useEffect(() => {
    async function fetchFeedbacks() {
      const feedbackData = await getAllFeedbacks();
      const users = await getAllUsers();

      // Lọc feedback của 3 người khác nhau (theo customerId)
      const uniqueCustomerIds = new Set<string>();
      const uniqueFeedbacks: any[] = [];
      for (const fb of feedbackData || []) {
        if (!uniqueCustomerIds.has(fb.customerId) && uniqueFeedbacks.length < 3) {
          uniqueCustomerIds.add(fb.customerId);
          uniqueFeedbacks.push(fb);
        }
        if (uniqueFeedbacks.length === 3) break;
      }

      // Map sang TestimonialType
      const mapped = uniqueFeedbacks.map((fb: any) => {
        const user = users.find((u: any) => u.userID === fb.customerId);
        return {
          name: user?.fullname || user?.username || 'Ẩn danh',
          role:  'Khách hàng', // Thêm trường role
          rating: fb.rating || 5,
          content: fb.comment || '',
          imageUrl: user?.image || '/images/lab-equipment.svg',
        };
      });

      setFeedbacks(mapped);
    }
    fetchFeedbacks();
  }, []);

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero"></div>
        <div className="relative container-max section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Chứng nhận ISO 15189 & CAP
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Dịch vụ Xét nghiệm
                <span className="block text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text">
                  ADN Chuyên nghiệp
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Trung tâm xét nghiệm ADN hàng đầu với công nghệ hiện đại nhất, 
                mang đến kết quả chính xác <strong>99.9999%</strong> và dịch vụ tận tâm.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/services" className="btn-primary text-lg">
                  Khám phá dịch vụ
                </Link>
                <Link href="/contact" className="btn-outline text-lg border-white text-white hover:bg-white hover:text-secondary-900">
                  Tư vấn miễn phí
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur-2xl opacity-30 scale-105"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-center w-full h-80">
                    <BeakerIcon className="w-32 h-32 text-white/80" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-primary-600 rounded-xl p-4">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Dịch vụ xét nghiệm ADN chuyên nghiệp
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp đa dạng các dịch vụ xét nghiệm ADN với công nghệ tiên tiến nhất, 
              đáp ứng mọi nhu cầu của khách hàng.
            </p>
          </div>
          {/* Căn giữa tất cả dịch vụ */}
          <div className="flex flex-wrap justify-center gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="card-elevated p-8 group hover:scale-105 transition-all duration-300 animate-slide-up max-w-md w-full"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="relative w-full h-48 rounded-xl mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src={service.imageUrl} 
                    alt={service.title}
                    fill
                    className="object-cover w-full h-full"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/lab-equipment.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <h3 className="text-xl font-bold text-secondary-900 mb-3">{service.title}</h3>
                <p className="text-secondary-600 mb-6 leading-relaxed">{service.description}</p>
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-secondary-700">
                      <CheckCircleIcon className="w-4 h-4 text-success-600 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Link 
                    href={service.href} 
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 group-hover:shadow-lg"
                  >
                    Tìm hiểu thêm
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample collection methods */}
      <section className="section-padding bg-secondary-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Phương thức thu mẫu linh hoạt
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp nhiều phương thức thu mẫu khác nhau, giúp quá trình xét nghiệm 
              trở nên thuận tiện và phù hợp nhất cho từng khách hàng.
            </p>
          </div>
            <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary-100 text-primary-600 mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center text-sm text-secondary-700">
                      <CheckCircleIcon className="w-4 h-4 text-success-600 mr-2 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {feedbacks.map((testimonial, index) => (
              <div
                key={index}
                className="bg-secondary-50 rounded-2xl p-8 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-6">
                  {/* Hiển thị ảnh và tên người feedback */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    {testimonial.imageUrl ? (
                      <img
                        src={`http://localhost:5198/${testimonial.imageUrl.replace(/^\/+/, '')}`}
                        alt={testimonial.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/lab-equipment.svg';
                        }}
                      />
                    ) : (
                      <img
                        src="/images/lab-equipment.svg"
                        alt="default"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900">{testimonial.name}</div>
                    <div className="text-sm text-secondary-600">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-warning-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 italic leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section-padding gradient-primary">
        <div className="container-max text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu xét nghiệm ADN?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Đăng ký tài khoản ngay hôm nay để đặt dịch vụ xét nghiệm ADN và theo dõi kết quả 
              một cách thuận tiện. Hoặc liên hệ với chúng tôi để được tư vấn miễn phí.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-secondary text-lg">
                Đăng ký ngay
              </Link>
              <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg">
                Tư vấn miễn phí
              </Link>
            </div>
          </div>        </div>
      </section>
    </MainLayout>
  );
}
