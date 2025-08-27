const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const Booking = require('../models/Booking');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Additional contact data for different scenarios
const additionalContacts = [
  {
    firstName: 'Riya',
    lastName: 'Gupta',
    email: 'riya.gupta@gmail.com',
    phone: '+919876543220',
    subject: 'booking',
    message: 'I need a wedding photography package. Can you please provide details about your wedding photography services and pricing?'
  },
  {
    firstName: 'Amit',
    lastName: 'Chopra',
    email: 'amit.chopra@yahoo.com',
    phone: '+919876543221',
    subject: 'pricing',
    message: 'Looking for corporate event photography for our annual conference. Need a quote for 2-day event coverage.'
  },
  {
    firstName: 'Pooja',
    lastName: 'Shah',
    email: 'pooja.shah@hotmail.com',
    phone: '+919876543222',
    subject: 'service',
    message: 'Do you offer maternity photography sessions? I\'m 7 months pregnant and would love to capture this special time.'
  },
  {
    firstName: 'Raj',
    lastName: 'Mehta',
    email: 'raj.mehta@gmail.com',
    phone: '+919876543223',
    subject: 'support',
    message: 'I have a question about my recent booking. Can you please call me back regarding the rescheduling request?'
  },
  {
    firstName: 'Neha',
    lastName: 'Tiwari',
    email: 'neha.tiwari@outlook.com',
    phone: '+919876543224',
    subject: 'general',
    message: 'I\'m interested in starting a photography business. Do you offer mentoring or training sessions?'
  }
];

// Additional booking data for different scenarios
const additionalBookings = [
  {
    firstName: 'Riya',
    lastName: 'Gupta',
    email: 'riya.gupta@gmail.com',
    phone: '+919876543220',
    service: 'Couples & Engagement',
    package: 'Deluxe Package',
    date: new Date('2024-04-15'),
    time: '18:00',
    addOns: ['Professional Makeup', 'Hair Styling', 'Outdoor Location', 'Engagement Ring Photography'],
    totalAmount: 2999,
    address: '456 Wedding Palace, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    notes: 'Wedding engagement shoot. Traditional and modern themes. Include family shots.',
    status: 'confirmed'
  },
  {
    firstName: 'Amit',
    lastName: 'Chopra',
    email: 'amit.chopra@yahoo.com',
    phone: '+919876543221',
    service: 'Product Photography',
    package: 'Premium Package',
    date: new Date('2024-04-20'),
    time: '10:00',
    addOns: ['Professional Lighting', 'Background Setup', 'Product Styling', 'Corporate Branding'],
    totalAmount: 3499,
    address: '789 Business Center, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110002',
    notes: 'Corporate conference photography. 2-day event. Need candid and formal shots.',
    status: 'pending'
  },
  {
    firstName: 'Pooja',
    lastName: 'Shah',
    email: 'pooja.shah@hotmail.com',
    phone: '+919876543222',
    service: 'Family Portraits',
    package: 'Premium Package',
    date: new Date('2024-04-25'),
    time: '16:00',
    addOns: ['Professional Makeup', 'Maternity Props', 'Family Shots'],
    totalAmount: 2199,
    address: '321 Maternity Home, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110003',
    notes: 'Maternity photoshoot. 7 months pregnant. Include husband in some shots.',
    status: 'confirmed'
  },
  {
    firstName: 'Raj',
    lastName: 'Mehta',
    email: 'raj.mehta@gmail.com',
    phone: '+919876543223',
    service: 'Solo Portraits',
    package: 'Essential Package',
    date: new Date('2024-03-25'),
    time: '14:00',
    addOns: ['Professional Makeup'],
    totalAmount: 1299,
    address: '654 Studio Complex, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110004',
    notes: 'Professional headshots for job applications. Business formal attire.',
    status: 'completed'
  },
  {
    firstName: 'Neha',
    lastName: 'Tiwari',
    email: 'neha.tiwari@outlook.com',
    phone: '+919876543224',
    service: 'Kids & Newborns',
    package: 'Essential Package',
    date: new Date('2024-05-01'),
    time: '11:00',
    addOns: ['Baby Props', 'Family Shots'],
    totalAmount: 1399,
    address: '147 Baby Care Center, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110005',
    notes: 'Baby girl, 3 months old. Include parents and grandparents in some shots.',
    status: 'pending'
  }
];

async function addAdditionalData() {
  try {
    console.log('🌱 Adding additional sample data...\n');

    // Insert additional contacts
    console.log('📝 Inserting additional contact data...');
    const contacts = await Contact.insertMany(additionalContacts);
    console.log(`✅ ${contacts.length} additional contacts inserted\n`);

    // Insert additional bookings
    console.log('📅 Inserting additional booking data...');
    const bookings = await Booking.insertMany(additionalBookings);
    console.log(`✅ ${bookings.length} additional bookings inserted\n`);

    // Calculate updated statistics
    const totalContacts = await Contact.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    console.log('📊 Updated Database Statistics:');
    console.log(`   📝 Total Contacts: ${totalContacts}`);
    console.log(`   📅 Total Bookings: ${totalBookings}`);
    console.log(`   ✅ Confirmed Bookings: ${confirmedBookings}`);
    console.log(`   ⏳ Pending Bookings: ${pendingBookings}`);
    console.log(`   🎉 Completed Bookings: ${completedBookings}\n`);

    console.log('🎉 Additional data added successfully!');
    console.log('\n📋 New Data Added:');
    console.log('   • 5 Additional Contact Form Submissions');
    console.log('   • 5 Additional Booking Requests');
    console.log('   • Wedding engagement photography');
    console.log('   • Corporate event photography');
    console.log('   • Maternity photography');
    console.log('   • Professional headshots');
    console.log('   • Baby photography with family');

  } catch (error) {
    console.error('❌ Error adding additional data:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the additional data seeding
addAdditionalData();
