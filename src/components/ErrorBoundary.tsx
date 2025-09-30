'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">오류가 발생했습니다</h2>
          <p className="text-sm text-red-600 mb-4 text-center max-w-md">
            {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            onClick={this.resetError}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook 버전의 에러 바운더리 (실험적)
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Caught error:', error, errorInfo);
    // 추가적인 에러 로깅 로직을 여기에 추가할 수 있습니다.
  };
}

// 기본 에러 폴백 컴포넌트
export function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <AlertTriangle className="w-8 h-8 text-yellow-600 mb-3" />
      <h3 className="font-medium text-yellow-800 mb-2">일시적인 문제가 발생했습니다</h3>
      <p className="text-sm text-yellow-700 mb-4 text-center">
        {error?.message || '페이지를 새로고침하거나 잠시 후 다시 시도해주세요.'}
      </p>
      <button
        onClick={resetError}
        className="px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
