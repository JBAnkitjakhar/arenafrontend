// src/app/auth/login/LoginPageContent.tsx

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store';
import { useAuthActions } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Chrome, AlertCircle } from 'lucide-react';

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const { initiateGoogleLogin, initiateGithubLogin } = useAuthActions();
  
  const error = searchParams.get('error');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to AlgoArena</CardTitle>
          <CardDescription>
            Sign in to access coding questions, solutions, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                {error === 'oauth_failed' ? 'Authentication failed. Please try again.' : 'An error occurred during login.'}
              </span>
            </div>
          )}
          
          <div className="space-y-3">
            <Button
              onClick={initiateGoogleLogin}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 h-11"
            >
              <Chrome className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
            
            <Button
              onClick={initiateGithubLogin}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 h-11"
            >
              <Github className="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}