import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { FallbackProps } from 'react-error-boundary';

interface ErrorFallbackProps extends Partial<FallbackProps> {
  message?: string;
}

const ErrorFallback = ({ error, resetErrorBoundary, message = 'Something went wrong' }: ErrorFallbackProps) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 p-8">
      <div className="p-4 bg-red-50 rounded-full">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">{message}</h2>
        {error instanceof Error && error.message && (
          <p className="text-sm text-gray-500 mt-1 max-w-md">{error.message}</p>
        )}
      </div>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="flex items-center gap-2 px-4 py-2 bg-[#20A8D8] text-white rounded-lg text-sm font-medium hover:bg-[#1a91bb] transition-colors"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
