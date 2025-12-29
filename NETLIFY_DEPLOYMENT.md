# Netlify Deployment Guide for FitPulse

## Prerequisites
- ✅ Code pushed to GitHub: https://github.com/Signa11/FitPulse.git
- ✅ Neon database connection string ready

## Step-by-Step Deployment

### 1. Push to GitHub (if not done yet)

If you haven't pushed yet, authenticate with your GitHub account and push:
```bash
git push -u origin main
```

### 2. Import to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select the repository: **Signa11/FitPulse**

### 3. Configure Build Settings

Netlify should auto-detect these from `netlify.toml`, but verify:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18` (set in Environment variables)

### 4. Add Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon PostgreSQL connection string
   - **Scopes**: All scopes (Production, Deploy previews, Branch deploys)

### 5. Configure Netlify Functions

For the API routes to work, you have two options:

#### Option A: Use Netlify Functions (Recommended)

1. Create a `netlify/functions` directory
2. Convert your API routes to Netlify Functions format
3. Each function should export a `handler` function

#### Option B: Use Netlify Edge Functions

Or keep the current structure and use redirects (already configured in `netlify.toml`)

### 6. Deploy!

1. Click **"Deploy site"**
2. Wait for the build to complete
3. Your site will be live at: `https://your-site-name.netlify.app`

## Neon Database Compatibility

✅ **Yes, it will work with Neon!**

The app uses:
- `@neondatabase/serverless` package (already installed)
- Environment variable `DATABASE_URL` for connection
- Standard PostgreSQL queries

Just make sure:
1. Your Neon database is running
2. The `DATABASE_URL` is set in Netlify environment variables
3. The connection string format is: `postgresql://user:password@host/database?sslmode=require`

## Troubleshooting

### API Routes Not Working
- Check Netlify Functions logs in the dashboard
- Verify environment variables are set
- Check that `netlify.toml` redirects are correct

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Neon dashboard to ensure database is active
- Test connection string format

### Build Failures
- Check build logs in Netlify dashboard
- Verify Node version is set to 18
- Ensure all dependencies are in `package.json`

## Post-Deployment

After deployment:
1. Test registration/login
2. Test workout tracking
3. Verify database connections
4. Check that all API endpoints work

## Support

If you encounter issues:
- Check Netlify Function logs
- Check browser console for errors
- Verify environment variables are set correctly

