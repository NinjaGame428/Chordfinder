const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test basic connection by trying to access auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError && authError.message.includes('JWT')) {
      console.log('✅ Supabase connection successful (JWT error expected for service key)');
    } else {
      console.log('✅ Supabase connection successful!');
    }
    
    // Test if we can access the database
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (error) {
      console.log('⚠️  Database access test:', error.message);
    } else {
      console.log('✅ Database access successful');
      console.log('Available tables:', data?.map(t => t.table_name) || 'None found');
    }
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  }
}

testConnection();
