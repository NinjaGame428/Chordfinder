import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    console.log('Testing database connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Database connection error:', testError);
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: testError,
        message: 'Could not connect to users table'
      }, { status: 500 });
    }
    
    console.log('✅ Database connection successful');
    
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ 
        error: 'Failed to fetch users', 
        details: usersError 
      }, { status: 500 });
    }
    
    console.log(`Found ${users.length} users in database`);
    
    // Also check auth users
    let authUsers = [];
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      if (!authError && authData?.users) {
        authUsers = authData.users;
        console.log(`Found ${authUsers.length} auth users`);
      }
    } catch (authErr) {
      console.log('Could not fetch auth users:', authErr);
    }
    
    return NextResponse.json({ 
      success: true,
      usersCount: users.length,
      users: users,
      authUsersCount: authUsers.length,
      authUsers: authUsers,
      message: `Found ${users.length} users in database and ${authUsers.length} auth users`
    });
    
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error 
    }, { status: 500 });
  }
}
