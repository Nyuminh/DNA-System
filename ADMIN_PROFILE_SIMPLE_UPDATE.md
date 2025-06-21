# Admin Profile Update Documentation

## Mô tả
Cập nhật giao diện trang profile admin để phù hợp với yêu cầu:
1. Loại bỏ sidebar/tab navigation, chỉ giữ lại form thông tin cá nhân
2. Sử dụng các trường thông tin giống với dashboard customer
3. Sử dụng API `/api/User/me` vì admin và user cùng database, chỉ khác roleID

## Các thay đổi đã thực hiện

### 1. Cập nhật giao diện (`src/app/admin/profile/page.tsx`)
- **Loại bỏ hoàn toàn:** Sidebar navigation, tabs, đổi mật khẩu form
- **Chỉ giữ lại:** Form thông tin cá nhân với layout đơn giản
- **Các trường form:** Giống với dashboard customer:
  - `username` (readonly)
  - `fullname` (editable)
  - `email` (editable)
  - `phone` (editable)
  - `address` (editable)

### 2. Cập nhật API Interface (`src/lib/api/admin.ts`)
- **AdminProfile interface:** Thêm trường `username` và `address`
- **UpdateProfileRequest interface:** Thêm optional fields `email` và `address`
- **getProfile method:** Transform API response từ `/api/User/me` thành AdminProfile format
- **updateProfile method:** Hỗ trợ cập nhật các trường mới

### 3. Layout và Styling
- **Container:** Max width 4xl, centered
- **Form:** Grid 2 columns, responsive
- **Loading/Error states:** Tương tự dashboard customer
- **Success/Error messages:** Dismissible notifications

## API Endpoints sử dụng
- **GET** `/api/User/me` - Lấy thông tin cá nhân
- **PUT** `/api/User/me` - Cập nhật thông tin cá nhân

## Files đã thay đổi
- `src/app/admin/profile/page.tsx` (file chính duy nhất)
- `src/lib/api/admin.ts` (updated interfaces and methods)
- `ADMIN_PROFILE_SIMPLE_UPDATE.md` (tài liệu cập nhật)

## Files đã xóa  
- `src/app/admin/profile/page-old.tsx` - Version gốc với đầy đủ tabs và sidebar
- `src/app/admin/profile/page-old-backup.tsx` - Version trước khi refactor

## Structure cuối cùng
```
src/app/admin/profile/
├── page.tsx (file duy nhất - form thông tin cá nhân đơn giản)
```

## Testing
- Server chạy thành công trên port 3000 (sau restart)
- Không có lỗi compile
- Chỉ còn 1 file page.tsx duy nhất trong thư mục admin/profile
- Form load và hiển thị đúng layout
- API endpoints đã được configure đúng

## Lưu ý
- Admin và user cùng sử dụng bảng database và API endpoints
- Chỉ khác nhau ở roleID để phân quyền
- Form validation và error handling đã được implement
- Responsive design cho mobile và desktop
