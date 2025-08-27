# Deployment Guide

This guide covers deploying the Shootic Backend to various platforms and environments.

## Table of Contents

- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Environment Configuration](#environment-configuration)
- [Security Checklist](#security-checklist)
- [Monitoring & Logging](#monitoring--logging)

---

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/bkbimal250/shootphoto.git
cd shootphoto

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Development Scripts
```bash
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production server
npm run test        # Run tests
npm run seed:admin  # Seed admin user
npm run seed:realistic  # Seed sample data
```

---

## Production Deployment

### 1. Environment Setup

Create a production `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration (Use Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shootic

# JWT Configuration (Use strong secret)
JWT_SECRET=your-super-strong-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Shootic Photography <noreply@shootic.com>

# Rate Limiting (Stricter for production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# CORS Configuration (Your frontend domain)
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Process Manager (PM2)

Install PM2 globally:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'shootic-backend',
    script: 'Server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

Start with PM2:
```bash
# Development
pm2 start ecosystem.config.js

# Production
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# View logs
pm2 logs shootic-backend
```

### 3. Nginx Configuration

Create `/etc/nginx/sites-available/shootic-backend`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/shootic-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Docker Deployment

### 1. Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]
```

### 2. Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/shootic
    depends_on:
      - mongo
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

volumes:
  mongo_data:
```

### 3. Build and Run

```bash
# Build the image
docker build -t shootic-backend .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f backend
```

---

## Cloud Platforms

### 1. Heroku

Create `Procfile`:
```
web: npm start
```

Deploy:
```bash
# Install Heroku CLI
heroku create shootic-backend
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku addons:create mongolab:sandbox
git push heroku main
```

### 2. Railway

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### 3. Render

1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables

### 4. DigitalOcean App Platform

1. Connect your GitHub repository
2. Select Node.js environment
3. Set build command: `npm install`
4. Set run command: `npm start`
5. Configure environment variables

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | `your-email@gmail.com` |
| `EMAIL_PASS` | SMTP password | `your-app-password` |
| `EMAIL_FROM` | From email address | `Shootic <noreply@shootic.com>` |
| `CORS_ORIGIN` | Allowed origins | `https://your-domain.com` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## Security Checklist

### ✅ Environment Variables
- [ ] Use strong JWT secrets
- [ ] Use MongoDB Atlas (not local)
- [ ] Use app passwords for email
- [ ] Set NODE_ENV=production

### ✅ CORS Configuration
- [ ] Restrict CORS to your frontend domain
- [ ] Remove wildcard origins
- [ ] Use HTTPS in production

### ✅ Rate Limiting
- [ ] Enable rate limiting
- [ ] Set appropriate limits for production
- [ ] Monitor rate limit violations

### ✅ Input Validation
- [ ] Validate all input data
- [ ] Sanitize user inputs
- [ ] Use express-validator

### ✅ Authentication
- [ ] Use HTTPS in production
- [ ] Set secure JWT expiration
- [ ] Implement proper logout

### ✅ Database Security
- [ ] Use MongoDB Atlas
- [ ] Enable network access controls
- [ ] Use strong database passwords

---

## Monitoring & Logging

### 1. Application Logs

The application uses Morgan for HTTP logging. Logs are written to:
- Console (development)
- Files (production)

### 2. Error Monitoring

Consider integrating error monitoring services:
- **Sentry**: `npm install @sentry/node`
- **LogRocket**: For session replay
- **New Relic**: For performance monitoring

### 3. Health Checks

The application includes a health check endpoint:
```
GET /api/health
```

### 4. Performance Monitoring

Monitor key metrics:
- Response times
- Error rates
- Database connection status
- Memory usage
- CPU usage

### 5. Log Rotation

For production, implement log rotation:
```bash
# Install logrotate
sudo apt-get install logrotate

# Configure log rotation
sudo nano /etc/logrotate.d/shootic-backend
```

Example logrotate configuration:
```
/path/to/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 node node
    postrotate
        pm2 reload shootic-backend
    endscript
}
```

---

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   # Kill the process
   kill -9 <PID>
   ```

2. **MongoDB connection failed**
   - Check MongoDB URI
   - Verify network access
   - Check credentials

3. **JWT token issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

4. **Email sending failed**
   - Verify SMTP credentials
   - Check app password for Gmail
   - Test SMTP connection

### Performance Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes to models
   bookingSchema.index({ email: 1 });
   bookingSchema.index({ date: 1 });
   bookingSchema.index({ status: 1 });
   ```

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use CDN for static assets

3. **Compression**
   - Enable gzip compression
   - Optimize response payloads
   - Use pagination for large datasets

---

## Support

For deployment issues:
1. Check the logs: `pm2 logs shootic-backend`
2. Verify environment variables
3. Test database connectivity
4. Check network configuration
5. Review security settings

For additional help, create an issue in the repository or contact the development team.
