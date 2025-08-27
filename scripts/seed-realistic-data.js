const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const Booking = require('../models/Booking');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Sample contact data
const sampleContacts = [
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+919876543210',
    subject: 'booking',
    message: 'Hi, I would like to book a family portrait session for my daughter\'s 5th birthday. Can you please provide details about your packages and availability?'
  },
  {
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.verma@yahoo.com',
    phone: '+919876543211',
    subject: 'pricing',
    message: 'I\'m interested in your couples photography session. Could you please share your pricing details and what\'s included in each package?'
  },
  {
    firstName: 'Anjali',
    lastName: 'Patel',
    email: 'anjali.patel@hotmail.com',
    phone: '+919876543212',
    subject: 'service',
    message: 'Do you offer newborn photography sessions? My baby is 2 weeks old and I would love to capture these precious moments.'
  },
  {
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@outlook.com',
    phone: '+919876543213',
    subject: 'general',
    message: 'I\'m planning a corporate event and need professional photography services. Do you handle corporate events as well?'
  },
  {
    firstName: 'Meera',
    lastName: 'Kumar',
    email: 'meera.kumar@gmail.com',
    phone: '+919876543214',
    subject: 'support',
    message: 'I had a booking last week but haven\'t received my photos yet. Can you please check the status and let me know when I can expect them?'
  },
  {
    firstName: 'Arjun',
    lastName: 'Malhotra',
    email: 'arjun.malhotra@gmail.com',
    phone: '+919876543215',
    subject: 'booking',
    message: 'Looking for engagement photography session. What are your available dates for next month?'
  },
  {
    firstName: 'Zara',
    lastName: 'Khan',
    email: 'zara.khan@yahoo.com',
    phone: '+919876543216',
    subject: 'pricing',
    message: 'Interested in product photography for my online store. Can you provide a quote for 50 product images?'
  },
  {
    firstName: 'Aditya',
    lastName: 'Joshi',
    email: 'aditya.joshi@gmail.com',
    phone: '+919876543217',
    subject: 'service',
    message: 'Do you offer outdoor photography sessions? I would like to have my family photos taken at a local park.'
  }
];

// Sample booking data
const sampleBookings = [
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+919876543210',
    service: 'Family Portraits',
    package: 'Premium Package',
    date: new Date('2024-02-15'),
    time: '14:00',
    addOns: ['Professional Makeup', 'Hair Styling'],
    totalAmount: 1899,
    address: '123 Green Park, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110016',
    notes: 'Daughter\'s 5th birthday celebration. Please bring props for kids photography.',
    status: 'confirmed'
  },
  {
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.verma@yahoo.com',
    phone: '+919876543211',
    service: 'Couples & Engagement',
    package: 'Deluxe Package',
    date: new Date('2024-02-20'),
    time: '16:00',
    addOns: ['Professional Makeup', 'Hair Styling', 'Outdoor Location'],
    totalAmount: 2499,
    address: '456 Lodhi Garden Road, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110003',
    notes: 'Engagement photoshoot. We would like some romantic poses and candid shots.',
    status: 'pending'
  },
  {
    firstName: 'Anjali',
    lastName: 'Patel',
    email: 'anjali.patel@hotmail.com',
    phone: '+919876543212',
    service: 'Kids & Newborns',
    package: 'Essential Package',
    date: new Date('2024-02-25'),
    time: '10:00',
    addOns: ['Baby Props'],
    totalAmount: 1199,
    address: '789 Vasant Vihar, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110057',
    notes: 'Newborn baby girl, 2 weeks old. Please bring soft lighting and gentle approach.',
    status: 'confirmed'
  },
  {
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@outlook.com',
    phone: '+919876543213',
    service: 'Product Photography',
    package: 'Premium Package',
    date: new Date('2024-03-01'),
    time: '11:00',
    addOns: ['Professional Lighting', 'Background Setup'],
    totalAmount: 1999,
    address: '321 Connaught Place, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    notes: 'Corporate product catalog. Need high-quality images for marketing materials.',
    status: 'pending'
  },
  {
    firstName: 'Meera',
    lastName: 'Kumar',
    email: 'meera.kumar@gmail.com',
    phone: '+919876543214',
    service: 'Solo Portraits',
    package: 'Essential Package',
    date: new Date('2024-01-28'),
    time: '15:00',
    addOns: ['Professional Makeup'],
    totalAmount: 1299,
    address: '654 Greater Kailash, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110048',
    notes: 'Professional headshots for LinkedIn profile. Business casual attire.',
    status: 'completed'
  },
  {
    firstName: 'Arjun',
    lastName: 'Malhotra',
    email: 'arjun.malhotra@gmail.com',
    phone: '+919876543215',
    service: 'Couples & Engagement',
    package: 'Premium Package',
    date: new Date('2024-03-05'),
    time: '17:00',
    addOns: ['Professional Makeup', 'Hair Styling', 'Outdoor Location'],
    totalAmount: 1899,
    address: '987 Hauz Khas Village, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110016',
    notes: 'Engagement announcement photos. Would like some traditional and modern poses.',
    status: 'confirmed'
  },
  {
    firstName: 'Zara',
    lastName: 'Khan',
    email: 'zara.khan@yahoo.com',
    phone: '+919876543216',
    service: 'Product Photography',
    package: 'Deluxe Package',
    date: new Date('2024-03-10'),
    time: '12:00',
    addOns: ['Professional Lighting', 'Background Setup', 'Product Styling'],
    totalAmount: 2499,
    address: '147 Khan Market, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110003',
    notes: 'Fashion accessories for online store. Need lifestyle and product shots.',
    status: 'pending'
  },
  {
    firstName: 'Aditya',
    lastName: 'Joshi',
    email: 'aditya.joshi@gmail.com',
    phone: '+919876543217',
    service: 'Family Portraits',
    package: 'Essential Package',
    date: new Date('2024-03-15'),
    time: '16:30',
    addOns: ['Outdoor Location'],
    totalAmount: 1299,
    address: '258 Nehru Park, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110021',
    notes: 'Family of 4 with 2 kids (ages 8 and 12). Outdoor session at Nehru Park.',
    status: 'confirmed'
  },
  {
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '+919876543218',
    service: 'Kids & Newborns',
    package: 'Premium Package',
    date: new Date('2024-02-10'),
    time: '09:00',
    addOns: ['Baby Props', 'Family Shots'],
    totalAmount: 1699,
    address: '369 Defence Colony, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110024',
    notes: 'Baby boy, 1 month old. Include some family shots with parents.',
    status: 'completed'
  },
  {
    firstName: 'Karan',
    lastName: 'Kapoor',
    email: 'karan.kapoor@gmail.com',
    phone: '+919876543219',
    service: 'Solo Portraits',
    package: 'Deluxe Package',
    date: new Date('2024-03-20'),
    time: '14:00',
    addOns: ['Professional Makeup', 'Hair Styling', 'Wardrobe Consultation'],
    totalAmount: 1999,
    address: '741 South Extension, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110049',
    notes: 'Actor portfolio shots. Need variety of looks and expressions.',
    status: 'pending'
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...\n');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Contact.deleteMany({});
    await Booking.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Insert contacts
    console.log('📝 Inserting contact data...');
    const contacts = await Contact.insertMany(sampleContacts);
    console.log(`✅ ${contacts.length} contacts inserted\n`);

    // Insert bookings
    console.log('📅 Inserting booking data...');
    const bookings = await Booking.insertMany(sampleBookings);
    console.log(`✅ ${bookings.length} bookings inserted\n`);

    // Calculate statistics
    const totalContacts = await Contact.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    console.log('📊 Database Statistics:');
    console.log(`   📝 Total Contacts: ${totalContacts}`);
    console.log(`   📅 Total Bookings: ${totalBookings}`);
    console.log(`   ✅ Confirmed Bookings: ${confirmedBookings}`);
    console.log(`   ⏳ Pending Bookings: ${pendingBookings}`);
    console.log(`   🎉 Completed Bookings: ${completedBookings}\n`);

    console.log('🎉 Data seeding completed successfully!');
    console.log('\n📋 Sample Data Overview:');
    console.log('   • 8 Contact Form Submissions');
    console.log('   • 10 Booking Requests');
    console.log('   • Various services and packages');
    console.log('   • Different booking statuses');
    console.log('   • Realistic customer information');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the seeding
seedData();
