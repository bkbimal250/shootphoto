# API Documentation

This document provides detailed information about all the API endpoints available in the Shootic Backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

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

---

## Authentication Endpoints

### POST /api/auth/login
Admin login endpoint.

**Request Body:**
```json
{
  "email": "admin@shootic.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Admin User",
      "email": "admin@shootic.com",
      "role": "admin",
      "isActive": true
    }
  }
}
```

### POST /api/auth/logout
Admin logout endpoint.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/auth/me
Get current admin profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Admin User",
      "email": "admin@shootic.com",
      "role": "admin",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## Booking Endpoints

### POST /api/bookings
Create a new booking.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+919876543210",
  "address": "123 Main Street",
  "city": "New Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "service": "Family Portraits",
  "package": "Premium Package",
  "date": "2024-02-15",
  "time": "14:00",
  "addOns": ["Professional Makeup", "Hair Styling"],
  "totalAmount": 1899,
  "notes": "Special requirements for the shoot"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "service": "Family Portraits",
      "package": "Premium Package",
      "date": "2024-02-15T00:00:00.000Z",
      "time": "14:00",
      "totalAmount": 1899,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### GET /api/bookings
Get all bookings with pagination and filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (pending, confirmed, completed, cancelled)
- `service` (string): Filter by service type
- `dateFrom` (string): Filter by date from (YYYY-MM-DD)
- `dateTo` (string): Filter by date to (YYYY-MM-DD)
- `search` (string): Search in customer name, email, or phone

**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "service": "Family Portraits",
        "package": "Premium Package",
        "date": "2024-02-15T00:00:00.000Z",
        "time": "14:00",
        "totalAmount": 1899,
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

### GET /api/bookings/:id
Get booking by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+919876543210",
      "address": "123 Main Street",
      "city": "New Delhi",
      "state": "Delhi",
      "pincode": "110001",
      "service": "Family Portraits",
      "package": "Premium Package",
      "date": "2024-02-15T00:00:00.000Z",
      "time": "14:00",
      "addOns": ["Professional Makeup", "Hair Styling"],
      "totalAmount": 1899,
      "status": "pending",
      "notes": "Special requirements for the shoot",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## Contact Endpoints

### POST /api/contact
Submit a contact form.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+919876543211",
  "subject": "booking",
  "message": "I would like to book a family portrait session for my daughter's 5th birthday."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "contact": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "subject": "booking",
      "status": "unread",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### GET /api/contact
Get all contacts (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (unread, read)
- `subject` (string): Filter by subject
- `search` (string): Search in name, email, or message

**Response:**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        "subject": "booking",
        "status": "unread",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

---

## Admin Dashboard Endpoints

### GET /api/admin/dashboard
Get dashboard statistics (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 150,
      "totalRevenue": 225000,
      "totalContacts": 45,
      "unreadContacts": 12
    },
    "statusBreakdown": {
      "pending": 25,
      "confirmed": 80,
      "completed": 40,
      "cancelled": 5
    },
    "recentActivity": {
      "bookings": [
        {
          "id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "firstName": "John",
          "lastName": "Doe",
          "service": "Family Portraits",
          "package": "Premium Package",
          "totalAmount": 1899,
          "status": "pending",
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "contacts": [
        {
          "id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "firstName": "Jane",
          "lastName": "Smith",
          "subject": "booking",
          "status": "unread",
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ]
    }
  }
}
```

### GET /api/admin/bookings
Get bookings with admin filters (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** Same as `/api/bookings`

### PUT /api/admin/bookings/:id/status
Update booking status (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "booking": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "status": "confirmed",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### GET /api/admin/contacts
Get contacts with admin filters (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** Same as `/api/contact`

### PUT /api/admin/contacts/:id/status
Update contact status (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "read"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact status updated successfully",
  "data": {
    "contact": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "status": "read",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation errors |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Validation Rules

### Booking Validation
- `firstName`, `lastName`: Required, string, max 50 characters
- `email`: Required, valid email format
- `phone`: Required, valid phone number format
- `address`, `city`, `state`: Required, string, max 100 characters
- `pincode`: Required, 6 digits
- `service`: Required, must be one of: Family Portraits, Couples & Engagement, Kids & Newborns, Solo Portraits, Product Photography
- `package`: Required, must be one of: Essential Package, Premium Package, Deluxe Package
- `date`: Required, valid date, must be future date
- `time`: Required, valid time format (HH:MM)
- `totalAmount`: Required, number, minimum 500

### Contact Validation
- `firstName`, `lastName`: Required, string, max 50 characters
- `email`: Required, valid email format
- `phone`: Required, valid phone number format
- `subject`: Required, must be one of: booking, pricing, service, support, general
- `message`: Required, string, minimum 10 characters, maximum 1000 characters

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 requests per window
- **Headers**: Rate limit information is included in response headers

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Development)
- `http://localhost:3000` (Alternative development port)
- Configure additional origins in production
