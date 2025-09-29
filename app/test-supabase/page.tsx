"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export default function TestSupabasePage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    addResult("Testing Supabase connection...");
    
    try {
      // Test 1: Check if supabase client exists
      if (!supabase) {
        addResult("❌ Supabase client is null");
        return;
      }
      addResult("✅ Supabase client created successfully");

      // Test 2: Get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        addResult(`❌ Session error: ${sessionError.message}`);
      } else {
        addResult(`✅ Session check successful. Active session: ${sessionData.session ? 'Yes' : 'No'}`);
      }

      // Test 3: Try to sign in with test credentials
      addResult("Testing sign in with test credentials...");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          addResult("✅ Sign in test successful (expected error for test credentials)");
        } else {
          addResult(`❌ Sign in error: ${signInError.message}`);
        }
      } else {
        addResult("✅ Sign in test successful (unexpected success)");
      }

      // Test 4: Try to sign up with test credentials
      addResult("Testing sign up with test credentials...");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123',
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      });

      if (signUpError) {
        addResult(`❌ Sign up error: ${signUpError.message}`);
      } else {
        addResult(`✅ Sign up test successful: ${signUpData.user?.id}`);
      }

    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testConnection} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test Connection"}
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Environment Variables:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                    <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not Set"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not found'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                    <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not Set"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not found'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Test Results:</h3>
              <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-muted-foreground">No tests run yet</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono mb-1">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
