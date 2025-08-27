const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Booking = require('./models/Booking');
const Contact = require('./models/Contact');

const testConnection = async () => {
  try {
    console.log('🔌 Testing database connection...');
    await connectDB();
    
    console.log('✅ Database connected successfully!');
    
    // Test models
    console.log('\n📊 Testing database models...');
    
    const adminCount = await Admin.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const contactCount = await Contact.countDocuments();
    
    console.log(`👤 Admin users: ${adminCount}`);
    console.log(`📅 Bookings: ${bookingCount}`);
    console.log(`📧 Contacts: ${contactCount}`);
    
    console.log('\n🎉 All tests passed! Your backend is ready.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  } finally {
    process.exit(0);
  }
};

testConnection();
