'use client';

import MainLayout from '@/components/layout/MainLayout';
import Logo from '@/components/common/Logo';

export default function LogoDemo() {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container-max">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Logo Component</h1>
            <p className="text-gray-600">Xem trước các variant của logo với hình ảnh tùy chỉnh</p>
          </div>

          <div className="space-y-16">
            {/* Logo với SVG mặc định */}
            <section className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-8 text-center">Logo SVG mặc định</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Full - Small</h3>
                  <Logo variant="full" size="sm" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Full - Medium</h3>
                  <Logo variant="full" size="md" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Full - Large</h3>
                  <Logo variant="full" size="lg" />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Full - Extra Large</h3>
                  <Logo variant="full" size="xl" />
                </div>
              </div>
            </section>

            {/* Logo với hình ảnh tùy chỉnh */}
            <section className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-8 text-center">Logo với hình ảnh tùy chỉnh</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Full - Small</h3>
                  <Logo 
                    variant="full" 
                    size="sm" 
                    useCustomLogo={true}
                    customLogoPath="/images/logo.jpg"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Full - Medium</h3>
                  <Logo 
                    variant="full" 
                    size="md" 
                    useCustomLogo={true}
                    customLogoPath="/images/logo.jpg"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Full - Large</h3>
                  <Logo 
                    variant="full" 
                    size="lg" 
                    useCustomLogo={true}
                    customLogoPath="/images/logo.jpg"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Full - Extra Large</h3>
                  <Logo 
                    variant="full" 
                    size="xl" 
                    useCustomLogo={true}
                    customLogoPath="/images/logo.jpg"
                  />
                </div>
              </div>
            </section>

            {/* Chỉ icon */}
            <section className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-8 text-center">Chỉ Icon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">SVG Icon</h3>
                  <div className="flex justify-center space-x-4">
                    <Logo variant="icon" size="sm" />
                    <Logo variant="icon" size="md" />
                    <Logo variant="icon" size="lg" />
                    <Logo variant="icon" size="xl" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Custom Image</h3>
                  <div className="flex justify-center space-x-4">
                    <Logo variant="icon" size="sm" useCustomLogo={true} customLogoPath="/images/logo.jpg" />
                    <Logo variant="icon" size="md" useCustomLogo={true} customLogoPath="/images/logo.jpg" />
                    <Logo variant="icon" size="lg" useCustomLogo={true} customLogoPath="/images/logo.jpg" />
                    <Logo variant="icon" size="xl" useCustomLogo={true} customLogoPath="/images/logo.jpg" />
                  </div>
                </div>
              </div>
            </section>

            {/* Với tagline */}
            <section className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-8 text-center">Với Tagline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">SVG với Tagline</h3>
                  <Logo variant="full" size="lg" showTagline={true} />
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Custom Image với Tagline</h3>
                  <Logo 
                    variant="full" 
                    size="lg" 
                    useCustomLogo={true}
                    customLogoPath="/images/logo.jpg"
                    showTagline={true} 
                  />
                </div>
              </div>
            </section>

            {/* Trên nền tối */}
            <section className="bg-gray-900 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-8 text-center text-white">Trên nền tối</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">SVG Logo</h3>
                  <div className="[&_span]:!text-white">
                    <Logo variant="full" size="lg" showTagline={true} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Custom Image Logo</h3>
                  <div className="[&_span]:!text-white">
                    <Logo 
                      variant="full" 
                      size="lg" 
                      useCustomLogo={true}
                      customLogoPath="/images/logo.jpg"
                      showTagline={true} 
                    />
                  </div>
                </div>
              </div>
            </section>            {/* Hướng dẫn sử dụng */}
            <section className="bg-blue-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Hướng dẫn sử dụng</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cách sử dụng logo tùy chỉnh:</h3>
                  <div className="bg-white rounded-lg p-4 font-mono text-sm">
                    <pre className="text-gray-800">{`<Logo 
  variant="full" 
  size="md"
  useCustomLogo={true}
  customLogoPath="/images/logo.jpg"
  showTagline={true}
/>`}</pre>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Các props có sẵn:</h3>
                  <ul className="space-y-2 text-sm">
                    <li><code className="bg-white px-2 py-1 rounded">variant</code>: &apos;full&apos; | &apos;icon&apos; | &apos;text&apos;</li>
                    <li><code className="bg-white px-2 py-1 rounded">size</code>: &apos;sm&apos; | &apos;md&apos; | &apos;lg&apos; | &apos;xl&apos;</li>
                    <li><code className="bg-white px-2 py-1 rounded">useCustomLogo</code>: boolean</li>
                    <li><code className="bg-white px-2 py-1 rounded">customLogoPath</code>: string</li>
                    <li><code className="bg-white px-2 py-1 rounded">showTagline</code>: boolean</li>
                    <li><code className="bg-white px-2 py-1 rounded">className</code>: string</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Kích thước hình ảnh tùy chỉnh:</h3>
                  <ul className="space-y-2 text-sm">
                    <li><code className="bg-white px-2 py-1 rounded">sm</code>: 40×32px (tỉ lệ 5:4)</li>
                    <li><code className="bg-white px-2 py-1 rounded">md</code>: 50×40px (tỉ lệ 5:4)</li>
                    <li><code className="bg-white px-2 py-1 rounded">lg</code>: 60×48px (tỉ lệ 5:4)</li>
                    <li><code className="bg-white px-2 py-1 rounded">xl</code>: 80×64px (tỉ lệ 5:4)</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-2">
                    Tỉ lệ 5:4 phù hợp cho header và layout ngang
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
