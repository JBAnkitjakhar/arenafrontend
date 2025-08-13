// src/app/admin/settings/page.tsx - Fixed version

'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  Database,
  Users,
  Shield,
  Bell,
  Globe,
  Mail,
  Server,
  Code,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

// Local Input component to avoid conflicts
const SettingsInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50',
      className
    )}
    {...props}
  />
);

interface SettingCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}

const SettingCard = ({ title, description, icon: Icon, children, className }: SettingCardProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className="flex items-center text-lg">
        <Icon className="h-5 w-5 mr-2" />
        {title}
      </CardTitle>
      <p className="text-sm text-gray-600">{description}</p>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

const ToggleSwitch = ({ enabled, onChange, label }: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  </div>
);

// Settings type interface
interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  defaultUserRole: string;
  maxUsersPerDay: number;
  sessionTimeout: number;
  passwordMinLength: number;
  requireTwoFactor: boolean;
  allowOAuth: boolean;
  maxLoginAttempts: number;
  rateLimitPerHour: number;
  enableApiDocs: boolean;
  apiTimeout: number;
  maxFileSize: number;
  emailNotifications: boolean;
  systemAlerts: boolean;
  userWelcomeEmail: boolean;
  adminNotifications: boolean;
}

export default function AdminSettingsPage() {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Mock settings state - replace with real API calls
  const [settings, setSettings] = useState<SystemSettings>({
    // General Settings
    siteName: 'AlgoArena',
    siteDescription: 'Master Data Structures & Algorithms',
    contactEmail: 'admin@algoarena.com',
    maintenanceMode: false,
    
    // User Settings
    allowRegistration: true,
    requireEmailVerification: true,
    defaultUserRole: 'USER',
    maxUsersPerDay: 100,
    
    // Security Settings
    sessionTimeout: 24, // hours
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowOAuth: true,
    maxLoginAttempts: 5,
    
    // API Settings
    rateLimitPerHour: 1000,
    enableApiDocs: true,
    apiTimeout: 30, // seconds
    maxFileSize: 10, // MB
    
    // Notifications
    emailNotifications: true,
    systemAlerts: true,
    userWelcomeEmail: true,
    adminNotifications: true,
  });

  const isSuperAdmin = user?.role === UserRole.SUPERADMIN;

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only Super Administrators can access system settings.</p>
        </CardContent>
      </Card>
    );
  }

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // API call to save settings
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
    // Show success toast
  };

  const handleReset = () => {
    // Reset to default or last saved values
    setUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {unsavedChanges && (
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
          <Button variant="outline" onClick={handleReset} disabled={!unsavedChanges}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!unsavedChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SettingCard
              title="Site Configuration"
              description="Basic site information and branding"
              icon={Globe}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <SettingsInput
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    placeholder="AlgoArena"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <SettingsInput
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    placeholder="Master Data Structures & Algorithms"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <SettingsInput
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                    placeholder="admin@algoarena.com"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="System Status"
              description="Control system availability and maintenance"
              icon={Settings}
            >
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.maintenanceMode}
                  onChange={(value) => updateSetting('maintenanceMode', value)}
                  label="Maintenance Mode"
                />
                {settings.maintenanceMode && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Maintenance Mode Enabled
                        </p>
                        <p className="text-sm text-amber-700">
                          Only administrators can access the system when maintenance mode is active.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SettingCard>
          </div>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SettingCard
              title="Registration Settings"
              description="Control how new users can join the platform"
              icon={Users}
            >
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.allowRegistration}
                  onChange={(value) => updateSetting('allowRegistration', value)}
                  label="Allow New Registrations"
                />
                <ToggleSwitch
                  enabled={settings.requireEmailVerification}
                  onChange={(value) => updateSetting('requireEmailVerification', value)}
                  label="Require Email Verification"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default User Role
                  </label>
                  <select
                    value={settings.defaultUserRole}
                    onChange={(e) => updateSetting('defaultUserRole', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                  </select>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="User Limits"
              description="Set limits on user registration and activity"
              icon={Database}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max New Users Per Day
                  </label>
                  <SettingsInput
                    type="number"
                    value={settings.maxUsersPerDay}
                    onChange={(e) => updateSetting('maxUsersPerDay', parseInt(e.target.value))}
                    min="1"
                    max="1000"
                  />
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Rate Limiting
                      </p>
                      <p className="text-sm text-blue-700">
                        This setting helps prevent spam registrations and manages server load.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SettingCard
              title="Authentication Security"
              description="Configure password and login security settings"
              icon={Shield}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (hours)
                  </label>
                  <SettingsInput
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                    min="1"
                    max="168"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <SettingsInput
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
                    min="6"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <SettingsInput
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Advanced Security"
              description="Enhanced security features and OAuth settings"
              icon={Code}
            >
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.requireTwoFactor}
                  onChange={(value) => updateSetting('requireTwoFactor', value)}
                  label="Require Two-Factor Authentication"
                />
                <ToggleSwitch
                  enabled={settings.allowOAuth}
                  onChange={(value) => updateSetting('allowOAuth', value)}
                  label="Allow OAuth Login (Google, GitHub)"
                />
                {settings.requireTwoFactor && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Enhanced Security
                        </p>
                        <p className="text-sm text-green-700">
                          Two-factor authentication significantly improves account security.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SettingCard>
          </div>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SettingCard
              title="API Configuration"
              description="Configure API limits and documentation access"
              icon={Server}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Limit (requests per hour)
                  </label>
                  <SettingsInput
                    type="number"
                    value={settings.rateLimitPerHour}
                    onChange={(e) => updateSetting('rateLimitPerHour', parseInt(e.target.value))}
                    min="100"
                    max="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Timeout (seconds)
                  </label>
                  <SettingsInput
                    type="number"
                    value={settings.apiTimeout}
                    onChange={(e) => updateSetting('apiTimeout', parseInt(e.target.value))}
                    min="10"
                    max="120"
                  />
                </div>
                <ToggleSwitch
                  enabled={settings.enableApiDocs}
                  onChange={(value) => updateSetting('enableApiDocs', value)}
                  label="Enable API Documentation"
                />
              </div>
            </SettingCard>

            <SettingCard
              title="File Upload Settings"
              description="Configure file upload limits and restrictions"
              icon={Database}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max File Size (MB)
                  </label>
                  <SettingsInput
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Supported formats:</strong> Images (JPG, PNG, GIF), Documents (PDF), 
                    Code files (TXT, HTML, CSS, JS), Archive files (ZIP)
                  </p>
                </div>
              </div>
            </SettingCard>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SettingCard
              title="Email Notifications"
              description="Configure when and how email notifications are sent"
              icon={Mail}
            >
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.emailNotifications}
                  onChange={(value) => updateSetting('emailNotifications', value)}
                  label="Enable Email Notifications"
                />
                <ToggleSwitch
                  enabled={settings.userWelcomeEmail}
                  onChange={(value) => updateSetting('userWelcomeEmail', value)}
                  label="Send Welcome Email to New Users"
                />
                <ToggleSwitch
                  enabled={settings.adminNotifications}
                  onChange={(value) => updateSetting('adminNotifications', value)}
                  label="Admin Email Notifications"
                />
              </div>
            </SettingCard>

            <SettingCard
              title="System Alerts"
              description="Configure system monitoring and alert preferences"
              icon={Bell}
            >
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={settings.systemAlerts}
                  onChange={(value) => updateSetting('systemAlerts', value)}
                  label="Enable System Alerts"
                />
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Alert Types
                      </p>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Server errors and downtime</li>
                        <li>• High traffic or resource usage</li>
                        <li>• Security incidents</li>
                        <li>• Database connection issues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}