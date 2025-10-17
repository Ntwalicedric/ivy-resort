# 🚀 Supabase Setup Guide for Ivy Resort

## Prerequisites
- Supabase account (free at [supabase.com](https://supabase.com))
- Node.js 18+ installed
- Git repository access

## Step 1: Create Supabase Project

1. **Sign up/Login to Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create account or login

2. **Create New Project**
   - Click "New Project"
   - Organization: Choose your org
   - Project name: `ivy-resort`
   - Database password: Generate strong password (save it!)
   - Region: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup** (2-3 minutes)

## Step 2: Get Project Credentials

1. **Go to Settings → API**
2. **Copy these values:**
   - Project URL: `https://your-project-id.supabase.co`
   - anon/public key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - service_role key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

## Step 3: Set Up Database Schema

1. **Go to SQL Editor in Supabase Dashboard**
2. **Copy and paste the contents of `supabase-schema.sql`**
3. **Click "Run" to execute the schema**

This creates:
- `reservations` table with all fields
- `users` table for admin authentication
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for `updated_at` timestamps

## Step 4: Configure Environment Variables

1. **Create `.env.local` file in project root**
2. **Copy contents from `supabase-env-example.txt`**
3. **Fill in your Supabase credentials:**

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_URL=https://your-project-id.supabase.co
```

## Step 5: Enable Real-time (Important!)

1. **Go to Database → Replication in Supabase Dashboard**
2. **Enable real-time for `reservations` table:**
   - Find `reservations` table
   - Toggle "Enable real-time" to ON
   - Click "Save"

## Step 6: Deploy to Vercel

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Add all environment variables from `.env.local`
   - Make sure to add both `VITE_` and non-`VITE_` variables

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add Supabase real-time integration"
   git push origin main
   ```

## Step 7: Test Real-time Sync

1. **Open admin dashboard** in one browser tab
2. **Open booking form** in another tab
3. **Make a reservation** in the booking form
4. **Watch it appear instantly** in the admin dashboard (no refresh needed!)

## Features You Get

### ✅ **Real-time Synchronization**
- Changes appear instantly across all devices
- No polling needed - uses WebSocket connections
- Automatic reconnection on network issues

### ✅ **Centralized Database**
- PostgreSQL with full ACID compliance
- Automatic backups and point-in-time recovery
- Built-in authentication and authorization

### ✅ **Performance Optimized**
- Indexed queries for fast data retrieval
- Connection pooling for efficiency
- Real-time subscriptions only for changed data

### ✅ **Production Ready**
- Row Level Security (RLS) for data protection
- Automatic SSL/TLS encryption
- Global CDN for fast access

## Troubleshooting

### Real-time Not Working?
1. Check if real-time is enabled for `reservations` table
2. Verify environment variables are set correctly
3. Check browser console for connection errors

### Database Connection Issues?
1. Verify your Supabase URL and keys
2. Check if your IP is whitelisted (if using IP restrictions)
3. Ensure service role key has proper permissions

### Email Not Sending?
1. Verify SMTP credentials in environment variables
2. Check Gmail app password is correct
3. Test email endpoint directly

## Monitoring

- **Supabase Dashboard**: Monitor database performance and real-time connections
- **Vercel Dashboard**: Monitor API function performance
- **Browser Console**: Check for real-time connection status

## Next Steps

1. **Set up authentication** (optional)
2. **Configure email templates** in Supabase
3. **Add more real-time features** (notifications, live updates)
4. **Set up monitoring and alerts**

## Support

- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Project Issues: Check GitHub repository

---

🎉 **Congratulations!** Your hotel reservation system now has real-time synchronization powered by Supabase!
