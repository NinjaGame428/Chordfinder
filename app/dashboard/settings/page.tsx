"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  Key,
  Mail,
  Smartphone
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'system',
    notifications: true,
    emailNotifications: true,
    pushNotifications: false,
    autoSave: true,
    showTutorials: true
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(prev => ({ ...prev, ...user.preferences }));
    }
  }, [user]);

  const handlePreferenceChange = async (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    // TODO: Implement preference updates when backend is ready
    console.log('Preference change:', key, value);
  };

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log('Deleting account...');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Customize your Chord Finder experience
            </p>
          </div>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your Chord Finder experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Language</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                    </div>
                  </div>
                  <select 
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                    </div>
                  </div>
                  <select 
                    value={preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Auto-save</Label>
                      <p className="text-sm text-muted-foreground">Automatically save your work</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Show Tutorials</Label>
                      <p className="text-sm text-muted-foreground">Display helpful tutorials</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.showTutorials}
                    onChange={(e) => handlePreferenceChange('showTutorials', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Password</Label>
                    <p className="text-sm text-muted-foreground">Change your password</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">Update your email address</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your data and account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Export Data</Label>
                    <p className="text-sm text-muted-foreground">Download your data</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  Export Data
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trash2 className="h-5 w-5 text-red-500" />
                  <div>
                    <Label className="text-red-600">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
