// src/app/auth/callback/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOAuthCallback } from '@/hooks/useAuth';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthCallback = useOAuthCallback();
  const [hasProcessed, setHasProcessed] = useState(false);
  
  const token = searchParams.get('token');
  const userId = searchParams.get('user');
  const error = searchParams.get('error');

  // Debug logging
  console.log('=== AuthCallback Debug ===');
  console.log('token:', token ? token.substring(0, 20) + '...' : null);
  console.log('userId:', userId);
  console.log('error:', error);
  console.log('hasProcessed:', hasProcessed);
  console.log('oauthCallback state:', {
    isPending: oauthCallback.isPending,
    isError: oauthCallback.isError,
    isSuccess: oauthCallback.isSuccess,
    error: oauthCallback.error
  });

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) {
      console.log('Already processed, skipping...');
      return;
    }

    if (error) {
      console.log('Error in URL params:', error);
      setHasProcessed(true);
      setTimeout(() => {
        router.push('/auth/login?error=oauth_failed');
      }, 2000);
      return;
    }

    if (token && userId) {
      console.log('Processing OAuth callback with token and userId');
      setHasProcessed(true);
      
      // Process successful OAuth callback
      oauthCallback.mutate({ token, userId });
    } else {
      console.log('Missing required parameters - token:', !!token, 'userId:', !!userId);
      setHasProcessed(true);
      setTimeout(() => {
        router.push('/auth/login?error=invalid_callback');
      }, 2000);
    }
  }, [token, userId, error, hasProcessed, oauthCallback, router]);

  // Show different states
  if (error) {
    console.log('Rendering error state');
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
    console.log('Rendering mutation error state');
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
          <p className="text-sm text-gray-500 mb-4">
            Error: {oauthCallback.error?.message || 'Unknown error'}
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
    console.log('Rendering success state');
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

  // Default loading state
  console.log('Rendering loading state');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Processing Authentication</h1>
        <p className="text-gray-600">
          Please wait while we complete your login...
        </p>
        <div className="text-xs text-gray-400 space-y-1">
          <p>Status: {oauthCallback.isPending ? 'Processing...' : 'Initializing...'}</p>
          <p>Token: {token ? 'Present' : 'Missing'}</p>
          <p>User ID: {userId ? 'Present' : 'Missing'}</p>
        </div>
      </div>
    </div>
  );
}