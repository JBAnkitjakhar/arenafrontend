// src/components/providers.tsx

'use client';

import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { queryClient } from '@/lib/query-client';
import { RealtimeProvider } from '@/components/providers/RealtimeProvider';
import { api } from '@/lib/api/client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { initializeAuth } from '@/store/slices/authSlice';

// Auth initializer component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth());
    
    // Initialize API client token
    api.initializeToken();
  }, [dispatch]);
  
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <RealtimeProvider>
            {children}
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #444',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                  style: {
                    background: '#065f46',
                    color: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                  style: {
                    background: '#7f1d1d',
                    color: '#fff',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: '#3b82f6',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </RealtimeProvider>
        </AuthInitializer>
        
        {/* Development tools - Fixed props */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools 
            initialIsOpen={false} 
            buttonPosition="bottom-right"
          />
        )}
      </QueryClientProvider>
    </Provider>
  );
}