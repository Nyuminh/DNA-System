# Cập Nhật Giao Diện Profile Admin

## Tổng Quan
Đã thiết kế lại giao diện trang profile admin (`/admin/profile`) để đồng bộ với giao diện dashboard customer, đảm bảo trải nghiệm người dùng nhất quán và sử dụng đúng endpoint API `/api/User/me`.

## Thay Đổi Chính

### 1. API Endpoint Updates (src/lib/api/admin.ts)
- **getProfile**: Đổi từ `/Admin/profile` → `/api/User/me`
- **updateProfile**: Đổi từ `/Admin/profile` → `/api/User/me` (PUT)
- **changePassword**: Đổi từ `/Admin/change-password` → `/api/User/change-password`

### 2. Giao Diện Mới (src/app/admin/profile/page.tsx)
#### Layout & Design:
- Tab navigation với sidebar giống dashboard customer
- Clean, modern UI với Tailwind CSS
- Responsive design cho mobile và desktop
- Error và success messages rõ ràng

#### Tabs Available:
1. **Hồ sơ cá nhân** - Cập nhật thông tin cơ bản
2. **Đổi mật khẩu** - Thay đổi mật khẩu an toàn
3. **Cài đặt** - Các tùy chọn hệ thống (placeholder)
4. **Thông báo** - Quản lý thông báo (placeholder)

#### Form Fields:
- **Hồ sơ**: Tên, Email, Số điện thoại, Chức vụ, Phòng ban, Địa chỉ
- **Đổi mật khẩu**: Mật khẩu hiện tại, Mật khẩu mới, Xác nhận mật khẩu

### 3. Sidebar Navigation (src/app/admin/layout.tsx)
- Thêm link "Hồ sơ cá nhân" vào admin sidebar
- Fixed duplicate menu items
- Active state highlighting cho profile page

#### Đổi mật khẩu  
- Cảnh báo bảo mật màu vàng
- 3 field: Mật khẩu hiện tại, Mật khẩu mới, Xác nhận mật khẩu
- Validation client-side
- Button "Cập nhật mật khẩu" với loading state

#### Cài đặt
- Checkbox options cho thông báo
- Dropdown chọn ngôn ngữ
- Button "Lưu cài đặt"

#### Thông báo
- Danh sách thông báo hệ thống
- Hiển thị với dot indicator và timestamp

### 3. Cập nhật Navigation
- **File**: `src/app/admin/layout.tsx`
- **Thay đổi**: Thêm link "Hồ sơ cá nhân" vào sidebar menu admin

### 4. API Integration
- Tích hợp với `adminProfileAPI` từ `src/lib/api/admin.ts`
- Các function được sử dụng:
  - `updateProfile()` - Cập nhật thông tin cá nhân
  - `changePassword()` - Đổi mật khẩu

## Giao diện mới

### Đặc điểm chính:
1. **Layout đơn giản**: Sidebar + Main content như dashboard customer
2. **Form chuẩn**: Input fields với border, focus states, validation
3. **Tab navigation**: Buttons đơn giản với active states
4. **Responsive**: Hoạt động tốt trên mobile và desktop
5. **Notifications**: Error/success messages rõ ràng

### So sánh với giao diện cũ:
- **Cũ**: Card-based layout, nhiều màu sắc, phức tạp
- **Mới**: Table-based layout, đơn giản, giống dashboard customer

## Cách sử dụng

1. Truy cập `/admin/profile` 
2. Chọn tab mong muốn từ sidebar
3. Chỉnh sửa thông tin và nhấn "Lưu thay đổi"
4. Xem thông báo thành công/lỗi

## Files liên quan

- `src/app/admin/profile/page.tsx` - Component chính
- `src/app/admin/layout.tsx` - Layout với navigation
- `src/lib/api/admin.ts` - API functions
- `src/app/admin/profile/page-old.tsx` - Backup file cũ
