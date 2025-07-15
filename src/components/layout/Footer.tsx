import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Logo from '@/components/common/Logo';

export default function Footer() {
  return (
    <footer className="bg-secondary-900">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Company Info */}          <div className="lg:col-span-2">
            <div className="[&_span]:!text-white mb-4">
              <Logo 
                variant="full" 
                size="md"
                useCustomLogo={true}
                customLogoPath="/images/logo.jpg"
                showTagline={true}
              />
            </div>
            <p className="text-secondary-300 mb-6 max-w-md leading-relaxed">
              Trung tâm xét nghiệm ADN hàng đầu Việt Nam với hơn 10 năm kinh nghiệm. 
              Chúng tôi cam kết mang đến kết quả chính xác và dịch vụ tận tâm nhất cho khách hàng.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 cursor-pointer">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <div className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 cursor-pointer">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </div>
              <div className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 cursor-pointer">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.989C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Dịch vụ</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services#paternity" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Xét nghiệm huyết thống
                </Link>
              </li>
              <li>
                <Link href="/services#legal" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Xét nghiệm ADN hành chính
                </Link>
              </li>
              <li>
                <Link href="/services#private" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Xét nghiệm ADN dân sự
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Tất cả dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          
        </div>

        {/* Contact Info */}
        <div className="border-t border-secondary-800 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600/10">
                <MapPinIcon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Địa chỉ</div>
                <div className="text-sm text-secondary-300">123 Đường XYZ, Quận ABC, TP. HCM</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600/10">
                <PhoneIcon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Hotline</div>
                <div className="text-sm text-secondary-300">1900 1234 567</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600/10">
                <EnvelopeIcon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Email</div>
                <div className="text-sm text-secondary-300">info@dnatestingvn.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-secondary-800 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-secondary-400">
              &copy; {new Date().getFullYear()} DNA Testing VN. Tất cả các quyền được bảo lưu.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/terms" className="text-sm text-secondary-400 hover:text-white transition-colors duration-200">
                Điều khoản sử dụng
              </Link>
              <Link href="/privacy" className="text-sm text-secondary-400 hover:text-white transition-colors duration-200">
                Chính sách bảo mật
              </Link>
            </div>
          </div>        </div>
      </div>
    </footer>
  );
}
