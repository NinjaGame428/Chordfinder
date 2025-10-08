'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Database,
  Mail,
  Shield,
  Bell,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'PhinAccords',
    siteDescription: 'Ultra-fast Gospel Chords webapp with 100x performance optimization',
    siteUrl: 'https://heavenkeys-chords-finder.vercel.app',
    adminEmail: 'admin@heavenkeys.ca',
    
    // Database Settings
    databaseUrl: 'Connected to Supabase',
    databaseStatus: 'healthy',
    lastBackup: '2024-01-15 10:30:00',
    
    // Email Settings
    emailProvider: 'Supabase Auth',
    emailEnabled: true,
    smtpHost: 'smtp.supabase.com',
    smtpPort: 587,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    ipWhitelist: false,
    
    // Notification Settings
    emailNotifications: true,
    systemAlerts: true,
    maintenanceMode: false,
    
    // Performance Settings
    cachingEnabled: true,
    cdnEnabled: true,
    compressionEnabled: true,
    imageOptimization: true
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">
                  Configure your application settings and preferences
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave} disabled={saving}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
            
            {/* Save Status */}
            {saveStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-green-800">Settings saved successfully!</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-red-800">Failed to save settings. Please try again.</span>
              </div>
            )}
          </div>

          {/* General Settings */}
          <Card className="mb-6">
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
                  />
                </div>
                <div>
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Database Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database Settings
              </CardTitle>
              <CardDescription>
                Database connection and health status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Database Status</span>
                <Badge className={getStatusColor(settings.databaseStatus)}>
                  {settings.databaseStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Connection</span>
                <span className="text-sm text-muted-foreground">{settings.databaseUrl}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Backup</span>
                <span className="text-sm text-muted-foreground">{settings.lastBackup}</span>
              </div>
              <Button variant="outline" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Test Database Connection
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
                </div>
                <Switch
                  id="ipWhitelist"
                  checked={settings.ipWhitelist}
                  onCheckedChange={(checked) => setSettings({...settings, ipWhitelist: checked})}
                />
              </div>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email alerts for system events</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemAlerts">System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Show system alerts in admin panel</p>
                </div>
                <Switch
                  id="systemAlerts"
                  checked={settings.systemAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, systemAlerts: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Performance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Performance Settings
              </CardTitle>
              <CardDescription>
                Optimize application performance and caching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cachingEnabled">Caching Enabled</Label>
                  <p className="text-sm text-muted-foreground">Enable application caching</p>
                </div>
                <Switch
                  id="cachingEnabled"
                  checked={settings.cachingEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, cachingEnabled: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cdnEnabled">CDN Enabled</Label>
                  <p className="text-sm text-muted-foreground">Use CDN for static assets</p>
                </div>
                <Switch
                  id="cdnEnabled"
                  checked={settings.cdnEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, cdnEnabled: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compressionEnabled">Compression Enabled</Label>
                  <p className="text-sm text-muted-foreground">Enable gzip compression</p>
                </div>
                <Switch
                  id="compressionEnabled"
                  checked={settings.compressionEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, compressionEnabled: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="imageOptimization">Image Optimization</Label>
                  <p className="text-sm text-muted-foreground">Optimize images automatically</p>
                </div>
                <Switch
                  id="imageOptimization"
                  checked={settings.imageOptimization}
                  onCheckedChange={(checked) => setSettings({...settings, imageOptimization: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
};

export default SettingsPage;
