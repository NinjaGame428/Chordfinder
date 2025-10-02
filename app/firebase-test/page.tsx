'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database, 
  Flame, 
  Shield,
  RefreshCw,
  Upload,
  Download,
  Trash2
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';

const FirebaseTestPage = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState({
    collection: 'test-collection',
    document: 'test-doc',
    field: 'test-field',
    value: 'test-value'
  });

  const runFirebaseTests = async () => {
    setIsLoading(true);
    const results = [];

    // Test 1: Check Firebase configuration
    results.push({
      test: 'Firebase Configuration',
      status: 'warning',
      message: 'Firebase configuration check not implemented',
      timestamp: new Date().toISOString()
    });

    // Test 2: Check environment variables
    const hasFirebaseConfig = !!(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      process.env.FIREBASE_API_KEY
    );
    
    results.push({
      test: 'Firebase Environment Variables',
      status: hasFirebaseConfig ? 'pass' : 'fail',
      message: hasFirebaseConfig ? 'Firebase environment variables found' : 'No Firebase environment variables found',
      timestamp: new Date().toISOString()
    });

    // Test 3: Check if Firebase is available
    const firebaseAvailable = typeof window !== 'undefined' && 
      (window as any).firebase || 
      (window as any).firebaseApp;
    
    results.push({
      test: 'Firebase SDK Availability',
      status: firebaseAvailable ? 'pass' : 'warning',
      message: firebaseAvailable ? 'Firebase SDK is available' : 'Firebase SDK not loaded (this is normal if using Supabase)',
      timestamp: new Date().toISOString()
    });

    // Test 4: Check for Firebase vs Supabase usage
    const hasSupabaseConfig = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    results.push({
      test: 'Database Configuration',
      status: hasSupabaseConfig ? 'pass' : 'warning',
      message: hasSupabaseConfig ? 
        'Using Supabase (Firebase alternative)' : 
        'No database configuration found',
      timestamp: new Date().toISOString()
    });

    // Test 5: Check authentication method
    results.push({
      test: 'Authentication Method',
      status: 'info',
      message: 'Using NextAuth with Supabase (not Firebase Auth)',
      timestamp: new Date().toISOString()
    });

    setTestResults(results);
    setIsLoading(false);
  };

  const testFirebaseConnection = async () => {
    try {
      // This would be where you'd test actual Firebase connection
      // For now, we'll simulate it
      const results = [...testResults];
      results.push({
        test: 'Firebase Connection Test',
        status: 'warning',
        message: 'Firebase connection test not implemented - using Supabase instead',
        timestamp: new Date().toISOString()
      });
      setTestResults(results);
    } catch (error) {
      console.error('Firebase connection test failed:', error);
    }
  };

  const testFirestoreOperations = async () => {
    try {
      // This would test Firestore read/write operations
      const results = [...testResults];
      results.push({
        test: 'Firestore Operations',
        status: 'warning',
        message: 'Firestore operations not available - using Supabase instead',
        timestamp: new Date().toISOString()
      });
      setTestResults(results);
    } catch (error) {
      console.error('Firestore operations test failed:', error);
    }
  };

  useEffect(() => {
    runFirebaseTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
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
      case 'info':
        return 'bg-blue-100 text-blue-800';
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
              <Flame className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-4xl font-bold">Firebase Test Page</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Test Firebase integration and database operations
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> This project uses Supabase instead of Firebase. 
                This page is for testing Firebase integration if you decide to switch.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-6 w-6 mr-2" />
                  Test Controls
                </CardTitle>
                <CardDescription>
                  Run Firebase tests and operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Label htmlFor="collection">Collection</Label>
                    <Label htmlFor="document">Document</Label>
                    <Input
                      id="collection"
                      value={testData.collection}
                      onChange={(e) => setTestData({...testData, collection: e.target.value})}
                      placeholder="test-collection"
                    />
                    <Input
                      id="document"
                      value={testData.document}
                      onChange={(e) => setTestData({...testData, document: e.target.value})}
                      placeholder="test-doc"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Label htmlFor="field">Field</Label>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="field"
                      value={testData.field}
                      onChange={(e) => setTestData({...testData, field: e.target.value})}
                      placeholder="test-field"
                    />
                    <Input
                      id="value"
                      value={testData.value}
                      onChange={(e) => setTestData({...testData, value: e.target.value})}
                      placeholder="test-value"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button 
                    onClick={runFirebaseTests} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Run Firebase Tests
                  </Button>
                  
                  <Button 
                    onClick={testFirebaseConnection} 
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  
                  <Button 
                    onClick={testFirestoreOperations} 
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Test Firestore
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  Current Configuration
                </CardTitle>
                <CardDescription>
                  Firebase configuration status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Firebase API Key:</span>
                    <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'default' : 'outline'}>
                      {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not Set'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Firebase Project ID:</span>
                    <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'default' : 'outline'}>
                      {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not Set'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Firebase Auth Domain:</span>
                    <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'default' : 'outline'}>
                      {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not Set'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Firebase Storage Bucket:</span>
                    <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'default' : 'outline'}>
                      {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not Set'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Firebase Messaging Sender ID:</span>
                    <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'default' : 'outline'}>
                      {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not Set'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-yellow-700">
                      This project is configured to use Supabase instead of Firebase.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Results */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Firebase integration test results
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

export default FirebaseTestPage;
