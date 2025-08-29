# Database Setup Guide for PollMaster

This guide will help you set up the Supabase database schema for the PollMaster polling application.

## Prerequisites

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Your Supabase project URL and API keys
3. Access to the Supabase SQL Editor

## Setup Steps

### 1. Create Environment Variables

First, create a `.env.local` file in your project root with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Run the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Create a new query
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click **Run** to execute the schema

**Note**: Make sure you're running this in the Supabase SQL Editor, not in a regular PostgreSQL database.

### 3. Verify the Setup

After running the schema, you should see the following tables created:

- `polls` - Stores poll information
- `poll_options` - Stores poll options/choices
- `votes` - Stores individual votes
- `poll_stats` - A view for poll statistics

### 4. Configure Authentication (Optional)

If you want to use Supabase Auth, make sure to:

1. Go to **Authentication > Settings** in your Supabase dashboard
2. Configure your authentication providers (Email, Google, etc.)
3. Set up email templates if using email authentication

## Database Schema Overview

### Tables

#### `polls`
- `id` - Unique identifier (UUID)
- `title` - Poll title (required)
- `description` - Poll description (optional)
- `created_by` - User ID who created the poll
- `created_at` - Creation timestamp
- `expires_at` - Expiration date (optional)
- `is_active` - Whether the poll is active
- `allow_multiple_votes` - Whether users can vote multiple times
- `is_public` - Whether the poll is publicly visible
- `status` - Poll status (active, inactive, expired)
- `updated_at` - Last update timestamp

#### `poll_options`
- `id` - Unique identifier (UUID)
- `poll_id` - Reference to the poll
- `text` - Option text
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### `votes`
- `id` - Unique identifier (UUID)
- `poll_id` - Reference to the poll
- `option_id` - Reference to the poll option
- `user_id` - User ID (for authenticated users)
- `voter_email` - Email (for anonymous voting)
- `voter_name` - Name (for anonymous voting)
- `created_at` - Vote timestamp

### Views

#### `poll_stats`
A view that provides aggregated statistics for each poll:
- Total number of options
- Total number of votes
- Number of unique voters

### Functions

#### `get_poll_option_vote_count(option_uuid)`
Returns the vote count for a specific poll option.

#### `get_poll_total_votes(poll_uuid)`
Returns the total number of votes for a specific poll.

### Row Level Security (RLS)

The schema includes comprehensive RLS policies that ensure:

- Users can only view public polls or polls they created
- Users can only create/update/delete their own polls
- Users can only vote on active, non-expired polls
- Anonymous voting is supported with email validation

### Triggers

- **Auto-update timestamps**: Automatically updates `updated_at` fields
- **Poll expiration**: Automatically marks polls as expired
- **Vote validation**: Prevents voting on inactive/expired polls
- **Multiple vote prevention**: Prevents duplicate votes unless allowed

## Testing the Setup

You can test the database setup by running these queries in the SQL Editor:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('polls', 'poll_options', 'votes');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('polls', 'poll_options', 'votes');

-- Check if policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('polls', 'poll_options', 'votes');
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure you're using the service role key for admin operations
2. **RLS Policies Not Working**: Verify that RLS is enabled and policies are created
3. **Foreign Key Errors**: Ensure all referenced tables exist before creating relationships
4. **"app.jwt_secret" Error**: This error occurs if you try to run the schema outside of Supabase. Always use the Supabase SQL Editor.

### Reset Database (Development Only)

If you need to reset the database during development:

```sql
-- Drop all tables (WARNING: This will delete all data)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;

-- Drop functions and types
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_poll_status() CASCADE;
DROP FUNCTION IF EXISTS get_poll_option_vote_count(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_poll_total_votes(UUID) CASCADE;
DROP FUNCTION IF EXISTS check_poll_active() CASCADE;
DROP FUNCTION IF EXISTS check_multiple_votes() CASCADE;
DROP TYPE IF EXISTS poll_status CASCADE;

-- Drop views
DROP VIEW IF EXISTS poll_stats CASCADE;
```

Then re-run the schema file.

## Next Steps

After setting up the database:

1. Update your application code to use the new database types
2. Test the authentication flow
3. Create some sample polls to verify everything works
4. Set up your deployment environment variables

## Support

If you encounter any issues:

1. Check the Supabase logs in your project dashboard
2. Verify your environment variables are correct
3. Ensure all SQL commands executed successfully
4. Check the browser console for any client-side errors
