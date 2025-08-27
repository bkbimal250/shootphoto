const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const fixAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all admin users
    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admin users`);

    for (const admin of admins) {
      // Check if admin has name field
      if (!admin.name) {
        console.log(`Fixing admin ${admin.email} - adding name field`);
        admin.name = admin.email.split('@')[0] || 'Admin User';
        await admin.save();
        console.log(`Fixed admin ${admin.email}`);
      } else {
        console.log(`Admin ${admin.email} already has name: ${admin.name}`);
      }
    }

    console.log('Admin users check completed');

  } catch (error) {
    console.error('Error fixing admin users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the fix function
fixAdmin();
