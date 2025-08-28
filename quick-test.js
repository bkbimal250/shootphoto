const axios = require('axios');

const API_BASE_URL = 'https://shootphoto.onrender.com/api';

async function quickTest() {
  console.log('🚀 Quick API Test for https://shootphoto.onrender.com/');
  console.log('='.repeat(60));
  
  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test 2: Contact Form
    console.log('\n2️⃣ Testing Contact Form...');
    const contactResponse = await axios.post(`${API_BASE_URL}/contact`, {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+1234567890',
      subject: 'general',
      message: 'Quick test message'
    });
    console.log('✅ Contact Form:', contactResponse.data.message);
    
    // Test 3: Booking Form
    console.log('\n3️⃣ Testing Booking Form...');
    const bookingResponse = await axios.post(`${API_BASE_URL}/bookings`, {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'customer@example.com',
      phone: '+1987654321',
      service: 'Family Portraits',
      package: 'Essential Package',
      date: '2024-02-20',
      time: '15:00',
      location: 'Home',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      totalAmount: 999,
      message: 'Quick test booking'
    });
    console.log('✅ Booking Form:', bookingResponse.data.message);
    
    // Test 4: Admin Login
    console.log('\n4️⃣ Testing Admin Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@shootic.com',
      password: 'admin123'
    });
    console.log('✅ Admin Login:', loginResponse.data.message);
    
    if (loginResponse.data.data?.token) {
      const token = loginResponse.data.data.token;
      
      // Test 5: Admin Dashboard
      console.log('\n5️⃣ Testing Admin Dashboard...');
      const dashboardResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Admin Dashboard:', dashboardResponse.data.message);
      
      // Test 6: Get Bookings
      console.log('\n6️⃣ Testing Get Bookings...');
      const bookingsResponse = await axios.get(`${API_BASE_URL}/admin/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Get Bookings:', `Found ${bookingsResponse.data.data?.bookings?.length || 0} bookings`);
      
      // Test 7: Get Contacts
      console.log('\n7️⃣ Testing Get Contacts...');
      const contactsResponse = await axios.get(`${API_BASE_URL}/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Get Contacts:', `Found ${contactsResponse.data.data?.contacts?.length || 0} contacts`);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ API is working correctly at https://shootphoto.onrender.com/');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

quickTest();
