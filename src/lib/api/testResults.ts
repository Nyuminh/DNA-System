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
