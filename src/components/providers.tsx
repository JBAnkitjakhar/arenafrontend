// src/components/providers.tsx

'use client';

import { Provider } from 'react-redux';
import {QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '@/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { initializeAuth } from '@/store/slices/authSlice';

// Auth initializer component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth());
  }, [dispatch]);
  
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
        </AuthInitializer>
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