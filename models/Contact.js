const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    maxlength: [255, 'Email cannot exceed 255 characters']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  serviceType: {
    type: String,
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
      'other',
      'general_inquiry'
    ],
    default: 'general_inquiry'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed', 'spam'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'social_media', 'referral', 'other'],
    default: 'website'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  referrer: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  notes: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  followUpDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  responseSent: {
    type: Boolean,
    default: false
  },
  responseSentAt: {
    type: Date
  },
  responseSentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ isRead: 1 });
contactSchema.index({ serviceType: 1 });

// Method to mark as read
contactSchema.methods.markAsRead = function(adminId) {
  this.isRead = true;
  this.readAt = new Date();
  this.readBy = adminId;
  if (this.status === 'new') {
    this.status = 'read';
  }
  return this.save();
};

// Method to mark as replied
contactSchema.methods.markAsReplied = function(adminId) {
  this.status = 'replied';
  this.responseSent = true;
  this.responseSentAt = new Date();
  this.responseSentBy = adminId;
  return this.save();
};

// Method to assign to admin
contactSchema.methods.assignTo = function(adminId) {
  this.assignedTo = adminId;
  return this.save();
};

// Method to add note
contactSchema.methods.addNote = function(content, adminId) {
  this.notes.push({
    content,
    createdBy: adminId
  });
  return this.save();
};

// Method to get contact summary
contactSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    subject: this.subject,
    status: this.status,
    priority: this.priority,
    createdAt: this.createdAt,
    isRead: this.isRead
  };
};

// Static method to find unread contacts
contactSchema.statics.findUnread = function() {
  return this.find({ isRead: false }).sort({ createdAt: -1 });
};

// Static method to find contacts by status
contactSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find contacts by priority
contactSchema.statics.findByPriority = function(priority) {
  return this.find({ priority }).sort({ createdAt: -1 });
};

// Static method to get contact statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return stats;
};

// Static method to find contacts that need follow-up
contactSchema.statics.findFollowUpNeeded = function() {
  const today = new Date();
  return this.find({
    followUpDate: { $lte: today },
    status: { $nin: ['closed', 'spam'] }
  }).sort({ followUpDate: 1 });
};

// Pre-save middleware to set priority based on subject/keywords
contactSchema.pre('save', function(next) {
  if (this.isModified('subject') || this.isModified('message')) {
    const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediate', 'critical'];
    const highKeywords = ['important', 'priority', 'quick', 'fast'];
    
    const content = (this.subject + ' ' + this.message).toLowerCase();
    
    if (urgentKeywords.some(keyword => content.includes(keyword))) {
      this.priority = 'urgent';
    } else if (highKeywords.some(keyword => content.includes(keyword))) {
      this.priority = 'high';
    }
  }
  next();
});

module.exports = mongoose.model('Contact', contactSchema);
