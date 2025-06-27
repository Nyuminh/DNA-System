"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DocumentTextIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface ResultDetail {
  resultId: string;
  staffId: string;
  serviceId: string;
  bookingId: string;
  date: string;
  status: string;
  [key: string]: any;
}

function getStatusColor(status: string) {
  switch (status) {
    case "Đã hoàn thành":
      return "bg-green-100 text-green-800";
    case "Đang xử lý":
      return "bg-yellow-100 text-yellow-800";
    case "Chờ thu mẫu":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function ResultDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5198/api/Results/by-booking/${bookingId}`);
        if (!res.ok) throw new Error("Không tìm thấy kết quả!");
        const data = await res.json();
        setResult(data);
      } catch (e: any) {
        setError(e.message || "Lỗi khi tải kết quả");
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) fetchResult();
  }, [bookingId]);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded shadow p-8">
      <div className="flex items-center mb-6">
        <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-blue-700">Chi tiết kết quả xét nghiệm</h1>
      </div>
      <Link href="/my-booking" className="text-blue-500 hover:underline text-sm mb-6 inline-block">
        ← Quay lại danh sách đặt lịch
      </Link>
      {loading ? (
        <div className="text-gray-500 py-8 text-center">Đang tải...</div>
      ) : error ? (
        <div className="text-red-500 py-8 text-center">{error}</div>
      ) : result ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mb-6">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Mã kết quả</td>
                <td className="py-2">{result.resultId}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Mã booking</td>
                <td className="py-2">{result.bookingId}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Mã dịch vụ</td>
                <td className="py-2">{result.serviceId}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Mã nhân viên</td>
                <td className="py-2">{result.staffId}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Ngày</td>
                <td className="py-2">{result.date}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Trạng thái</td>
                <td className="py-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(result.status)}`}>
                    {result.status === "Đã hoàn thành" ? (
                      <CheckCircleIcon className="h-5 w-5 mr-1 text-green-600" />
                    ) : (
                      <ExclamationCircleIcon className="h-5 w-5 mr-1 text-yellow-600" />
                    )}
                    {result.status}
                  </span>
                </td>
              </tr>
              {/* Hiển thị thêm các trường khác nếu có */}
              {Object.entries(result).map(([key, value]) =>
                ![
                  "resultId",
                  "bookingId",
                  "serviceId",
                  "staffId",
                  "date",
                  "status",
                  "booking",
                  "customer",
                  "service",
                  "staff"
                ].includes(key) && value !== null && value !== undefined ? (
                  <tr key={key}>
                    <td className="py-2 pr-4 font-medium text-gray-500 capitalize">{key}</td>
                    <td className="py-2">{String(value)}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 py-8 text-center">Không có dữ liệu kết quả.</div>
      )}
    </div>
  );
}