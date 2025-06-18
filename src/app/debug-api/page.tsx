'use client';

import { useState } from 'react';
import axios from 'axios';

interface ApiResult {
  status?: number;
  statusText?: string;
  headers?: unknown;
  data?: unknown;
  error?: boolean;
  message?: string;
  response?: unknown;
}

export default function DebugApiPage() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testLoginApi = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://localhost:7029/User/Login', {
        email: 'admin@dnatest.com',
        password: 'Admin123!',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });
      
      console.log('Full response:', response);
      setResult({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      });    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorResponse = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: unknown; status?: number } }).response 
        : undefined;
      
      setResult({
        error: true,
        message: errorMessage,
        response: errorResponse?.data,
        status: errorResponse?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug API Response</h1>
      
      <button
        onClick={testLoginApi}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Login API'}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">API Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
