"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DocumentTextIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { getServices } from "@/lib/api/services";

interface ResultDetail {
  resultId: string;
  staffId: string;
  serviceId: string;
  bookingId: string;
  date: string;
  status: string;
  [key: string]: any;
}

export default function ResultDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [result, setResult] = useState<ResultDetail | null>(null);
  const [kitStatus, setKitStatus] = useState<string>("---");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [staffName, setStaffName] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");

  useEffect(() => {
    async function fetchResultAndKit() {
      setLoading(true);
      try {
        // Lấy kết quả xét nghiệm
        const res = await fetch(`http://localhost:5198/api/Results/by-booking/${bookingId}`);
        if (!res.ok) throw new Error("Không tìm thấy kết quả!");
        const data = await res.json();
        setResult(data);

        // Lấy trạng thái kit
        const kitRes = await fetch(`http://localhost:5198/api/Kit/by-booking/${bookingId}`);
        const kitData = await kitRes.json();
        setKitStatus(kitData?.status || kitData?.kitStatus || "---");
      } catch (e: any) {
        setError(e.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) fetchResultAndKit();
  }, [bookingId]);

  useEffect(() => {
    if (result?.staffId) {
      getStaffNameById(result.staffId).then((name) => {
        setStaffName(name || result.staffId);
      });
    }
  }, [result?.staffId]);

  useEffect(() => {
    if (result?.serviceId) {
      getServiceNameById(result.serviceId).then((name) => setServiceName(name || result.serviceId));
    }
  }, [result?.serviceId]);

  function getKitStatusColor(status: string) {
    switch (status) {
      case "Đã nhận":
        return "bg-emerald-100 text-emerald-700";
      case "Đang giao":
        return "bg-yellow-200 text-yellow-900";
      case "Chưa nhận":
        return "bg-gray-200 text-gray-700";
      case "Đang vận chuyển":
        return "bg-blue-200 text-blue-900";
      case "Đã vận chuyển":
        return "bg-indigo-200 text-indigo-900";
      case "Đang vận chuyển mẫu":
        return "bg-orange-200 text-orange-900";
      case "Đã lấy mẫu":
        return "bg-teal-200 text-teal-900";
      case "Đã tới kho":
        return "bg-purple-200 text-purple-900";
      default:
        return "bg-gray-50 text-gray-400";
    }
  }

  async function getStaffNameById(staffId: string): Promise<string | null> {
    try {
      const res = await fetch("http://localhost:5198/api/User");
      let users = await res.json();
      if (!Array.isArray(users)) {
        users = users?.$values || [];
      }
      const found = users.find(
        (u: any) => String(u.userID || u.id || u.userId).trim() === String(staffId).trim()
      );
      // Trả về tên nhân viên (ưu tiên fullName, name, username)
      return found?.fullname || found?.fullName || found?.name || found?.username || found?.userName || null;
    } catch (e) {
      return null;
    }
  }

 async function getServiceNameById(serviceId: string): Promise<string | null> {
  try {
    const res = await fetch("http://localhost:5198/api/Services");
    let services = await res.json();
    if (!Array.isArray(services)) {
      services = services?.$values || [];
    }
    const found = services.find(
      (s: any) => String(s.id || s.serviceId).trim() === String(serviceId).trim()
    );
    // Trả về tên dịch vụ hoặc serviceId nếu không tìm thấy
    return found?.name || found?.serviceName || serviceId;
  } catch (e) {
    return serviceId;
  }
}

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-8">
        <DocumentTextIcon className="h-10 w-10 text-blue-600 mr-3" />
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Kết quả xét nghiệm</h1>
          <p className="text-gray-500 text-sm">
            Chi tiết kết quả theo mã đặt:{" "}
            <span className="font-semibold text-blue-600">{bookingId}</span>
          </p>
        </div>
      </div>
      <Link href="/my-booking" className="text-blue-500 hover:underline text-sm mb-6 inline-block">
        ← Quay lại danh sách đặt lịch
      </Link>
      {loading ? (
        <div className="text-gray-500 py-12 text-center text-lg">Đang tải...</div>
      ) : error ? (
        <div className="text-red-500 py-12 text-center text-lg">{error}</div>
      ) : result ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mb-8">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Mã kết quả</td>
                <td className="py-2 font-semibold text-blue-700">{result.resultId}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Mã booking</td>
                <td className="py-2">{result.bookingId}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Tên dịch vụ</td>
                <td className="py-2">{serviceName}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Tên nhân viên</td>
                <td className="py-2">{staffName}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Ngày</td>
                <td className="py-2">{result.date}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Trạng thái</td>
                <td className="py-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                    {result.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Trạng thái Kit</td>
                <td className="py-2">
                  <span
                    className={`inline-block px-2 py-[2px] rounded-full font-bold uppercase text-[11px] ${getKitStatusColor(
                      kitStatus
                    )}`}
                  >
                    {kitStatus}
                  </span>
                </td>
              </tr>
              {/* Hiển thị thêm các trường khác nếu có */}
              {Object.entries(result).map(([key, value]) =>
                ![
                  "resultId",
                  "bookingId",
                  "serviceId", // Đã bỏ mã dịch vụ
                  "staffId",
                  "date",
                  "status",
                  "booking",
                  "service",
                  "staff",
                  "customerId",
                  "customer"
                ].includes(key) && value !== null && value !== undefined ? (
                  <tr key={key}>
                    <td className="py-2 pr-4 font-medium text-gray-500 capitalize">
                      {key === "description" ? "Mô tả" : key}
                    </td>
                    <td className="py-2">{String(value)}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 py-12 text-center text-lg">Không có dữ liệu kết quả.</div>
      )}
    </div>
  );
}