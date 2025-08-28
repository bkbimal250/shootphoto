const axios = require('axios');

// Production API base URL
const API_BASE_URL = 'https://shootphoto.onrender.com/api';

// Test data
const testContactData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  subject: 'general',
  message: 'This is a test message from the production API test script.'
};

const testBookingData = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '+1987654321',
  service: 'Family Portraits',
  package: 'Essential Package',
  date: '2024-02-15',
  time: '14:00',
  location: 'Home',
  address: '456 Test Avenue',
  city: 'Test City',
  state: 'Test State',
  pincode: '123456',
  totalAmount: 999,
  message: 'Test booking from production API test script.'
};

const adminCredentials = {
  email: 'admin@shootic.com',
  password: 'admin123'
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Helper function to log results
function logResult(testName, success, data = null, error = null) {
  const status = success ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`${colors.bold}${testName}:${colors.reset} ${status}`);
  
  if (success && data) {
    console.log(`${colors.blue}Response:${colors.reset}`, JSON.stringify(data, null, 2));
  }
  
  if (error) {
    console.log(`${colors.red}Error:${colors.reset}`, error.message || error);
  }
  
  console.log(''); // Empty line for readability
}

// Test functions
async function testHealthCheck() {
  try {
    console.log(`${colors.bold}🏥 Testing Health Check Endpoint${colors.reset}\n`);
    
    const response = await axios.get(`${API_BASE_URL}/health`);
    logResult('Health Check', true, response.data);
    return true;
  } catch (error) {
    logResult('Health Check', false, null, error);
    return false;
  }
}

async function testContactForm() {
  try {
    console.log(`${colors.bold}📧 Testing Contact Form Endpoint${colors.reset}\n`);
    
    const response = await axios.post(`${API_BASE_URL}/contact`, testContactData);
    logResult('Contact Form Submission', true, response.data);
    return true;
  } catch (error) {
    logResult('Contact Form Submission', false, null, error);
    return false;
  }
}

async function testBookingForm() {
  try {
    console.log(`${colors.bold}📅 Testing Booking Form Endpoint${colors.reset}\n`);
    
    const response = await axios.post(`${API_BASE_URL}/bookings`, testBookingData);
    logResult('Booking Form Submission', true, response.data);
    return true;
  } catch (error) {
    logResult('Booking Form Submission', false, null, error);
    return false;
  }
}

async function testAdminLogin() {
  try {
    console.log(`${colors.bold}🔐 Testing Admin Login Endpoint${colors.reset}\n`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, adminCredentials);
    logResult('Admin Login', true, {
      success: response.data.success,
      message: response.data.message,
      hasToken: !!response.data.data?.token
    });
    
    // Return token for other tests
    return response.data.data?.token;
  } catch (error) {
    logResult('Admin Login', false, null, error);
    return null;
  }
}

async function testAdminDashboard(token) {
  if (!token) {
    console.log(`${colors.yellow}⚠️ Skipping Admin Dashboard test - no token available${colors.reset}\n`);
    return false;
  }
  
  try {
    console.log(`${colors.bold}📊 Testing Admin Dashboard Endpoint${colors.reset}\n`);
    
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logResult('Admin Dashboard', true, {
      success: response.data.success,
      hasStats: !!response.data.data?.overview,
      hasRecentBookings: !!response.data.data?.recentActivity?.bookings,
      statsCount: Object.keys(response.data.data?.overview || {}).length
    });
    return true;
  } catch (error) {
    logResult('Admin Dashboard', false, null, error);
    return false;
  }
}

async function testGetBookings(token) {
  if (!token) {
    console.log(`${colors.yellow}⚠️ Skipping Get Bookings test - no token available${colors.reset}\n`);
    return false;
  }
  
  try {
    console.log(`${colors.bold}📋 Testing Get Bookings Endpoint${colors.reset}\n`);
    
    const response = await axios.get(`${API_BASE_URL}/admin/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logResult('Get Bookings', true, {
      success: response.data.success,
      totalBookings: response.data.data?.bookings?.length || 0,
      hasPagination: !!response.data.data?.pagination
    });
    return true;
  } catch (error) {
    logResult('Get Bookings', false, null, error);
    return false;
  }
}

async function testGetContacts(token) {
  if (!token) {
    console.log(`${colors.yellow}⚠️ Skipping Get Contacts test - no token available${colors.reset}\n`);
    return false;
  }
  
  try {
    console.log(`${colors.bold}📞 Testing Get Contacts Endpoint${colors.reset}\n`);
    
    const response = await axios.get(`${API_BASE_URL}/admin/contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logResult('Get Contacts', true, {
      success: response.data.success,
      totalContacts: response.data.data?.contacts?.length || 0,
      hasPagination: !!response.data.data?.pagination
    });
    return true;
  } catch (error) {
    logResult('Get Contacts', false, null, error);
    return false;
  }
}

async function testInvalidEndpoints() {
  try {
    console.log(`${colors.bold}🚫 Testing Invalid Endpoints${colors.reset}\n`);
    
    // Test non-existent endpoint
    try {
      await axios.get(`${API_BASE_URL}/nonexistent`);
      logResult('Non-existent Endpoint', false, null, 'Should have returned 404');
    } catch (error) {
      if (error.response?.status === 404) {
        logResult('Non-existent Endpoint', true, { status: 404, message: 'Not Found' });
      } else {
        logResult('Non-existent Endpoint', false, null, error);
      }
    }
    
    // Test invalid contact data
    try {
      await axios.post(`${API_BASE_URL}/contact`, {
        email: 'invalid-email',
        subject: 'invalid-subject'
      });
      logResult('Invalid Contact Data', false, null, 'Should have returned validation error');
    } catch (error) {
      if (error.response?.status === 400) {
        logResult('Invalid Contact Data', true, { 
          status: 400, 
          message: 'Validation error as expected',
          errors: error.response.data?.errors 
        });
      } else {
        logResult('Invalid Contact Data', false, null, error);
      }
    }
    
    return true;
  } catch (error) {
    logResult('Invalid Endpoints Test', false, null, error);
    return false;
  }
}

async function testCORS() {
  try {
    console.log(`${colors.bold}🌐 Testing CORS Configuration${colors.reset}\n`);
    
    const response = await axios.options(`${API_BASE_URL}/health`);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
    };
    
    logResult('CORS Configuration', true, corsHeaders);
    return true;
  } catch (error) {
    logResult('CORS Configuration', false, null, error);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log(`${colors.bold}🚀 Starting Production API Tests${colors.reset}`);
  console.log(`${colors.blue}API Base URL:${colors.reset} ${API_BASE_URL}\n`);
  
  const results = {
    healthCheck: false,
    contactForm: false,
    bookingForm: false,
    adminLogin: false,
    adminDashboard: false,
    getBookings: false,
    getContacts: false,
    invalidEndpoints: false,
    cors: false
  };
  
  // Run tests
  results.healthCheck = await testHealthCheck();
  results.contactForm = await testContactForm();
  results.bookingForm = await testBookingForm();
  
  const token = await testAdminLogin();
  results.adminLogin = !!token;
  
  if (token) {
    results.adminDashboard = await testAdminDashboard(token);
    results.getBookings = await testGetBookings(token);
    results.getContacts = await testGetContacts(token);
  }
  
  results.invalidEndpoints = await testInvalidEndpoints();
  results.cors = await testCORS();
  
  // Summary
  console.log(`${colors.bold}📊 Test Summary${colors.reset}`);
  console.log('='.repeat(50));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
    console.log(`${status} ${test}`);
  });
  
  console.log('='.repeat(50));
  console.log(`${colors.bold}Total Tests:${colors.reset} ${totalTests}`);
  console.log(`${colors.green}Passed:${colors.reset} ${passedTests}`);
  console.log(`${colors.red}Failed:${colors.reset} ${failedTests}`);
  console.log(`${colors.bold}Success Rate:${colors.reset} ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log(`\n${colors.green}${colors.bold}🎉 All tests passed! The API is working correctly.${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}${colors.bold}⚠️ Some tests failed. Please check the errors above.${colors.reset}`);
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error(`${colors.red}${colors.bold}❌ Test runner failed:${colors.reset}`, error);
  process.exit(1);
});
