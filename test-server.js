const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: [
    'https://shootphoto.onrender.com', 
    'https://shootic.com', 
    'https://admin.shootic.com', 
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://192.168.29.211:5173',
    'http://192.168.29.211:5174',
    'https://shootic.onrender.com',
    'https://shootic-admin.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Shootic API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: 'connected',
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  
  // Test the login endpoint immediately
  setTimeout(() => {
    testLogin();
  }, 1000);
});

async function testLogin() {
  const http = require('http');
  
  const data = JSON.stringify({
    email: 'admin@shootic.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\n📊 Login Test Results:`);
    console.log(`Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Response:', responseData);
      try {
        const parsed = JSON.parse(responseData);
        console.log('✅ Parsed response:', parsed);
        
        if (parsed.success) {
          console.log('🎉 Login successful!');
        } else {
          console.log('❌ Login failed:', parsed.message);
          if (parsed.errors) {
            console.log('Validation errors:', parsed.errors);
          }
        }
      } catch (e) {
        console.log('❌ Could not parse JSON:', e.message);
      }
      
      // Close the server after testing
      server.close(() => {
        console.log('🔒 Test server closed');
        process.exit(0);
      });
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Problem with request: ${e.message}`);
    server.close(() => {
      console.log('🔒 Test server closed');
      process.exit(1);
    });
  });

  req.write(data);
  req.end();
}
