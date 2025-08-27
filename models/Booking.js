const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Customer Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },

  // Address Information
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'PIN code is required'],
    trim: true
  },

  // Booking Details
  service: {
    type: String,
    required: [true, 'Service is required'],
    enum: ['Family Portraits', 'Couples & Engagement', 'Kids & Newborns', 'Solo Portraits', 'Product Photography']
  },
  package: {
    type: String,
    required: [true, 'Package is required'],
    enum: ['Essential Package', 'Premium Package', 'Deluxe Package']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  addOns: [{
    type: String
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },

  // Status and Notes
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ email: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for full name
bookingSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-IN');
});

// Method to get booking summary
bookingSchema.methods.getSummary = function() {
  return {
    id: this._id,
    customerName: this.fullName,
    service: this.service,
    date: this.formattedDate,
    time: this.time,
    amount: this.totalAmount,
    status: this.status
  };
};

// Pre-save middleware to update the updatedAt field
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
