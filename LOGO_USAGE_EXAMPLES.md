# DNA Testing VN - Logo Usage Examples

## Import Logo Component
```tsx
import Logo from '@/components/common/Logo';
```

## Basic Usage Examples

### 1. Header Logo (Currently Used)
```tsx
<Logo variant="full" size="md" className="hover:scale-105 transition-transform" />
```

### 2. Footer Logo (Currently Used) 
```tsx
<Logo variant="full" size="md" showTagline={true} />
```

### 3. Authentication Pages
```tsx
<div className="flex justify-center mb-8">
  <Logo variant="full" size="lg" showTagline={true} />
</div>
```

### 4. Loading Screen
```tsx
<div className="flex flex-col items-center justify-center min-h-screen">
  <Logo variant="icon" size="xl" className="animate-pulse mb-4" />
  <Logo variant="text" size="lg" showTagline={true} />
</div>
```

### 5. Email Templates
```tsx
<div className="text-center mb-8">
  <Logo variant="full" size="md" showTagline={true} />
</div>
```

### 6. Mobile App Icon
```tsx
<Logo variant="icon" size="sm" />
```

### 7. Business Card / Print Materials
```tsx
<Logo variant="full" size="xl" showTagline={true} className="print:text-black" />
```

### 8. Sidebar Logo (Compact)
```tsx
<Logo variant="icon" size="md" className="mx-auto" />
```

### 9. Error Pages (404, 500)
```tsx
<div className="text-center">
  <Logo variant="full" size="lg" className="opacity-75 mb-4" />
  <h1>Trang không tìm thấy</h1>
</div>
```

### 10. Watermark
```tsx
<Logo variant="icon" size="sm" className="opacity-20 absolute bottom-4 right-4" />
```

## Advanced Customization

### Custom Colors (if needed)
```tsx
<Logo 
  variant="icon" 
  size="lg" 
  className="text-white" // For dark backgrounds
/>
```

### Animation Examples
```tsx
<Logo 
  variant="full" 
  size="md" 
  className="hover:scale-110 transition-transform duration-200 cursor-pointer"
/>
```

### Responsive Sizing
```tsx
<Logo 
  variant="full" 
  size="md" 
  className="lg:hidden" // Hide on large screens
/>

<Logo 
  variant="full" 
  size="lg" 
  className="hidden lg:block" // Show only on large screens
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'full' \| 'icon' \| 'text'` | `'full'` | Logo display type |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Logo size |
| `className` | `string` | `''` | Additional CSS classes |
| `showTagline` | `boolean` | `false` | Show tagline text |

## Design System Integration

The logo automatically uses the design system colors:
- Primary colors: `var(--primary-600)`, `var(--primary-700)`
- Secondary colors: `var(--secondary-900)`, `var(--secondary-600)`
- Professional gradient backgrounds
- Inter font for optimal typography

## Current Implementation

The logo is already implemented in:
- ✅ Header component (full logo with company name)
- ✅ Footer component (full logo with tagline)
- ✅ Mobile menu (compact version)
- ✅ SVG logo file for external use

Ready to use in any additional locations as needed!
