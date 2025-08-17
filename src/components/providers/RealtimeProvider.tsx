// src/components/providers/RealtimeProvider.tsx

'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch, AppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { socketClient } from '@/lib/socket/client';
import { queryKeys } from '@/lib/query-client';
import { Socket } from 'socket.io-client';

// Define event data types that match backend events
interface QuestionEventData {
  id: string;
  title: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

interface SolutionEventData {
  id: string;
  questionId: string;
  questionTitle: string;
}

interface ApproachEventData {
  id: string;
  userId: string;
  questionId: string;
  questionTitle: string;
}

interface ProgressEventData {
  userId: string;
  questionId: string;
  questionTitle: string;
  solved: boolean;
}

interface UserSolvedEventData {
  userId: string;
  userName: string;
  questionId: string;
  questionTitle: string;
}

interface RoleChangeEventData {
  userId: string;
  newRole: string;
}

interface SystemAnnouncementData {
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface CompilerEventData {
  userId: string;
  language: string;
  status: 'started' | 'completed' | 'error';
}

// Generic event callback type
type EventCallback<T = Record<string, unknown>> = (data: T) => void;

interface RealtimeContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  emit: <T = Record<string, unknown>>(event: string, data?: T) => void;
  subscribe: <T = Record<string, unknown>>(event: string, callback: EventCallback<T>) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<RealtimeContextType['connectionStatus']>('disconnected');
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector(state => state.auth);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketClient.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
      return;
    }

    // Connect to socket
    setConnectionStatus('connecting');
    const socket = socketClient.connect(token);
    socketRef.current = socket;

    // Setup connection event handlers
    const handleConnect = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      dispatch(addToast({
        title: 'Real-time connection established',
        description: 'Live updates are now active',
        type: 'success',
      }));
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };

    const handleConnectError = () => {
      setConnectionStatus('error');
      dispatch(addToast({
        title: 'Connection failed',
        description: 'Real-time updates are unavailable',
        type: 'error',
      }));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Setup real-time event handlers for cache invalidation
    setupRealtimeHandlers(socket, queryClient, dispatch, user?.id);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      
      if (socket.connected) {
        socketClient.disconnect();
      }
      socketRef.current = null;
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, [isAuthenticated, token, user?.id, queryClient, dispatch]);

  const emit = <T = Record<string, unknown>>(event: string, data?: T) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const subscribe = <T = Record<string, unknown>>(event: string, callback: EventCallback<T>) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
      return () => {
        socketRef.current?.off(event, callback);
      };
    }
    return () => {};
  };

  const value: RealtimeContextType = {
    socket: socketRef.current,
    isConnected,
    connectionStatus,
    emit,
    subscribe,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}

// Setup all real-time event handlers for cache invalidation and UI updates
function setupRealtimeHandlers(
  socket: Socket,
  queryClient: QueryClient,
  dispatch: AppDispatch,
  userId?: string
) {
  if (!userId) return; // Can't setup user-specific handlers without userId

  // Define event names as constants to avoid magic strings
  const EVENTS = {
    QUESTION_CREATED: 'question:created',
    QUESTION_UPDATED: 'question:updated', 
    QUESTION_DELETED: 'question:deleted',
    SOLUTION_CREATED: 'solution:created',
    SOLUTION_UPDATED: 'solution:updated',
    SOLUTION_DELETED: 'solution:deleted',
    APPROACH_CREATED: 'approach:created',
    APPROACH_UPDATED: 'approach:updated',
    APPROACH_DELETED: 'approach:deleted',
    PROGRESS_UPDATED: 'progress:updated',
    USER_SOLVED: 'user:solved',
    USER_ROLE_CHANGED: 'user:role_changed',
    SYSTEM_ANNOUNCEMENT: 'system:announcement',
    COMPILATION_COMPLETED: 'compiler:completed',
    COMPILATION_ERROR: 'compiler:error',
  } as const;

  // Question events
  socket.on(EVENTS.QUESTION_CREATED, (data: QuestionEventData) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.questions.counts });
    
    dispatch(addToast({
      title: 'New question added!',
      description: `"${data.title}" is now available`,
      type: 'info',
    }));
  });

  socket.on(EVENTS.QUESTION_UPDATED, (data: QuestionEventData) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.questions.detail(data.id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.questions.list({}) });
    
    dispatch(addToast({
      title: 'Question updated',
      description: `"${data.title}" has been modified`,
      type: 'info',
    }));
  });

  socket.on(EVENTS.QUESTION_DELETED, (data: QuestionEventData) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.questions.all });
    queryClient.removeQueries({ queryKey: queryKeys.questions.detail(data.id) });
    
    dispatch(addToast({
      title: 'Question removed',
      description: `"${data.title}" has been deleted`,
      type: 'warning',
    }));
  });

  // Solution events
  socket.on(EVENTS.SOLUTION_CREATED, (data: SolutionEventData) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.solutions.byQuestion(data.questionId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.questions.detail(data.questionId) });
    
    dispatch(addToast({
      title: 'New solution available!',
      description: `Solution added for "${data.questionTitle}"`,
      type: 'success',
    }));
  });

  socket.on(EVENTS.SOLUTION_UPDATED, (data: SolutionEventData) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.solutions.detail(data.id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.solutions.byQuestion(data.questionId) });
  });

  socket.on(EVENTS.SOLUTION_DELETED, (data: SolutionEventData) => {
    queryClient.removeQueries({ queryKey: queryKeys.solutions.detail(data.id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.solutions.byQuestion(data.questionId) });
  });

  // Approach events (only for current user)
  socket.on(EVENTS.APPROACH_CREATED, (data: ApproachEventData) => {
    if (data.userId === userId) {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.approaches.byQuestion(data.questionId, userId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.approaches.sizeUsage(data.questionId, userId) 
      });
    }
  });

  socket.on(EVENTS.APPROACH_UPDATED, (data: ApproachEventData) => {
    if (data.userId === userId) {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.approaches.detail(data.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.approaches.sizeUsage(data.questionId, userId) 
      });
    }
  });

  socket.on(EVENTS.APPROACH_DELETED, (data: ApproachEventData) => {
    if (data.userId === userId) {
      queryClient.removeQueries({ 
        queryKey: queryKeys.approaches.detail(data.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.approaches.byQuestion(data.questionId, userId) 
      });
    }
  });

  // Progress events
  socket.on(EVENTS.PROGRESS_UPDATED, (data: ProgressEventData) => {
    if (data.userId === userId) {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.progress.byQuestion(data.questionId, userId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.progress.stats(userId) 
      });
      
      if (data.solved) {
        dispatch(addToast({
          title: '🎉 Congratulations!',
          description: `You solved "${data.questionTitle}"!`,
          type: 'success',
        }));
      }
    }
  });

  socket.on(EVENTS.USER_SOLVED, (data: UserSolvedEventData) => {
    // Show celebration for any user solving a question
    dispatch(addToast({
      title: '🏆 Someone solved a question!',
      description: `${data.userName} solved "${data.questionTitle}"`,
      type: 'success',
    }));
  });

  // Admin events
  socket.on(EVENTS.USER_ROLE_CHANGED, (data: RoleChangeEventData) => {
    if (data.userId === userId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      
      dispatch(addToast({
        title: 'Role updated',
        description: `Your role has been changed to ${data.newRole}`,
        type: 'info',
      }));
    }
  });

  socket.on(EVENTS.SYSTEM_ANNOUNCEMENT, (data: SystemAnnouncementData) => {
    dispatch(addToast({
      title: 'System Announcement',
      description: data.message,
      type: 'info',
    }));
  });

  // Compiler events
  socket.on(EVENTS.COMPILATION_COMPLETED, (data: CompilerEventData) => {
    if (data.userId === userId) {
      dispatch(addToast({
        title: 'Code executed successfully',
        description: 'Check the output below',
        type: 'success',
      }));
    }
  });

  socket.on(EVENTS.COMPILATION_ERROR, (data: CompilerEventData) => {
    if (data.userId === userId) {
      dispatch(addToast({
        title: 'Compilation failed',
        description: 'Check your code for errors',
        type: 'error',
      }));
    }
  });
}