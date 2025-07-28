// // Export all from individual modules
// export * from './auth';
// export * from './users';
// export * from './services';
// export * from './bookings';
// export * from './appointments';
// // Export from admin with explicit exports to resolve conflicts
// export { 
//   getAdminDashboardStats,
//   getAdminReports,
//   getAllUsers as getAllAdminUsers,
//   adminProfileAPI,
//   updateUserById
// } from './admin';

// // Export từ staff riêng biệt để tránh xung đột với appointments
// export { kitApi } from './staff';
// export { 
//   createTestResult,
//   createTestResultV2,
//   getTestResultsByBookingId,
//   updateAppointmentStatusSafe,
//   getRelativesByBookingId
// } from './staff';

// // Export types từ staff
// export type { 
//   Kit,
//   SimpleKit,
//   CreateKitRequest,
//   KitApiResponse,
//   TestResult,
//   Relative
// } from './staff';

// // Export the API client
// export { default as apiClient } from './client';
