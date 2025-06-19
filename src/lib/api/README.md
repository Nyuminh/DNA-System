# API Package Structure

Thư mục này chứa tất cả các API calls được tổ chức theo module chức năng.

## Cấu trúc thư mục

```
src/lib/api/
├── index.ts          # Export tất cả APIs
├── client.ts         # Axios client configuration
├── auth.ts           # Authentication APIs
├── users.ts          # User management APIs
├── services.ts       # Service management APIs
├── bookings.ts       # Booking APIs
├── appointments.ts   # Appointment APIs
├── tests.ts          # Test samples & results APIs
├── other.ts          # Reviews, Notifications, Payments APIs
└── admin.ts          # Admin dashboard & reports APIs
```

## Sử dụng

### Import APIs

```typescript
// Import từ package chính
import { loginUser, createBooking, getServices } from '@/lib/api';

// Hoặc import từ module cụ thể
import { loginUser } from '@/lib/api/auth';
import { createBooking } from '@/lib/api/bookings';
```

### Authentication

```typescript
import { loginUser, logoutUser } from '@/lib/api/auth';

// Login
const result = await loginUser({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  // result.user và result.token available
  console.log('Login thành công', result.user);
}

// Logout
await logoutUser();
```

### Bookings

```typescript
import { createBooking } from '@/lib/api/bookings';

const result = await createBooking({
  serviceId: 'test-123',
  testType: 'Xét nghiệm cha con',
  collectionMethod: 'self',
  participants: [
    {
      role: 'father',
      name: 'Nguyễn Văn A',
      dob: '1980-01-01',
      gender: 'male',
      sampleType: 'buccal'
    }
  ]
});
```

## API Client Configuration

API client được cấu hình với:
- Base URL: `process.env.NEXT_PUBLIC_API_URL` hoặc `https://localhost:7029`
- Timeout: 15 giây
- Auto token management
- Error handling cho 401 (unauthorized)

## Role-based Access Control

Hệ thống phân quyền dựa trên `roleID`:
- `R01`: Admin
- `R03`: Customer/User  
- `R04`: Manager

## Error Handling

Tất cả APIs trả về format nhất quán:

```typescript
{
  success: boolean;
  message?: string;
  data?: any; // Response data nếu có
}
```

## Migration từ API cũ

Các file API cũ đã được di chuyển thành `.old`:
- `src/lib/api.ts` → `src/lib/api.ts.old`
- `src/lib/auth.ts` → `src/lib/auth.ts.old`

Tất cả import đã được cập nhật để sử dụng package mới.
