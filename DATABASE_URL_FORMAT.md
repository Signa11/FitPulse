# Database URL Format for Netlify

## Environment Variable Name
**`DATABASE_URL`**

## Format
Your Neon PostgreSQL connection string should look like this:

```
postgresql://username:password@hostname/database?sslmode=require
```

## Example Format
```
postgresql://neondb_owner:your_password@ep-bold-hall-agc4lo2c-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## Where to Find Your Neon Connection String

1. **Go to your Neon Dashboard**: https://console.neon.tech
2. **Select your project**
3. **Go to "Connection Details"** or **"Connection String"**
4. **Copy the connection string**

It will typically include:
- **Username**: Usually `neondb_owner` or similar
- **Password**: Your database password
- **Host**: Something like `ep-xxx-xxx-pooler.region.aws.neon.tech`
- **Database**: Usually `neondb` or your database name
- **SSL Mode**: `require` (usually included in the string)

## For Netlify

1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Click **"Add a variable"**
4. Enter:
   - **Key**: `DATABASE_URL`
   - **Value**: Your full Neon connection string (paste the entire string)
   - **Scopes**: Select all (Production, Deploy previews, Branch deploys)
5. Click **"Save"**

## Important Notes

- ✅ The connection string should include `?sslmode=require` at the end
- ✅ Use the **pooler** connection string if available (better for serverless)
- ✅ Keep the connection string secure - never commit it to git
- ✅ The format should be exactly as provided by Neon

## Testing the Connection

After adding to Netlify, you can test by:
1. Deploying your site
2. Trying to register a new user
3. Check Netlify Function logs if there are connection issues

## Example (DO NOT USE THIS - Get Your Own!)
```
postgresql://neondb_owner:password123@ep-example-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

