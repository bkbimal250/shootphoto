const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
require('dotenv').config();

const seedSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Sample bookings data
    const sampleBookings = [
      {
        customerName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        service: 'family-portrait',
        package: 'premium',
        date: new Date('2024-02-15'),
        time: '14:00',
        addOns: ['makeup', 'hair-styling'],
        totalAmount: 450,
        status: 'confirmed'
      },
      {
        customerName: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0456',
        address: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        service: 'couples-engagement',
        package: 'standard',
        date: new Date('2024-02-20'),
        time: '16:00',
        addOns: ['location-scouting'],
        totalAmount: 350,
        status: 'pending'
      },
      {
        customerName: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        phone: '+1-555-0789',
        address: {
          street: '789 Pine Road',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        service: 'kids-newborn',
        package: 'basic',
        date: new Date('2024-02-25'),
        time: '10:00',
        addOns: [],
        totalAmount: 250,
        status: 'completed'
      },
      {
        customerName: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0321',
        address: {
          street: '321 Elm Street',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101'
        },
        service: 'solo-portrait',
        package: 'premium',
        date: new Date('2024-03-01'),
        time: '15:00',
        addOns: ['makeup', 'wardrobe-styling'],
        totalAmount: 400,
        status: 'confirmed'
      },
      {
        customerName: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+1-555-0654',
        address: {
          street: '654 Maple Drive',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101'
        },
        service: 'product-photography',
        package: 'standard',
        date: new Date('2024-03-05'),
        time: '11:00',
        addOns: ['product-styling'],
        totalAmount: 300,
        status: 'pending'
      }
    ];

    // Sample contacts data
    const sampleContacts = [
      {
        firstName: 'Alice',
        lastName: 'Thompson',
        email: 'alice.thompson@email.com',
        phone: '+1-555-0987',
        subject: 'pricing',
        message: 'Hi, I would like to know more about your pricing for family portraits. Do you offer any discounts for multiple sessions?',
        status: 'unread'
      },
      {
        firstName: 'Robert',
        lastName: 'Garcia',
        email: 'robert.garcia@email.com',
        phone: '+1-555-0123',
        subject: 'booking',
        message: 'I am interested in booking a couples engagement session. What dates do you have available in March?',
        status: 'read'
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.anderson@email.com',
        phone: '+1-555-0456',
        subject: 'service',
        message: 'Do you provide makeup and hair styling services for portrait sessions? I would like to know more about your add-on services.',
        status: 'unread'
      },
      {
        firstName: 'James',
        lastName: 'Taylor',
        email: 'james.taylor@email.com',
        phone: '+1-555-0789',
        subject: 'general',
        message: 'I saw your work on social media and I am very impressed. Do you travel for outdoor sessions?',
        status: 'read'
      },
      {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@email.com',
        phone: '+1-555-0321',
        subject: 'support',
        message: 'I had a session booked for last week but had to cancel due to illness. Can I reschedule without additional fees?',
        status: 'unread'
      }
    ];

    // Clear existing sample data (optional)
    const clearExisting = process.argv.includes('--clear');
    if (clearExisting) {
      await Booking.deleteMany({});
      await Contact.deleteMany({});
      console.log('Cleared existing data');
    }

    // Check if sample data already exists
    const existingBookings = await Booking.countDocuments();
    const existingContacts = await Contact.countDocuments();

    if (existingBookings > 0 && existingContacts > 0 && !clearExisting) {
      console.log('Sample data already exists. Use --clear flag to replace existing data.');
      process.exit(0);
    }

    // Insert sample bookings
    if (existingBookings === 0 || clearExisting) {
      const bookings = await Booking.insertMany(sampleBookings);
      console.log(`Created ${bookings.length} sample bookings`);
    }

    // Insert sample contacts
    if (existingContacts === 0 || clearExisting) {
      const contacts = await Contact.insertMany(sampleContacts);
      console.log(`Created ${contacts.length} sample contacts`);
    }

    console.log('Sample data seeded successfully!');

  } catch (error) {
    console.error('Error seeding sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedSampleData();
