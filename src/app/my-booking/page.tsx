'use client';

import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Booking {
  id: string;
  bookingId: string;
  serviceId: string;
  serviceName: string;
  staffName: string;
  date: string;
  status: string;
  address: string;
  method: string;
}

interface Service {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

// ✅ Hàm xử lý $ref/$id
function resolveRefs<T extends { $id?: string; $ref?: string }>(data: T[]): T[] {
  const idMap = new Map<string, T>();
  for (const item of data) {
    if (item.$id) idMap.set(item.$id, item);
  }
  // Resolve nhiều lớp cho toàn bộ mảng
  const resolve = (item: T, visited = new Set<string>()): T => {
    while (item?.$ref && idMap.has(item.$ref) && !visited.has(item.$ref)) {
      visited.add(item.$ref);
      item = idMap.get(item.$ref)!;
    }
    // Nếu resolve ra object vẫn còn $ref, tiếp tục resolve
    if (item?.$ref && idMap.has(item.$ref)) {
      return resolve(item, visited);
    }
    return item;
  };
  return data.map((item) => resolve(item));
}

export default function MyBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 👉 Fetch services
        const serviceRes = await axios.get('http://localhost:5198/api/Services');
        let serviceData = serviceRes.data?.$values ?? serviceRes.data ?? [];
        if (!Array.isArray(serviceData)) serviceData = [serviceData];
        serviceData = serviceData.filter((s: any) => s && (s.id || s.serviceID || s.serviceId));
        const formattedServices = serviceData.map((s: any) => ({
          id: s.id || s.serviceID || s.serviceId || '',
          name: s.name || '',
        }));
        setServices(formattedServices);

        // 👉 Fetch and resolve users
        const userRes = await axios.get('http://localhost:5198/api/User');
        let rawUserData = userRes.data?.$values ?? userRes.data ?? [];
        if (!Array.isArray(rawUserData)) rawUserData = [rawUserData];

        // LUÔN resolveRefs trước
        const resolvedUserData = resolveRefs(rawUserData);

        // Log để kiểm tra
        console.log('User đã resolve:', resolvedUserData);

        // Sau đó mới filter nếu cần
        const validUsers = resolvedUserData.filter(
          (u: any) => u && (u.id || u.userID || u.userId)
        );

        // 👉 Lọc nhân viên (roleID = R02)
        const allStaff = validUsers
          .filter((u: any) => (u.roleID || u.roleId || u.RoleID) === 'R02')
          .map((u: any) => ({
            id: u.userID || u.userId || u.id || '',
            name: u.fullName || u.fullname || u.name || u.username || u.userName || '',
          }))
          .filter((u: any) => u.id);

        // 👉 Fetch bookings
        const bookingRes = await axios.get('http://localhost:5198/api/Appointments');
        let bookingData = bookingRes.data?.$values ?? bookingRes.data ?? [];
        if (!Array.isArray(bookingData)) bookingData = [bookingData];
        bookingData = bookingData.filter(Boolean);

        const bookingsList: Booking[] = bookingData.map((item: any) => {
          const serviceId =
            item?.serviceId || item?.ServiceID || item?.service_id || item?.ServiceId || '';
          const staffId =
            item?.staffId || item?.staffID || item?.staff_id || item?.StaffId || '';

          const service = formattedServices.find(
            (s: Service) => String(s?.id).trim() === String(serviceId).trim()
          );
          const staff = allStaff.find(
            (u) => String(u.id).trim() === String(staffId).trim()
          );

          return {
            id: item?.id || '',
            bookingId: item?.bookingId || item?.bookingID || '',
            serviceId: String(serviceId),
            serviceName: service?.name || '',
            staffName: staff?.name || '',
            date: item?.date ? item.date.slice(0, 10) : '',
            status: item?.status || 'Chờ xác nhận',
            address: item?.address || '',
            method: item?.method || '',
          };
        });

        setBookings(bookingsList);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu đặt lịch');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Lịch đặt xét nghiệm của tôi
          </h1>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Bạn chưa có lịch đặt nào.</div>
          ) : (
            <div className="bg-white rounded-xl shadow border border-gray-200 w-full text-xs">
              <div className="grid grid-cols-11 px-2 py-3 bg-gray-50 font-semibold text-gray-500 uppercase gap-x-1">
                <div className="col-span-1">MÃ ĐẶT</div>
                <div className="col-span-2">TÊN DỊCH VỤ</div>
                <div className="col-span-2">NHÂN VIÊN</div>
                <div className="col-span-2">ĐỊA CHỈ</div>
                <div className="col-span-1">NGÀY HẸN</div>
                <div className="col-span-2">PHƯƠNG THỨC</div>
                <div className="col-span-1">TRẠNG THÁI</div>
              </div>
              {bookings.map((booking, idx) => (
                <div
                  key={booking.id ? `booking-form-${booking.id}` : `booking-form-${idx}`}
                  className="grid grid-cols-11 px-2 py-4 border-t border-gray-100 items-center hover:bg-gray-50 transition gap-x-1"
                >
                  <div className="col-span-1 font-semibold text-blue-700 break-words">
                    {booking.bookingId}
                  </div>
                  <div className="col-span-2 text-gray-900 break-words">
                    {booking.serviceName || <span className="italic text-gray-400">---</span>}
                  </div>
                  <div className="col-span-2 text-gray-900 break-words">
                    {booking.staffName || <span className="italic text-gray-400">---</span>}
                  </div>
                  <div className="col-span-2 text-gray-900 break-words">{booking.address}</div>
                  <div className="col-span-1 text-gray-900">{booking.date}</div>
                  <div className="col-span-2">
                    <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {booking.method}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full font-semibold ${
                        booking.status === 'Đã xác nhận'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              Đặt lịch mới
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
