"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { getServices } from "@/lib/api/services";
import { submitFeedback, deleteFeedbackById } from "@/lib/api/feedback";
import { downloadResultPdf } from "@/lib/api/testResults";
import { set } from "react-hook-form";

interface ResultDetail {
   feedbackId?: string; 
  id?: string;
  resultId: string;
  staffId: string;
  serviceId: string;
  bookingId: string;
  date: string;
  status: string;
  [key: string]: any;
}

// Define extended Feedback interface with feedbackId
interface Feedback {
  feedbackId?: string; // The API might return this property
  id?: string; // Or it might use this property instead
  serviceId: string;
  customerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ResultDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [result, setResult] = useState<ResultDetail | null>(null);
  const [kitStatus, setKitStatus] = useState<string>("---");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [staffName, setStaffName] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [ratingData, setRatingData] = useState<{
    comment: string;
    rating: number;
  }>({
    comment: "",
    rating: 5 // Mặc định 5 sao
  });
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(null);
  const [feedbackChecked, setFeedbackChecked] = useState<boolean>(false);
  const [downloading, setDownloading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Lấy token khi component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    console.log("Token lấy được từ localStorage:", storedToken);
  }, []);

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

  const greenStatuses = [
    "Đã nhận", 
    "Đã lấy mẫu", 
    "Đã vận chuyển", 
    "Đã tới kho"
  ];
  
  const redStatuses = [
    "Chưa nhận", 
    "Bị từ chối", 
    "Lỗi mẫu", 
    "Thất lạc"
  ];
  
  const yellowStatuses = [
    "Đang giao", 
    "Đang vận chuyển", 
    "Đang vận chuyển mẫu", 
    "Đang xử lý",
    "Đang lấy mẫu"
  ];
  
  if (greenStatuses.includes(status)) {
    return "bg-green-100 text-green-700";
  } else if (redStatuses.includes(status)) {
    return "bg-red-100 text-red-700";
  } else if (yellowStatuses.includes(status)) {
    return "bg-yellow-100 text-yellow-700";
  } else {
    return "bg-gray-100 text-gray-700";
  }
}

  function getResultStatusColor(status: string) {
  // Các kết quả trùng khớp, xác nhận dương tính
  const positiveResults = [
    "Trùng nhau", 
    "Trùng khớp",
    "Xác nhận",
    "Dương tính", 
    "Phù hợp",
    "Đạt yêu cầu"
  ];
  
  // Các kết quả không trùng khớp, âm tính
  const negativeResults = [
    "Không trùng", 
    "Không khớp",
    "Không phù hợp",
    "Không xác nhận",
    "Âm tính"
  ];
  
  // Các kết quả đang xử lý
  const pendingResults = [
    "Đang xử lý", 
    "Chờ xác nhận", 
    "Đang phân tích"
  ];
  
  if (positiveResults.includes(status)) {
    return "bg-green-100 text-green-800";
  } else if (negativeResults.includes(status)) {
    return "bg-red-100 text-red-800";
  } else if (pendingResults.includes(status)) {
    return "bg-yellow-100 text-yellow-800";
  } else {
    return "bg-gray-100 text-gray-800";
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

  const handleSubmitRating = async () => {
    try {
      // Check if feedback already exists
      if (existingFeedback) {
        alert('Bạn đã đánh giá dịch vụ này rồi.');
        setShowRatingModal(false);
        return;
      }
      
      // Thử nhiều cách khác nhau để lấy ID người dùng
      let customerId;
      
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        customerId = user.userId || user.id || user.userID;
      } catch (e) {
        console.log('Không tìm thấy user trong localStorage');
      }
      
      if (!customerId) {
        try {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          customerId = userData.userId || userData.id || userData.userID;
        } catch (e) {
          console.log('Không tìm thấy userData trong localStorage');
        }
      }
      
      if (!customerId && result?.customerId) {
        customerId = result.customerId;
      }
      
      if (!customerId) {
        const userInput = prompt('Vui lòng nhập ID của bạn để đánh giá dịch vụ:');
        if (userInput) customerId = userInput;
      }
      
      if (!customerId) {
        alert('Không thể xác định ID người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      
      const feedbackData: Feedback = {
        serviceId: result?.serviceId || '',
        customerId,
        bookingId: String(bookingId),
        rating: ratingData.rating,
        comment: ratingData.comment,
        date: new Date().toISOString()
      };
      
      const savedFeedback = await submitFeedback(feedbackData);
      
      // Update the existingFeedback with the newly submitted feedback
      setExistingFeedback(savedFeedback);
      
      // Store in localStorage for future reference
      localStorage.setItem(
        `feedback-for-booking-${bookingId}`, 
        JSON.stringify(savedFeedback)
      );
      
      // Also update the result page state
      const resultPageStateKey = `result-page-state-${bookingId}`;
      const currentData = localStorage.getItem(resultPageStateKey);
      if (currentData) {
        try {
          const parsedData = JSON.parse(currentData);
          parsedData.existingFeedback = savedFeedback;
          localStorage.setItem(resultPageStateKey, JSON.stringify(parsedData));
        } catch (e) {
          console.error('Error updating localStorage after feedback:', e);
        }
      }
      
      alert('Cảm ơn bạn đã đánh giá dịch vụ!');
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  // Thêm useEffect để lưu và khôi phục trạng thái từ localStorage
useEffect(() => {
  // Khôi phục dữ liệu từ localStorage khi component mount
  const storageKey = `result-page-state-${bookingId}`;
  const storedData = localStorage.getItem(storageKey);
  
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      
      // Khôi phục các trạng thái từ localStorage nếu có
      if (parsedData.result) setResult(parsedData.result);
      if (parsedData.kitStatus) setKitStatus(parsedData.kitStatus);
      if (parsedData.staffName) setStaffName(parsedData.staffName);
      if (parsedData.serviceName) setServiceName(parsedData.serviceName);
      if (parsedData.existingFeedback) setExistingFeedback(parsedData.existingFeedback);
      if (parsedData.feedbackChecked !== undefined) setFeedbackChecked(parsedData.feedbackChecked);
      if (parsedData.ratingData) setRatingData(parsedData.ratingData);
      
      // Nếu có dữ liệu được lưu trữ, có thể bỏ qua việc tải lại
      if (parsedData.result) {
        setLoading(false); // Không cần tải lại dữ liệu từ API
      }
    } catch (e) {
      console.error('Error parsing stored data:', e);
    }
  }
}, [bookingId]);

// Thêm useEffect để lưu trữ trạng thái mỗi khi nó thay đổi
useEffect(() => {
  if (!loading && result) {
    const storageKey = `result-page-state-${bookingId}`;
    const dataToStore = {
      result,
      kitStatus,
      staffName,
      serviceName,
      existingFeedback,
      feedbackChecked,
      ratingData
    };
    
    localStorage.setItem(storageKey, JSON.stringify(dataToStore));
  }
}, [
  loading, 
  result, 
  kitStatus, 
  staffName, 
  serviceName, 
  existingFeedback, 
  feedbackChecked, 
  ratingData,
  bookingId
]);

  // Replace the existing useEffect that uses getFeedbackByBookingId
useEffect(() => {
  async function checkExistingFeedback() {
    if (!bookingId) return;
    
    try {
      setFeedbackChecked(false);
      
      // Check if feedback exists in localStorage first
      const storedFeedback = getExistingFeedbackFromStorage(String(bookingId));
      if (storedFeedback) {
        setExistingFeedback(storedFeedback);
        setFeedbackChecked(true);
        return;
      }
      
      // Alternative: Check all feedbacks from the API if available
      try {
        const allFeedbacksRes = await fetch('http://localhost:5198/api/Feedbacks');
        if (allFeedbacksRes.ok) {
          const text = await allFeedbacksRes.text();
          if (text && text.trim() !== '') {
            const allFeedbacks = JSON.parse(text);
            const feedbackList = Array.isArray(allFeedbacks) 
              ? allFeedbacks 
              : (allFeedbacks?.$values || []);
              
            // Find feedback that matches the current booking ID
            const matchingFeedback = feedbackList.find((fb: any) => 
              String(fb.bookingId) === String(bookingId)
            );
            
            if (matchingFeedback) {
              setExistingFeedback(matchingFeedback);
              // Also store it in localStorage for future reference
              localStorage.setItem(
                `feedback-for-booking-${bookingId}`, 
                JSON.stringify(matchingFeedback)
              );
            }
          }
        }
      } catch (apiError) {
        console.error("Error fetching all feedbacks:", apiError);
      }
      
    } catch (error) {
      console.error("Error checking existing feedback:", error);
    } finally {
      setFeedbackChecked(true);
    }
  }
  
  checkExistingFeedback();
}, [bookingId]);

  // Thêm hàm này vào component để xóa dữ liệu đánh giá
  async function resetFeedbackData() {
    try {
      if (!existingFeedback) {
        return;
      }

      const feedbackId = existingFeedback.feedbackId || existingFeedback.id;
      if (!feedbackId) {
        return;
      }

      // Show loading state
      const originalButtonText = (document.activeElement as HTMLElement).innerText;
      (document.activeElement as HTMLElement).innerText = "Đang xóa...";
      (document.activeElement as HTMLElement).classList.add("opacity-70");
      
      // Call the API to delete the feedback in the database
      const deleted = await deleteFeedbackById(feedbackId);
      
      if (deleted) {
        // If API deletion was successful, clear localStorage
        localStorage.removeItem(`feedback-for-booking-${bookingId}`);
        
        // Update the result page state
        const resultPageStateKey = `result-page-state-${bookingId}`;
        const currentData = localStorage.getItem(resultPageStateKey);
        if (currentData) {
          try {
            const parsedData = JSON.parse(currentData);
            delete parsedData.existingFeedback;
            localStorage.setItem(resultPageStateKey, JSON.stringify(parsedData));
          } catch (e) {
            console.error('Error updating localStorage after reset:', e);
          }
        }
        
        // Update state
        setExistingFeedback(null);
        
        // Show the rating form immediately
        setShowRatingModal(true);
      } else {
        alert('Không thể xóa đánh giá. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error resetting feedback data:', error);
      alert('Có lỗi xảy ra khi xóa đánh giá.');
    } finally {
      // Reset button state if it's still the active element
      if (document.activeElement && (document.activeElement as HTMLElement).classList) {
        (document.activeElement as HTMLElement).innerText = "Đánh giá lại";
        (document.activeElement as HTMLElement).classList.remove("opacity-70");
      }
    }
  }

  // Thêm hàm parseDescriptionTable
  function renderDescriptionTable(description: string) {
  // Giả sử description là chuỗi dạng CSV hoặc text bảng, ví dụ:
  // Locus,(B),(Ct)\nD3S1358,16;17,15;16\n...
  const rows = description
    .trim()
    .split("\n")
    .map((row) => row.split(/\s{2,}|,|\t/).map(cell => cell.trim()));

  // Nếu không đủ dữ liệu, trả về null
  if (rows.length < 2) return <div>{description}</div>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-blue-200">
            {rows[0].map((cell, idx) => (
              <th key={idx} className="px-4 py-2 text-left font-bold">{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((cols, i) => (
            <tr key={i} className="border-t">
              {cols.map((cell, j) => (
                <td key={j} className="px-4 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

  const handleDownloadPdf = async () => {
    if (!result?.resultId) return;
    setDownloading(true);
    try {
      // Lấy lại token trực tiếp từ localStorage để chắc chắn luôn có giá trị mới nhất
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
      console.log("Token khi tải PDF:", currentToken);
      if (!currentToken) {
        alert("Bạn cần đăng nhập để tải file PDF.");
        setDownloading(false);
        return;
      }
      const blob = await downloadResultPdf(result.resultId, currentToken);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `KetQua_${result.resultId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } else {
        alert("Không thể tải file PDF. Vui lòng thử lại sau.");
      }
    } catch (e) {
      alert("Có lỗi khi tải file PDF.");
    } finally {
      setDownloading(false);
    }
  };

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
      <Link 
  href="/my-booking" 
  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-lg border border-blue-200 shadow-sm transition-all mb-6 w-fit"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
  Quay lại danh sách đặt lịch
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
                <td className="py-2 pr-4 font-medium text-gray-500">Kết quả</td>
                <td className="py-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getResultStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </td>
              </tr>
              
              <tr>
                <td colSpan={2} className="pt-8 pb-2">
                  <div className="mb-2">
                    <h2 className="text-lg font-bold text-blue-700 mb-2">BẢNG DỮ LIỆU CHI TIẾT</h2>
                    {renderDescriptionTable(String(result.description))}
                  </div>
                </td>
              </tr>
      
          <tr>
            <td colSpan={2} className="pt-4 pb-2 text-center">
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow transition mb-4 mx-auto"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
                {downloading ? "Đang tải..." : "Tải file PDF kết quả"}
              </button>
            </td>
          </tr>
        
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 py-12 text-center text-lg">Không có dữ liệu kết quả.</div>
      )}
      {/* Nút đánh giá dịch vụ hoặc hiển thị đánh giá đã có */}
      <div className="mt-6">
        {!feedbackChecked ? (
          <div className="flex justify-center">
            <div className="text-gray-500 flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang kiểm tra đánh giá...
            </div>
          </div>
        ) : existingFeedback ? (
          <div className="border border-green-100 bg-green-50 rounded-lg p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium text-green-800">Cảm ơn bạn đã đánh giá dịch vụ!</h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    className={`h-5 w-5 ${existingFeedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            {existingFeedback.comment && (
              <div className="bg-white p-3 rounded-md border border-green-200">
                <p className="text-gray-700 italic">"{existingFeedback.comment}"</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Đã đánh giá vào: {new Date(existingFeedback.date).toLocaleString('vi-VN')}
            </p>
            
            {/* Thêm nút reset ở đây */}
            <div className="mt-4 flex justify-end">
              <button 
                onClick={resetFeedbackData}
                className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                title="Xóa đánh giá này để đánh giá lại"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Đánh giá lại
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowRatingModal(true)}
              className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 font-medium py-3 px-6 rounded-lg border border-yellow-200 shadow-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Đánh giá dịch vụ
            </button>
          </div>
        )}
      </div>

      {/* Modal đánh giá dịch vụ */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Đánh giá dịch vụ
              </h3>
              <button 
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá của bạn</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingData({...ratingData, rating: star})}
                    className="focus:outline-none"
                  >
                    <svg 
                      className={`h-8 w-8 ${ratingData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Nhận xét của bạn
              </label>
              <textarea
                id="comment"
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Chia sẻ trải nghiệm của bạn với dịch vụ này"
                value={ratingData.comment}
                onChange={(e) => setRatingData({...ratingData, comment: e.target.value})}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitRating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      
      
    </div>
  );
}

// A simple function to check for existing feedback in localStorage
function getExistingFeedbackFromStorage(bookingId: string): Feedback | null {
  try {
    const storageKey = `feedback-for-booking-${bookingId}`;
    const storedFeedback = localStorage.getItem(storageKey);
    if (storedFeedback) {
      return JSON.parse(storedFeedback);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving feedback from localStorage:", error);
    return null;
  }
}


