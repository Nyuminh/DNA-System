"use client";
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

interface Booking {
  id: string;
  bookingId: string;
  serviceId: string;      // thêm dòng này để lưu serviceId
  serviceName: string;    // tên dịch vụ sẽ lấy từ API Services
  staffName: string;      // nếu cần hiện tên nhân viên
  date: string;
  status: string;
  address: string;
  method: string;
}

interface Service {
  id: string;
  name: string;
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
        // Lấy token từ localStorage và decode lấy UserID
        let userIdFromToken = '';
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const decoded: any = jwtDecode(token);
            console.log('Decoded token:', decoded); // <-- Xem toàn bộ payload token
            userIdFromToken =
              decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
              decoded.UserID ||
              decoded.userId ||
              decoded.sub ||
              decoded.id ||
              decoded.user_id ||
              '';
            console.log('UserID lấy từ token:', userIdFromToken); // <-- Xem giá trị thực tế
          }
        } catch (e) {
          console.log('Không thể decode token:', e);
        }

        // Lấy danh sách dịch vụ từ API
        const serviceRes = await axios.get('http://localhost:5198/api/Services');
        let serviceData: any[] = [];
        if (serviceRes.data && typeof serviceRes.data === 'object' && '$values' in serviceRes.data && Array.isArray(serviceRes.data.$values)) {
          serviceData = serviceRes.data.$values;
        } else if (Array.isArray(serviceRes.data)) {
          serviceData = serviceRes.data;
        } else if (serviceRes.data && typeof serviceRes.data === 'object') {
          serviceData = [serviceRes.data];
        }

        // Map lại dữ liệu service theo form bạn muốn
        const formattedServices = serviceData.map((s: any) => ({
          id: s.id || s.serviceID || s.serviceId || '', // thêm các trường có thể có
          name: s.name || '',
          // các trường khác...
        }));

        setServices(formattedServices);

        // Lấy danh sách nhân viên
        const userRes = await axios.get('http://localhost:5198/api/User');
        let userData: any[] = [];
        if (userRes.data && typeof userRes.data === 'object' && '$values' in userRes.data && Array.isArray(userRes.data.$values)) {
          userData = userRes.data.$values;
        } else if (Array.isArray(userRes.data)) {
          userData = userRes.data;
        } else if (userRes.data && typeof userRes.data === 'object') {
          userData = [userRes.data];
        }
        // Map lại dữ liệu user
        const formattedUsers = userData.map((u: any) => ({
          id: u.id || u.userID || u.userId || '',
          name: u.fullname || u.name || '', // Ưu tiên fullName
        }));

        // Lấy danh sách booking từ API
        const bookingRes = await axios.get('http://localhost:5198/api/Appointments', {
          headers: { 'Content-Type': 'application/json' },
        });
        let data = bookingRes.data;
        let bookingsArray: any[] = [];
        if (data && typeof data === 'object' && '$values' in data && Array.isArray(data.$values)) {
          bookingsArray = data.$values;
        } else if (Array.isArray(data)) {
          bookingsArray = data;
        } else if (data && typeof data === 'object') {
          bookingsArray = [data];
        }

        console.log(bookingsArray);

        // Lọc booking theo UserID từ token
        const bookingsData: Booking[] = bookingsArray.filter((item: any) => {
          const customerId = item.customerId || item.CustomerID || item.customerID || '';
          console.log('So sánh customerId:', customerId, 'userIdFromToken:', userIdFromToken, '==>', String(customerId).trim() === String(userIdFromToken).trim());
          return userIdFromToken && String(customerId).trim() === String(userIdFromToken).trim();
        }).map((item: any) => {
          // Gán serviceName cho từng booking dựa vào serviceId
          const serviceId =
            item.serviceId ??
            item.ServiceID ??   // <-- Dòng này sẽ lấy đúng với dữ liệu của bạn
            item.service_id ??
            item.ServiceId ??
            '';

          const service = formattedServices.find(
            (s: any) => String(s.id).trim() === String(serviceId).trim()
          );

          const staffId =
            item.staffId ??
            item.staffID ??
            item.staff_id ??
            item.StaffId ??
            '';

          // Lấy fullName từ formattedUsers
          const staff = formattedUsers.find(
            (u: any) => String(u.id).trim() === String(staffId).trim()
          );

          return {
            id: item.id || '',
            bookingId: item.bookingId || item.bookingID || '', // phòng trường hợp trả về bookingID
            serviceId: String(serviceId),
            serviceName: service ? service.name : '',
            staffName: staff?.name || '', // name đã là fullName hoặc name
            date: item.date ? item.date.slice(0, 10) : '',
            status: item.status || 'Chờ xác nhận',
            address: item.address || '',
            method: item.method || '',
          };
        });

        setBookings(bookingsData);
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
                  <div className="col-span-1 font-semibold text-blue-700 break-words">{booking.bookingId}</div>
                  <div className="col-span-2 text-gray-900 break-words">
                    {
                      services.find(
                        s => String(s.id).trim() === String(booking.serviceId).trim()
                      )?.name || <span className="italic text-gray-400">---</span>
                    }
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
                    <span className={`inline-block px-2 py-1 rounded-full font-semibold ${
                      booking.status === 'Đã xác nhận'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
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

async function getStaffNameById(staffId: string): Promise<string | null> {
  try {
    const res = await fetch('http://localhost:5198/api/User');
    let users = await res.json();
    if (!Array.isArray(users)) {
      if (users.$values && Array.isArray(users.$values)) {
        users = users.$values;
      } else {
        return null;
      }
    }
    // Resolve $ref nếu có
    const idMap: Record<string, any> = {};
    users.forEach((u: any) => { if (u.$id) idMap[u.$id] = u; });
    users = users.map((u: any) => (u.$ref ? idMap[u.$ref] : u));

    // Tìm user theo staffId (có thể là userID, id, userId)
    const found = users.find((u: any) =>
      String(u.userID || u.id || u.userId).trim() === String(staffId).trim()
    );
    // Trả về tên nhân viên (ưu tiên fullName, name, username)
    return found?.fullName || found?.name || found?.username || found?.userName || null;
  } catch (e) {
    return null;
  }
}
