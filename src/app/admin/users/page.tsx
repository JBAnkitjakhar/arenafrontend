// src/app/admin/users/page.tsx somthing need to add at line 40

'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useAuth';
import { useRoleManagement } from '@/lib/super-admin';
import { AdminRoute } from '@/components/auth/RouteGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  Crown, 
  Shield, 
  User as UserIcon,
  Calendar,
  Mail,
  Edit,
  AlertTriangle
} from 'lucide-react';
import { UserRole, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

// Local Input component to avoid conflicts
const UsersInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

// TODO: Replace with real API hook for users
// For now, we'll use an empty array and show appropriate empty states
const useUsers = () => {
  // This would be replaced with actual API call
  return {
    data: [] as User[],
    isLoading: false,
    error: null
  };
};

export default function AdminUsersPage() {
  const { user: currentUser } = useCurrentUser();
  const { checkCanModifyUser, isProtectedSuperAdmin, SUPER_ADMIN_EMAIL } = useRoleManagement();
  const { data: users = [], isLoading } = useUsers();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [showRoleModal, setShowRoleModal] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>(UserRole.USER);

  // Filter users based on search and role
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: users.length,
    byRole: {
      [UserRole.SUPERADMIN]: users.filter((u: User) => u.role === UserRole.SUPERADMIN).length,
      [UserRole.ADMIN]: users.filter((u: User) => u.role === UserRole.ADMIN).length,
      [UserRole.USER]: users.filter((u: User) => u.role === UserRole.USER).length,
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case UserRole.ADMIN:
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      [UserRole.SUPERADMIN]: 'bg-yellow-100 text-yellow-800',
      [UserRole.ADMIN]: 'bg-blue-100 text-blue-800',
      [UserRole.USER]: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <Badge className={styles[role]}>
        <div className="flex items-center space-x-1">
          {getRoleIcon(role)}
          <span>{role}</span>
        </div>
      </Badge>
    );
  };

  const handleRoleChange = (user: User) => {
    if (!currentUser?.role) return;
    
    const canModify = checkCanModifyUser(user.email, currentUser.role);
    
    if (!canModify.canChangeRole) {
      alert(canModify.reason || 'Cannot modify this user');
      return;
    }
    
    setShowRoleModal(user);
    setNewRole(user.role);
  };

  const confirmRoleChange = () => {
    if (showRoleModal) {
      // Here you would call the API to update the user's role
      // console.log(`Changing ${showRoleModal.email} role to ${newRole}`);
      // For now, just close the modal
      setShowRoleModal(null);
    }
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-1">
              View and manage user accounts and permissions
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              {userStats.total} Total Users
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{userStats.total}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{userStats.byRole[UserRole.SUPERADMIN]}</div>
                  <div className="text-sm text-gray-600">Super Admins</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{userStats.byRole[UserRole.ADMIN]}</div>
                  <div className="text-sm text-gray-600">Admins</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-2xl font-bold">{userStats.byRole[UserRole.USER]}</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <UsersInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value={UserRole.SUPERADMIN}>Super Admin</option>
                <option value={UserRole.ADMIN}>Admin</option>
                <option value={UserRole.USER}>User</option>
              </select>

              {/* Clear Filters */}
              {(searchQuery || selectedRole) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('');
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Super Admin Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Super Admin Protection</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  The account <strong>{SUPER_ADMIN_EMAIL}</strong> is protected and cannot have its role changed. 
                  Only super admins can modify other users roles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">
                    {users.length === 0 
                      ? 'No users are registered yet.' 
                      : searchQuery || selectedRole 
                      ? 'Try adjusting your filters.' 
                      : 'No users available.'
                    }
                  </p>
                </div>
              ) : (
                filteredUsers.map((user: User) => {
                  const canModify = currentUser?.role ? checkCanModifyUser(user.email, currentUser.role) : { canChangeRole: false, reason: 'No permission' };
                  const isProtected = isProtectedSuperAdmin(user.email);
                  
                  return (
                    <div
                      key={user.id}
                      className={`border rounded-lg p-4 ${
                        isProtected ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {user.image ? (
                              <Image 
                                src={user.image} 
                                alt={user.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserIcon className="h-6 w-6 text-gray-600" />
                            )}
                          </div>
                          
                          {/* User Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {user.name}
                              </h3>
                              {getRoleBadge(user.role)}
                              {isProtected && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Protected
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{user.email}</span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {canModify.canChangeRole ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRoleChange(user)}
                              className="flex items-center space-x-1"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Change Role</span>
                            </Button>
                          ) : (
                            <div className="text-xs text-gray-500 italic">
                              {canModify.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role Change Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change User Role
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User: {showRoleModal.name} ({showRoleModal.email})
                  </label>
                  <p className="text-sm text-gray-600">
                    Current role: {getRoleBadge(showRoleModal.role)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={UserRole.USER}>User</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    {currentUser?.role === UserRole.SUPERADMIN && (
                      <option value={UserRole.SUPERADMIN}>Super Admin</option>
                    )}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowRoleModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmRoleChange}
                  disabled={newRole === showRoleModal.role}
                >
                  Change Role
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}