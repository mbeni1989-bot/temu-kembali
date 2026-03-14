# Railway Environment Variables Setup

## 🚨 CRITICAL: Login tidak berfungsi tanpa environment variables ini!

Aplikasi Temu Kembali menggunakan **Manus OAuth** untuk autentikasi. Railway deployment memerlukan environment variables berikut untuk login berfungsi:

---

## Required Environment Variables

### 1. Frontend Variables (VITE_*)
Digunakan oleh Vite/client untuk OAuth flow:

```bash
VITE_APP_ID=proj_temukembali_xxxxx
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
VITE_APP_TITLE=Temu Kembali
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

### 2. Backend Variables
Digunakan oleh server untuk OAuth verification:

```bash
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev
JWT_SECRET=your-secure-jwt-secret-here
DATABASE_URL=mysql://user:password@host:port/database
```

### 3. Optional Analytics
```bash
VITE_ANALYTICS_ENDPOINT=https://umami.dev.ops.butterfly-effect.dev
VITE_ANALYTICS_WEBSITE_ID=analytics_proj_xxxxx
```

---

## How to Set in Railway

### Via Railway Dashboard:

1. **Login to Railway**: https://railway.app
2. **Select Project**: `intelligent-illumination`
3. **Go to Variables Tab**
4. **Add Variables** one by one:
   - Click "+ New Variable"
   - Enter variable name (e.g., `VITE_APP_ID`)
   - Enter variable value
   - Click "Add"

5. **Redeploy** after adding all variables

### Via Railway CLI:

```bash
# Login
railway login

# Link to project
railway link intelligent-illumination

# Set variables
railway variables set VITE_APP_ID=proj_temukembali_xxxxx
railway variables set VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
railway variables set OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev
railway variables set JWT_SECRET=your-secure-secret
railway variables set DATABASE_URL=mysql://user:pass@host:port/db

# Redeploy
railway up
```

---

## Current Status

❌ **Login NOT working** - Environment variables belum di-set  
✅ **Build & Deployment** - Sudah berfungsi  
✅ **Frontend** - Sudah berfungsi  
⚠️ **Authentication** - Memerlukan env vars

---

## Verification Steps

After setting environment variables:

1. **Check Railway Logs**:
   ```
   railway logs
   ```
   
2. **Verify Variables Loaded**:
   - Check if `VITE_APP_ID` is defined in browser console
   - Check if login button redirects to Manus OAuth portal

3. **Test Login Flow**:
   - Click "Sign In with Manus"
   - Should redirect to: `https://vida.butterfly-effect.dev/app-auth?appId=...`
   - After auth, should redirect back to app

4. **Check OAuth Callback**:
   - URL: `https://temukembali-production.up.railway.app/api/oauth/callback`
   - Should process OAuth token and set session cookie

---

## Troubleshooting

### Issue: Login button does nothing
**Cause**: `VITE_APP_ID` or `VITE_OAUTH_PORTAL_URL` not set  
**Fix**: Set both variables in Railway and redeploy

### Issue: OAuth redirect fails
**Cause**: `OAUTH_SERVER_URL` not set or incorrect  
**Fix**: Verify backend variable is correct

### Issue: "Invalid JWT" error
**Cause**: `JWT_SECRET` not set or mismatched  
**Fix**: Set same JWT_SECRET on all environments

### Issue: Database connection error
**Cause**: `DATABASE_URL` not set or incorrect  
**Fix**: Verify MySQL connection string

---

## Security Notes

⚠️ **NEVER commit `.env` files to Git**  
⚠️ **Use strong JWT_SECRET** (minimum 32 characters)  
⚠️ **Rotate secrets regularly**  
⚠️ **Use Railway's secret management** for sensitive data

---

## Next Steps

1. ✅ Set all required environment variables in Railway
2. ✅ Redeploy application
3. ✅ Test login flow
4. ✅ Verify user authentication works
5. ✅ Test protected routes (create report, messages, profile)

---

**Status**: 🔴 **ACTION REQUIRED** - Set environment variables in Railway dashboard
