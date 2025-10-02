'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  LogIn,
  LogOut,
  UserPlus,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';

const AuthTestPage = () => {
  const { user, login, logout, register, isLoading } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runAuthTests = async () => {
    const results = [];
    
    // Test 1: Check if user is loaded
    results.push({
      test: 'User State Check',
      status: user ? 'pass' : 'fail',
      message: user ? `User loaded: ${user.email}` : 'No user loaded',
      timestamp: new Date().toISOString()
    });

    // Test 2: Check authentication status
    results.push({
      test: 'Authentication Status',
      status: user ? 'pass' : 'fail',
      message: user ? 'User is authenticated' : 'User is not authenticated',
      timestamp: new Date().toISOString()
    });

    // Test 3: Check user role
    if (user) {
      results.push({
        test: 'User Role Check',
        status: 'pass',
        message: `User role: ${user.role || 'No role assigned'}`,
        timestamp: new Date().toISOString()
      });
    }

    // Test 4: Check loading state
    results.push({
      test: 'Loading State Check',
      status: isLoading ? 'warning' : 'pass',
      message: isLoading ? 'Auth is currently loading' : 'Auth is not loading',
      timestamp: new Date().toISOString()
    });

    // Test 5: Check for errors
    results.push({
      test: 'Error State Check',
      status: error ? 'fail' : 'pass',
      message: error ? `Error: ${error}` : 'No authentication errors',
      timestamp: new Date().toISOString()
    });

    setTestResults(results);
  };

  const handleTestLogin = async () => {
    try {
      setError(null);
      const success = await login(testEmail, testPassword);
      if (!success) {
        setError('Login failed - check credentials');
      }
      await runAuthTests();
    } catch (err) {
      console.error('Test login failed:', err);
      setError('Login test failed');
    }
  };

  const handleTestLogout = async () => {
    try {
      setError(null);
      await logout();
      await runAuthTests();
    } catch (err) {
      console.error('Test logout failed:', err);
      setError('Logout test failed');
    }
  };

  const handleTestRegister = async () => {
    try {
      setError(null);
      const success = await register({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: testPassword
      });
      if (!success) {
        setError('Registration failed - user may already exist');
      }
      await runAuthTests();
    } catch (err) {
      console.error('Test registration failed:', err);
      setError('Registration test failed');
    }
  };

  useEffect(() => {
    runAuthTests();
  }, [user, isLoading, error]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-4xl font-bold">Authentication Test Page</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Test and debug authentication functionality
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Auth State */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Current Authentication State
                </CardTitle>
                <CardDescription>
                  Real-time authentication status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">User Status:</span>
                  <Badge className={user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {user ? 'Authenticated' : 'Not Authenticated'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Loading:</span>
                  <Badge className={isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                    {isLoading ? 'Loading...' : 'Ready'}
                  </Badge>
                </div>

                {user && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Email:</span>
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Role:</span>
                        <Badge variant="outline">{user.role || 'User'}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">User ID:</span>
                        <span className="text-xs font-mono">{user.id}</span>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <>
                    <Separator />
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">Error: {error}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Test Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-6 w-6 mr-2" />
                  Test Controls
                </CardTitle>
                <CardDescription>
                  Test authentication functions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-email">Test Email</Label>
                  <Input
                    id="test-email"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-password">Test Password</Label>
                  <Input
                    id="test-password"
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="password123"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={handleTestLogin} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Test Login
                  </Button>
                  
                  <Button 
                    onClick={handleTestRegister} 
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Test Register
                  </Button>
                  
                  <Button 
                    onClick={handleTestLogout} 
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Test Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Results */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Automated test results for authentication functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-muted-foreground">{result.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AuthTestPage;
