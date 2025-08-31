# 🚀 Render Deployment Guide for Shootic Backend

## 📋 Pre-Deployment Checklist

### ✅ Code Ready
- [x] Server.js optimized for production
- [x] Environment variables configured
- [x] CORS settings updated
- [x] Security middleware enabled
- [x] Error handling implemented
- [x] Health check endpoints added

### ✅ Environment Variables (Set in Render Dashboard)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://shootic:6cqA7sx6QgZxpwE7@cluster0.0g9epcq.mongodb.net/Shootic-photo
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info.shootic@gmail.com
EMAIL_PASS=cfwm duyq yjnf cjuz
EMAIL_FROM=Shootic Photography <info.shootic@gmail.com>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
LOG_LEVEL=info
```

## 🎯 Deployment Steps

### 1. **Connect to Render**
- Go to [render.com](https://render.com)
- Sign in with your GitHub account
- Click "New +" → "Web Service"

### 2. **Connect Repository**
- Connect your GitHub repository
- Select the `shootic-backend` directory
- Choose "Node" as the environment

### 3. **Configure Service**
```
Name: shootic-backend
Environment: Node
Region: Choose closest to your users
Branch: main (or your default branch)
Root Directory: shootic-backend (if deploying from monorepo)
Build Command: npm install
Start Command: npm start
```

### 4. **Set Environment Variables**
- Add all environment variables listed above
- Mark sensitive ones (MONGODB_URI, JWT_SECRET, EMAIL_PASS) as "Secret"

### 5. **Advanced Settings**
```
Health Check Path: /api/health
Auto-Deploy: Enabled
```

## 🔧 Post-Deployment Configuration

### 1. **Update Frontend URLs**
After deployment, update your frontend applications to use the new backend URL:

**shootic/.env.local:**
```
VITE_API_URL=https://your-backend-name.onrender.com/api
```

**shootic-admin/.env:**
```
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### 2. **Update CORS Origins**
Add your frontend URLs to the CORS configuration in `Server.js`:
```javascript
origin: [
  'https://your-frontend-name.onrender.com',
  'https://your-admin-frontend-name.onrender.com',
  // ... existing origins
]
```

### 3. **Test Endpoints**
```bash
# Health check
curl https://your-backend-name.onrender.com/api/health

# Test admin creation
curl -X POST https://your-backend-name.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@shootic.com",
    "password": "admin123",
    "role": "super_admin"
  }'
```

## 🛡️ Security Considerations

### 1. **JWT Secret**
- Use a strong, random JWT secret in production
- Generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 2. **MongoDB Security**
- Ensure MongoDB Atlas network access allows Render IPs
- Use strong database credentials

### 3. **Email Configuration**
- Use App Passwords for Gmail
- Enable 2FA on the email account

## 📊 Monitoring

### 1. **Render Dashboard**
- Monitor logs in real-time
- Check deployment status
- View performance metrics

### 2. **Health Checks**
- `/api/health` endpoint for automated monitoring
- Returns uptime and database status

### 3. **Error Tracking**
- Production errors are logged but don't expose stack traces
- Monitor for 500 errors and rate limiting

## 🔄 Continuous Deployment

### 1. **Auto-Deploy**
- Enabled by default
- Deploys on every push to main branch

### 2. **Manual Deploy**
- Use "Manual Deploy" for testing specific commits
- Rollback to previous versions if needed

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check `package.json` has correct start script
   - Verify all dependencies are in `dependencies` (not `devDependencies`)

2. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names

3. **Database Connection**
   - Verify MongoDB URI is correct
   - Check network access in MongoDB Atlas

4. **CORS Errors**
   - Add frontend URLs to CORS origins
   - Check for trailing slashes in URLs

### Debug Commands:
```bash
# Check logs
curl https://your-backend-name.onrender.com/api/health

# Test database connection
curl -X POST https://your-backend-name.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shootic.com","password":"admin123"}'
```

## 📞 Support

If you encounter issues:
1. Check Render logs in the dashboard
2. Verify environment variables
3. Test endpoints locally first
4. Check MongoDB connection
5. Review CORS configuration

---

**🎉 Your Shootic Backend is now ready for production deployment on Render!**
