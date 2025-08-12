// src/components/layout/MainLayout.tsx

'use client';

import { useAppSelector } from '@/store';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen, mobileMenuOpen } = useAppSelector(state => state.ui);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && <MobileNav />}
      
      <div className="flex pt-16"> {/* pt-16 for fixed header */}
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-30',
            'lg:relative lg:top-0 lg:h-[calc(100vh-4rem)]',
            sidebarOpen 
              ? 'w-64 translate-x-0' 
              : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'
          )}
        >
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 transition-all duration-300',
            sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
          )}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => {
            // Will implement sidebar close action
          }}
        />
      )}
    </div>
  );
}