"use client";
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { deleteBooking, updateBooking } from "@/lib/api/bookings";
import { updateKitById } from "@/lib/api/kit";

interface Booking {
  id: string;
  bookingId: string;
  serviceId: string;
  serviceName: string;
  staffName: string;
  staffId?: string; 
  date: string;
  time: string;     
  status: string;
  address: string;
  method: string;
}

interface Service {
  id: string;
  name: string;
}

interface KitInfo {
  status: string;
  kitId?: string;
}

export default function MyBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kitStatuses, setKitStatuses] = useState<Record<string, string>>({});
  const [bookingResData, setBookingResData] = useState<any[]>([]); 
  const [kitInfo, setKitInfo] = useState<Record<string, KitInfo>>({});

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
            bookingId: item.bookingId || item.bookingID || '',
            serviceId: String(serviceId),
            serviceName: service ? service.name : '',
            staffName: staff?.name || '',
            
            // Tách riêng ngày và giờ từ trường date
            date: item.date ? item.date.split('T')[0] : '',
            time: item.date && item.date.includes('T') ? 
              item.date.split('T')[1].substring(0, 5) : // Lấy phần giờ:phút
              item.time || '',
              
            status: item.status || 'Chờ xác nhận',
            address: item.address || '',
            method: item.method || '',
          };
        });

        // Sau khi map bookingsData, sort theo bookingId giảm dần (mới nhất lên đầu)
        bookingsData.sort((a, b) => {
          // Nếu bookingId là số, sort số; nếu là chuỗi, sort chuỗi
          const idA = Number(a.bookingId) || a.bookingId;
          const idB = Number(b.bookingId) || b.bookingId;
          if (idA < idB) return 1;
          if (idA > idB) return -1;
          return 0;
        });

        setBookings(bookingsData);
        setBookingResData(bookingsArray); // <-- Lưu dữ liệu gốc vào state
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu đặt lịch');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchKitStatuses() {
      const statuses: Record<string, string> = {};
      const kitInfoMap: Record<string, { status: string; kitId?: string }> = {};
      await Promise.all(
        bookings.map(async (booking) => {
          try {
            const res = await fetch(`http://localhost:5198/api/Kit/by-booking/${booking.bookingId}`);
            const data = await res.json();
            statuses[booking.bookingId] = data?.status || data?.kitStatus || "---";
            kitInfoMap[booking.bookingId] = {
              status: data?.status || data?.kitStatus || "---",
              kitId: data?.kitId || data?.kitID || data?.KitId || undefined,
            };
          } catch {
            statuses[booking.bookingId] = "---";
            kitInfoMap[booking.bookingId] = { status: "---" };
          }
        })
      );
      setKitStatuses(statuses);
      setKitInfo(kitInfoMap);
    }
    if (bookings.length > 0) fetchKitStatuses();
  }, [bookings]);

  // Add this function inside the MyBookingPage component
  async function handleCancelBooking(bookingId: string) {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch xét nghiệm này không?')) {
      return;
    }
    
    try {
      const result = await deleteBooking(bookingId);
      
      if (result.success) {
        // Update local state to reflect cancellation
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.bookingId === bookingId 
              ? { ...booking, status: 'Hủy' } 
              : booking
          )
        );
        alert('Đã hủy đặt lịch thành công.');
      } else {
        alert(result.message || 'Không thể hủy đặt lịch. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Có lỗi xảy ra khi hủy đặt lịch. Vui lòng thử lại sau.');
    }
  }

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
              {/* Header */}
              <div className="grid grid-cols-12 px-2 py-3 bg-gray-50 font-semibold text-gray-500 uppercase gap-x-1 border-b border-gray-200">
                <div className="col-span-1 text-center">MÃ ĐẶT</div>
                <div className="col-span-2">TÊN DỊCH VỤ</div>
                <div className="col-span-2">NHÂN VIÊN</div>
                <div className="col-span-2">ĐỊA CHỈ</div>
                <div className="col-span-1 text-center">NGÀY ĐẶT</div>
                <div className="col-span-1">PHƯƠNG THỨC</div>
                <div className="col-span-1 text-center">TRẠNG THÁI</div>
                <div className="col-span-1 text-center">TRẠNG THÁI KIT</div>
                <div className="col-span-1 text-center">THAO TÁC</div>
              </div>
              {/* Body */}
              {bookings.map((booking, idx) => (
                <div
                  key={booking.id ? `booking-form-${booking.id}` : `booking-form-${idx}`}
                  className="grid grid-cols-12 px-2 py-4 items-center gap-x-1 border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="col-span-1 font-semibold text-blue-700 text-center break-words">{booking.bookingId}</div>
                  <div className="col-span-2 text-gray-900 break-words">
                    {services.find(s => String(s.id).trim() === String(booking.serviceId).trim())?.name || <span className="italic text-gray-400">---</span>}
                  </div>
                  <div className="col-span-2 text-gray-900 break-words">
                    {booking.staffName || <span className="italic text-gray-400">---</span>}
                  </div>
                  <div className="col-span-2 text-gray-900 break-words">{booking.address || <span className="italic text-gray-400">---</span>}</div>
                  <div className="col-span-1 text-center">
                    <div className="text-gray-900">
                      {booking.date || <span className="italic text-gray-400">---</span>}
                      {booking.time && (
                        <div className="mt-1 text-xs text-blue-600 font-medium">
                          {booking.time}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium w-full text-center">
                      {booking.method || <span className="italic text-gray-400">---</span>}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full font-medium text-center w-full ${
                        booking.status === 'Hoàn thành'
                          ? 'bg-green-100 text-green-800'
                        : booking.status === 'Đang thực hiện'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'Hủy'
                          ? 'bg-red-100 text-red-700'
                          : booking.status === 'Đã check-in'
                          ? 'bg-green-100 text-green-800 border border-green-400'
                          : booking.status === 'Đang chờ check-in'
                          ? 'bg-blue-100 text-blue-800 border border-blue-400'
                          : (booking.status === 'Đã xác nhận' || booking.status === 'Đang chờ mẫu')
                          ? 'bg-yellow-300 text-yellow-900 border border-yellow-400'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      style={{ letterSpacing: 1 }}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full font-medium text-center w-full ${
                        // XANH LÁ - Các trạng thái hoàn thành
                        ['Đã nhận', 'Đã vận chuyển', 'Đã lấy mẫu', 'Đã tới kho'].includes(kitStatuses[booking.bookingId])
                          ? 'bg-green-100 text-green-800'
                        // XANH DƯƠNG - Các trạng thái đang tiến hành
                        : ['Đang giao', 'Đang vận chuyển', 'Đang vận chuyển mẫu', 'Đang xử lý', 'Đang lấy mẫu', 'Đang chờ mẫu', 'Đang tới kho'].includes(kitStatuses[booking.bookingId])
                          ? 'bg-blue-100 text-blue-800'
                        // VÀNG - Các trạng thái chờ xác nhận, chờ mẫu
                        : ['Chờ xác nhận', 'Đã xác nhận', 'Đang chờ mẫu'].includes(kitStatuses[booking.bookingId])
                          ? 'bg-yellow-300 text-yellow-900 border border-yellow-400'
                        // ĐỎ - Các trạng thái có vấn đề
                        : ['Chưa nhận', 'Bị từ chối', 'Lỗi mẫu', 'Thất lạc', 'Hủy'].includes(kitStatuses[booking.bookingId])
                          ? 'bg-red-100 text-red-800'
                        // XÁM - Mặc định cho các trạng thái khác
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      style={{ letterSpacing: 1 }}
                    >
                      {kitStatuses[booking.bookingId] || <span className="italic text-gray-400">---</span>}
                    </span>
                  </div>
                  <div className="col-span-1 flex flex-col space-y-2 justify-center items-center">
                    {/* Nút Đã nhận Kit chỉ hiện khi tự thu mẫu và kit đang trên đường giao */}
                    {booking.method === 'Tự thu mẫu' &&
                      kitInfo[booking.bookingId]?.status === 'Đang giao' &&
                      kitInfo[booking.bookingId]?.kitId &&
                      booking.status !== 'Hủy' &&
                      booking.status !== 'Đã check-in' && (
                        <button
                          onClick={async () => {
                            try {
                              await updateKitById(kitInfo[booking.bookingId]?.kitId as string, { status: 'Đã nhận' });
                              setKitStatuses(prev => ({
                                ...prev,
                                [booking.bookingId]: 'Đã nhận'
                              }));
                              setKitInfo(prev => ({
                                ...prev,
                                [booking.bookingId]: {
                                  ...prev[booking.bookingId],
                                  status: 'Đã nhận'
                                }
                              }));
                              alert('Bạn đã nhận kit!');
                            } catch (e) {
                              alert('Có lỗi khi cập nhật trạng thái kit!');
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-xs inline-block text-center w-full mb-1"
                        >
                          Đã nhận Kit
                        </button>
                      )}
                    {/* Nút Gửi tới kho chỉ hiện khi đã nhận kit, và ẩn hoàn toàn các nút khác */}
                    {booking.method === 'Tự thu mẫu' &&
                      kitInfo[booking.bookingId]?.status === 'Đã nhận' &&
                      kitInfo[booking.bookingId]?.kitId &&
                      booking.status !== 'Hủy' &&
                      booking.status !== 'Đã check-in' && (
                        <button
                          onClick={async () => {
                            try {
                              await updateKitById(kitInfo[booking.bookingId]?.kitId as string, { status: 'Đang tới kho' });
                              setKitStatuses(prev => ({
                                ...prev,
                                [booking.bookingId]: 'Đang tới kho'
                              }));
                              setKitInfo(prev => ({
                                ...prev,
                                [booking.bookingId]: {
                                  ...prev[booking.bookingId],
                                  status: 'Đang tới kho'
                                }
                              }));
                              alert('Đã gửi tới kho!');
                            } catch (e) {
                              alert('Có lỗi khi cập nhật trạng thái kit!');
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold w-full text-center transition shadow"
                          style={{ letterSpacing: 1 }}
                        >
                          Gửi tới kho
                        </button>
                      )}
                    {/* Các nút khác */}
                    {!(booking.method === 'Tự thu mẫu' && kitInfo[booking.bookingId]?.status === 'Đã nhận' && kitInfo[booking.bookingId]?.kitId && booking.status !== 'Hủy' && booking.status !== 'Đã check-in') && (
                      <>
                        {booking.method === 'Tại cơ sở y tế' &&
                          booking.status == 'Đang chờ check-in' && (
                            <button
                              onClick={async () => {
                                if (confirm('Bạn xác nhận đã đến cơ sở để lấy mẫu?')) {
                                  try {
                                    const bookingOrigin = bookingResData.find(
                                      (b: any) =>
                                        String(b.bookingId || b.bookingID) === String(booking.bookingId)
                                    );
                                    const staffId = bookingOrigin?.staffId ||
                                      bookingOrigin?.staffID ||
                                      bookingOrigin?.staff_id ||
                                      bookingOrigin?.StaffId ||
                                      "";

                                    // Lấy date gồm cả ngày và giờ (nếu có)
                                    let date = booking.date;
                                    if (booking.time) {
                                      date = booking.date.includes('T')
                                        ? booking.date
                                        : `${booking.date}T${booking.time}:00`;
                                    }

                                    const payload = {
                                      date,
                                      staffId,
                                      serviceId: booking.serviceId,
                                      address: booking.address,
                                      method: booking.method,
                                      status: "Đã check-in"
                                    };
                                    console.log("Dữ liệu gửi lên API khi check-in:", payload);
                                    const result = await updateBooking(booking.bookingId, payload);
                                    if (result.success) {
                                      setBookings(prev =>
                                        prev.map(b =>
                                          b.bookingId === booking.bookingId
                                            ? { ...b, status: "Đã check-in" }
                                            : b
                                        )
                                      );
                                      alert('Check-in thành công!');
                                    } else {
                                      alert(result.message || 'Có lỗi khi check-in, vui lòng thử lại!');
                                    }
                                  } catch (e) {
                                    alert('Có lỗi khi check-in, vui lòng thử lại!');
                                  }
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-xs inline-block text-center w-full mb-1"
                            >
                              Check-in
                            </button>
                          )}
                        {booking.status === 'Hoàn thành' ? (
                          <Link
                            href={`/my-booking/result/${booking.bookingId}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs inline-block text-center w-full"
                          >
                            Xem kết quả
                          </Link>
                        ) : (
                          // Ẩn nút hủy nếu trạng thái kit đã là các trạng thái sau khi nhận
                          !['Đã nhận', 'Đang tới kho', 'Đã tới kho', 'Đã lấy mẫu', 'Đã vận chuyển'].includes(kitStatuses[booking.bookingId]) &&
                          booking.status !== 'Hủy' &&
                          booking.status !== 'Đã check-in' ? (
                            <button
                              onClick={() => handleCancelBooking(booking.bookingId)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs inline-block text-center w-full"
                              disabled={booking.status === 'Hoàn thành'}
                            >
                              Hủy đặt lịch
                            </button>
                          ) : (
                            <span className="text-gray-400 italic">---</span>
                          )
                        )}
                      </>
                    )}
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
    // // Resolve $ref nếu có
    // const idMap: Record<string, any> = {};
    // users.forEach((u: any) => { if (u.$id) idMap[u.$id] = u; });
    // users = users.map((u: any) => (u.$ref ? idMap[u.$ref] : u));

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