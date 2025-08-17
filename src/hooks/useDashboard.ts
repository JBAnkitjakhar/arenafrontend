// src/hooks/useDashboard.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/store';
import { useRealtime } from '@/components/providers/RealtimeProvider';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { useEffect } from 'react';
import type { DashboardStats, UserProgress } from '@/types'; // Import from consolidated types

// Get dashboard statistics
export function useDashboardStats() {
  const { user } = useAppSelector(state => state.auth);
  const { isConnected, subscribe } = useRealtime();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.dashboard.stats(user?.id || ''),
    queryFn: async (): Promise<DashboardStats> => {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      return response;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: isConnected ? false : 5 * 60 * 1000, // 5 minutes if not connected
  });

  // Real-time updates
  useEffect(() => {
    if (!isConnected || !user) return;

    const unsubscribers = [
      subscribe('progress:updated', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats(user.id) });
      }),
      subscribe('question:solved', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats(user.id) });
      }),
      subscribe('streak:updated', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats(user.id) });
      }),
      subscribe('leaderboard:updated', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats(user.id) });
      }),
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [isConnected, user, subscribe, queryClient]);

  return query;
}

// Get detailed user progress
export function useUserProgress() {
  const { user } = useAppSelector(state => state.auth);
  const { isConnected, subscribe } = useRealtime();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.progress.details(user?.id || ''),
    queryFn: async (): Promise<UserProgress> => {
      const response = await api.get<UserProgress>('/progress/details');
      return response;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Real-time updates
  useEffect(() => {
    if (!isConnected || !user) return;

    const unsubscribers = [
      subscribe('progress:updated', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.progress.details(user.id) });
      }),
      subscribe('activity:logged', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.progress.details(user.id) });
      }),
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [isConnected, user, subscribe, queryClient]);

  return query;
}

// Get real-time leaderboard
export function useLeaderboard(limit: number = 10) {
  const { isConnected, subscribe } = useRealtime();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.leaderboard.top(limit),
    queryFn: async () => {
      const response = await api.get(`/leaderboard/top?limit=${limit}`);
      return response;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: isConnected ? false : 2 * 60 * 1000, // 2 minutes if not connected
  });

  // Real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscriber = subscribe('leaderboard:updated', () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard.top(limit) });
    });

    return unsubscriber;
  }, [isConnected, subscribe, queryClient, limit]);

  return query;
}

// Get system statistics (admin only)
export function useSystemStats() {
  const { user } = useAppSelector(state => state.auth);
  const { isConnected, subscribe } = useRealtime();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.admin.systemStats,
    queryFn: async () => {
      const response = await api.get('/admin/system/stats');
      return response;
    },
    enabled: !!user && ['ADMIN', 'SUPERADMIN'].includes(user.role),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Real-time updates for admin
  useEffect(() => {
    if (!isConnected || !user || !['ADMIN', 'SUPERADMIN'].includes(user.role)) return;

    const unsubscribers = [
      subscribe('system:stats_updated', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.systemStats });
      }),
      subscribe('user:registered', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.systemStats });
      }),
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [isConnected, user, subscribe, queryClient]);

  return query;
}

// Get recent activity feed
export function useRecentActivity(limit: number = 20) {
  const { user } = useAppSelector(state => state.auth);
  const { isConnected, subscribe } = useRealtime();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.activity.recent(user?.id || '', limit),
    queryFn: async () => {
      const response = await api.get(`/activity/recent?limit=${limit}`);
      return response;
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Real-time updates
  useEffect(() => {
    if (!isConnected || !user) return;

    const unsubscribers = [
      subscribe('activity:new', (data: { userId: string }) => {
        if (data.userId === user.id) {
          queryClient.invalidateQueries({ queryKey: queryKeys.activity.recent(user.id, limit) });
        }
      }),
      subscribe('progress:updated', () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.activity.recent(user.id, limit) });
      }),
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [isConnected, user, subscribe, queryClient, limit]);

  return query;
}