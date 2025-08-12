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

// Handle OAuth callback
export function useOAuthCallback() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ token, userId }: { token: string; userId: string }) => {
      // Get user info with the token
      const response = await api.get<User>('/auth/me');
      return { user: response, token };
    },
    onSuccess: ({ user, token }) => {
      dispatch(loginSuccess({ user, token }));
      dispatch(addToast({
        title: 'Welcome!',
        description: `Logged in as ${user.name}`,
        type: 'success',
      }));
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Login failed';
      dispatch(loginFailure(message));
      dispatch(addToast({
        title: 'Login Failed',
        description: message,
        type: 'error',
      }));
      router.push('/auth/login?error=oauth_failed');
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
  const dispatch = useAppDispatch();
  
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