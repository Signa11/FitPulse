# Manual Push to GitHub Instructions

Since automated push is having authentication issues, here's how to push manually:

## Option 1: Using GitHub CLI (Easiest)

If you have GitHub CLI installed:
```bash
gh auth login
# Follow the prompts, select GitHub.com, HTTPS, and authenticate
git push -u origin main
```

## Option 2: Using Personal Access Token in Terminal

1. **Set the remote** (if not already set):
   ```bash
   git remote set-url origin https://github.com/Signa11/FitPulse.git
   ```

2. **Push with token**:
   ```bash
   git push -u origin main
   ```
   
   When prompted:
   - **Username**: `Signa11`
   - **Password**: `[Your Personal Access Token]`

## Option 3: Verify Token Permissions

Make sure your token has these scopes:
- ✅ `repo` (Full control of private repositories)
- ✅ `workflow` (if using GitHub Actions)

To check/update:
1. Go to: https://github.com/settings/tokens
2. Find your token or create a new one
3. Ensure `repo` scope is checked
4. Generate and use the new token

## Option 4: Use SSH Instead

1. **Add SSH key to GitHub** (if you haven't):
   - Generate: `ssh-keygen -t ed25519 -C "moerenhoudt.g@gmail.com"`
   - Add to GitHub: https://github.com/settings/keys

2. **Change remote to SSH**:
   ```bash
   git remote set-url origin git@github.com:Signa11/FitPulse.git
   git push -u origin main
   ```

## Current Status

✅ Code is committed locally  
✅ Repository exists on GitHub  
✅ Ready to push  

Just need to authenticate properly!

