// Database models and TypeScript types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestBooking {
  id: string;
  userId: string;
  testType: string;
  serviceType: 'standard' | 'expedited';
  collectionMethod: 'self' | 'facility' | 'home';
  status: 'pending' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  appointmentDate?: Date;
  appointmentTime?: string;
  address?: string;
  cityProvince?: string;
  participants: Participant[];
  contactInfo: ContactInfo;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant {
  id: string;
  bookingId: string;
  role: string;
  name: string;
  dob: Date;
  gender: 'male' | 'female';
  relationship?: string;
  sampleType: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface TestResult {
  id: string;
  bookingId: string;
  userId: string;
  resultData: Record<string, unknown>;
  conclusion: string;
  completedAt: Date;
  downloadUrl?: string;
}
