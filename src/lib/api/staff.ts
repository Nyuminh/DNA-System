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
    'available': 'Received',     // Kit đã nhận và sẵn sàng sử dụng
    'in-use': 'Processing',      // Kit đang được xử lý/sử dụng
    'completed': 'Pending',      // Kit đã hoàn thành và đang chờ
    'expired': 'Received'        // Kit hết hạn quay về trạng thái đã nhận
  };
  return statusMap[status] || 'Received';
};

// Helper function to map backend status to frontend status
const mapStatusFromBackend = (backendStatus: string): Kit['status'] => {
  // Map backend status values (from database) to frontend status values
  const normalizedStatus = backendStatus?.toLowerCase() || '';
  
  // Mapping based on actual database values: Received, Pending, Processing
  if (normalizedStatus === 'received') return 'available';        // Received -> Available for use
  if (normalizedStatus === 'processing') return 'in-use';         // Processing -> In use
  if (normalizedStatus === 'pending') return 'completed';         // Pending -> Completed/waiting
  
  // Legacy/additional mappings for backward compatibility
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
      
      // Function to recursively find all kit objects with actual data (not $ref)
      const findAllKitObjects = (obj: unknown, found: ApiKitResponse[] = []): ApiKitResponse[] => {
        if (obj && typeof obj === 'object') {
          const objTyped = obj as Record<string, unknown>;
          
          // Check if this is a kit object with actual data
          if (objTyped.kitId && typeof objTyped.kitId === 'string' && !objTyped.$ref) {
            found.push(objTyped as ApiKitResponse);
          }
          
          // Recursively search in nested objects and arrays
          for (const key in objTyped) {
            if (objTyped.hasOwnProperty(key) && key !== '$ref') {
              if (Array.isArray(objTyped[key])) {
                (objTyped[key] as unknown[]).forEach((item: unknown) => findAllKitObjects(item, found));
              } else if (typeof objTyped[key] === 'object' && objTyped[key] !== null) {
                findAllKitObjects(objTyped[key], found);
              }
            }
          }
        }
        return found;
      };
      
      // Handle different response formats
      if (response.data && typeof response.data === 'object') {
        if ('$values' in response.data && Array.isArray(response.data.$values)) {
          console.log('Found $values array, searching for all kit objects...');
          kitsArray = findAllKitObjects(response.data);
        } else if (Array.isArray(response.data)) {
          console.log('Found direct array, searching for all kit objects...');
          kitsArray = findAllKitObjects(response.data);
        } else {
          console.log('Found single object, searching for kit objects...');
          kitsArray = findAllKitObjects(response.data);
        }
      }
      
      console.log('All found kit objects:', kitsArray);
      console.log('Total kit objects found:', kitsArray.length);
      
      // Format and normalize kit data
      const normalizedKits = kitsArray.map((kit: ApiKitResponse, index: number) => {
        console.log(`Processing kit ${index + 1}:`, kit);
        
        const normalizedKit = {
          kitID: kit.kitId?.toString() || `KIT_${Date.now()}_${index}`,  // Read kitId from backend
          customerID: kit.customerId?.toString() || '',                   // Read customerId from backend  
          staffID: kit.staffId?.toString() || '',                         // Read staffId from backend
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
      
      // Sort kits by kitID 
      const sortedKits = normalizedKits.sort((a, b) => {
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
      
      // Based on your successful curl: -d '"Processing"'
      // The backend expects the status as a raw JSON string
      const statusPayload = `"${backendStatus}"`;
      
      console.log('📤 Sending status payload:', statusPayload);
      console.log('🔗 PUT URL:', `/api/Kit/${kitData.kitID}`);
      
      const response = await apiClient.put<ApiKitResponse>(`/api/Kit/${kitData.kitID}`, statusPayload, {
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
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
      console.log(`📤 Sending raw JSON string: "${backendStatus}"`);
      console.log(`🔗 PUT URL: /api/Kit/${kitData.kitID}`);
      
      // Send the status as a raw JSON string, matching the working curl example:
      // curl -X 'PUT' 'http://localhost:5198/api/Kit/K04' -H 'Content-Type: application/json' -d '"Processing"'
      const response = await apiClient.put(`/api/Kit/${kitData.kitID}`, `"${backendStatus}"`, {
        headers: { 
          'Content-Type': 'application/json',
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

// Default export
export default kitApi;