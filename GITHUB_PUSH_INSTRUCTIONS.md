# GitHub Push Instructions - Fix Token Permissions

## The Problem
Your token only has **Read** access to repository contents. To push code, you need **Write** access.

## Solution: Update Token Permissions

### Step 1: Go to Token Settings
1. Visit: https://github.com/settings/tokens
2. Find your token (or click "Generate new token" → "Generate new token (classic)")

### Step 2: Set Required Permissions
Under **"Repository permissions"**, enable:
- ✅ **Contents**: `Read and write` (THIS IS CRITICAL - currently only has Read)
- ✅ **Metadata**: `Read` (already enabled)

Or simply select:
- ✅ **repo** (Full control) - This includes everything needed

### Step 3: Generate/Update Token
- If creating new: Copy the token immediately (you won't see it again!)
- If updating existing: The changes save automatically

### Step 4: Push with New Token
```bash
git remote set-url origin https://github.com/Signa11/FitPulse.git
git push -u origin main
```

When prompted:
- **Username**: `Signa11`
- **Password**: `[Your token with write permissions]`

## Alternative: Use SSH (No Token Needed)

If tokens keep causing issues, use SSH:

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "moerenhoudt.g@gmail.com"
   ```

2. **Add to GitHub**:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste and save

3. **Change remote to SSH**:
   ```bash
   git remote set-url origin git@github.com:Signa11/FitPulse.git
   git push -u origin main
   ```

## Current Status
✅ Code committed locally  
✅ Repository exists  
❌ Token needs Write permissions for Contents

