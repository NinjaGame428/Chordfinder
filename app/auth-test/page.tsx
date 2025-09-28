"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { testSupabaseConnection, testAuthFlow } from '@/lib/auth-test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthTestPage() {
  const { user, login, register, logout, isLoading } = useAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    fullName: '', 
    email: '', 
    password: '' 
  });

  const runTests = async () => {
    console.log('Running authentication tests...');
    
    const connectionTest = await testSupabaseConnection();
    const authTest = await testAuthFlow();
    
    setTestResults({
      connection: connectionTest,
      auth: authTest,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      isLoading
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Testing login...');
    const success = await login(loginData.email, loginData.password);
    console.log('Login result:', success);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Testing registration...');
    const success = await register(registerData);
    console.log('Registration result:', success);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Current State</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {user ? `Logged in as ${user.email}` : 'Not logged in'}
                  </p>
                </div>
                <div>
                  <Label>Loading Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : 'Ready'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connection Tests</h3>
              <Button onClick={runTests} className="mb-4">
                Run Tests
              </Button>
              {testResults && (
                <div className="space-y-2">
                  <div className="p-3 bg-muted rounded">
                    <strong>Connection:</strong> {testResults.connection.success ? '✅ Success' : '❌ Failed'}
                    {testResults.connection.error && (
                      <p className="text-sm text-red-600 mt-1">{testResults.connection.error}</p>
                    )}
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <strong>Auth Flow:</strong> {testResults.auth.success ? '✅ Success' : '❌ Failed'}
                    {testResults.auth.error && (
                      <p className="text-sm text-red-600 mt-1">{testResults.auth.error}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="test@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="password"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Test Login
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="test@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="password"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Test Registration
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {user && (
              <div>
                <h3 className="text-lg font-semibold mb-4">User Actions</h3>
                <Button onClick={logout} variant="destructive">
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
