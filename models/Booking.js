const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    lowercase: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: [
      'wedding',
      'portrait',
      'event',
      'commercial',
      'family',
      'engagement',
      'maternity',
      'newborn',
      'graduation',
      'corporate',
      'other'
    ]
  },
  package: {
    type: String,
    required: [true, 'Package selection is required'],
    enum: ['basic', 'standard', 'premium', 'custom']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  time: {
    type: String,
    required: [true, 'Booking time is required']
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Location address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    }
  },
  specialRequirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Special requirements cannot exceed 1000 characters']
  },
  numberOfPeople: {
    type: Number,
    min: [1, 'Number of people must be at least 1'],
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price amount is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'online', 'other'],
    default: 'online'
  },
  photographer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  notes: {
    admin: [{
      content: String,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    customer: {
      type: String,
      trim: true
    }
  },
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  cancellationReason: {
    type: String,
    trim: true
  },
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ customerEmail: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ serviceType: 1 });
bookingSchema.index({ 'location.city': 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for total price after discount
bookingSchema.virtual('totalPrice').get(function() {
  return this.price.amount - this.price.discount;
});

// Method to check if booking is in the past
bookingSchema.methods.isPast = function() {
  return new Date(this.date) < new Date();
};

// Method to check if booking is today
bookingSchema.methods.isToday = function() {
  const today = new Date();
  const bookingDate = new Date(this.date);
  return bookingDate.toDateString() === today.toDateString();
};

// Method to get booking duration in hours and minutes
bookingSchema.methods.getDurationText = function() {
  const hours = Math.floor(this.duration);
  const minutes = Math.round((this.duration - hours) * 60);
  
  if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

// Static method to find bookings by date range
bookingSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
};

// Static method to find bookings by status
bookingSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ date: 1 });
};

// Static method to get booking statistics
bookingSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$price.amount' }
      }
    }
  ]);
  
  return stats;
};

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);
