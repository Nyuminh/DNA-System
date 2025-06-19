/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './client';

// Interface cho test sample
export interface TestSample {
  id: string;
  testId: string;
  sampleType: string;
  collectionDate: string;
  status: 'collected' | 'received' | 'processing' | 'completed';
  trackingNumber: string;
  notes?: string;
}

// Interface cho test result
export interface TestResult {
  id: string;
  testId: string;
  resultData: any;
  conclusion: string;
  confidence: number;
  completedDate: string;
  labTechnicianId: string;
}

// === SAMPLES API ===

// Lấy danh sách test samples
export const getTestSamples = async (): Promise<{ success: boolean; samples?: TestSample[]; message?: string }> => {
  try {
    const response = await apiClient.get('/Samples');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        samples: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách mẫu xét nghiệm'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách mẫu xét nghiệm'
    };
  }
};

// Tạo test sample mới
export const createTestSample = async (sampleData: Omit<TestSample, 'id'>): Promise<{ success: boolean; sample?: TestSample; message?: string }> => {
  try {
    const response = await apiClient.post('/Samples', sampleData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        sample: response.data,
        message: 'Tạo mẫu xét nghiệm thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể tạo mẫu xét nghiệm'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tạo mẫu xét nghiệm'
    };
  }
};

// Lấy thông tin test sample theo ID
export const getTestSampleById = async (id: string): Promise<{ success: boolean; sample?: TestSample; message?: string }> => {
  try {
    const response = await apiClient.get(`/Samples/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        sample: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy thông tin mẫu xét nghiệm'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin mẫu xét nghiệm'
    };
  }
};

// Cập nhật test sample
export const updateTestSample = async (id: string, sampleData: Partial<TestSample>): Promise<{ success: boolean; sample?: TestSample; message?: string }> => {
  try {
    const response = await apiClient.put(`/Samples/${id}`, sampleData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        sample: response.data,
        message: 'Cập nhật mẫu xét nghiệm thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể cập nhật mẫu xét nghiệm'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật mẫu xét nghiệm'
    };
  }
};

// Theo dõi trạng thái mẫu
export const trackSample = async (trackingNumber: string): Promise<{ success: boolean; tracking?: any; message?: string }> => {
  try {
    const response = await apiClient.get(`/Samples/tracking?trackingNumber=${trackingNumber}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        tracking: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể theo dõi mẫu'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi theo dõi mẫu'
    };
  }
};

// === RESULTS API ===

// Lấy danh sách test results
export const getTestResults = async (): Promise<{ success: boolean; results?: TestResult[]; message?: string }> => {
  try {
    const response = await apiClient.get('/Results');
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        results: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy danh sách kết quả xét nghiệm'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách kết quả xét nghiệm'
    };
  }
};

// Tạo result mới (Lab)
export const createTestResult = async (resultData: Omit<TestResult, 'id'>): Promise<{ success: boolean; result?: TestResult; message?: string }> => {
  try {
    const response = await apiClient.post('/Results', resultData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        result: response.data,
        message: 'Tạo kết quả xét nghiệm thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể tạo kết quả xét nghiệm'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tạo kết quả xét nghiệm'
    };
  }
};

// Lấy result theo ID
export const getTestResultById = async (id: string): Promise<{ success: boolean; result?: TestResult; message?: string }> => {
  try {
    const response = await apiClient.get(`/Results/${id}`);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        result: response.data
      };
    }
    
    return {
      success: false,
      message: 'Không thể lấy kết quả xét nghiệm'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy kết quả xét nghiệm'
    };
  }
};

// Cập nhật result (Lab)
export const updateTestResult = async (id: string, resultData: Partial<TestResult>): Promise<{ success: boolean; result?: TestResult; message?: string }> => {
  try {
    const response = await apiClient.put(`/Results/${id}`, resultData);
    
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        result: response.data,
        message: 'Cập nhật kết quả xét nghiệm thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể cập nhật kết quả xét nghiệm'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật kết quả xét nghiệm'
    };
  }
};

// Download result PDF
export const downloadTestResult = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.get(`/Results/${id}/download`, {
      responseType: 'blob'
    });
    
    if (response.status >= 200 && response.status < 300) {
      // Tạo URL để download file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `test-result-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return {
        success: true,
        message: 'Tải xuống kết quả thành công'
      };
    }
    
    return {
      success: false,
      message: 'Không thể tải xuống kết quả'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi tải xuống kết quả'
    };
  }
};
