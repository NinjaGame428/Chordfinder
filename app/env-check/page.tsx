'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Settings, 
  Key, 
  Database,
  Globe,
  Shield,
  RefreshCw
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';

const EnvCheckPage = () => {
  const [envStatus, setEnvStatus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkEnvironmentVariables = async () => {
    setIsLoading(true);
    const results = [];

    // Check required environment variables
    const requiredVars = [
      { name: 'NEXT_PUBLIC_SUPABASE_URL', description: 'Supabase URL', category: 'Database' },
      { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', description: 'Supabase Anon Key', category: 'Database' },
      { name: 'YOUTUBE_API_KEY', description: 'YouTube API Key', category: 'API' },
      { name: 'NEXT_PUBLIC_APP_URL', description: 'App URL', category: 'App' },
      { name: 'NEXTAUTH_SECRET', description: 'NextAuth Secret', category: 'Auth' },
      { name: 'NEXTAUTH_URL', description: 'NextAuth URL', category: 'Auth' }
    ];

    for (const envVar of requiredVars) {
      const value = process.env[envVar.name];
      const isSet = !!value;
      const isSecure = envVar.name.includes('SECRET') || envVar.name.includes('KEY') ? 
        (value ? value.length > 10 : false) : true;

      results.push({
        name: envVar.name,
        description: envVar.description,
        category: envVar.category,
        status: isSet && isSecure ? 'pass' : 'fail',
        message: isSet ? 
          (isSecure ? 'Set and secure' : 'Set but may be insecure') : 
          'Not set',
        value: isSet ? (envVar.name.includes('SECRET') || envVar.name.includes('KEY') ? 
          `${value.substring(0, 8)}...` : value) : 'Not set',
        timestamp: new Date().toISOString()
      });
    }

    // Check optional environment variables
    const optionalVars = [
      { name: 'NODE_ENV', description: 'Node Environment', category: 'App' },
      { name: 'VERCEL', description: 'Vercel Deployment', category: 'Deployment' },
      { name: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics', category: 'Analytics' },
      { name: 'NEXT_PUBLIC_SENTRY_DSN', description: 'Sentry DSN', category: 'Monitoring' }
    ];

    for (const envVar of optionalVars) {
      const value = process.env[envVar.name];
      const isSet = !!value;

      results.push({
        name: envVar.name,
        description: envVar.description,
        category: envVar.category,
        status: isSet ? 'pass' : 'warning',
        message: isSet ? 'Set' : 'Optional - not set',
        value: isSet ? value : 'Not set',
        timestamp: new Date().toISOString()
      });
    }

    setEnvStatus(results);
    setIsLoading(false);
  };

  useEffect(() => {
    checkEnvironmentVariables();
  }, []);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Database':
        return <Database className="h-4 w-4" />;
      case 'API':
        return <Globe className="h-4 w-4" />;
      case 'Auth':
        return <Shield className="h-4 w-4" />;
      case 'App':
        return <Settings className="h-4 w-4" />;
      case 'Deployment':
        return <Globe className="h-4 w-4" />;
      case 'Analytics':
        return <Settings className="h-4 w-4" />;
      case 'Monitoring':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Database':
        return 'bg-blue-100 text-blue-800';
      case 'API':
        return 'bg-green-100 text-green-800';
      case 'Auth':
        return 'bg-purple-100 text-purple-800';
      case 'App':
        return 'bg-orange-100 text-orange-800';
      case 'Deployment':
        return 'bg-cyan-100 text-cyan-800';
      case 'Analytics':
        return 'bg-pink-100 text-pink-800';
      case 'Monitoring':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedResults = envStatus.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, any[]>);

  const overallStatus = envStatus.length > 0 ? 
    (envStatus.some(r => r.status === 'fail') ? 'fail' : 
     envStatus.some(r => r.status === 'warning') ? 'warning' : 'pass') : 'unknown';

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Settings className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-4xl font-bold">Environment Check</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Check environment variables and configuration
            </p>
          </div>

          {/* Overall Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  {getStatusIcon(overallStatus)}
                  <span className="ml-2">Overall Status</span>
                </span>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(overallStatus)}>
                    {overallStatus.toUpperCase()}
                  </Badge>
                  <Button 
                    onClick={checkEnvironmentVariables} 
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {overallStatus === 'pass' && 'All required environment variables are properly configured.'}
                {overallStatus === 'warning' && 'Some optional environment variables are missing, but the app should work.'}
                {overallStatus === 'fail' && 'Some required environment variables are missing or misconfigured.'}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Environment Variables by Category */}
          <div className="space-y-6">
            {Object.entries(groupedResults).map(([category, results]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
                    <Badge className={`ml-auto ${getCategoryColor(category)}`}>
                      {(results as any[]).length} variables
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(results as any[]).map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(result.status)}
                          <div className="flex-1">
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-muted-foreground">{result.description}</div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">
                              Value: {result.value}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(result.status)}>
                            {result.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Environment Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Environment Information</CardTitle>
              <CardDescription>
                Additional environment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Node Environment:</span>
                    <Badge variant="outline">{process.env.NODE_ENV || 'development'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Platform:</span>
                    <span className="text-sm">{typeof window !== 'undefined' ? 'Browser' : 'Server'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Timestamp:</span>
                    <span className="text-sm">{new Date().toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Vercel:</span>
                    <Badge variant={process.env.VERCEL ? 'default' : 'outline'}>
                      {process.env.VERCEL ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Variables:</span>
                    <span className="text-sm">{envStatus.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Passed:</span>
                    <span className="text-sm text-green-600">
                      {envStatus.filter(r => r.status === 'pass').length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EnvCheckPage;
