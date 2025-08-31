'use client';

import { useState, useEffect } from 'react';
import { createKitCompat, getKits, SimpleKit, CreateKitRequest } from '@/lib/api/staff';

export default function KitManagement() {
  const [kits, setKits] = useState<SimpleKit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state cho việc tạo kit mới
  const [formData, setFormData] = useState<CreateKitRequest>({
    name: '',
    description: '',
    price: 0,
    type: '',
    stockQuantity: 0,
    instructions: '',
    estimatedDeliveryDays: 3
  });

  // Lấy danh sách kits khi component mount
  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    setLoading(true);
    try {
      const response = await getKits();
      if (response.success && response.kits) {
        setKits(response.kits);
      } else {
        setError(response.message || 'Không thể lấy danh sách kit');
      }
    } catch (err) {
      console.error('Error fetching kits:', err);
      setError('Có lỗi xảy ra khi tải danh sách kit');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createKitCompat(formData);
      if (response.success) {
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: 0,
          type: '',
          stockQuantity: 0,
          instructions: '',
          estimatedDeliveryDays: 3
        });
        setShowCreateForm(false);
        // Reload danh sách kits
        await fetchKits();
        alert('Kit đã được tạo thành công!');
      } else {
        setError(response.message || 'Không thể tạo kit');
      }
    } catch (err) {
      console.error('Error creating kit:', err);
      setError('Có lỗi xảy ra khi tạo kit');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Kit xét nghiệm</h1>
        <p className="mt-1 text-sm text-gray-600">
          Quản lý các kit xét nghiệm ADN có sẵn trong hệ thống
        </p>
      </div>

      {/* Nút tạo kit mới */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showCreateForm ? 'Hủy' : 'Thêm Kit Mới'}
        </button>
      </div>

      {/* Form tạo kit mới */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Tạo Kit Mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Tên Kit
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Loại Kit
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Chọn loại kit</option>
                  <option value="Xét nghiệm huyết thống">Xét nghiệm huyết thống</option>
                  <option value="Xét nghiệm ADN pháp y">Xét nghiệm ADN pháp y</option>
                  <option value="Xét nghiệm ADN cá nhân">Xét nghiệm ADN cá nhân</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Giá (VND)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="estimatedDeliveryDays" className="block text-sm font-medium text-gray-700">
                  Thời gian giao hàng (ngày)
                </label>
                <input
                  type="number"
                  id="estimatedDeliveryDays"
                  name="estimatedDeliveryDays"
                  value={formData.estimatedDeliveryDays}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Hướng dẫn sử dụng
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows={4}
                value={formData.instructions}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nhập hướng dẫn chi tiết về cách sử dụng kit..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang tạo...' : 'Tạo Kit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hiển thị lỗi */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách kits */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách Kit</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : kits.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Chưa có kit nào trong hệ thống
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Kit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kits.map((kit) => (
                  <tr key={kit.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{kit.name}</div>
                        <div className="text-sm text-gray-500">{kit.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {kit.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {kit.price.toLocaleString('vi-VN')} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {kit.stockQuantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        kit.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {kit.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
