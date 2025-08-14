// src/hooks/useAuth.ts

import { useQuery, useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginSuccess, loginFailure, logout } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

// Get current user info
export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  
  const { data, error, isLoading: isQueryLoading } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => api.get<{ user: User }>('/auth/me'),
    enabled: isAuthenticated && !!user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: data?.user || user,
    isAuthenticated,
    isLoading: isLoading || isQueryLoading,
    error,
  };
}

// Handle OAuth callback - FIXED VERSION
export function useOAuthCallback() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ token, userId }: { token: string; userId: string }) => {
      console.log('useOAuthCallback: Starting authentication with token:', token.substring(0, 20) + '...');
      
      // Store token first so API client can use it
      localStorage.setItem('token', token);
      
      // ✅ FIXED: Use fetch instead of api.get() to avoid axios interceptor issues
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('useOAuthCallback: API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('useOAuthCallback: API error response:', errorText);
        throw new Error(`Authentication failed: HTTP ${response.status} - ${errorText}`);
      }

      const userData = await response.json();
      console.log('useOAuthCallback: User data received:', userData);
      
      return { user: userData, token };
    },
    onSuccess: ({ user, token }) => {
      console.log('useOAuthCallback: Success, updating state and redirecting');
      
      // Update Redux state
      dispatch(loginSuccess({ user, token }));
      
      // Add success toast
      try {
        dispatch(addToast({
          title: 'Welcome!',
          description: `Logged in as ${user.name}`,
          type: 'success',
        }));
      } catch (e) {
        // Toast might not be available
        console.log('Toast not available, skipping');
      }
      
      // Redirect to dashboard
      console.log('Redirecting to dashboard...');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('useOAuthCallback: Error occurred:', error);
      
      // Clear any stored token on error
      localStorage.removeItem('token');
      
      // Update Redux state
      const message = error?.message || 'Authentication failed';
      dispatch(loginFailure(message));
      
      // Add error toast
      try {
        dispatch(addToast({
          title: 'Login Failed',
          description: message,
          type: 'error',
        }));
      } catch (e) {
        // Toast might not be available
        console.log('Toast not available, skipping');
      }
      
      // Redirect back to login with error
      setTimeout(() => {
        router.push('/auth/login?error=oauth_failed');
      }, 2000);
    },
  });
}

// Logout mutation
export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      dispatch(logout());
      dispatch(addToast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
        type: 'info',
      }));
      router.push('/auth/login');
    },
    onError: () => {
      // Even if API call fails, clear local auth state
      dispatch(logout());
      router.push('/auth/login');
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => api.post<{ token: string; refreshToken: string; user: User }>('/auth/refresh'),
    onSuccess: ({ token, user }) => {
      dispatch(loginSuccess({ user, token }));
    },
    onError: () => {
      dispatch(logout());
    },
  });
}

// Auth utilities
export function useAuthActions() {
  const initiateGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`;
  };

  const initiateGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/github`;
  };

  return {
    initiateGoogleLogin,
    initiateGithubLogin,
  };
}