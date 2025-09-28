"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EnvCheckPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isConfigured = supabaseUrl && supabaseKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseKey !== 'placeholder-key';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Supabase URL</h3>
              <p className="text-sm text-muted-foreground break-all">
                {supabaseUrl || 'Not set'}
              </p>
              <p className={`text-sm ${supabaseUrl ? 'text-green-600' : 'text-red-600'}`}>
                {supabaseUrl ? '✅ Set' : '❌ Not set'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Supabase Anon Key</h3>
              <p className="text-sm text-muted-foreground break-all">
                {supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not set'}
              </p>
              <p className={`text-sm ${supabaseKey ? 'text-green-600' : 'text-red-600'}`}>
                {supabaseKey ? '✅ Set' : '❌ Not set'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Overall Status</h3>
              <p className={`text-lg ${isConfigured ? 'text-green-600' : 'text-red-600'}`}>
                {isConfigured ? '✅ Supabase is configured' : '❌ Supabase is not properly configured'}
              </p>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Instructions for Vercel:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Go to your Vercel project dashboard</li>
                <li>Navigate to Settings → Environment Variables</li>
                <li>Add the following variables:</li>
                <li><code>NEXT_PUBLIC_SUPABASE_URL</code> = your Supabase URL</li>
                <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> = your Supabase anon key</li>
                <li>Redeploy your project</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
