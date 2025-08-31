const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with admin@shootic.com...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@shootic.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status text:', error.response.statusText);
      console.log('Headers:', error.response.headers);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('Request was made but no response received');
      console.log('Request:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
    
    // Test with different email formats
    console.log('\n--- Testing different email formats ---');
    
    const testEmails = [
      'admin@shootic.com',
      'ADMIN@SHOOTIC.COM',
      ' Admin@shootic.com ',
      'admin@shootic.com ',
      ' admin@shootic.com'
    ];
    
    for (const email of testEmails) {
      try {
        console.log(`\nTesting with: "${email}"`);
        const testResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: email,
          password: 'admin123'
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Success with this format!');
        console.log('Response:', testResponse.data);
        break;
      } catch (testError) {
        console.log('❌ Failed:', testError.message);
        if (testError.response) {
          console.log('Status:', testError.response.status);
          console.log('Data:', testError.response.data);
        }
      }
    }
  }
}

testLogin();
