import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:5198';

// Additional Kit interface from kit.ts for compatibility
export interface SimpleKit {
  id?: string;
  name: string;
  description: string;
  price: number;
  type: string;
  status?: 'active' | 'inactive';
  stockQuantity?: number;
  instructions?: string;
  estimatedDeliveryDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Interface cho create kit request from kit.ts
export interface CreateKitRequest {
  name: string;
  description: string;
  price: number;
  type: string;
  stockQuantity?: number;
  instructions?: string;
  estimatedDeliveryDays?: number;
}

// Interface cho API response from kit.ts
export interface KitApiResponse {
  success: boolean;
  message?: string;
  kit?: SimpleKit;
  kits?: SimpleKit[];
}

// Helper function to map frontend status to backend status
const mapStatusToBackend = (status: Kit['status']): string => {
  // Map frontend status values to backend status values (matching database varchar(50))
  const statusMap: Record<Kit['status'], string> = {
    'available': 'Đã vận chuyển',     // Kit đã nhận và sẵn sàng sử dụng
    'in-use': 'Đang vận chuyển',      // Kit đang được xử lý/sử dụng
    'completed': 'Đã lấy mẫu',        // Kit đã hoàn thành và đang chờ
    'expired': 'Đã tới kho'           // Kit hết hạn quay về trạng thái đã nhận
  };
  return statusMap[status] || 'Đã vận chuyển';
};

// Helper function to map backend status to frontend status
const mapStatusFromBackend = (backendStatus: string): Kit['status'] => {
  // Kiểm tra và log trạng thái ban đầu
  console.log(`🔍 Mapping backend status: "${backendStatus}"`);
  
  // Nếu không có giá trị, trả về mặc định
  if (!backendStatus) {
    console.warn('Empty status received, defaulting to available');
    return 'available';
  }
  
  // Chuẩn hóa chuỗi trạng thái
  const normalizedStatus = backendStatus.toLowerCase();
  console.log(`🔍 Normalized status: "${normalizedStatus}"`);
  
  // Xử lý các trường hợp không lỗi encoding
  if (normalizedStatus === 'đã vận chuyển' || normalizedStatus === 'da van chuyen') return 'available';
  if (normalizedStatus === 'đã lấy mẫu' || normalizedStatus === 'da lay mau') return 'completed';
  if (normalizedStatus === 'đã tới kho' || normalizedStatus === 'da toi kho') return 'expired';
  if (normalizedStatus === 'đang vận chuyển' || normalizedStatus === 'dang van chuyen') return 'in-use';
  if (normalizedStatus === 'đang vận chuyển mẫu' || normalizedStatus === 'dang van chuyen mau') return 'in-use';
  
  // Xử lý các trường hợp có lỗi encoding với dấu "?"
  if (normalizedStatus.includes('đã') || normalizedStatus.includes('da') || normalizedStatus.includes('đa')) {
    if (normalizedStatus.includes('vận chuyển') || normalizedStatus.includes('van chuyen') || 
        normalizedStatus.includes('v?n chuy?n') || normalizedStatus.includes('v?n chuy') || 
        normalizedStatus.includes('van chuy')) {
      console.log('✅ Matched pattern: "đã vận chuyển" -> available');
      return 'available';
    }
    
    if (normalizedStatus.includes('lấy mẫu') || normalizedStatus.includes('lay mau') || 
        normalizedStatus.includes('l?y m?u') || normalizedStatus.includes('l?y mau') || 
        normalizedStatus.includes('lay m?u')) {
      console.log('✅ Matched pattern: "đã lấy mẫu" -> completed');
      return 'completed';
    }
    
    if (normalizedStatus.includes('tới kho') || normalizedStatus.includes('toi kho') || 
        normalizedStatus.includes('t?i kho') || normalizedStatus.includes('toi kho')) {
      console.log('✅ Matched pattern: "đã tới kho" -> expired');
      return 'expired';
    }
  }
  
  if (normalizedStatus.includes('đang') || normalizedStatus.includes('dang') || normalizedStatus.includes('?ang')) {
    if (normalizedStatus.includes('vận chuyển') || normalizedStatus.includes('van chuyen') || 
        normalizedStatus.includes('v?n chuy?n') || normalizedStatus.includes('v?n chuy') || 
        normalizedStatus.includes('van chuy')) {
      console.log('✅ Matched pattern: "đang vận chuyển" -> in-use');
      return 'in-use';
    }
  }
  
  // Hỗ trợ các trường hợp có lỗi encoding khác
  if (normalizedStatus.includes('lay mau') || normalizedStatus.includes('l?y m?u')) return 'completed';
  if (normalizedStatus.includes('toi kho') || normalizedStatus.includes('t?i kho')) return 'expired';
  if (normalizedStatus.includes('van chuyen') || normalizedStatus.includes('v?n chuy?n')) {
    if (normalizedStatus.startsWith('da') || normalizedStatus.startsWith('đa') || normalizedStatus.startsWith('đã') || normalizedStatus.startsWith('?a')) {
      return 'available';
    }
    return 'in-use';
  }
  
  // Legacy mappings for backward compatibility
  if (normalizedStatus === 'received') return 'available';
  if (normalizedStatus === 'processing') return 'in-use';
  if (normalizedStatus === 'pending') return 'completed';
  
  if (normalizedStatus.includes('available')) return 'available';
  if (normalizedStatus.includes('inuse') || normalizedStatus.includes('in-use')) return 'in-use';
  if (normalizedStatus.includes('completed')) return 'completed';
  if (normalizedStatus.includes('expired')) return 'expired';
  
  // Default fallback for unknown statuses
  console.warn(`Unknown backend status: ${backendStatus}, defaulting to 'available'`);
  return 'available';
};

// Kit interface matching database fields
export interface Kit {
  kitID: string;
  customerID?: string;
  staffID?: string;
  bookingId?: string;
  description?: string;
  status: 'available' | 'in-use' | 'completed' | 'expired';
  receivedate?: string;
  // Additional display fields (not in database)
  customerName?: string;
  staffName?: string;
}

// Raw Kit data from API (before normalization) - matching actual backend response
interface ApiKitResponse {
  kitId?: string | number;        // Backend uses kitId (camelCase)
  customerId?: string | number;   // Backend uses customerId (camelCase) 
  staffId?: string | number;      // Backend uses staffId (camelCase)
  bookingId?: string | number;    // Added bookingId field from backend
  description?: string;
  status?: string;                // Backend might use different status values
  receivedate?: string;
  // Additional fields that might come from API
  customer?: {                    // Nested customer object
    fullname?: string;
    userId?: string;
  };
  staff?: {                       // Nested staff object
    fullname?: string;
    userId?: string;
  };
}

// Get authentication token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Kit API functions
export const kitApi = {  /**
   * Fetch all kits from the system
   * @returns Promise<Kit[]>
   */
  async getAllKits(): Promise<Kit[]> {
    try {
      console.log('🚀 Fetching kits from API...');
      console.log('API Endpoint:', `${API_BASE_URL}/api/Kit`);
      
      const response = await apiClient.get('/api/Kit');
      console.log('✅ Raw API response:', response.data);
      console.log('Response status:', response.status);
      
      let kitsArray: ApiKitResponse[] = [];
      
      // Thay thế hàm findAllKitObjects bằng một cách tiếp cận đơn giản hơn
      // để tránh thu thập các kit trùng lặp từ response API
      if (response.data && typeof response.data === 'object') {
        if ('$values' in response.data && Array.isArray(response.data.$values)) {
          console.log('Found $values array in response');
          kitsArray = response.data.$values.filter((item: any) => 
            item && typeof item === 'object' && item.kitId && !item.$ref
          );
        } else if (Array.isArray(response.data)) {
          console.log('Found direct array in response');
          kitsArray = response.data.filter((item: any) => 
            item && typeof item === 'object' && item.kitId && !item.$ref
          );
        } else if (response.data.kitId) {
          console.log('Found single kit object');
          kitsArray = [response.data];
        } else {
          console.log('Unexpected response format, searching for top-level kit properties');
          // Tìm các thuộc tính cấp cao nhất có thể chứa danh sách kit
          Object.keys(response.data).forEach(key => {
            const value = response.data[key];
            if (Array.isArray(value)) {
              const validKits = value.filter((item: any) => 
                item && typeof item === 'object' && item.kitId && !item.$ref
              );
              if (validKits.length > 0) {
                console.log(`Found ${validKits.length} kits in property '${key}'`);
                kitsArray = [...kitsArray, ...validKits];
              }
            }
          });
        }
      }
      
      console.log('Extracted kit objects:', kitsArray);
      console.log('Total kit objects found:', kitsArray.length);
      
      // Format and normalize kit data
      const normalizedKits = kitsArray.map((kit: ApiKitResponse, index: number) => {
        console.log(`Processing kit ${index + 1}:`, kit);
        
        const normalizedKit = {
          kitID: kit.kitId?.toString() || `KIT_${Date.now()}_${index}`,
          customerID: kit.customerId?.toString() || '',
          staffID: kit.staffId?.toString() || '',
          bookingId: kit.bookingId?.toString(),
          description: kit.description || '',
          status: mapStatusFromBackend(kit.status || ''),
          receivedate: kit.receivedate || '',
          customerName: kit.customer?.fullname || '',
          staffName: kit.staff?.fullname || ''
        };
        
        console.log(`Normalized kit ${index + 1}:`, normalizedKit);
        return normalizedKit;
      });
      
      // Lọc bỏ các kit trùng lặp dựa trên kitID
      const uniqueKits: Kit[] = [];
      const kitIDs = new Set<string>();
      
      normalizedKits.forEach(kit => {
        if (!kitIDs.has(kit.kitID)) {
          kitIDs.add(kit.kitID);
          uniqueKits.push(kit);
        } else {
          console.warn(`Duplicated kitID found and removed: ${kit.kitID}`);
        }
      });
      
      console.log('After removing duplicates:', uniqueKits.length);
      
      // Sort kits by kitID 
      const sortedKits = uniqueKits.sort((a, b) => {
        // Extract numeric part from kitID for proper sorting (K01, K02, K10, etc.)
        const getNumericPart = (kitID: string) => {
          const match = kitID.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        
        const numA = getNumericPart(a.kitID);
        const numB = getNumericPart(b.kitID);
        
        // If both have numbers, sort by number
        if (numA && numB) {
          return numA - numB;
        }
        
        // Otherwise, sort alphabetically
        return a.kitID.localeCompare(b.kitID);
      });
      
      console.log('Final normalized kits (sorted by kitID):', sortedKits);
      console.log('Total kits returned:', sortedKits.length);
      
      return sortedKits;
    } catch (error) {
      console.error('❌ Error fetching kits:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.error('Endpoint not found - check if backend is running');
        } else if (error.response?.status === 500) {
          console.error('Server error - check backend logs');
        }
      }
      
      // Return empty array instead of throwing to prevent app crash
      console.log('🔄 Returning empty array due to API error');
      return [];
    }
  },
  /**
   * Fetch a specific kit by ID
   * @param kitId - The ID of the kit to fetch (e.g., "K01")
   * @returns Promise<Kit>
   */
  async getKitById(kitId: string): Promise<Kit> {
    try {
      console.log(`🔍 Fetching kit by ID: ${kitId}`);
      console.log('API Endpoint:', `${API_BASE_URL}/api/Kit/${kitId}`);
      
      const response = await apiClient.get<ApiKitResponse>(`/api/Kit/${kitId}`);
      console.log('✅ Kit details response:', response.data);
      
      const kit = response.data;
      
      // Map backend status to frontend status
      let normalizedStatus: Kit['status'] = 'available';
      if (kit.status) {
        const statusLower = kit.status.toLowerCase();
        if (statusLower.includes('received') || statusLower.includes('available')) {
          normalizedStatus = 'available';
        } else if (statusLower.includes('use') || statusLower.includes('processing')) {
          normalizedStatus = 'in-use';
        } else if (statusLower.includes('completed') || statusLower.includes('done')) {
          normalizedStatus = 'completed';
        } else if (statusLower.includes('expired')) {
          normalizedStatus = 'expired';
        }
      }
      
      const normalizedKit = {
        kitID: kit.kitId?.toString() || kitId,     // Read kitId from backend
        customerID: kit.customerId?.toString() || '',  // Read customerId from backend
        staffID: kit.staffId?.toString() || '',    // Read staffId from backend
        bookingId: kit.bookingId?.toString(),
        description: kit.description || '',
        status: normalizedStatus,
        receivedate: kit.receivedate || '',
        customerName: kit.customer?.fullname || '',
        staffName: kit.staff?.fullname || ''
      };
      
      console.log('Normalized kit details:', normalizedKit);
      return normalizedKit;
    } catch (error) {
      console.error(`❌ Error fetching kit ${kitId}:`, error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Kit với ID "${kitId}" không tồn tại`);
        } else if (error.response?.status === 500) {
          throw new Error('Lỗi server khi lấy thông tin kit');
        }
      }
      throw new Error(`Không thể tải thông tin kit ${kitId}`);
    }
  },

  /**
   * Create a new kit
   * @param kitData - The kit data to create
   * @returns Promise<Kit>
   */  async createKit(kitData: Partial<Kit>): Promise<Kit> {
    try {
      // Don't send kitID - let backend auto-generate it
      const payload: any = {
        customerID: kitData.customerID,
        staffID: kitData.staffID,
        bookingId: kitData.bookingId,
        description: kitData.description,
        status: kitData.status || 'available',
        receivedate: kitData.receivedate
      };

      // Only include fields that have values (remove undefined/null fields)
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
          delete payload[key];
        }
      });

      console.log('Creating kit with payload:', payload);
      const response = await apiClient.post<Kit>('/api/Kit', payload);
      
      return response.data;
    } catch (error) {
      console.error('Error creating kit:', error);
      throw new Error('Không thể tạo kit mới');
    }
  },

  /**
   * Update kit status
   * @param kitData - The complete kit data with updated status
   * @returns Promise<Kit>
   */
  async updateKitStatus(kitData: Kit): Promise<Kit> {
    try {
      console.log(`🔄 Updating kit ${kitData.kitID} status to: ${kitData.status}`);
      console.log('🔍 Full kit data:', kitData);
      
      // Map frontend status to backend status
      const backendStatus = mapStatusToBackend(kitData.status);
      console.log(`🔄 Mapped status: ${kitData.status} -> ${backendStatus}`);
      
      // Stringify the Vietnamese status properly for nvarchar
      const statusPayload = JSON.stringify(backendStatus);
      
      console.log('📤 Sending status payload:', statusPayload);
      console.log('📤 Raw status value:', backendStatus);
      console.log('🔗 PUT URL:', `/api/Kit/${kitData.kitID}`);
      
      const response = await apiClient.put<ApiKitResponse>(`/api/Kit/${kitData.kitID}`, statusPayload, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': '*/*'
        }
      });
      
      console.log('✅ Status update succeeded:', response.data);
      
      // Return the updated kit data
      return {
        ...kitData,
        status: kitData.status // Keep the frontend status
      };
    } catch (error) {
      console.error('❌ Error updating kit status:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        
        // Log detailed validation errors
        if (error.response?.data?.errors) {
          console.error('Validation errors:', error.response.data.errors);
          Object.keys(error.response.data.errors).forEach(field => {
            console.error(`❌ Field '${field}':`, error.response?.data?.errors[field]);
          });
        }
        
        console.error('Request config:', error.config?.data);
        console.error('Request URL:', error.config?.url);
      }
      throw new Error(`Không thể cập nhật trạng thái kit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Update kit status - sends raw status string as JSON payload (matching curl example)
   * @param kitData - The complete kit data with updated status
   * @returns Promise<Kit>
   */
  async updateKitStatusMultiFormat(kitData: Kit): Promise<Kit> {
    try {
      const backendStatus = mapStatusToBackend(kitData.status);
      console.log(`🚀 Updating kit ${kitData.kitID} status to: ${kitData.status} -> ${backendStatus}`);
      
      // Ensure proper JSON formatting for Vietnamese text
      const statusPayload = JSON.stringify(backendStatus);
      console.log(`📤 Sending JSON status payload: ${statusPayload}`);
      console.log(`📤 Raw status value (Vietnamese): "${backendStatus}"`);
      console.log(`🔗 PUT URL: /api/Kit/${kitData.kitID}`);
      
      // Send the status as a properly formatted JSON string
      const response = await apiClient.put(`/api/Kit/${kitData.kitID}`, statusPayload, {
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': '*/*'
        }
      });
      
      console.log(`✅ Kit status update successful:`, response.data);
      
      // Return the updated kit data
      return {
        ...kitData,
        status: kitData.status
      };
    } catch (error) {
      console.error('❌ Error updating kit status with raw string method:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        
        // Log detailed validation errors if any
        if (error.response?.data?.errors) {
          console.error('Validation errors:', error.response.data.errors);
          Object.keys(error.response.data.errors).forEach(field => {
            console.error(`❌ Field '${field}':`, error.response?.data?.errors[field]);
          });
        }
      }
      throw error;
    }
  },

  /**
   * Update an existing kit (full update)
   * @param kitId - The ID of the kit to update
   * @param kitData - The updated kit data
   * @returns Promise<Kit>
   */  async updateKit(kitId: string, kitData: Partial<Kit>): Promise<Kit> {
    try {
      const response = await apiClient.put<Kit>(`/api/Kit/${kitId}`, {
        kitID: kitId,
        customerID: kitData.customerID,
        staffID: kitData.staffID,
        bookingId: kitData.bookingId,
        description: kitData.description,
        status: kitData.status,
        receivedate: kitData.receivedate
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating kit:', error);
      throw new Error('Không thể cập nhật kit');
    }
  },

  /**
   * Delete a kit
   * @param kitId - The ID of the kit to delete
   * @returns Promise<void>
   */  async deleteKit(kitId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/Kit/${kitId}`);
    } catch (error) {
      console.error('Error deleting kit:', error);
      throw new Error('Không thể xóa kit');
    }
  },

  /**
   * Assign a kit to a customer/order
   * @param kitId - The ID of the kit to assign
   * @param assignmentData - Assignment details
   * @returns Promise<Kit>
   */  async assignKit(kitId: string, assignmentData: {
    customerID: string;
    customerName?: string;
    staffID: string;
    staffName?: string;
    bookingId?: string;
    description?: string;
  }): Promise<Kit> {    try {
      const response = await apiClient.patch<Kit>(`/api/Kit/${kitId}/assign`, {
        customerID: assignmentData.customerID,
        staffID: assignmentData.staffID,
        bookingId: assignmentData.bookingId,
        description: assignmentData.description,
        status: 'in-use',
        receivedate: new Date().toISOString().split('T')[0]
      });
      
      return response.data;
    } catch (error) {
      console.error('Error assigning kit:', error);
      throw new Error('Không thể gán kit');
    }
  },

  /**
   * Filter kits by status
   * @param status - The status to filter by
   * @returns Promise<Kit[]>
   */
  async getKitsByStatus(status: Kit['status']): Promise<Kit[]> {
    try {
      const allKits = await this.getAllKits();
      return allKits.filter(kit => kit.status === status);
    } catch (error) {
      console.error('Error filtering kits by status:', error);
      throw new Error('Không thể lọc kit theo trạng thái');
    }
  },

  /**
   * Search kits by name or barcode
   * @param searchTerm - The search term
   * @returns Promise<Kit[]>
   */  async searchKits(searchTerm: string): Promise<Kit[]> {
    try {
      const allKits = await this.getAllKits();
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return allKits.filter(kit => 
        kit.kitID.toLowerCase().includes(lowerSearchTerm) ||
        (kit.description && kit.description.toLowerCase().includes(lowerSearchTerm)) ||
        (kit.bookingId && kit.bookingId.toLowerCase().includes(lowerSearchTerm)) ||
        (kit.customerID && kit.customerID.toLowerCase().includes(lowerSearchTerm)) ||
        (kit.customerName && kit.customerName.toLowerCase().includes(lowerSearchTerm)) ||
        (kit.staffID && kit.staffID.toLowerCase().includes(lowerSearchTerm)) ||
        (kit.staffName && kit.staffName.toLowerCase().includes(lowerSearchTerm))
      );
    } catch (error) {
      console.error('Error searching kits:', error);
      throw new Error('Không thể tìm kiếm kit');
    }
  },

  /**
   * Update kit status with special handling for Vietnamese characters
   * Use this method when encountering issues with Vietnamese characters in nvarchar fields
   * @param kitData - The kit data with status to update
   * @returns Promise<Kit>
   */
  async updateKitStatusVietnamese(kitData: Kit): Promise<Kit> {
    try {
      const backendStatus = mapStatusToBackend(kitData.status);
      console.log(`🇻🇳 Updating kit ${kitData.kitID} status with Vietnamese handling`);
      console.log(`🔄 Status mapping: ${kitData.status} -> "${backendStatus}"`);

      // API chỉ chấp nhận giá trị trạng thái là một chuỗi có dấu ngoặc kép
      // Không gửi toàn bộ đối tượng kit
      const statusPayload = JSON.stringify(backendStatus);
      
      console.log(`📤 Sending status payload (raw value): ${statusPayload}`);

      // Gửi với cấu hình tối ưu cho tiếng Việt
      const response = await apiClient.put(`/api/Kit/${kitData.kitID}`, statusPayload, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': '*/*'
        }
      });
      
      console.log(`✅ Kit status update successful:`, response.data);
      
      return {
        ...kitData,
        status: kitData.status
      };
    } catch (error) {
      console.error('❌ Error updating kit status with Vietnamese handling:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        console.error('Request data:', error.config?.data);
        
        // Thử phương pháp thay thế nếu phương pháp đầu tiên thất bại
        try {
          console.log('⚠️ First method failed, trying alternative method...');
          
          // Lấy lại giá trị trạng thái để sử dụng trong phương pháp thay thế
          const alternativeBackendStatus = mapStatusToBackend(kitData.status);
          
          // Phương pháp 2: Gửi trạng thái dưới dạng chuỗi không có dấu ngoặc kép bên ngoài
          const response = await apiClient.put(`/api/Kit/${kitData.kitID}`, `"${alternativeBackendStatus}"`, {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': '*/*'
            }
          });
          
          console.log('✅ Alternative method succeeded:', response.data);
          
          return {
            ...kitData,
            status: kitData.status
          };
        } catch (fallbackError) {
          console.error('❌ Alternative method also failed:', fallbackError);
          throw fallbackError;
        }
      }
      throw new Error(`Không thể cập nhật trạng thái kit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Fix kit status by updating it to match the desired status
   * This is useful when encountering issues with Vietnamese characters in nvarchar fields
   * @param kitId - The ID of the kit to fix
   * @param desiredStatus - The desired status to set
   * @returns Promise<Kit>
   */
  async fixKitStatus(kitId: string, desiredStatus: Kit['status']): Promise<Kit> {
    try {
      console.log(`🔧 Fixing kit status for ${kitId} to ${desiredStatus}`);
      
      // Fetch the current kit first
      const currentKit = await this.getKitById(kitId);
      console.log(`📊 Current kit status: ${currentKit.status}`);
      
      // Try multiple methods to update the status
      try {
        console.log(`🔄 Attempting to fix using updateKitStatusVietnamese`);
        const updatedKit = await this.updateKitStatusVietnamese({
          ...currentKit,
          status: desiredStatus
        });
        console.log(`✅ Successfully fixed kit status using Vietnamese method`);
        return updatedKit;
      } catch (error) {
        console.error(`❌ Vietnamese method failed:`, error);
        
        try {
          console.log(`🔄 Attempting to fix using updateKitStatusMultiFormat`);
          const updatedKit = await this.updateKitStatusMultiFormat({
            ...currentKit,
            status: desiredStatus
          });
          console.log(`✅ Successfully fixed kit status using MultiFormat method`);
          return updatedKit;
        } catch (innerError) {
          console.error(`❌ MultiFormat method failed:`, innerError);
          
          console.log(`🔄 Attempting direct PUT method as last resort`);
          // Final attempt with direct PUT and raw string
          const backendStatus = mapStatusToBackend(desiredStatus);
          const response = await apiClient.put(`/api/Kit/${kitId}`, `"${backendStatus}"`, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Accept': '*/*'
            }
          });
          
          console.log(`✅ Last resort method succeeded:`, response.data);
          return {
            ...currentKit,
            status: desiredStatus
          };
        }
      }
    } catch (error) {
      console.error(`❌ Failed to fix kit status:`, error);
      throw new Error(`Không thể sửa trạng thái kit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  /**
   * Refresh kit data from the server and ensure correct status mapping
   * @param kitId - The ID of the kit to refresh
   * @returns Promise<Kit>
   */
  async refreshKitData(kitId: string): Promise<Kit> {
    try {
      console.log(`🔄 Refreshing kit data for ${kitId}`);
      
      // Fetch the latest kit data
      const response = await apiClient.get(`/api/Kit/${kitId}`);
      const rawData = response.data;
      console.log(`📊 Raw kit data from API:`, rawData);
      
      // Extract the actual kit object
      let kitData: ApiKitResponse | null = null;
      
      if (rawData && typeof rawData === 'object') {
        if (rawData.kitId) {
          kitData = rawData;
        } else if (rawData.$values && Array.isArray(rawData.$values) && rawData.$values.length > 0) {
          kitData = rawData.$values.find((item: any) => item && typeof item === 'object' && item.kitId === kitId);
        }
      }
      
      if (!kitData) {
        throw new Error(`Kit with ID ${kitId} not found in API response`);
      }
      
      // Log the actual status value received
      console.log(`🔍 Raw status from API: "${kitData.status}"`);
      
      // Check if status has proper Vietnamese encoding
      const hasProperVietnameseEncoding = 
        kitData.status?.includes('ả') || 
        kitData.status?.includes('ậ') || 
        kitData.status?.includes('ấ') || 
        kitData.status?.includes('ấ') || 
        kitData.status?.includes('ầ');
      
      console.log(`📊 Status has proper Vietnamese encoding: ${hasProperVietnameseEncoding}`);
      
      // Convert to normalized Kit object
      const normalizedKit: Kit = {
        kitID: kitData.kitId?.toString() || kitId,
        customerID: kitData.customerId?.toString() || '',
        staffID: kitData.staffId?.toString() || '',
        bookingId: kitData.bookingId?.toString() || '',
        description: kitData.description || '',
        status: mapStatusFromBackend(kitData.status || ''),
        receivedate: kitData.receivedate || '',
        customerName: kitData.customer?.fullname || '',
        staffName: kitData.staff?.fullname || ''
      };
      
      console.log(`✅ Refreshed kit data:`, normalizedKit);
      return normalizedKit;
    } catch (error) {
      console.error(`❌ Failed to refresh kit data:`, error);
      throw new Error(`Không thể làm mới dữ liệu kit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Simple Kit API functions from kit.ts for compatibility
export const simpleKitApi = {
  // Thêm kit mới (from kit.ts)
  async createSimpleKit(kitData: CreateKitRequest): Promise<KitApiResponse> {
    try {
      // Clean up the data - remove any undefined/null values and ensure no ID is sent
      const cleanData = {
        name: kitData.name,
        description: kitData.description,
        price: kitData.price,
        type: kitData.type,
        ...(kitData.stockQuantity !== undefined && { stockQuantity: kitData.stockQuantity }),
        ...(kitData.instructions && { instructions: kitData.instructions }),
        ...(kitData.estimatedDeliveryDays !== undefined && { estimatedDeliveryDays: kitData.estimatedDeliveryDays })
      };

      console.log('Creating simple kit with clean data:', cleanData);
      const response = await apiClient.post('/api/Kit', cleanData);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          kit: response.data,
          message: 'Kit đã được tạo thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không thể tạo kit'
      };
    } catch (error: any) {
      console.error('Error creating kit:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo kit'
      };
    }
  },

  // Lấy danh sách kits (from kit.ts)
  async getSimpleKits(): Promise<KitApiResponse> {
    try {
      const response = await apiClient.get('/api/Kit');
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          kits: response.data
        };
      }
      
      return {
        success: false,
        message: 'Không thể lấy danh sách kit'
      };
    } catch (error: any) {
      console.error('Error fetching kits:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách kit'
      };
    }
  },

  // Lấy kit theo ID (from kit.ts)
  async getSimpleKitById(id: string): Promise<KitApiResponse> {
    try {
      const response = await apiClient.get(`/api/Kit/${id}`);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          kit: response.data
        };
      }
      
      return {
        success: false,
        message: 'Không thể lấy thông tin kit'
      };
    } catch (error: any) {
      console.error('Error fetching kit:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin kit'
      };
    }
  },

  // Cập nhật kit (from kit.ts)
  async updateSimpleKit(id: string, kitData: Partial<CreateKitRequest>): Promise<KitApiResponse> {
    try {
      const response = await apiClient.put(`/api/Kit/${id}`, kitData);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          kit: response.data,
          message: 'Kit đã được cập nhật thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không thể cập nhật kit'
      };
    } catch (error: any) {
      console.error('Error updating kit:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật kit'
      };
    }
  },

  // Xóa kit (from kit.ts)
  async deleteSimpleKit(id: string): Promise<KitApiResponse> {
    try {
      const response = await apiClient.delete(`/api/Kit/${id}`);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          message: 'Kit đã được xóa thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không thể xóa kit'
      };
    } catch (error: any) {
      console.error('Error deleting kit:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa kit'
      };
    }
  }
};

// Export individual functions for convenience (from kitApi)
export const {
  getAllKits,
  assignKit,
  getKitsByStatus,
  searchKits
} = kitApi;

// Export simple kit functions for compatibility with kit.ts
export const {
  createSimpleKit,
  getSimpleKits,
  getSimpleKitById,
  updateSimpleKit,
  deleteSimpleKit
} = simpleKitApi;

// Alias exports for backward compatibility with kit.ts (avoiding naming conflicts)
export const createKitCompat = simpleKitApi.createSimpleKit;
export const getKits = simpleKitApi.getSimpleKits;
export const getKitByIdCompat = simpleKitApi.getSimpleKitById;
export const updateKitCompat = simpleKitApi.updateSimpleKit;
export const deleteKitCompat = simpleKitApi.deleteSimpleKit;

// Export the original functions with different names to avoid conflicts
export const getKitById = kitApi.getKitById;
export const createKit = kitApi.createKit;
export const updateKit = kitApi.updateKit;
export const updateKitStatus = kitApi.updateKitStatus;
export const deleteKit = kitApi.deleteKit;

// Appointments API
export interface Appointment {
  id?: string;
  bookingId: string;
  customerId: string;
  date: string;
  staffId: string;
  serviceId: string;
  address: string;
  method: string;
  status: string;
  customerName?: string;
  serviceName?: string;
}

export const appointmentsApi = {
  async getAppointments(): Promise<Appointment[]> {
    try {
      console.log('🚀 Fetching appointments from API...');
      console.log('API Endpoint:', `${API_BASE_URL}/api/Appointments`);
      
      const response = await apiClient.get('/api/Appointments');
      console.log('✅ Raw API response:', response.data);
      
      let appointments: Appointment[] = [];
      
      // Handle different response formats (similar to Kit API)
      if (response.data && typeof response.data === 'object') {
        if ('$values' in response.data && Array.isArray(response.data.$values)) {
          console.log('Found $values array in appointment data');
          appointments = response.data.$values;
        } else if (Array.isArray(response.data)) {
          console.log('Found direct array in appointment data');
          appointments = response.data;
        } else {
          console.log('Found single object or unexpected format in appointment data');
          // Assuming it might be a single appointment or have a different structure
          appointments = Array.isArray(response.data) ? response.data : [response.data];
        }
      }
      
      // Map and normalize the appointment data
      const normalizedAppointments = appointments.map((item: any, index: number) => {
        console.log(`Processing appointment ${index + 1}:`, item);
        
        // Convert nested objects if present
        const appointment: Appointment = {
          id: item.id || `appointment_${index}`,
          bookingId: item.bookingId || '',
          customerId: item.customerId || '',
          date: item.date || '',
          staffId: item.staffId || '',
          serviceId: item.serviceId || '',
          address: item.address || '',
          method: item.method || '',
          status: item.status || 'pending',
          // Handle nested objects for name fields
          customerName: item.customer?.fullname || '',
          serviceName: item.service?.name || ''
        };
        
        console.log(`Normalized appointment ${index + 1}:`, appointment);
        return appointment;
      });
      
      console.log('Total appointments found:', normalizedAppointments.length);
      return normalizedAppointments;
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.error('Endpoint not found - check if backend is running');
        } else if (error.response?.status === 500) {
          console.error('Server error - check backend logs');
        }
      }
      // Return empty array on error to prevent app crash
      return [];
    }
  },
  
  async updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    try {
      console.log(`📤 Updating appointment ${id} status to: ${status}`);
      console.log(`📝 API Endpoint: ${API_BASE_URL}/api/Appointments/${id}/status`);
      console.log(`📝 Payload: "${status}"`);
      
      // Chuẩn bị payload như một chuỗi JSON đơn giản, đưa vào dấu ngoặc kép
      const payload = JSON.stringify(status);
      console.log('Raw payload:', payload);
      
      // Gửi request cập nhật status
      const response = await apiClient.put(`/api/Appointments/${id}/status`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      });
      
      console.log(`✅ Status code: ${response.status}`);
      console.log(`✅ Updated appointment ${id} status to ${status}`);
      console.log('Response data:', response.data);
      
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error(`❌ Error updating appointment status:`, error);
      
      // Log chi tiết về lỗi
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        console.error('Request config:', error.config?.data);
        console.error('Request URL:', error.config?.url);
      }
      
      return false;
    }
  }
};

// Export appointment functions
export const getAppointments = appointmentsApi.getAppointments;
export const updateAppointmentStatus = appointmentsApi.updateAppointmentStatus;

// Default export
export default kitApi;

export const getAppointmentById = async (token: string, id: string): Promise<Appointment | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error);
    return null;
  }
};

export const updateAppointment = async (token: string, id: string, appointmentData: Partial<Appointment>): Promise<Appointment | null> => {
  try {
    console.log(`Updating appointment ${id} with data:`, appointmentData);
    
    // Đảm bảo dữ liệu gửi đi đúng định dạng
    const apiPayload = {
      id: appointmentData.id,
      bookingId: appointmentData.bookingId,
      customerId: appointmentData.customerId,
      date: appointmentData.date,
      staffId: appointmentData.staffId || "",
      serviceId: appointmentData.serviceId,
      address: appointmentData.address || "",
      method: appointmentData.method,
      status: appointmentData.status,
      // Giữ lại các trường bổ sung nếu có
      customerName: appointmentData.customerName,
      serviceName: appointmentData.serviceName
    };
    
    console.log('API payload for update:', apiPayload);
    
    const response = await axios.put(`${API_BASE_URL}/api/Appointments/${id}`, apiPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Update response:', response.data);
    
    // Nếu API không trả về dữ liệu đầy đủ, trả về dữ liệu ban đầu với status đã cập nhật
    if (!response.data || typeof response.data !== 'object') {
      console.log('API returned invalid data, using original data with updated status');
      return {
        ...appointmentData,
        status: appointmentData.status
      } as Appointment;
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error updating appointment with ID ${id}:`, error.response.status, error.response.data);
    } else if (error.request) {
      console.error(`Error updating appointment with ID ${id}: No response`, error.request);
    } else {
      console.error(`Error updating appointment with ID ${id}:`, error.message);
    }
    
    // Nếu có lỗi, trả về dữ liệu ban đầu để tránh mất dữ liệu trong giao diện
    console.log('Returning original appointment data due to API error');
    return appointmentData as Appointment;
  }
};

// Test Result API
export interface TestResult {
  resultId?: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  bookingId: string;
  date: string;
  description: string;
  status: string;
}

export const createTestResult = async (token: string, resultData: Partial<TestResult>): Promise<TestResult | null> => {
  try {
    console.log('Creating test result with data:', resultData);
    
    const response = await axios.post(`${API_BASE_URL}/api/TestResults`, resultData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Create test result response:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error creating test result:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Error creating test result: No response received', error.request);
    } else {
      console.error('Error creating test result:', error.message);
    }
    return null;
  }
};

// Hàm mới sử dụng endpoint /api/Results
export const createTestResultV2 = async (token: string, resultData: Partial<TestResult>): Promise<TestResult | null> => {
  try {
    console.log('Creating test result with new API endpoint:', resultData);
    
    const response = await axios.post(`${API_BASE_URL}/api/Results`, resultData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
     
    console.log('Create test result V2 response:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error creating test result V2:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Error creating test result V2: No response received', error.request);
    } else {
      console.error('Error creating test result V2:', error.message);
    }
    return null;
  }
};

// Hàm mới sử dụng endpoint /api/Results/by-booking/{bookingId}
export const getTestResultsByBookingId = async (token: string, bookingId: string): Promise<TestResult[]> => {
  try {
    console.log(`🔍 Fetching test results for booking ID: ${bookingId} using new API endpoint`);
    console.log(`🔗 Endpoint: ${API_BASE_URL}/api/Results/by-booking/${bookingId}`);
    
    const response = await axios.get(`${API_BASE_URL}/api/Results/by-booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': '*/*'
      },
    });
    
    console.log('✅ Test results response:', response.data);
    
    // Xử lý response tương tự như các API khác
    let results: TestResult[] = [];
    
    if (response.data) {
      // Xử lý các định dạng response có thể có
      if ('$values' in response.data && Array.isArray(response.data.$values)) {
        console.log('Found $values array in results data');
        results = response.data.$values;
      } else if (Array.isArray(response.data)) {
        console.log('Found direct array in results data');
        results = response.data;
      } else if (response.data.resultId) {
        // Nếu API trả về một kết quả duy nhất
        console.log('Found single result object');
        results = [response.data];
      }
      
      // Map và format dữ liệu nếu cần
      results = results.map(result => ({
        resultId: result.resultId || '',
        customerId: result.customerId || '',
        staffId: result.staffId || '',
        serviceId: result.serviceId || '',
        bookingId: result.bookingId || bookingId,
        date: result.date || new Date().toISOString(),
        description: result.description || '',
        status: result.status || 'completed'
      }));
    }
    
    console.log(`Found ${results.length} test results for booking ID: ${bookingId}`);
    return results;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error fetching test results for booking ${bookingId}:`, error.response.status, error.response.data);
    } else if (error.request) {
      console.error(`Error fetching test results for booking ${bookingId}: No response`, error.request);
    } else {
      console.error(`Error fetching test results for booking ${bookingId}:`, error.message);
    }
    console.log('🔄 Returning empty array due to API error');
    return [];
  }
};

// Hàm cập nhật trạng thái an toàn - thử nhiều phương pháp khác nhau nếu cần
export const updateAppointmentStatusSafe = async (token: string, id: string, status: string): Promise<boolean> => {
  try {
    console.log(`🚀 Attempting to update appointment ${id} status to: ${status}`);
    
    // Phương pháp 1: Thử cập nhật với endpoint PUT /api/Appointments/{id}
    // Lấy dữ liệu hiện tại trước
    const currentAppointment = await getAppointmentById(token, id);
    
    if (!currentAppointment) {
      console.error('❌ Cannot update status: Failed to fetch current appointment data');
      return false;
    }
    
    console.log('✅ Current appointment data:', currentAppointment);
    
    // Cập nhật chỉ trường status
    const updateData = {
      ...currentAppointment,
      status: status
    };
    
    console.log('📤 Updating with payload:', updateData);
    
    // Gửi request cập nhật toàn bộ đối tượng
    const response = await axios.put(`${API_BASE_URL}/api/Appointments/${id}`, updateData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
    });
    
    console.log(`✅ Update response status: ${response.status}`);
    console.log('✅ Update response data:', response.data);
    
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error(`❌ Error in safe update for appointment status:`, error);
    
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request URL:', error.config?.url);
      console.error('Request payload:', error.config?.data);
    }
    
    return false;
  }
};

// Interface cho Staff Profile
export interface StaffProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  employeeId: string;
  joinDate: string;
  avatar?: string;
  status?: string;
}

// API functions for staff profile management
export const staffProfileAPI = {
  // Lấy thông tin profile staff hiện tại
  getProfile: async (): Promise<{ success: boolean; profile?: StaffProfile; message?: string }> => {
    try {
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token available when fetching staff profile');
        return {
          success: false,
          message: 'Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.'
        };
      }

      console.log('Fetching staff profile with token:', token.substring(0, 15) + '...');
      
      // Thử gọi API với timeout ngắn hơn
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await apiClient.get('/api/User/me', {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.status >= 200 && response.status < 300 && response.data) {
        console.log('Staff profile API response:', response.data);
        
        // Transform API response to match StaffProfile interface
        const profileData: StaffProfile = {
          id: response.data.userID || response.data.id || '',
          username: response.data.username || response.data.userName || '',
          fullName: response.data.fullname || response.data.fullName || response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || response.data.phoneNumber || '',
          address: response.data.address || '',
          department: response.data.department || 'Phòng xét nghiệm',
          position: response.data.position || 'Kỹ thuật viên',
          employeeId: response.data.employeeId || response.data.staffCode || '',
          joinDate: response.data.joinDate || response.data.createdDate || new Date().toISOString(),
          avatar: response.data.image || response.data.avatar || response.data.profileImage || '',
          status: response.data.status || response.data.isActive ? 'active' : 'inactive'
        };
        
        return {
          success: true,
          profile: profileData
        };
      }
      
      return {
        success: false,
        message: 'Không thể lấy thông tin hồ sơ'
      };
    } catch (error) {
      console.error('Error fetching staff profile:', error);
      
      if (axios.isAxiosError(error)) {
        // Xử lý lỗi timeout
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          return {
            success: false,
            message: 'Yêu cầu bị timeout. Vui lòng thử lại sau.'
          };
        }
        
        // Xử lý lỗi abort
        if (error.message.includes('aborted')) {
          return {
            success: false,
            message: 'Yêu cầu bị hủy.'
          };
        }
        
        // Xử lý lỗi 401 một cách cụ thể
        if (error.response?.status === 401) {
          console.warn('401 Unauthorized when fetching staff profile');
          // Xóa token nếu không hợp lệ
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          return {
            success: false,
            message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
          };
        }
        
        if (error.response?.status === 404) {
          return {
            success: false,
            message: 'API endpoint không tồn tại. Vui lòng kiểm tra cấu hình hệ thống.'
          };
        }
        
        return {
          success: false,
          message: `Lỗi: ${error.response?.status} - ${error.response?.data?.message || error.message}`
        };
      }
      
      return {
        success: false,
        message: 'Có lỗi xảy ra khi lấy thông tin hồ sơ'
      };
    }
  },
  
  // Cập nhật thông tin profile staff hiện tại
  updateProfile: async (profileData: Partial<StaffProfile>): Promise<{ success: boolean; profile?: StaffProfile; message?: string }> => {
    try {
      const response = await apiClient.put('/api/User/me', profileData);
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          profile: response.data as StaffProfile,
          message: 'Cập nhật hồ sơ thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không thể cập nhật thông tin hồ sơ'
      };
    } catch (error) {
      console.error('Error updating staff profile:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
          };
        }
        
        return {
          success: false,
          message: `Lỗi: ${error.response?.status} - ${error.response?.data?.message || error.message}`
        };
      }
      
      return {
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật thông tin hồ sơ'
      };
    }
  },
  
  // Cập nhật mật khẩu staff
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post('/api/User/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          message: 'Đổi mật khẩu thành công'
        };
      }
      
      return {
        success: false,
        message: response.data?.message || 'Không thể đổi mật khẩu'
      };
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            success: false,
            message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
          };
        }
        
        if (error.response?.status === 400) {
          return {
            success: false,
            message: error.response.data?.message || 'Mật khẩu hiện tại không đúng'
          };
        }
        
        return {
          success: false,
          message: `Lỗi: ${error.response?.status} - ${error.response?.data?.message || error.message}`
        };
      }
      
      return {
        success: false,
        message: 'Có lỗi xảy ra khi đổi mật khẩu'
      };
    }
  }
};

