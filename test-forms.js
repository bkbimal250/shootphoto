const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testForms() {
  console.log('🧪 Testing Booking and Contact Forms...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Contact Form Submission
    console.log('2️⃣ Testing Contact Form...');
    const contactData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+919876543210',
      subject: 'general',
      message: 'This is a test message from the contact form. Please ignore this message as it is only for testing purposes.'
    };
    
    const contactResponse = await axios.post(`${API_BASE}/contact`, contactData);
    console.log('✅ Contact Form Response:', {
      success: contactResponse.data.success,
      message: contactResponse.data.message,
      contactId: contactResponse.data.data?.contact?._id
    });
    console.log('');

    // Test 3: Booking Form Submission
    console.log('3️⃣ Testing Booking Form...');
    const bookingData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+919876543211',
      service: 'Family Portraits',
      package: 'Premium Package',
      date: '2024-02-15',
      time: '14:00',
      addOns: ['Professional Makeup', 'Hair Styling'],
      totalAmount: 1899,
      address: '123 Test Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      notes: 'This is a test booking. Please ignore this as it is only for testing purposes.',
      status: 'pending'
    };
    
    const bookingResponse = await axios.post(`${API_BASE}/bookings`, bookingData);
    console.log('✅ Booking Form Response:', {
      success: bookingResponse.data.success,
      message: bookingResponse.data.message,
      bookingId: bookingResponse.data.data?.booking?._id
    });
    console.log('');

    // Test 4: Get All Contacts
    console.log('4️⃣ Testing Get All Contacts...');
    const contactsResponse = await axios.get(`${API_BASE}/contact`);
    console.log('✅ Contacts Response:', {
      success: contactsResponse.data.success,
      totalContacts: contactsResponse.data.data?.contacts?.length || 0
    });
    console.log('');

    // Test 5: Get All Bookings
    console.log('5️⃣ Testing Get All Bookings...');
    const bookingsResponse = await axios.get(`${API_BASE}/bookings`);
    console.log('✅ Bookings Response:', {
      success: bookingsResponse.data.success,
      totalBookings: bookingsResponse.data.data?.bookings?.length || 0
    });
    console.log('');

    console.log('🎉 All form tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the tests
testForms();
