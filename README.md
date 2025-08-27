# Shootic Backend

A Node.js Express backend for the Shootic Photography booking system. This backend provides RESTful APIs for managing bookings, contacts, admin authentication, and dashboard analytics.

## Features

- **Booking Management**: Create, read, update, and delete bookings
- **Contact Form Handling**: Process and manage customer inquiries
- **Admin Authentication**: Secure JWT-based authentication system
- **Dashboard Analytics**: Comprehensive statistics and reporting
- **Email Notifications**: Automated email sending for bookings and contacts
- **Security**: Rate limiting, CORS, Helmet, and input validation
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Email**: Nodemailer
- **Logging**: Morgan

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd shootic-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   - For local MongoDB:
     ```bash
     # Start MongoDB service
     mongod
     ```
   - For MongoDB Atlas:
     - Create a cluster
     - Get your connection string
     - Update `MONGODB_URI` in `.env`

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/shootic

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Shootic Photography <noreply@shootic.com>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin profile
- `PUT /api/auth/profile` - Update admin profile
- `POST /api/auth/change-password` - Change admin password

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (with pagination/filters)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin only)
- `GET /api/contact/:id` - Get contact by ID (Admin only)
- `PUT /api/contact/:id` - Update contact status (Admin only)
- `DELETE /api/contact/:id` - Delete contact (Admin only)

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/bookings` - Get bookings with filters
- `PUT /api/admin/bookings/:id/status` - Update booking status
- `GET /api/admin/contacts` - Get contacts with filters
- `PUT /api/admin/contacts/:id/status` - Update contact status
- `GET /api/admin/stats` - Get detailed statistics

## Database Models

### Booking
```javascript
{
  customerName: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  service: String,
  package: String,
  date: Date,
  time: String,
  addOns: [String],
  totalAmount: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Contact
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: Prevent abuse with request rate limiting
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers for Express
- **Compression**: Response compression for better performance

## Email Configuration

The backend uses Nodemailer for sending emails. For Gmail:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your `.env` file

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

### Project Structure
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
├── Server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example            # Environment variables example
└── README.md              # This file
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start Server.js --name "shootic-backend"
   ```

### Environment Variables for Production
- Use strong JWT secrets
- Configure production MongoDB URI
- Set up proper email credentials
- Configure CORS for your frontend domain
- Enable all security features

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

