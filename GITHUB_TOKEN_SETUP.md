# GitHub Token Setup - Step by Step

## Step 1: Choose Token Type
- Click **"Generate new token (classic)"** (NOT fine-grained)
- Classic tokens are simpler and work better for git push

## Step 2: Configure Token
- **Note**: `FitPulse Push Token` (or any name you like)
- **Expiration**: Choose your preference (90 days, 1 year, or no expiration)
- **Select scopes**: Scroll down and check:
  - ✅ **`repo`** - This gives full control (includes read/write to contents, metadata, etc.)
  
  That's it! Just check `repo` and you're done.

## Step 3: Generate
- Click **"Generate token"** at the bottom
- **IMPORTANT**: Copy the token immediately - you won't see it again!
- It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 4: Use the Token
Once you have the new token, run:

```bash
git remote set-url origin https://Signa11:YOUR_NEW_TOKEN@github.com/Signa11/FitPulse.git
git push -u origin main
```

Replace `YOUR_NEW_TOKEN` with the token you just copied.

## Why Classic Token?
- Classic tokens are simpler
- One scope (`repo`) gives you everything you need
- Fine-grained tokens require selecting specific repos and permissions (more complex)

