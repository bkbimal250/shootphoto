const axios = require('axios');

const API_BASE_URL = 'https://shootphoto.onrender.com/api';

async function testLoginDebug() {
  console.log('🔍 Debugging Login Endpoint');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Check if the endpoint exists
    console.log('\n1️⃣ Testing OPTIONS request...');
    try {
      const optionsResponse = await axios.options(`${API_BASE_URL}/auth/login`);
      console.log('✅ OPTIONS Response Status:', optionsResponse.status);
      console.log('✅ OPTIONS Response Headers:', optionsResponse.headers);
    } catch (error) {
      console.log('❌ OPTIONS Error:', error.message);
    }
    
    // Test 2: Test actual login
    console.log('\n2️⃣ Testing POST login request...');
    const loginData = {
      email: 'admin@shootic.com',
      password: 'admin123'
    };
    
    console.log('📤 Sending data:', JSON.stringify(loginData, null, 2));
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Login Response Status:', loginResponse.status);
    console.log('✅ Login Response Data:', JSON.stringify(loginResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Login Error:', error.message);
    if (error.response) {
      console.log('❌ Response Status:', error.response.status);
      console.log('❌ Response Headers:', error.response.headers);
      console.log('❌ Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testLoginDebug();
