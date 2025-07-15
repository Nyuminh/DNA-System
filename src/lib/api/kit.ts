import apiClient from './client'; 

// Hàm cập nhật kit theo ID sử dụng apiClient
export async function updateKitById(kitId: string, data: any) {
  try {
    const response = await apiClient.put(`/api/Kit/${kitId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}