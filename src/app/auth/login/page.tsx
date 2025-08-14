// src/app/auth/login/page.tsx

import { Suspense } from 'react';
import LoginPageContent from './LoginPageContent';

// Loading component for suspense boundary
function LoginPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="rounded-lg border bg-white shadow-sm w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div className="space-y-3">
            <div className="h-11 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-11 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginPageContent />
    </Suspense>
  );
}