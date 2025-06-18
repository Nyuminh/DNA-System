# Hướng dẫn sử dụng Logo

## Cách thêm logo .jpg của bạn

### Bước 1: Thêm file logo vào thư mục public/images
```
public/
  images/
    logo.jpg          // Logo chính của bạn
    logo-white.jpg    // Logo màu trắng (tuỳ chọn)
    logo-small.jpg    // Logo nhỏ (tuỳ chọn)
```

### Bước 2: Sử dụng component Logo

#### Sử dụng logo mặc định (SVG)
```tsx
import Logo from '@/components/common/Logo';

// Logo đầy đủ với icon SVG
<Logo variant="full" size="md" showTagline={true} />

// Chỉ icon SVG
<Logo variant="icon" size="lg" />

// Chỉ text
<Logo variant="text" size="md" showTagline={true} />
```

#### Sử dụng logo tùy chỉnh (.jpg)
```tsx
import Logo from '@/components/common/Logo';

// Logo đầy đủ với hình ảnh tùy chỉnh
<Logo 
  variant="full" 
  size="md" 
  useCustomLogo={true}
  customLogoPath="/images/logo.jpg"
  showTagline={true} 
/>

// Chỉ hình ảnh logo
<Logo 
  variant="icon" 
  size="lg"
  useCustomLogo={true}
  customLogoPath="/images/logo.jpg"
/>

// Logo với đường dẫn khác
<Logo 
  variant="full"
  size="xl"
  useCustomLogo={true}
  customLogoPath="/images/my-custom-logo.jpg"
/>
```

## Các tùy chọn có sẵn

### variant
- `'full'`: Hiển thị logo + text (mặc định)
- `'icon'`: Chỉ hiển thị logo/icon
- `'text'`: Chỉ hiển thị text

### size
- `'sm'`: Nhỏ (32x32px cho logo)
- `'md'`: Trung bình (40x40px cho logo) - mặc định
- `'lg'`: Lớn (48x48px cho logo)
- `'xl'`: Rất lớn (64x64px cho logo)

### useCustomLogo
- `false`: Sử dụng SVG icon mặc định
- `true`: Sử dụng hình ảnh tùy chỉnh

### customLogoPath
- Đường dẫn đến file logo của bạn
- Mặc định: `'/images/logo.jpg'`

### showTagline
- `false`: Không hiển thị slogan
- `true`: Hiển thị slogan "Chuyên nghiệp • Uy tín • Chính xác"

## Ví dụ sử dụng trong Header

```tsx
// src/components/layout/Header.tsx
import Logo from '@/components/common/Logo';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <Logo 
          variant="full"
          size="md"
          useCustomLogo={true}
          customLogoPath="/images/logo.jpg"
          className="cursor-pointer"
        />
      </div>
    </header>
  );
}
```

## Lưu ý quan trọng

1. **Tỷ lệ hình ảnh**: Đảm bảo logo có tỷ lệ phù hợp (khuyến nghị vuông hoặc chữ nhật không quá dài)
2. **Chất lượng**: Sử dụng hình ảnh có độ phân giải cao để đảm bảo hiển thị rõ nét
3. **Kích thước file**: Nén hình ảnh để tối ưu tốc độ tải trang
4. **Format**: Component hỗ trợ .jpg, .png, .webp và các format hình ảnh khác
