import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:mt-0">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
            <span className="ml-2 text-xl font-bold text-white">DNA Testing VN</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            Dịch vụ xét nghiệm ADN chuyên nghiệp và uy tín hàng đầu tại Việt Nam.
          </p>
        </div>
        
        <div className="mt-8 md:mt-0">
          <h3 className="text-sm font-semibold leading-6 text-white">Dịch vụ</h3>
          <ul role="list" className="mt-2 space-y-2">
            <li>
              <Link href="/services#paternity" className="text-sm leading-6 text-gray-300 hover:text-white">
                Xét nghiệm huyết thống
              </Link>
            </li>
            <li>
              <Link href="/services#legal" className="text-sm leading-6 text-gray-300 hover:text-white">
                Xét nghiệm ADN hành chính
              </Link>
            </li>
            <li>
              <Link href="/services#private" className="text-sm leading-6 text-gray-300 hover:text-white">
                Xét nghiệm ADN dân sự
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mt-8 md:mt-0">
          <h3 className="text-sm font-semibold leading-6 text-white">Công ty</h3>
          <ul role="list" className="mt-2 space-y-2">
            <li>
              <Link href="/about" className="text-sm leading-6 text-gray-300 hover:text-white">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm leading-6 text-gray-300 hover:text-white">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm leading-6 text-gray-300 hover:text-white">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mt-8 md:mt-0">
          <h3 className="text-sm font-semibold leading-6 text-white">Liên hệ</h3>
          <ul role="list" className="mt-2 space-y-2">
            <li className="text-sm leading-6 text-gray-300">
              <span className="font-semibold">Địa chỉ:</span> 123 Đường XYZ, Quận ABC, TP. HCM
            </li>
            <li className="text-sm leading-6 text-gray-300">
              <span className="font-semibold">Email:</span> info@dnatestingvn.com
            </li>
            <li className="text-sm leading-6 text-gray-300">
              <span className="font-semibold">Hotline:</span> 1900 1234 567
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-8">
        <p className="text-xs leading-5 text-gray-400 text-center">
          &copy; {new Date().getFullYear()} DNA Testing VN. Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}
