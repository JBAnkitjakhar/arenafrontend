// src/app/auth/callback/AuthCallbackContent.tsx

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOAuthCallback } from '@/hooks/useAuth';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthCallback = useOAuthCallback();
  
  const token = searchParams.get('token');
  const userId = searchParams.get('user');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      // Handle OAuth error
      setTimeout(() => {
        router.push('/auth/login?error=oauth_failed');
      }, 2000);
      return;
    }

    if (token && userId) {
      // Process successful OAuth callback
      oauthCallback.mutate({ token, userId });
    } else {
      // Missing required parameters
      setTimeout(() => {
        router.push('/auth/login?error=invalid_callback');
      }, 2000);
    }
  }, [token, userId, error, oauthCallback, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Authentication Failed</h1>
          <p className="text-gray-600">
            There was an error during the authentication process.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  if (oauthCallback.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Login Failed</h1>
          <p className="text-gray-600">
            Unable to complete the authentication process.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (oauthCallback.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Login Successful!</h1>
          <p className="text-gray-600">
            Welcome to AlgoArena. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h1 className="text-xl font-semibold text-gray-900">Processing authentication...</h1>
        <p className="text-gray-600">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}