'use client';

import { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { checkSupabaseConnection } from '@/lib/supabase';

export default function SupabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean;
    message: string;
    loading: boolean;
  }>({
    connected: false,
    message: '연결 확인 중...',
    loading: true
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await checkSupabaseConnection();
      setStatus({
        connected: result.connected,
        message: result.message,
        loading: false
      });
    } catch (error) {
      setStatus({
        connected: false,
        message: '연결 확인 중 오류가 발생했습니다.',
        loading: false
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null; // 프로덕션에서는 숨김
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg border text-sm font-medium transition-all
        ${status.connected 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : status.loading 
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }
      `}>
        <div className="flex items-center gap-2">
          {status.loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : status.connected ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <Database className="w-4 h-4" />
        </div>
        
        <div className="flex flex-col">
          <span className="font-semibold">
            {status.connected ? 'Supabase 연결됨' : status.loading ? 'Supabase 확인중' : 'Supabase 연결 실패'}
          </span>
          <span className="text-xs opacity-75 max-w-64 truncate">
            {status.message}
          </span>
        </div>

        {!status.loading && (
          <button
            onClick={checkConnection}
            className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
            title="다시 확인"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
