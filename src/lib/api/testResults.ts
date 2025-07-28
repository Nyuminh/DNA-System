import axios from 'axios';

const API_BASE_URL = 'http://localhost:5198';

export interface TestResult {
  id: string;
  testCode: string;
  serviceType: string;
  testType: string;
  status: string;
  requestDate: string;
  completionDate: string;
  sampleMethod: string;
  amount: number;
  participants: Array<{ role: string; name: string; age: string | number }>;
  timeline: Array<{ status: string; date: string; description: string }>;
  result?: {
    conclusion: string;
    probability: string;
    reportUrl?: string;
  };
}

export async function getTestResults(userId?: string): Promise<TestResult[]> {
  try {
    const url = userId ? `${API_BASE_URL}/api/TestResults?userId=${userId}` : `${API_BASE_URL}/api/TestResults`;
    const response = await axios.get(url);
    if (response.status >= 200 && response.status < 300) {
      // Có thể cần map lại dữ liệu nếu backend trả về khác
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching test results:', error);
    return [];
  }
}

export async function downloadResultPdf(resultId: string, token: string): Promise<Blob | null> {
  try {
    const url = `${API_BASE_URL}/api/Results/${resultId}/pdf`;
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error downloading result PDF:', error);
    return null;
  }
}

export interface UpdateTestResultRequest {
  date: string;
  description: string;
  status: string;
}

export async function updateTestResult(
  resultId: string,
  data: UpdateTestResultRequest,
  token: string
): Promise<any> {
  try {
    const url = `${API_BASE_URL}/api/Results/${resultId}`;
    const response = await axios.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật kết quả xét nghiệm thành công',
      };
    }
    
    return {
      success: false,
      message: 'Không thể cập nhật kết quả xét nghiệm',
    };
  } catch (error) {
    console.error('Error updating test result:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật kết quả xét nghiệm',
      error,
    };
  }
}
