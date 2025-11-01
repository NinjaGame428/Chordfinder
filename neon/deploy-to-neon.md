# Deploy Database Schema to Neon

## Quick Deploy

1. **Get your Neon connection string:**
   - Go to your Neon project dashboard
   - Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)

2. **Run the migration:**
   
   **Option A: Using Neon SQL Editor (Recommended)**
   - Go to your Neon project dashboard
   - Click on "SQL Editor"
   - Copy the entire contents of `neon/neon-migration.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

   **Option B: Using psql command line**
   ```bash
   psql "your-neon-connection-string" -f neon/neon-migration.sql
   ```

   **Option C: Using Node.js script**
   ```bash
   node neon/deploy-schema.js
   ```

3. **Verify the migration:**
   ```sql
   -- Check tables were created
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

## Real-Time Setup

Neon supports PostgreSQL logical replication, but for real-time subscriptions you'll need:

1. **For simple real-time needs:** Use polling or Server-Sent Events (SSE)
2. **For advanced real-time:** Use a service like:
   - Supabase Realtime (free tier available)
   - Pusher
   - Socket.io with your own WebSocket server

## Environment Variables

Update your `.env.local`:

```env
NEON_DATABASE_URL=postgresql://user:password@host/database?sslmode=require
# OR
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

JWT_SECRET=your-super-secret-jwt-key-change-this
```

## Troubleshooting

### "REPLICA IDENTITY" errors
- These are optional for real-time. If you get errors, you can remove those lines.
- Real-time subscriptions require additional setup beyond just the database.

### RLS (Row Level Security) errors
- If using JWT auth, you'll need to create a custom `auth.uid()` function
- Or disable RLS if you're handling permissions in application code

### Permission errors
- Make sure you're using the correct database user
- Some operations require superuser privileges

