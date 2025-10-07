'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Mail, 
  Shield, 
  Bell,
  Globe,
  Lock,
  Users,
  Music,
  BarChart3
} from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Gospel Chords',
    siteDescription: 'Ultra-fast Gospel Chords webapp',
    siteUrl: 'https://gospel-chords.vercel.app',
    
    // User Settings
    allowRegistration: true,
    requireEmailVerification: true,
    allowGuestAccess: false,
    maxUsersPerDay: 100,
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@gospel-chords.com',
    fromName: 'Gospel Chords',
    
    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    
    // Analytics Settings
    enableAnalytics: true,
    enableUserTracking: true,
    enableLocationTracking: true,
    analyticsRetention: 365,
    
    // Content Settings
    allowUserUploads: true,
    maxFileSize: 10,
    allowedFileTypes: ['mp3', 'wav', 'pdf'],
    autoApproveSongs: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    adminNotifications: true,
    userNotifications: true
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // TODO: Implement settings save API
      console.log('Saving settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // TODO: Implement settings reset
    console.log('Reset settings');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-muted-foreground">
            Configure your application settings and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">{success}</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            General Settings
          </CardTitle>
          <CardDescription>
            Basic application configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                placeholder="Your site name"
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                placeholder="https://your-site.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              placeholder="Brief description of your site"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Settings
          </CardTitle>
          <CardDescription>
            Configure user registration and access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowRegistration">Allow User Registration</Label>
              <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
            </div>
            <Switch
              id="allowRegistration"
              checked={settings.allowRegistration}
              onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
              <p className="text-sm text-muted-foreground">Users must verify their email before accessing the site</p>
            </div>
            <Switch
              id="requireEmailVerification"
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowGuestAccess">Allow Guest Access</Label>
              <p className="text-sm text-muted-foreground">Allow users to browse without registration</p>
            </div>
            <Switch
              id="allowGuestAccess"
              checked={settings.allowGuestAccess}
              onCheckedChange={(checked) => setSettings({...settings, allowGuestAccess: checked})}
            />
          </div>
          <div>
            <Label htmlFor="maxUsersPerDay">Max Users Per Day</Label>
            <Input
              id="maxUsersPerDay"
              type="number"
              value={settings.maxUsersPerDay}
              onChange={(e) => setSettings({...settings, maxUsersPerDay: parseInt(e.target.value)})}
              placeholder="100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
            </div>
            <Switch
              id="enableTwoFactor"
              checked={settings.enableTwoFactor}
              onCheckedChange={(checked) => setSettings({...settings, enableTwoFactor: checked})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                placeholder="24"
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="passwordMinLength">Password Min Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                placeholder="8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Analytics Settings
          </CardTitle>
          <CardDescription>
            Configure analytics and user tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableAnalytics">Enable Analytics</Label>
              <p className="text-sm text-muted-foreground">Track user behavior and site performance</p>
            </div>
            <Switch
              id="enableAnalytics"
              checked={settings.enableAnalytics}
              onCheckedChange={(checked) => setSettings({...settings, enableAnalytics: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableUserTracking">Enable User Tracking</Label>
              <p className="text-sm text-muted-foreground">Track individual user sessions and activities</p>
            </div>
            <Switch
              id="enableUserTracking"
              checked={settings.enableUserTracking}
              onCheckedChange={(checked) => setSettings({...settings, enableUserTracking: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableLocationTracking">Enable Location Tracking</Label>
              <p className="text-sm text-muted-foreground">Track user location for analytics</p>
            </div>
            <Switch
              id="enableLocationTracking"
              checked={settings.enableLocationTracking}
              onCheckedChange={(checked) => setSettings({...settings, enableLocationTracking: checked})}
            />
          </div>
          <div>
            <Label htmlFor="analyticsRetention">Analytics Retention (days)</Label>
            <Input
              id="analyticsRetention"
              type="number"
              value={settings.analyticsRetention}
              onChange={(e) => setSettings({...settings, analyticsRetention: parseInt(e.target.value)})}
              placeholder="365"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="h-5 w-5 mr-2" />
            Content Settings
          </CardTitle>
          <CardDescription>
            Configure content management and user uploads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowUserUploads">Allow User Uploads</Label>
              <p className="text-sm text-muted-foreground">Allow users to upload their own content</p>
            </div>
            <Switch
              id="allowUserUploads"
              checked={settings.allowUserUploads}
              onCheckedChange={(checked) => setSettings({...settings, allowUserUploads: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoApproveSongs">Auto-Approve Songs</Label>
              <p className="text-sm text-muted-foreground">Automatically approve uploaded songs</p>
            </div>
            <Switch
              id="autoApproveSongs"
              checked={settings.autoApproveSongs}
              onCheckedChange={(checked) => setSettings({...settings, autoApproveSongs: checked})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes.join(', ')}
                onChange={(e) => setSettings({...settings, allowedFileTypes: e.target.value.split(', ').filter(Boolean)})}
                placeholder="mp3, wav, pdf"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
