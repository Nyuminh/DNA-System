# Cách sử dụng Logo mới trong Header

## Thay đổi Header để sử dụng component Logo

Để sử dụng logo .jpg trong Header, bạn có thể thay đổi file `src/components/layout/Header.tsx` như sau:

### Cách 1: Thay thế hoàn toàn bằng component Logo

```tsx
// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '@/components/common/Logo'; // Import Logo component

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Dịch vụ', href: '/services' },
  { name: 'Về chúng tôi', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Liên hệ', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = false;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
      <nav className="container-max flex items-center justify-between py-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="group">
            {/* Sử dụng logo tùy chỉnh */}
            <Logo 
              variant="full" 
              size="md"
              useCustomLogo={true}
              customLogoPath="/images/logo.jpg"
              className="group-hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>
        
        {/* Rest of the header code remains the same */}
        {/* ... */}
      </nav>
    </header>
  );
}
```

### Cách 2: Kết hợp logo cũ và mới (responsive)

```tsx
// Hiển thị logo SVG trên desktop, logo hình ảnh trên mobile
<Link href="/" className="group">
  {/* Logo cho desktop */}
  <div className="hidden md:block">
    <Logo 
      variant="full" 
      size="md"
      useCustomLogo={false} // SVG
      className="group-hover:scale-105 transition-transform duration-200"
    />
  </div>
  
  {/* Logo cho mobile */}
  <div className="md:hidden">
    <Logo 
      variant="icon" 
      size="sm"
      useCustomLogo={true}
      customLogoPath="/images/logo.jpg"
      className="group-hover:scale-105 transition-transform duration-200"
    />
  </div>
</Link>
```

### Cách 3: Chỉ thay đổi icon giữ nguyên text

```tsx
<Link href="/" className="flex items-center group">
  {/* Chỉ sử dụng icon từ logo component */}
  <Logo 
    variant="icon" 
    size="md"
    useCustomLogo={true}
    customLogoPath="/images/logo.jpg"
    className="group-hover:scale-105 transition-transform duration-200"
  />
  <div className="ml-3">
    <span className="text-xl font-bold text-secondary-900">DNA Testing VN</span>
    <div className="text-xs text-secondary-600 font-medium">Chuyên nghiệp • Uy tín</div>
  </div>
</Link>
```

## Cập nhật Mobile Menu

Cũng cần cập nhật phần mobile menu:

```tsx
{/* Mobile menu logo */}
<Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
  <Logo 
    variant="icon" 
    size="sm"
    useCustomLogo={true}
    customLogoPath="/images/logo.jpg"
  />
  <span className="ml-2 text-lg font-bold text-secondary-900">DNA Testing VN</span>
</Link>
```

## Các tùy chọn logo phổ biến

### 1. Logo chính (header)
```tsx
<Logo 
  variant="full" 
  size="md"
  useCustomLogo={true}
  customLogoPath="/images/logo.jpg"
/>
```

### 2. Logo compact cho mobile
```tsx
<Logo 
  variant="icon" 
  size="sm"
  useCustomLogo={true}
  customLogoPath="/images/logo.jpg"
/>
```

### 3. Logo với tagline (footer hoặc trang đặc biệt)
```tsx
<Logo 
  variant="full" 
  size="lg"
  useCustomLogo={true}
  customLogoPath="/images/logo.jpg"
  showTagline={true}
/>
```

## Lưu ý khi sử dụng

1. **Đặt file logo vào đúng thư mục**: `public/images/logo.jpg`
2. **Kích thước phù hợp**: Logo nên có tỷ lệ vuông hoặc chữ nhật không quá dài
3. **Chất lượng cao**: Sử dụng hình ảnh có độ phân giải tốt
4. **Tối ưu kích thước**: Nén file để tăng tốc độ tải trang
