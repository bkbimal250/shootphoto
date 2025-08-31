const Contact = require('../models/Contact');
const Admin = require('../models/Admin');
const { validationResult } = require('express-validator');

class ContactController {
  // @desc    Create new contact submission
  // @route   POST /api/contact
  // @access  Public
  static async createContact(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        name,
        email,
        phone,
        subject,
        message,
        serviceType = 'general_inquiry'
      } = req.body;

      // Create new contact
      const contact = new Contact({
        name,
        email,
        phone,
        subject,
        message,
        serviceType,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referrer')
      });

      await contact.save();

      res.status(201).json({
        success: true,
        message: 'Contact message sent successfully',
        data: contact
      });

    } catch (error) {
      console.error('Create contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get all contacts (admin)
  // @route   GET /api/contact
  // @access  Private
  static async getAllContacts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status || '';
      const priority = req.query.priority || '';
      const serviceType = req.query.serviceType || '';
      const search = req.query.search || '';
      const unreadOnly = req.query.unreadOnly === 'true';

      const skip = (page - 1) * limit;

      // Build query
      let query = {};
      
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (serviceType) query.serviceType = serviceType;
      if (unreadOnly) query.isRead = false;

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }

      const contacts = await Contact.find(query)
        .populate('assignedTo', 'name email')
        .populate('readBy', 'name email')
        .populate('responseSentBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Contact.countDocuments(query);

      res.json({
        success: true,
        data: {
          contacts,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get all contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get contacts',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get contact by ID
  // @route   GET /api/contact/:id
  // @access  Private
  static async getContactById(req, res) {
    try {
      const contact = await Contact.findById(req.params.id)
        .populate('assignedTo', 'name email phone')
        .populate('readBy', 'name email')
        .populate('responseSentBy', 'name email')
        .populate('notes.createdBy', 'name email');

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      // Mark as read if not already read
      if (!contact.isRead) {
        await contact.markAsRead(req.adminId);
      }

      res.json({
        success: true,
        data: contact
      });

    } catch (error) {
      console.error('Get contact by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get contact',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Update contact
  // @route   PUT /api/contact/:id
  // @access  Private
  static async updateContact(req, res) {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      const {
        status,
        priority,
        assignedTo,
        followUpDate,
        tags
      } = req.body;

      // Update fields
      if (status) contact.status = status;
      if (priority) contact.priority = priority;
      if (assignedTo) contact.assignedTo = assignedTo;
      if (followUpDate) contact.followUpDate = new Date(followUpDate);
      if (tags) contact.tags = tags;

      await contact.save();

      res.json({
        success: true,
        message: 'Contact updated successfully',
        data: contact
      });

    } catch (error) {
      console.error('Update contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Delete contact
  // @route   DELETE /api/contact/:id
  // @access  Private
  static async deleteContact(req, res) {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      await Contact.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Contact deleted successfully'
      });

    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete contact',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Mark contact as read
  // @route   PATCH /api/contact/:id/mark-read
  // @access  Private
  static async markAsRead(req, res) {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      await contact.markAsRead(req.adminId);

      res.json({
        success: true,
        message: 'Contact marked as read',
        data: contact
      });

    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark as read',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Mark contact as replied
  // @route   PATCH /api/contact/:id/mark-replied
  // @access  Private
  static async markAsReplied(req, res) {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      await contact.markAsReplied(req.adminId);

      res.json({
        success: true,
        message: 'Contact marked as replied',
        data: contact
      });

    } catch (error) {
      console.error('Mark as replied error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark as replied',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Assign contact to admin
  // @route   PATCH /api/contact/:id/assign
  // @access  Private
  static async assignContact(req, res) {
    try {
      const { adminId } = req.body;

      // Check if admin exists
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      await contact.assignTo(adminId);

      res.json({
        success: true,
        message: 'Contact assigned successfully',
        data: contact
      });

    } catch (error) {
      console.error('Assign contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign contact',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Add note to contact
  // @route   POST /api/contact/:id/notes
  // @access  Private
  static async addNote(req, res) {
    try {
      const { content } = req.body;

      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      await contact.addNote(content, req.adminId);

      res.json({
        success: true,
        message: 'Note added successfully',
        data: contact.notes[contact.notes.length - 1]
      });

    } catch (error) {
      console.error('Add note error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add note',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get contact statistics
  // @route   GET /api/contact/stats/overview
  // @access  Private
  static async getStats(req, res) {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Total contacts
      const totalContacts = await Contact.countDocuments();
      
      // Monthly contacts
      const monthlyContacts = await Contact.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      // Unread contacts
      const unreadContacts = await Contact.countDocuments({ isRead: false });

      // Status breakdown
      const statusStats = await Contact.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      // Priority breakdown
      const priorityStats = await Contact.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]);

      // Service type breakdown
      const serviceStats = await Contact.aggregate([
        {
          $group: {
            _id: '$serviceType',
            count: { $sum: 1 }
          }
        }
      ]);

      // Today's contacts
      const todayContacts = await Contact.countDocuments({
        createdAt: {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lt: new Date(today.setHours(23, 59, 59, 999))
        }
      });

      // Follow-up needed
      const followUpNeeded = await Contact.countDocuments({
        followUpDate: { $lte: today },
        status: { $nin: ['closed', 'spam'] }
      });

      res.json({
        success: true,
        data: {
          totalContacts,
          monthlyContacts,
          unreadContacts,
          todayContacts,
          followUpNeeded,
          statusStats,
          priorityStats,
          serviceStats
        }
      });

    } catch (error) {
      console.error('Get contact stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get unread contacts
  // @route   GET /api/contact/unread
  // @access  Private
  static async getUnreadContacts(req, res) {
    try {
      const contacts = await Contact.findUnread()
        .populate('assignedTo', 'name email')
        .limit(10);

      res.json({
        success: true,
        data: contacts
      });

    } catch (error) {
      console.error('Get unread contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get unread contacts',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get contacts needing follow-up
  // @route   GET /api/contact/follow-up
  // @access  Private
  static async getFollowUpContacts(req, res) {
    try {
      const contacts = await Contact.findFollowUpNeeded()
        .populate('assignedTo', 'name email')
        .limit(10);

      res.json({
        success: true,
        data: contacts
      });

    } catch (error) {
      console.error('Get follow-up contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get follow-up contacts',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Bulk update contacts
  // @route   PATCH /api/contact/bulk-update
  // @access  Private
  static async bulkUpdateContacts(req, res) {
    try {
      const { contactIds, updates } = req.body;

      if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Contact IDs are required'
        });
      }

      const allowedUpdates = ['status', 'priority', 'assignedTo', 'tags'];
      const filteredUpdates = {};

      // Only allow specific fields to be updated
      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });

      const result = await Contact.updateMany(
        { _id: { $in: contactIds } },
        { $set: filteredUpdates }
      );

      res.json({
        success: true,
        message: `Updated ${result.modifiedCount} contacts`,
        data: {
          modifiedCount: result.modifiedCount
        }
      });

    } catch (error) {
      console.error('Bulk update contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contacts',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = ContactController;
