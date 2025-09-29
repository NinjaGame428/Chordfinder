# Disable Email Confirmation in Supabase

## Quick Fix: Disable Email Confirmation

To make users automatically verified when they register (without requiring email confirmation), follow these steps:

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to your project: https://supabase.com/dashboard/project/zsujkjbvliqphssuvvyw

2. **Navigate to Authentication Settings**
   - In the left sidebar, click on **Authentication**
   - Click on **Settings** (under Configuration)

3. **Disable Email Confirmation**
   - Scroll down to find **"Enable email confirmations"**
   - **Uncheck** the checkbox to disable email confirmations
   - Click **Save** to apply the changes

### Method 2: Using Supabase CLI (Alternative)

If you have the Supabase CLI installed, you can also disable it via command line:

```bash
# Navigate to your project directory
cd "C:\Users\micha\OneDrive\Desktop\Chords finder new\pure-landing-shadcnui-template"

# Update the auth settings
supabase projects update --disable-email-confirmations
```

## What This Changes

- ✅ Users will be automatically verified when they register
- ✅ No email confirmation required
- ✅ Users can immediately log in after registration
- ✅ No "Waiting for verification" status

## Testing the Change

After disabling email confirmation:

1. **Test Registration**:
   - Go to your app's registration page
   - Register a new user
   - The user should be immediately verified

2. **Check Supabase Dashboard**:
   - Go to Authentication → Users
   - New users should show as verified (not "Waiting for verification")

3. **Test Login**:
   - Try logging in with the newly registered user
   - Login should work immediately without email confirmation

## Important Notes

- This setting affects all new registrations
- Existing users with "Waiting for verification" status will remain in that state
- For production apps, consider keeping email confirmation enabled for security
- You can always re-enable email confirmation later if needed

## Alternative: Manual Verification

If you want to keep email confirmation enabled but manually verify specific users:

1. Go to Authentication → Users in your Supabase dashboard
2. Find the user you want to verify
3. Click on the user's email
4. In the user details, you can manually confirm their email
