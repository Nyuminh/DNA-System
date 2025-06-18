// Mock Data for DNA Testing Service Management System
// This file contains comprehensive fake data for development and testing

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  identityNumber: string;
  createdAt: string;
  updatedAt: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: 'vi' | 'en';
  };
}

export interface TestParticipant {
  id: string;
  role: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  relationship?: string;
  sampleId?: string;
}

export interface TestTimeline {
  id: string;
  status: string;
  date: string;
  time?: string;
  description: string;
  performedBy?: string;
  location?: string;
}

export interface TestResult {
  id: string;
  conclusion: string;
  probability: string;
  details: {
    markersTested: number;
    matchingMarkers: number;
    probabilityOfPaternity: string;
    probabilityOfExclusion: string;
  };
  reportUrl: string;
  issuedDate: string;
  validUntil?: string;
}

export interface DNATest {
  id: string;
  userId: string;
  serviceType: string;
  testType: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestDate: string;
  completionDate: string | null;
  sampleMethod: 'home-kit' | 'facility' | 'home-visit';
  amount: string;
  amountNumeric: number;
  currency: 'VND';
  participants: TestParticipant[];
  timeline: TestTimeline[];
  result: TestResult | null;
  rating?: number;
  feedback?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  sampleCollectionAddress?: string;
  priority: 'normal' | 'urgent';
  referenceNumber: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'paternity' | 'civil' | 'private' | 'prenatal' | 'ancestry';
  description: string;
  price: string;
  priceNumeric: number;
  duration: string;
  durationDays: number;
  features: string[];
  isPopular: boolean;
  testTypes: TestType[];
}

export interface TestType {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNumeric: number;
  duration: string;
  durationDays: number;
  requirements: string[];
  sampleTypes: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  testId?: string;
  type: 'consultation' | 'sample-collection' | 'result-discussion';
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
  staffMember?: string;
  notes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'test-update' | 'appointment' | 'result-ready' | 'promotion' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  isPublished: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPopular: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  testType?: string;
  isVerified: boolean;
  createdAt: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user_001',
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    email: 'nguyen.vana@example.com',
    phone: '0912345678',
    address: '123 Đường XYZ, Phường ABC, Quận 1, TP.HCM',
    dateOfBirth: '1985-03-15',
    gender: 'male',
    identityNumber: '024085001234',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2025-05-20T14:22:00Z',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      language: 'vi'
    }
  },
  {
    id: 'user_002',
    firstName: 'Trần',
    lastName: 'Thị B',
    email: 'tran.thib@example.com',
    phone: '0987654321',
    address: '456 Đường DEF, Phường GHI, Quận 3, TP.HCM',
    dateOfBirth: '1990-07-22',
    gender: 'female',
    identityNumber: '024090004567',
    createdAt: '2024-02-20T10:15:00Z',
    updatedAt: '2025-05-18T09:45:00Z',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      language: 'vi'
    }
  },
  {
    id: 'user_003',
    firstName: 'Lê',
    lastName: 'Minh C',
    email: 'le.minhc@example.com',
    phone: '0901234567',
    address: '789 Đường JKL, Phường MNO, Quận 7, TP.HCM',
    dateOfBirth: '1988-12-10',
    gender: 'male',
    identityNumber: '024088007890',
    createdAt: '2024-03-10T16:20:00Z',
    updatedAt: '2025-05-15T11:30:00Z',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      language: 'vi'
    }
  }
];

// Mock DNA Tests
export const mockDNATests: DNATest[] = [
  {
    id: 'TEST001',
    userId: 'user_001',
    serviceType: 'Xét nghiệm Huyết thống',
    testType: 'Xét nghiệm cha con',
    status: 'completed',
    requestDate: '2025-05-12',
    completionDate: '2025-05-15',
    sampleMethod: 'home-kit',
    amount: '4,000,000 VNĐ',
    amountNumeric: 4000000,
    currency: 'VND',
    priority: 'normal',
    referenceNumber: 'REF-2025-001234',
    participants: [
      {
        id: 'p001',
        role: 'Cha giả định',
        name: 'Nguyễn Văn A',
        age: 40,
        gender: 'male',
        relationship: 'alleged_father',
        sampleId: 'S001A'
      },
      {
        id: 'p002',
        role: 'Con',
        name: 'Nguyễn Văn B',
        age: 15,
        gender: 'male',
        relationship: 'child',
        sampleId: 'S001B'
      }
    ],
    timeline: [
      {
        id: 't001',
        status: 'Đã đặt xét nghiệm',
        date: '2025-05-12',
        time: '09:30',
        description: 'Đơn hàng đã được tạo và thanh toán thành công',
        performedBy: 'Hệ thống',
        location: 'Online'
      },
      {
        id: 't002',
        status: 'Đã gửi kit thu mẫu',
        date: '2025-05-13',
        time: '14:00',
        description: 'Kit thu mẫu đã được gửi đến địa chỉ của bạn qua bưu điện',
        performedBy: 'Phòng Logistics',
        location: 'Kho DNA Testing'
      },
      {
        id: 't003',
        status: 'Đã nhận mẫu',
        date: '2025-05-14',
        time: '10:15',
        description: 'Phòng xét nghiệm đã nhận được mẫu và bắt đầu kiểm tra',
        performedBy: 'BS. Nguyễn Thị D',
        location: 'Phòng xét nghiệm A'
      },
      {
        id: 't004',
        status: 'Đang xét nghiệm',
        date: '2025-05-14',
        time: '15:30',
        description: 'Mẫu đang được phân tích ADN với 21 marker di truyền',
        performedBy: 'Kỹ thuật viên Trần Văn E',
        location: 'Phòng phân tích ADN'
      },
      {
        id: 't005',
        status: 'Đã hoàn thành',
        date: '2025-05-15',
        time: '16:45',
        description: 'Kết quả xét nghiệm đã sẵn sàng và báo cáo đã được tạo',
        performedBy: 'BS. Lê Minh F',
        location: 'Phòng kiểm định'
      }
    ],
    result: {
      id: 'r001',
      conclusion: 'Có quan hệ huyết thống',
      probability: '99.9999%',
      details: {
        markersTested: 21,
        matchingMarkers: 21,
        probabilityOfPaternity: '99.9999%',
        probabilityOfExclusion: '0.0001%'
      },
      reportUrl: '/reports/TEST001.pdf',
      issuedDate: '2025-05-15',
      validUntil: '2030-05-15'
    },
    rating: 5,
    feedback: 'Dịch vụ rất chuyên nghiệp, kết quả nhanh chóng và chính xác. Nhân viên hỗ trợ tận tình.'
  },
  {
    id: 'TEST002',
    userId: 'user_001',
    serviceType: 'Xét nghiệm ADN Dân sự',
    testType: 'Xét nghiệm cha con ẩn danh',
    status: 'processing',
    requestDate: '2025-05-20',
    completionDate: null,
    sampleMethod: 'home-visit',
    amount: '3,500,000 VNĐ',
    amountNumeric: 3500000,
    currency: 'VND',
    priority: 'normal',
    referenceNumber: 'REF-2025-001567',
    appointmentDate: '2025-05-22',
    appointmentTime: '10:00',
    sampleCollectionAddress: '123 Đường XYZ, Phường ABC, Quận 1, TP.HCM',
    participants: [
      {
        id: 'p003',
        role: 'Cha giả định',
        name: 'Ẩn danh',
        age: 35,
        gender: 'male',
        relationship: 'alleged_father'
      },
      {
        id: 'p004',
        role: 'Con',
        name: 'Ẩn danh',
        age: 8,
        gender: 'female',
        relationship: 'child'
      }
    ],
    timeline: [
      {
        id: 't006',
        status: 'Đã đặt xét nghiệm',
        date: '2025-05-20',
        time: '11:20',
        description: 'Đơn hàng đã được tạo và thanh toán thành công',
        performedBy: 'Hệ thống'
      },
      {
        id: 't007',
        status: 'Đã đặt lịch thu mẫu',
        date: '2025-05-21',
        time: '09:15',
        description: 'Lịch hẹn thu mẫu đã được xác nhận: 22/05/2025, 10:00',
        performedBy: 'Nhân viên tư vấn'
      },
      {
        id: 't008',
        status: 'Đã thu mẫu',
        date: '2025-05-22',
        time: '10:30',
        description: 'Nhân viên đã thu mẫu thành công tại địa chỉ khách hàng',
        performedBy: 'Y tá Phạm Thị G',
        location: 'Tại nhà khách hàng'
      },
      {
        id: 't009',
        status: 'Đang xét nghiệm',
        date: '2025-05-22',
        time: '14:00',
        description: 'Mẫu đang được phân tích với quy trình bảo mật cao',
        performedBy: 'Phòng xét nghiệm B'
      }
    ],
    result: null
  },
  {
    id: 'TEST003',
    userId: 'user_002',
    serviceType: 'Xét nghiệm ADN Huyết thống',
    testType: 'Xét nghiệm anh chị em',
    status: 'completed',
    requestDate: '2025-05-08',
    completionDate: '2025-05-12',
    sampleMethod: 'facility',
    amount: '5,200,000 VNĐ',
    amountNumeric: 5200000,
    currency: 'VND',
    priority: 'normal',
    referenceNumber: 'REF-2025-001890',
    participants: [
      {
        id: 'p005',
        role: 'Anh/chị',
        name: 'Trần Văn H',
        age: 28,
        gender: 'male',
        relationship: 'sibling'
      },
      {
        id: 'p006',
        role: 'Em',
        name: 'Trần Thị I',
        age: 25,
        gender: 'female',
        relationship: 'sibling'
      }
    ],
    timeline: [
      {
        id: 't010',
        status: 'Đã đặt xét nghiệm',
        date: '2025-05-08',
        time: '14:30',
        description: 'Đăng ký dịch vụ và đặt lịch hẹn tại cơ sở',
        performedBy: 'Tư vấn viên'
      },
      {
        id: 't011',
        status: 'Đã thu mẫu',
        date: '2025-05-09',
        time: '09:00',
        description: 'Thu mẫu tại cơ sở DNA Testing Center',
        performedBy: 'BS. Hoàng Văn J',
        location: 'DNA Testing Center - Chi nhánh HCM'
      },
      {
        id: 't012',
        status: 'Đang xét nghiệm',
        date: '2025-05-09',
        time: '11:00',
        description: 'Bắt đầu quá trình phân tích ADN',
        performedBy: 'Phòng xét nghiệm C'
      },
      {
        id: 't013',
        status: 'Đã hoàn thành',
        date: '2025-05-12',
        time: '17:00',
        description: 'Hoàn thành xét nghiệm và tạo báo cáo',
        performedBy: 'BS. Nguyễn Minh K'
      }
    ],
    result: {
      id: 'r003',
      conclusion: 'Có quan hệ anh chị em ruột',
      probability: '99.8%',
      details: {
        markersTested: 23,
        matchingMarkers: 19,
        probabilityOfPaternity: 'N/A',
        probabilityOfExclusion: 'N/A'
      },
      reportUrl: '/reports/TEST003.pdf',
      issuedDate: '2025-05-12'
    },
    rating: 4,
    feedback: 'Dịch vụ tốt, tuy nhiên thời gian chờ hơi lâu so với dự kiến.'
  },
  {
    id: 'TEST004',
    userId: 'user_003',
    serviceType: 'Xét nghiệm ADN Trước sinh',
    testType: 'Xét nghiệm ADN thai nhi không xâm lấn',
    status: 'pending',
    requestDate: '2025-05-25',
    completionDate: null,
    sampleMethod: 'facility',
    amount: '15,000,000 VNĐ',
    amountNumeric: 15000000,
    currency: 'VND',
    priority: 'urgent',
    referenceNumber: 'REF-2025-002123',
    appointmentDate: '2025-05-28',
    appointmentTime: '08:30',
    participants: [
      {
        id: 'p007',
        role: 'Mẹ mang thai',
        name: 'Phạm Thị L',
        age: 32,
        gender: 'female',
        relationship: 'mother'
      },
      {
        id: 'p008',
        role: 'Cha giả định',
        name: 'Lê Minh C',
        age: 37,
        gender: 'male',
        relationship: 'alleged_father'
      }
    ],
    timeline: [
      {
        id: 't014',
        status: 'Đã đặt xét nghiệm',
        date: '2025-05-25',
        time: '16:45',
        description: 'Đăng ký dịch vụ xét nghiệm ADN trước sinh khẩn cấp',
        performedBy: 'Bác sĩ tư vấn'
      },
      {
        id: 't015',
        status: 'Đã xác nhận lịch hẹn',
        date: '2025-05-26',
        time: '10:00',
        description: 'Xác nhận lịch hẹn lấy mẫu máu mẹ và mẫu ADN cha',
        performedBy: 'Phòng đặt lịch'
      }
    ],
    result: null
  }
];

// Mock Services
export const mockServices: Service[] = [
  {
    id: 'service_001',
    name: 'Xét nghiệm ADN Huyết thống',
    category: 'paternity',
    description: 'Xét nghiệm ADN để xác định mối quan hệ huyết thống được công nhận bởi tòa án.',
    price: 'Từ 4,000,000 VNĐ',
    priceNumeric: 4000000,
    duration: '3-5 ngày làm việc',
    durationDays: 5,
    features: [
      'Độ chính xác 99.9999%',
      'Được công nhận bởi tòa án',
      'Báo cáo chi tiết',
      'Tư vấn miễn phí'
    ],
    isPopular: true,
    testTypes: [
      {
        id: 'paternity_standard',
        name: 'Xét nghiệm cha con tiêu chuẩn',
        description: 'Xét nghiệm xác định mối quan hệ cha con với độ chính xác cao.',
        price: '4,000,000 VNĐ',
        priceNumeric: 4000000,
        duration: '3-5 ngày làm việc',
        durationDays: 5,
        requirements: ['Mẫu ADN của cha', 'Mẫu ADN của con'],
        sampleTypes: ['Nước bọt', 'Tóc có chân tóc', 'Máu']
      },
      {
        id: 'maternity_test',
        name: 'Xét nghiệm mẹ con',
        description: 'Xét nghiệm xác định mối quan hệ mẹ con.',
        price: '4,500,000 VNĐ',
        priceNumeric: 4500000,
        duration: '3-5 ngày làm việc',
        durationDays: 5,
        requirements: ['Mẫu ADN của mẹ', 'Mẫu ADN của con'],
        sampleTypes: ['Nước bọt', 'Tóc có chân tóc', 'Máu']
      }
    ]
  },
  {
    id: 'service_002',
    name: 'Xét nghiệm ADN Dân sự',
    category: 'civil',
    description: 'Dịch vụ xét nghiệm ADN được công nhận bởi cơ quan pháp lý.',
    price: 'Từ 5,500,000 VNĐ',
    priceNumeric: 5500000,
    duration: '5-7 ngày làm việc',
    durationDays: 7,
    features: [
      'Công nhận pháp lý',
      'Phù hợp thủ tục hành chính',
      'Báo cáo chính thức',
      'Hỗ trợ pháp lý'
    ],
    isPopular: false,
    testTypes: [
      {
        id: 'immigration_dna',
        name: 'Xét nghiệm ADN cho di trú',
        description: 'Chứng minh mối quan hệ huyết thống cho mục đích di trú.',
        price: '6,500,000 VNĐ',
        priceNumeric: 6500000,
        duration: '5-7 ngày làm việc',
        durationDays: 7,
        requirements: ['Giấy tờ tùy thân', 'Mẫu ADN của các bên'],
        sampleTypes: ['Nước bọt', 'Máu']
      }
    ]
  },
  {
    id: 'service_003',
    name: 'Xét nghiệm ADN Riêng tư',
    category: 'private',
    description: 'Dịch vụ xét nghiệm ADN bảo mật, không yêu cầu cung cấp thông tin cá nhân.',
    price: 'Từ 3,500,000 VNĐ',
    priceNumeric: 3500000,
    duration: '3-5 ngày làm việc',
    durationDays: 5,
    features: [
      'Hoàn toàn bảo mật',
      'Không cần giấy tờ',
      'Thu mẫu tại nhà',
      'Kết quả riêng tư'
    ],
    isPopular: true,
    testTypes: [
      {
        id: 'anonymous_paternity',
        name: 'Xét nghiệm cha con ẩn danh',
        description: 'Xác định mối quan hệ cha con mà không cần cung cấp thông tin cá nhân.',
        price: '3,500,000 VNĐ',
        priceNumeric: 3500000,
        duration: '3-5 ngày làm việc',
        durationDays: 5,
        requirements: ['Mẫu ADN (không cần giấy tờ)'],
        sampleTypes: ['Nước bọt', 'Tóc', 'Móng tay']
      }
    ]
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'apt_001',
    userId: 'user_001',
    testId: 'TEST002',
    type: 'sample-collection',
    date: '2025-05-28',
    time: '09:00',
    status: 'confirmed',
    location: '123 Đường XYZ, Phường ABC, Quận 1, TP.HCM',
    staffMember: 'Y tá Nguyễn Thị M',
    notes: 'Thu mẫu tại nhà, chuẩn bị sẵn giấy tờ tùy thân',
    createdAt: '2025-05-20T11:30:00Z'
  },
  {
    id: 'apt_002',
    userId: 'user_002',
    type: 'consultation',
    date: '2025-05-30',
    time: '14:30',
    status: 'scheduled',
    location: 'DNA Testing Center - Chi nhánh HCM',
    staffMember: 'BS. Trần Văn N',
    notes: 'Tư vấn về xét nghiệm ADN gia đình',
    createdAt: '2025-05-25T15:45:00Z'
  },
  {
    id: 'apt_003',
    userId: 'user_003',
    testId: 'TEST004',
    type: 'sample-collection',
    date: '2025-05-28',
    time: '08:30',
    status: 'confirmed',
    location: 'DNA Testing Center - Chi nhánh HCM',
    staffMember: 'BS. Lê Thị O',
    notes: 'Xét nghiệm ADN trước sinh - khẩn cấp',
    createdAt: '2025-05-25T16:50:00Z'
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    userId: 'user_001',
    type: 'result-ready',
    title: 'Kết quả xét nghiệm đã sẵn sàng',
    message: 'Kết quả xét nghiệm TEST001 đã có. Vui lòng đăng nhập để xem chi tiết.',
    isRead: false,
    createdAt: '2025-05-15T16:45:00Z',
    actionUrl: '/my-tests/TEST001',
    priority: 'high'
  },
  {
    id: 'notif_002',
    userId: 'user_001',
    type: 'appointment',
    title: 'Nhắc nhở lịch hẹn',
    message: 'Bạn có lịch hẹn thu mẫu vào ngày 28/05/2025 lúc 09:00.',
    isRead: true,
    createdAt: '2025-05-27T08:00:00Z',
    actionUrl: '/appointments',
    priority: 'medium'
  },
  {
    id: 'notif_003',
    userId: 'user_001',
    type: 'promotion',
    title: 'Khuyến mãi tháng 5',
    message: 'Giảm 10% cho tất cả dịch vụ xét nghiệm ADN. Áp dụng đến 31/05/2025.',
    isRead: false,
    createdAt: '2025-05-01T09:00:00Z',
    actionUrl: '/services',
    priority: 'low'
  },
  {
    id: 'notif_004',
    userId: 'user_002',
    type: 'test-update',
    title: 'Cập nhật trạng thái xét nghiệm',
    message: 'Xét nghiệm TEST003 đã hoàn thành. Kết quả sẽ được gửi trong vòng 24h.',
    isRead: false,
    createdAt: '2025-05-12T17:00:00Z',
    actionUrl: '/my-tests/TEST003',
    priority: 'medium'
  }
];

// Mock Blog Posts
export const mockBlogs: Blog[] = [
  {
    id: 'blog_001',
    title: 'ADN là gì? Tìm hiểu cơ bản về xét nghiệm ADN',
    slug: 'adn-la-gi-tim-hieu-co-ban-ve-xet-nghiem-adn',
    excerpt: 'Tìm hiểu về ADN, cấu trúc, chức năng và ứng dụng trong xét nghiệm y khoa.',
    content: `# ADN là gì?

ADN (Acid deoxyribonucleic) là vật chất di truyền của tất cả sinh vật. ADN chứa đựng thông tin di truyền được truyền từ thế hệ này sang thế hệ khác.

## Cấu trúc của ADN

ADN có cấu trúc xoắn kép, bao gồm:
- Đường phosphate
- Đường deoxyribose  
- 4 loại base nitơ: A, T, G, C

## Ứng dụng trong xét nghiệm

Xét nghiệm ADN có thể:
- Xác định quan hệ huyết thống
- Chẩn đoán bệnh di truyền
- Xác định danh tính
- Phân tích tổ tiên

## Quy trình xét nghiệm ADN

1. Thu thập mẫu
2. Tách chiết ADN
3. Phân tích genetic markers
4. So sánh và đánh giá
5. Tạo báo cáo kết quả`,
    image: '/images/blog/dna-basics.svg',
    category: 'Kiến thức cơ bản',
    tags: ['ADN', 'Kiến thức', 'Xét nghiệm'],
    author: 'BS. Nguyễn Minh Khoa',
    publishedAt: '2025-05-01T10:00:00Z',
    readTime: 8,
    isPublished: true
  },
  {
    id: 'blog_002',
    title: 'Các phương pháp thu mẫu xét nghiệm ADN',
    slug: 'cac-phuong-phap-thu-mau-xet-nghiem-adn',
    excerpt: 'Hướng dẫn chi tiết về các phương pháp thu mẫu ADN phổ biến và hiệu quả.',
    content: `# Các phương pháp thu mẫu xét nghiệm ADN

Việc thu mẫu ADN là bước đầu tiên quan trọng trong quá trình xét nghiệm. Có nhiều phương pháp thu mẫu khác nhau.

## 1. Thu mẫu nước bọt

**Ưu điểm:**
- Đơn giản, không xâm lấn
- Có thể tự thực hiện tại nhà
- Độ tin cậy cao

**Quy trình:**
1. Súc miệng bằng nước sạch
2. Chờ 30 phút sau khi ăn/uống
3. Thu thập nước bọt vào ống
4. Bảo quản đúng cách

## 2. Thu mẫu từ má

**Đặc điểm:**
- Sử dụng que cotton swab
- Quét nhẹ bên trong má
- Phù hợp cho trẻ em

## 3. Thu mẫu máu

**Khi nào sử dụng:**
- Xét nghiệm pháp y
- Trường hợp đặc biệt
- Yêu cầu độ chính xác tuyệt đối

## Lưu ý quan trọng

- Tránh ô nhiễm mẫu
- Bảo quản đúng nhiệt độ
- Ghi nhãn rõ ràng
- Vận chuyển nhanh chóng`,
    image: '/images/blog/collection-methods.svg',
    category: 'Hướng dẫn',
    tags: ['Thu mẫu', 'Hướng dẫn', 'Quy trình'],
    author: 'Kỹ thuật viên Trần Thị Lan',
    publishedAt: '2025-05-10T14:30:00Z',
    readTime: 6,
    isPublished: true
  },
  {
    id: 'blog_003',
    title: 'Xét nghiệm ADN trong pháp luật Việt Nam',
    slug: 'xet-nghiem-adn-trong-phap-luat-viet-nam',
    excerpt: 'Tìm hiểu về khung pháp lý và quy định của Việt Nam về xét nghiệm ADN.',
    content: `# Xét nghiệm ADN trong pháp luật Việt Nam

Xét nghiệm ADN có vai trò quan trọng trong hệ thống pháp luật Việt Nam.

## Cơ sở pháp lý

**Các văn bản quy định:**
- Luật Hôn nhân và Gia đình 2014
- Bộ luật Dân sự 2015
- Thông tư 01/2016/TT-BYT

## Trường hợp bắt buộc xét nghiệm ADN

1. **Tranh chấp về quan hệ cha con:**
   - Yêu cầu của tòa án
   - Thỏa thuận các bên
   - Quyết định cơ quan có thẩm quyền

2. **Thủ tục hành chính:**
   - Khai sinh muộn
   - Xác định nguồn gốc
   - Di trú, định cư

## Quy trình thực hiện

**Bước 1:** Có quyết định/yêu cầu hợp pháp
**Bước 2:** Lựa chọn cơ sở xét nghiệm được cấp phép
**Bước 3:** Thu mẫu theo quy định
**Bước 4:** Thực hiện xét nghiệm
**Bước 5:** Cấp kết quả có giá trị pháp lý

## Giá trị pháp lý

Kết quả xét nghiệm ADN có:
- Giá trị chứng cứ trước pháp luật
- Hiệu lực toàn quốc
- Được công nhận quốc tế`,
    image: '/images/blog/legal-dna.svg',
    category: 'Pháp luật',
    tags: ['Pháp luật', 'Quy định', 'Thủ tục'],
    author: 'Luật sư Phạm Văn Đức',
    publishedAt: '2025-05-15T09:15:00Z',
    readTime: 10,
    isPublished: true
  }
];

// Mock FAQs
export const mockFAQs: FAQ[] = [
  {
    id: 'faq_001',
    question: 'Độ chính xác của xét nghiệm ADN là bao nhiêu?',
    answer: 'Xét nghiệm ADN có độ chính xác lên đến 99.9999% đối với các trường hợp xác định có quan hệ huyết thống và 100% đối với các trường hợp loại trừ quan hệ huyết thống.',
    category: 'Độ chính xác',
    order: 1,
    isPopular: true
  },
  {
    id: 'faq_002',
    question: 'Mất bao lâu để có kết quả xét nghiệm?',
    answer: 'Thời gian trả kết quả tùy thuộc vào loại xét nghiệm: Xét nghiệm cơ bản: 3-5 ngày làm việc, Xét nghiệm phức tạp: 7-12 ngày làm việc, Xét nghiệm khẩn cấp: 24-48 giờ (phụ thu thêm phí).',
    category: 'Thời gian',
    order: 2,
    isPopular: true
  },
  {
    id: 'faq_003',
    question: 'Có thể tự thu mẫu tại nhà không?',
    answer: 'Có, chúng tôi cung cấp kit thu mẫu tại nhà với hướng dẫn chi tiết. Tuy nhiên, đối với xét nghiệm pháp y hoặc có giá trị pháp lý, cần thu mẫu tại cơ sở y tế hoặc có sự giám sát của nhân viên y tế.',
    category: 'Thu mẫu',
    order: 3,
    isPopular: true
  },
  {
    id: 'faq_004',
    question: 'Chi phí xét nghiệm ADN là bao nhiêu?',
    answer: 'Chi phí xét nghiệm phụ thuộc vào loại dịch vụ: Xét nghiệm riêng tư: từ 3.500.000 VNĐ, Xét nghiệm huyết thống: từ 4.000.000 VNĐ, Xét nghiệm pháp y: từ 5.500.000 VNĐ. Giá đã bao gồm tất cả các chi phí liên quan.',
    category: 'Chi phí',
    order: 4,
    isPopular: true
  },
  {
    id: 'faq_005',
    question: 'Thông tin cá nhân có được bảo mật không?',
    answer: 'Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Mọi thông tin được mã hóa, lưu trữ an toàn và chỉ được truy cập bởi nhân viên có thẩm quyền. Đối với xét nghiệm riêng tư, khách hàng có thể hoàn toàn ẩn danh.',
    category: 'Bảo mật',
    order: 5,
    isPopular: false
  }
];

// Mock Testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial_001',
    name: 'Chị Nguyễn Thị Lan',
    role: 'Khách hàng',
    content: 'Dịch vụ xét nghiệm ADN tại đây rất chuyên nghiệp và nhanh chóng. Kết quả chính xác, nhân viên tư vấn tận tình. Tôi rất hài lòng với dịch vụ.',
    rating: 5,
    image: '/images/testimonials/customer-1.jpg',
    testType: 'Xét nghiệm cha con',
    isVerified: true,
    createdAt: '2025-05-10T14:20:00Z'
  },
  {
    id: 'testimonial_002',
    name: 'Anh Trần Văn Minh',
    role: 'Khách hàng',
    content: 'Quy trình thu mẫu tại nhà rất tiện lợi, không mất thời gian di chuyển. Kết quả được trả đúng hẹn và báo cáo rất chi tiết.',
    rating: 5,
    image: '/images/testimonials/customer-2.jpg',
    testType: 'Xét nghiệm riêng tư',
    isVerified: true,
    createdAt: '2025-05-08T16:30:00Z'
  },
  {
    id: 'testimonial_003',
    name: 'Chị Lê Thị Hoa',
    role: 'Khách hàng',
    content: 'Tôi lo lắng về độ chính xác nhưng sau khi nhận kết quả và được tư vấn kỹ, tôi hoàn toàn tin tưởng. Dịch vụ đáng tin cậy.',
    rating: 4,
    testType: 'Xét nghiệm anh chị em',
    isVerified: true,
    createdAt: '2025-05-05T11:45:00Z'
  },
  {
    id: 'testimonial_004',
    name: 'Anh Phạm Đức An',
    role: 'Khách hàng',
    content: 'Chi phí hợp lý so với chất lượng dịch vụ. Nhân viên chuyên nghiệp, giải thích rõ ràng về quy trình và kết quả.',
    rating: 5,
    testType: 'Xét nghiệm pháp y',
    isVerified: true,
    createdAt: '2025-05-02T09:15:00Z'
  }
];

// Export all mock data
export const mockData = {
  users: mockUsers,
  dnaTests: mockDNATests,
  services: mockServices,
  appointments: mockAppointments,
  notifications: mockNotifications,
  blogs: mockBlogs,
  faqs: mockFAQs,
  testimonials: mockTestimonials
};

// Utility functions to get data
export const getMockUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getMockTestsByUserId = (userId: string): DNATest[] => {
  return mockDNATests.filter(test => test.userId === userId);
};

export const getMockTestById = (id: string): DNATest | undefined => {
  return mockDNATests.find(test => test.id === id);
};

export const getMockNotificationsByUserId = (userId: string): Notification[] => {
  return mockNotifications.filter(notif => notif.userId === userId);
};

export const getMockAppointmentsByUserId = (userId: string): Appointment[] => {
  return mockAppointments.filter(apt => apt.userId === userId);
};

// Statistics data
export const mockStats = {
  totalTests: mockDNATests.length,
  completedTests: mockDNATests.filter(test => test.status === 'completed').length,
  processingTests: mockDNATests.filter(test => test.status === 'processing').length,
  pendingTests: mockDNATests.filter(test => test.status === 'pending').length,
  totalRevenue: mockDNATests.reduce((sum, test) => sum + test.amountNumeric, 0),
  averageRating: mockTestimonials.reduce((sum, t) => sum + t.rating, 0) / mockTestimonials.length,
  totalUsers: mockUsers.length,
  totalServices: mockServices.length
};
