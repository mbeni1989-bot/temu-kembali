# Temu Kembali - Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub account (already connected)

### Step 1: Create New Project on Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose repository: **`mbeni1989-bot/temu-kembali`**
5. Railway will automatically detect the project

### Step 2: Add MySQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"Add MySQL"**
2. Railway will automatically create a MySQL database
3. Copy the `DATABASE_URL` from the database service

### Step 3: Configure Environment Variables

Go to your app service → **Variables** tab and add these:

```bash
# Database (copy from MySQL service)
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret (generate random string)
JWT_SECRET=your-super-secret-jwt-key-here-change-this

# Manus OAuth (use your existing credentials)
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=your-app-id
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Owner Info
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name

# App Branding
VITE_APP_TITLE=Temu Kembali
VITE_APP_LOGO=https://your-logo-url.com/logo.png

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=

# Built-in Services
BUILT_IN_FORGE_API_URL=your-forge-api-url
BUILT_IN_FORGE_API_KEY=your-forge-api-key

# Mapbox Token
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiYmVuaTExIiwiYSI6ImNtZ2xlMnc1ZDBzajgybG9rdzMwNGVmMDIifQ.4izllpojnxVezj4_gHDDEA

# Encryption Key (generate random 32 characters)
ENCRYPTION_KEY=your-32-character-encryption-key

# Node Environment
NODE_ENV=production
```

### Step 4: Deploy

1. Railway will automatically build and deploy
2. Wait for deployment to complete (5-10 minutes)
3. Click **"View Logs"** to monitor progress
4. Once deployed, Railway will provide a public URL

### Step 5: Run Database Migrations

After first deployment, you need to run migrations:

1. Go to your app service
2. Click **"Settings"** → **"Deploy"**
3. Add custom start command:
   ```bash
   pnpm db:push && pnpm start
   ```
4. Redeploy the service

### Step 6: Access Your App

Your app will be available at: `https://your-app-name.up.railway.app`

---

## 🔧 Troubleshooting

### Build Fails
- Check logs for errors
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check MySQL service is running
- Ensure migrations have run

### App Crashes on Start
- Check environment variables are set
- Review application logs
- Verify `pnpm start` command works

---

## 📊 Monitoring

- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: Monitor CPU, memory, and network usage
- **Alerts**: Set up alerts for downtime

---

## 💰 Pricing

Railway offers:
- **Free Tier**: $5 credit/month (enough for small apps)
- **Pro Plan**: $20/month for production apps

---

## 🔐 Security Checklist

- ✅ Change all default secrets
- ✅ Use strong JWT_SECRET
- ✅ Enable HTTPS (automatic on Railway)
- ✅ Set up database backups
- ✅ Monitor logs for suspicious activity

---

## 📝 Notes

- Railway automatically handles SSL certificates
- Auto-deploy on git push is enabled by default
- Database backups are automatic on paid plans
- Custom domains can be added in project settings

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/mbeni1989-bot/temu-kembali/issues

