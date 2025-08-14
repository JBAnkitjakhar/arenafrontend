// src/app/auth/callback/page.tsx

import { Suspense } from 'react';
import AuthCallbackContent from './AuthCallbackContent';

function CallbackPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h1 className="text-xl font-semibold text-gray-900">Processing authentication...</h1>
        <p className="text-gray-600">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackPageSkeleton />}>
      <AuthCallbackContent />
    </Suspense>
  );
}