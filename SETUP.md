# Supabase Authentication Setup Guide

## Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `polling-app` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select closest to your users
5. Click "Create new project"

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

### 3. Configure Environment Variables

1. Create a `.env.local` file in your project root:
```bash
touch .env.local
```

2. Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Configure Authentication Settings

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled
3. **Optional**: Disable email confirmation for testing:
   - Go to **Authentication** → **Settings**
   - Turn off "Enable email confirmations"

### 5. Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000`
3. You should be redirected to `/login`
4. Try creating an account and logging in

## Troubleshooting

### Common Issues

**Rate Limit Error:**
```bash
export GEMINI_MODEL="gemini-2.5-flash"
```

**Email Verification Error:**
- Go to Supabase → Authentication → Settings
- Turn off "Enable email confirmations" for testing

**Authentication Errors:**
- Check your environment variables are correct
- Ensure Supabase project is active
- Verify API keys are copied correctly

### Development Tips

1. **Check Console Logs**: Open browser dev tools to see authentication state changes
2. **Supabase Dashboard**: Monitor user creation and sessions in real-time
3. **Network Tab**: Check for failed API requests
4. **Environment Variables**: Verify `.env.local` is in the root directory

## Production Deployment

### Environment Variables
Make sure to set these in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Security Considerations
1. Never commit `.env.local` to version control
2. Use environment variables in production
3. Consider enabling email verification for production
4. Set up proper CORS settings in Supabase

## Next Steps

Once authentication is working:
1. Add user profiles and avatars
2. Implement role-based access control
3. Add social authentication providers
4. Set up email templates
5. Configure password policies
