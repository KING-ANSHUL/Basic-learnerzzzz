import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-8 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-blue-500 font-semibold text-lg">Loading...</p>
    </div>
  );
};