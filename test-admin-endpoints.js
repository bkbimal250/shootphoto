const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAdminEndpoints() {
  console.log('🧪 Testing Admin Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Admin Login
    console.log('2️⃣ Testing Admin Login...');
               const loginData = {
             email: 'admin@shootic.com',
             password: 'admin123'
           };
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login Response:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.data?.token,
      tokenLength: loginResponse.data.data?.token?.length || 0
    });
    console.log('');

    if (!loginResponse.data.success || !loginResponse.data.data?.token) {
      console.log('❌ Login failed, stopping tests');
      return;
    }

    const token = loginResponse.data.data.token;

    // Test 3: Admin Dashboard
    console.log('3️⃣ Testing Admin Dashboard...');
    const dashboardResponse = await axios.get(`${API_BASE}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Dashboard Response:', {
      success: dashboardResponse.data.success,
      hasData: !!dashboardResponse.data.data,
      overview: dashboardResponse.data.data?.overview,
      recentBookings: dashboardResponse.data.data?.recentActivity?.bookings?.length || 0
    });
    console.log('');

    // Test 4: Admin Profile
    console.log('4️⃣ Testing Admin Profile...');
    const profileResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile Response:', {
      success: profileResponse.data.success,
      admin: profileResponse.data.data?.admin
    });
    console.log('');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the tests
testAdminEndpoints();
