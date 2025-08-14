// Temporary debug version - Replace src/app/auth/callback/AuthCallbackContent.tsx

'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOAuthCallback } from '@/hooks/useAuth';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthCallback = useOAuthCallback();
  const hasProcessed = useRef(false);
  
  const token = searchParams.get('token');
  const userId = searchParams.get('user');
  const error = searchParams.get('error');

  // Debug logging
  console.log('=== AuthCallback Debug ===');
  console.log('token:', token ? `${token.substring(0, 30)}...` : 'null');
  console.log('userId:', userId);
  console.log('error:', error);
  console.log('hasProcessed:', hasProcessed.current);
  console.log('oauthCallback state:', {
    isPending: oauthCallback.isPending,
    isError: oauthCallback.isError,
    isSuccess: oauthCallback.isSuccess,
    error: oauthCallback.error
  });

  useEffect(() => {
    console.log('=== AuthCallback useEffect ===');
    console.log('hasProcessed.current:', hasProcessed.current);
    
    if (hasProcessed.current) {
      console.log('Already processed, skipping');
      return;
    }

    if (error) {
      console.error('URL error detected:', error);
      hasProcessed.current = true;
      setTimeout(() => {
        console.log('Redirecting to login with error');
        router.replace('/auth/login?error=oauth_failed');
      }, 2000);
      return;
    }

    if (token && userId) {
      console.log('Processing OAuth callback...');
      hasProcessed.current = true;
      
      // Test the API call directly first
      console.log('Testing API call directly...');
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log('Direct API test - status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Direct API test - data:', data);
        
        // Now try the mutation
        console.log('Starting mutation...');
        oauthCallback.mutate({ token, userId });
      })
      .catch(err => {
        console.error('Direct API test failed:', err);
      });
      
    } else {
      console.error('Missing parameters:', { token: !!token, userId: !!userId });
      hasProcessed.current = true;
      setTimeout(() => {
        router.replace('/auth/login?error=invalid_callback');
      }, 2000);
    }
  }, [token, userId, error, oauthCallback, router]);

  // Debug render states
  if (error) {
    console.log('Rendering error state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-semibold text-gray-900">Authentication Failed</h1>
          <p className="text-gray-600">Error: {error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (oauthCallback.isError) {
    console.log('Rendering mutation error state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-semibold text-gray-900">Login Failed</h1>
          <p className="text-gray-600">Mutation failed</p>
          <p className="text-sm text-gray-500 mb-4">
            Error: {oauthCallback.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => router.replace('/auth/login')}
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
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="text-xl font-semibold text-gray-900">Login Successful!</h1>
          <p className="text-gray-600">Welcome to AlgoArena. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering loading state');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h1 className="text-xl font-semibold text-gray-900">Processing authentication...</h1>
        <p className="text-gray-600">Please wait while we complete your login.</p>
        <div className="text-xs text-gray-400 mt-4">
          <p>Debug info:</p>
          <p>Token: {token ? 'Present' : 'Missing'}</p>
          <p>UserId: {userId || 'Missing'}</p>
          <p>Loading: {oauthCallback.isPending ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}