// src/lib/socket/client.ts  at 70 line

import { io, Socket } from 'socket.io-client';

// Define event data types
interface QuestionEvent {
  id: string;
  title: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

interface ProgressEvent {
  userId: string;
  questionId: string;
  questionTitle: string;
  solved: boolean;
}

interface UserSolvedEvent {
  userId: string;
  userName: string;
  questionId: string;
  questionTitle: string;
}

interface SystemEvent {
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface CompilerEvent {
  userId: string;
  language: string;
  status: 'started' | 'completed' | 'error';
  output?: string;
  error?: string;
}

// Union type for all possible event data
type SocketEventData = 
  | QuestionEvent 
  | ProgressEvent 
  | UserSolvedEvent 
  | SystemEvent 
  | CompilerEvent 
  | Record<string, unknown>;

// Event callback type
type EventCallback<T = SocketEventData> = (data: T) => void;

class SocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting) {
      return this.socket!;
    }

    this.isConnecting = true;

    // Use the correct API base URL from environment
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'https://algoarena-api.com'
      : 'http://localhost:8080'; // Remove /api for socket connection

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      retries: 3,
    });

    this.setupEventHandlers();
    this.isConnecting = false;

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, reconnect manually
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('🔴 Socket connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_failed', () => {
      console.error('💥 Socket reconnection failed after maximum attempts');
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('🚫 Maximum reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
      }
    }, delay);
  }

  // Event emission helpers - properly typed
  emit<T = SocketEventData>(event: string, data?: T): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️  Cannot emit '${event}': Socket not connected`);
    }
  }

  // Event subscription helpers - properly typed
  on<T = SocketEventData>(event: string, callback: EventCallback<T>): void {
    this.socket?.on(event, callback);
  }

  off<T = SocketEventData>(event: string, callback?: EventCallback<T>): void {
    this.socket?.off(event, callback);
  }

  // Specialized event subscription methods with proper typing
  onQuestionEvent(event: string, callback: EventCallback<QuestionEvent>): void {
    this.socket?.on(event, callback);
  }

  onProgressEvent(event: string, callback: EventCallback<ProgressEvent>): void {
    this.socket?.on(event, callback);
  }

  onSystemEvent(event: string, callback: EventCallback<SystemEvent>): void {
    this.socket?.on(event, callback);
  }

  onCompilerEvent(event: string, callback: EventCallback<CompilerEvent>): void {
    this.socket?.on(event, callback);
  }

  // Real-time event types
  static Events = {
    // Question events
    QUESTION_CREATED: 'question:created',
    QUESTION_UPDATED: 'question:updated',
    QUESTION_DELETED: 'question:deleted',
    
    // Solution events
    SOLUTION_CREATED: 'solution:created',
    SOLUTION_UPDATED: 'solution:updated',
    SOLUTION_DELETED: 'solution:deleted',
    
    // Approach events
    APPROACH_CREATED: 'approach:created',
    APPROACH_UPDATED: 'approach:updated',
    APPROACH_DELETED: 'approach:deleted',
    
    // Progress events
    PROGRESS_UPDATED: 'progress:updated',
    USER_SOLVED: 'user:solved',
    
    // Admin events
    USER_ROLE_CHANGED: 'user:role_changed',
    SYSTEM_ANNOUNCEMENT: 'system:announcement',
    
    // Compiler events
    COMPILATION_STARTED: 'compiler:started',
    COMPILATION_COMPLETED: 'compiler:completed',
    COMPILATION_ERROR: 'compiler:error',
  } as const;
}

export const socketClient = new SocketClient();
export default socketClient;