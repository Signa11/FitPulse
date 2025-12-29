# Fix 403 Error - Token Regeneration Required

## The Issue
Even with "Read & Write" permissions, GitHub tokens sometimes need to be **regenerated** after permission changes for the new permissions to take effect.

## Solution: Regenerate Token

1. **Go to**: https://github.com/settings/tokens
2. **Delete the old token** (or create a new one)
3. **Create new token**:
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: `FitPulse Push Token`
   - Expiration: Choose your preference
   - **Select scopes**:
     - ✅ `repo` (Full control of private repositories)
     - This includes all needed permissions
4. **Generate and COPY the token immediately** (you won't see it again!)

## Then Push

```bash
# Remove old remote
git remote remove origin

# Add with new token
git remote add origin https://Signa11:YOUR_NEW_TOKEN@github.com/Signa11/FitPulse.git

# Push
git push -u origin main
```

## Alternative: Use GitHub CLI (Easiest)

If you have GitHub CLI installed:

```bash
# Install if needed: brew install gh

# Login
gh auth login

# Follow prompts:
# - GitHub.com
# - HTTPS
# - Authenticate via browser

# Then push
git push -u origin main
```

## Alternative: Use SSH (Most Reliable)

1. **Generate SSH key**:
   ```bash
   ssh-keygen -t ed25519 -C "moerenhoudt.g@gmail.com"
   # Press Enter to accept default location
   # Press Enter twice for no passphrase (or set one)
   ```

2. **Copy public key**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```

3. **Add to GitHub**:
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: `MacBook FitPulse`
   - Paste the key
   - Click "Add SSH key"

4. **Change remote to SSH**:
   ```bash
   git remote set-url origin git@github.com:Signa11/FitPulse.git
   git push -u origin main
   ```

## Why This Happens
GitHub tokens are immutable - when you change permissions on an existing token, sometimes the changes don't propagate immediately. Regenerating ensures fresh permissions.

