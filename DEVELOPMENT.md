# Development Guide

This guide is for developers who want to contribute to or work with the Shootic Backend project.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Testing](#testing)
- [Database](#database)
- [API Development](#api-development)
- [Security](#security)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git
- VS Code (recommended)

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/bkbimal250/shootphoto.git
cd shootphoto

# Install dependencies
npm install

# Set up environment
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Development Scripts
```bash
npm run dev              # Start with nodemon
npm start               # Start production server
npm run test            # Run tests
npm run test:connection # Test database connection
npm run test:admin      # Test admin endpoints
npm run test:forms      # Test form submissions
npm run seed:admin      # Seed admin user
npm run seed:realistic  # Seed realistic data
npm run seed:additional # Seed additional data
```

---

## Project Structure

```
shootic-backend/
├── config/
│   └── db.js              # Database configuration
├── models/
│   ├── Admin.js           # Admin user model
│   ├── Booking.js         # Booking model
│   └── Contact.js         # Contact model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── bookings.js        # Booking routes
│   ├── contact.js         # Contact routes
│   └── admin.js           # Admin dashboard routes
├── scripts/
│   ├── seed-admin.js      # Admin seeding script
│   ├── seed-realistic-data.js    # Realistic data seeding
│   ├── seed-additional-data.js   # Additional data seeding
│   ├── fix-admin.js       # Admin data fix script
│   └── setup-env.js       # Environment setup script
├── Server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example            # Environment variables example
├── .gitignore             # Git ignore rules
├── README.md              # Main documentation
├── API_DOCUMENTATION.md   # API documentation
├── DEPLOYMENT.md          # Deployment guide
└── DEVELOPMENT.md         # This file
```

### Key Files Explained

#### `Server.js`
Main application entry point. Sets up:
- Express server
- Middleware (CORS, compression, rate limiting)
- Route handlers
- Error handling
- Database connection

#### `config/db.js`
Database configuration and connection setup using Mongoose.

#### `models/`
Mongoose schemas defining data structure and validation:
- **Admin.js**: Admin user model with authentication
- **Booking.js**: Booking model with customer details
- **Contact.js**: Contact form submission model

#### `routes/`
API route handlers organized by feature:
- **auth.js**: Login, logout, profile management
- **bookings.js**: CRUD operations for bookings
- **contact.js**: Contact form handling
- **admin.js**: Admin dashboard and analytics

---

## Code Style

### JavaScript/Node.js
- Use ES6+ features
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Use async/await over promises
- Use template literals for string interpolation

### Naming Conventions
- **Files**: kebab-case (`admin-dashboard.js`)
- **Variables**: camelCase (`userName`)
- **Constants**: UPPER_SNAKE_CASE (`JWT_SECRET`)
- **Functions**: camelCase (`getUserById`)
- **Classes**: PascalCase (`UserModel`)

### Code Organization
```javascript
// 1. Imports
const express = require('express');
const { body, validationResult } = require('express-validator');

// 2. Router setup
const router = express.Router();

// 3. Middleware
const validateInput = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

// 4. Route handlers
router.post('/login', validateInput, async (req, res) => {
  try {
    // Implementation
  } catch (error) {
    // Error handling
  }
});

// 5. Export
module.exports = router;
```

### Error Handling
```javascript
// Always use try-catch for async operations
try {
  const result = await someAsyncOperation();
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
}
```

---

## Testing

### Manual Testing
Use the provided test scripts:

```bash
# Test database connection
npm run test:connection

# Test admin authentication
npm run test:admin

# Test form submissions
npm run test:forms
```

### API Testing with Postman
1. Import the collection (if available)
2. Set up environment variables
3. Test each endpoint systematically

### Test Data
Use the seeding scripts to populate test data:
```bash
npm run seed:realistic  # 8 contacts + 10 bookings
npm run seed:additional # 5 more contacts + 5 bookings
```

### Automated Testing (Future)
Consider implementing:
- Unit tests with Jest
- Integration tests with Supertest
- API tests with Postman collections

---

## Database

### MongoDB Atlas Setup
1. Create a cluster
2. Set up network access (IP whitelist)
3. Create database user
4. Get connection string
5. Update `.env` file

### Local MongoDB
```bash
# Install MongoDB
brew install mongodb-community  # macOS
sudo apt-get install mongodb   # Ubuntu

# Start MongoDB
mongod

# Connect to MongoDB shell
mongosh
```

### Database Operations
```javascript
// Find documents
const bookings = await Booking.find({ status: 'pending' });

// Find with pagination
const bookings = await Booking.find()
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

// Aggregate for statistics
const stats = await Booking.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);
```

### Indexing
Add indexes for better performance:
```javascript
// In models
bookingSchema.index({ email: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
```

---

## API Development

### Adding New Endpoints
1. **Create route handler** in appropriate route file
2. **Add validation** using express-validator
3. **Implement business logic**
4. **Add error handling**
5. **Test the endpoint**

Example:
```javascript
// In routes/bookings.js
router.get('/stats', verifyAdminToken, async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});
```

### Response Format
Always follow the standard response format:
```javascript
// Success response
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}

// Error response
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}
```

### Validation
Use express-validator for input validation:
```javascript
const validateBooking = [
  body('firstName').trim().isLength({ min: 1, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').matches(/^\+?[\d\s-()]+$/),
  body('service').isIn(['Family Portraits', 'Couples & Engagement', ...]),
  body('date').isISO8601().custom(value => {
    return new Date(value) > new Date();
  })
];
```

---

## Security

### Authentication
- Use JWT tokens for authentication
- Implement token expiration
- Store tokens securely (HttpOnly cookies in production)
- Implement proper logout

### Input Validation
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries (Mongoose handles this)
- Implement rate limiting

### Environment Variables
- Never commit sensitive data
- Use strong secrets for JWT
- Use app passwords for email
- Set appropriate CORS origins

### Security Headers
The application uses Helmet for security headers:
- XSS Protection
- Content Security Policy
- Frame Options
- Content Type Options

---

## Performance

### Database Optimization
1. **Use indexes** for frequently queried fields
2. **Limit query results** with pagination
3. **Use projection** to select only needed fields
4. **Avoid N+1 queries**

### Caching
Consider implementing:
- Redis for session storage
- Response caching for static data
- Database query caching

### Compression
The application uses compression middleware for:
- Response compression
- Reduced bandwidth usage
- Faster response times

### Monitoring
Monitor key metrics:
- Response times
- Database query performance
- Memory usage
- Error rates

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check connection string
echo $MONGODB_URI

# Test connection
npm run test:connection
```

#### 2. JWT Token Issues
```javascript
// Check token format
console.log('Token:', token);

// Verify JWT secret
console.log('JWT Secret:', process.env.JWT_SECRET);

// Check token expiration
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('Expires:', new Date(decoded.exp * 1000));
```

#### 3. Email Issues
```javascript
// Test SMTP connection
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready');
  }
});
```

#### 4. CORS Issues
```javascript
// Check CORS configuration
console.log('CORS Origin:', process.env.CORS_ORIGIN);

// Test from frontend
fetch('http://localhost:5000/api/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}).then(response => console.log('CORS Test:', response.status));
```

### Debug Mode
Enable debug logging:
```javascript
// In Server.js
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  mongoose.set('debug', true);
}
```

### Logs
Check application logs:
```bash
# PM2 logs
pm2 logs shootic-backend

# Direct logs
tail -f logs/combined.log

# Error logs
tail -f logs/err.log
```

---

## Contributing

### Before Contributing
1. Fork the repository
2. Create a feature branch
3. Set up development environment
4. Read the code style guide

### Pull Request Process
1. Write clear commit messages
2. Include tests if applicable
3. Update documentation
4. Follow the response format
5. Test thoroughly

### Code Review Checklist
- [ ] Code follows style guide
- [ ] Error handling is implemented
- [ ] Input validation is present
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Documentation updated

---

## Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code Extensions](https://marketplace.visualstudio.com/) - Development tools

### Community
- [Node.js Community](https://nodejs.org/en/community/)
- [MongoDB Community](https://community.mongodb.com/)
- [Express.js Community](https://expressjs.com/en/resources/community.html)

---

## Support

For development issues:
1. Check the troubleshooting section
2. Review the logs
3. Test with minimal setup
4. Create an issue with detailed information

For questions and discussions:
- Create an issue in the repository
- Contact the development team
- Join the community forums
