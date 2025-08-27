const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://shootic:6cqA7sx6QgZxpwE7@cluster0.0g9epcq.mongodb.net/Shootic-photo

# JWT Configuration
JWT_SECRET=shootic-super-secret-jwt-key-2024-production-ready
JWT_EXPIRES_IN=24h

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info.shootic@gmail.com
EMAIL_PASS=cfwm duyq yjnf cjuz
EMAIL_FROM=Shootic Photography <info.shootic@gmail.com>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Security
HELMET_ENABLED=true
COMPRESSION_ENABLED=true

# Logging
LOG_LEVEL=info
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📁 Location:', envPath);
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
}
