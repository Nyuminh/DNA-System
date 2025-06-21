# Hướng dẫn test giao diện Admin với fullname

## Các thay đổi đã thực hiện:

### 1. Admin Layout (`src/app/admin/layout.tsx`)
- Import `useAuth` hook từ AuthContext
- Thay thế "Admin User" bằng `{user?.fullname || 'Admin User'}` ở header
- Thay thế "Admin User" bằng `{user?.fullname || 'Admin User'}` ở sidebar
- Thay thế email cứng bằng `{user?.email || 'admin@dnatest.com'}`

### 2. Admin Profile (`src/app/admin/profile/page.tsx`)  
- Import `useAuth` hook và `useEffect`
- Khởi tạo profileData với thông tin user thực tế
- Thêm useEffect để cập nhật khi user data thay đổi

## Cách test:

### Test 1: Với user đã đăng nhập
1. Đăng nhập với tài khoản admin
2. Vào trang `/admin`
3. Kiểm tra xem tên hiển thị ở header và sidebar có phải là fullname từ user data không

### Test 2: Với localStorage có sẵn data
Mở DevTools Console và chạy:
```javascript
// Test với mock admin data
const mockAdmin = {
  userID: "admin001",
  username: "admin",
  fullname: "Nguyễn Văn Admin",
  gender: "male",
  roleID: "R01",
  email: "admin@dnatesting.com",
  phone: "+84901234567",
  birthdate: "1985-01-01",
  image: ""
};

localStorage.setItem('token', 'mock-admin-token');
localStorage.setItem('user', JSON.stringify(mockAdmin));

// Reload trang để AuthContext load data mới
window.location.reload();
```

### Test 3: Fallback khi không có user data
```javascript
// Xóa user data để test fallback
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.reload();
```

## Kết quả mong đợi:

- **Có user data**: Hiển thị fullname thật từ user object
- **Không có user data**: Hiển thị "Admin User" (fallback)
- **Email**: Hiển thị email thật hoặc "admin@dnatest.com" (fallback)

## File đã sửa:
- ✅ `src/app/admin/layout.tsx` - Header và sidebar
- ✅ `src/app/admin/profile/page.tsx` - Trang profile

Giao diện admin bây giờ sẽ hiển thị tên thật của admin thay vì hard-coded "Admin User"!
