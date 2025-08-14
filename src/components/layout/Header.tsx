// src/components/layout/Header.tsx

'use client';

import { useAppDispatch } from '@/store';
import { toggleSidebar, toggleMobileMenu } from '@/store/slices/uiSlice';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, User, LogOut, Settings, Crown } from 'lucide-react';
import { UserRole } from '@/types';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export function Header() {
  const dispatch = useAppDispatch();
  // const { sidebarOpen } = useAppSelector(state => state.ui);
  const { user, isAuthenticated } = useCurrentUser();
  const logout = useLogout();
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout.mutate();
    setUserMenuOpen(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case UserRole.ADMIN:
        return <Settings className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        return (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            Super Admin
          </span>
        );
      case UserRole.ADMIN:
        return (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            Admin
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:flex"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AA</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              AlgoArena
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              {/* User Menu Button */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <Image
                      src={user.image} 
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      unoptimized // Add this for external images
                    />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        {user.image ? (
                          <Image 
                            src={user.image} 
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized // Add this for external images
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                        <div className="mt-1">
                          {getRoleBadge(user.role)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {getRoleIcon(user.role)}
                      <span>Profile</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      disabled={logout.isPending}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{logout.isPending ? 'Signing out...' : 'Sign out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => window.location.href = '/auth/login'}
              size="sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}