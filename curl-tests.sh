#!/bin/bash

# Shootic API Test Script
# Base URL: https://shootphoto.onrender.com/api

echo "🚀 Shootic API Manual Tests"
echo "=========================="

# Test 1: Health Check
echo -e "\n1️⃣ Health Check:"
curl -X GET "https://shootphoto.onrender.com/api/health" \
  -H "Content-Type: application/json"

# Test 2: Contact Form
echo -e "\n\n2️⃣ Contact Form:"
curl -X POST "https://shootphoto.onrender.com/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "subject": "general",
    "message": "Test message from curl"
  }'

# Test 3: Booking Form
echo -e "\n\n3️⃣ Booking Form:"
curl -X POST "https://shootphoto.onrender.com/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Customer",
    "email": "customer@example.com",
    "phone": "+1987654321",
    "service": "Family Portraits",
    "package": "Essential Package",
    "date": "2024-02-25",
    "time": "16:00",
    "location": "Home",
    "address": "123 Test Street",
    "city": "Test City",
    "state": "Test State",
    "pincode": "123456",
    "totalAmount": 999,
    "message": "Test booking from curl"
  }'

# Test 4: Admin Login
echo -e "\n\n4️⃣ Admin Login:"
LOGIN_RESPONSE=$(curl -s -X POST "https://shootphoto.onrender.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shootic.com",
    "password": "admin123"
  }')

echo "$LOGIN_RESPONSE"

# Extract token from login response (requires jq)
if command -v jq &> /dev/null; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
    
    if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
        echo -e "\n\n5️⃣ Admin Dashboard (with token):"
        curl -X GET "https://shootphoto.onrender.com/api/admin/dashboard" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN"
        
        echo -e "\n\n6️⃣ Get Bookings (with token):"
        curl -X GET "https://shootphoto.onrender.com/api/admin/bookings" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN"
        
        echo -e "\n\n7️⃣ Get Contacts (with token):"
        curl -X GET "https://shootphoto.onrender.com/api/admin/contacts" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN"
    else
        echo -e "\n❌ Could not extract token from login response"
    fi
else
    echo -e "\n⚠️ jq not installed. Skipping authenticated tests."
    echo "Install jq to test authenticated endpoints:"
    echo "  Ubuntu/Debian: sudo apt install jq"
    echo "  macOS: brew install jq"
    echo "  Windows: choco install jq"
fi

echo -e "\n\n✅ Manual tests completed!"
