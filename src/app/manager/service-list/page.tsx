'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PlusIcon, MagnifyingGlassIcon, EyeIcon,
  PencilIcon, TrashIcon, FunnelIcon, ArrowLeftIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  bookings: number;
  rating: number;
  createdAt: string;
  image?: string;
  rawId?: string; // Add this missing property
}

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Updated fetchServices function to properly handle API IDs
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5198/api/Services');
        const rawData = response.data;

        console.log('Raw API response:', rawData);
        
        let dataArray: any[] = [];
        if (Array.isArray(rawData)) {
          dataArray = rawData;
        } else if (rawData?.$values && Array.isArray(rawData.$values)) {
          dataArray = rawData.$values;
        } else if (rawData) {
          dataArray = [rawData];
        }

        // Log detailed information about first item's ID property
        if (dataArray.length > 0) {
          const firstItem = dataArray[0];
          console.log('First service data:', firstItem);
          console.log('ID value:', firstItem.id);
          console.log('ID type:', typeof firstItem.id);
          console.log('ID stringified:', JSON.stringify(firstItem.id));
        }

        const mapped = dataArray.map((item: any): Service => {
          // Store the original ID value exactly as received from API (without conversion)
          const originalId = item.id;
          const originalIdType = typeof originalId;
          
          // Log detailed ID information for debugging
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Service "${item.name}" - ID: ${originalId}, Type: ${originalIdType}`);
          }
          
          return {
            // For React keys and UI identification (always string)
            id: String(item.id || item.serviceId || item.Id || item.ServiceId || Math.random()),
            name: item.name || 'Không có tên',
            description: item.description || 'Không có mô tả',
            price: typeof item.price === 'number' ? item.price :
              parseFloat(item.price?.toString().replace(/[^\d]/g, '') || '0'),
            category: item.type || item.category || 'Khác',
            bookings: item.bookingCount || item.bookings || 0,
            rating: item.averageRating || item.rating || 0,
            createdAt: item.createdAt || new Date().toISOString(),
            image: item.image || undefined,
            // Store the EXACT original ID value from API (preserve number type if it's a number)
            rawId: originalId !== undefined ? 
              (originalIdType === 'number' ? originalId : String(originalId)) : 
              null
          };
        });

        // Log all service IDs for verification
        console.log('Mapped services with IDs:', mapped.map(s => ({
          name: s.name,
          id: s.id,
          rawId: s.rawId,
          rawIdType: typeof s.rawId
        })));

        setServices(mapped);
        setCategories(Array.from(new Set(mapped.map(s => s.category))));
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách dịch vụ');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleDeleteService = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để thực hiện chức năng này.');
      return;
    }

    // Find service to delete
    const serviceToDelete = services.find(s => s.id === id);
    if (!serviceToDelete) {
      alert('Không tìm thấy dịch vụ cần xóa.');
      return;
    }
    
    // Get the exact ID value to use with the API
    const apiId = serviceToDelete.rawId || serviceToDelete.id;
    
    console.log('Attempting to delete service with API ID:', apiId);
    console.log('Service object:', serviceToDelete);
    
    try {
      // Use the raw ID directly from the API response
      const res = await axios.delete(
        `http://localhost:5198/api/Services/${apiId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 200 || res.status === 204) {
        // Update UI
        setServices(prev => prev.filter(s => s.id !== id));
        alert('Xóa thành công');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      
      if (axios.isAxiosError(err)) {
        // Check for specific error conditions
        if (err.response?.status === 404) {
          alert(`Không thể tìm thấy dịch vụ với ID: ${apiId} trên máy chủ.`);
        } else if (err.response?.status === 403) {
          alert('Bạn không có quyền xóa dịch vụ này.');
        } else if (err.response?.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          alert(`Lỗi xóa dịch vụ: ${err.response?.data?.message || err.message}`);
        }
      } else {
        alert('Đã xảy ra lỗi khi xóa dịch vụ. Vui lòng thử lại sau.');
      }
    }
  };

  const filteredServices = services.filter(service => {
    const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dịch vụ ADN</h1>
            <p className="text-sm text-gray-500">Quản lý các dịch vụ xét nghiệm</p>
          </div>
          <div className="flex gap-3">
            <Link href="/manager" className="px-4 py-2 bg-white border rounded text-gray-700 flex items-center">
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
            <Link href="/manager/services/new" className="px-4 py-2 bg-blue-600 text-white rounded flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" />
              Thêm dịch vụ
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 border rounded w-full"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">Tất cả</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && filteredServices.length === 0 && (
          <p className="text-center text-gray-500">Không có dịch vụ nào.</p>
        )}

        {!loading && !error && filteredServices.length > 0 && (
          <ul className="bg-white shadow rounded divide-y">
            {filteredServices.map(service => (
              <li key={service.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    {service.price.toLocaleString()} VND • {service.category}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/manager/services/${service.id}`} className="text-blue-600">
                    <EyeIcon className="w-5 h-5" />
                  </Link>
                  <Link href={`/manager/services/edit/${service.id}`} className="text-green-600">
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button onClick={() => handleDeleteService(service.id)} className="text-red-600">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
