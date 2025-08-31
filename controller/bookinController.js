const Booking = require('../models/Booking');
const Admin = require('../models/Admin');
const { validationResult } = require('express-validator');

class BookingController {
  // @desc    Create new booking
  // @route   POST /api/bookings
  // @access  Public
  static async createBooking(req, res) {
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
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        package: packageType,
        date,
        time,
        duration,
        location,
        specialRequirements,
        numberOfPeople,
        price
      } = req.body;

      // Check for booking conflicts
      const conflictingBooking = await Booking.findOne({
        date: new Date(date),
        time,
        status: { $nin: ['cancelled'] }
      });

      if (conflictingBooking) {
        return res.status(400).json({
          success: false,
          message: 'Time slot is already booked for this date'
        });
      }

      // Create new booking
      const booking = new Booking({
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        package: packageType,
        date: new Date(date),
        time,
        duration,
        location,
        specialRequirements,
        numberOfPeople,
        price
      });

      await booking.save();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      });

    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get all bookings (admin)
  // @route   GET /api/bookings
  // @access  Private
  static async getAllBookings(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status || '';
      const serviceType = req.query.serviceType || '';
      const dateFrom = req.query.dateFrom || '';
      const dateTo = req.query.dateTo || '';
      const search = req.query.search || '';

      const skip = (page - 1) * limit;

      // Build query
      let query = {};
      
      if (status) query.status = status;
      if (serviceType) query.serviceType = serviceType;
      
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
      }

      if (search) {
        query.$or = [
          { customerName: { $regex: search, $options: 'i' } },
          { customerEmail: { $regex: search, $options: 'i' } },
          { customerPhone: { $regex: search, $options: 'i' } }
        ];
      }

      const bookings = await Booking.find(query)
        .populate('photographer', 'name email')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Booking.countDocuments(query);

      res.json({
        success: true,
        data: {
          bookings,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get all bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get booking by ID
  // @route   GET /api/bookings/:id
  // @access  Private
  static async getBookingById(req, res) {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate('photographer', 'name email phone')
        .populate('notes.admin.createdBy', 'name email');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });

    } catch (error) {
      console.error('Get booking by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Update booking
  // @route   PUT /api/bookings/:id
  // @access  Private
  static async updateBooking(req, res) {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const {
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        package: packageType,
        date,
        time,
        duration,
        location,
        specialRequirements,
        numberOfPeople,
        price,
        status,
        paymentStatus,
        photographer
      } = req.body;

      // Update fields
      if (customerName) booking.customerName = customerName;
      if (customerEmail) booking.customerEmail = customerEmail;
      if (customerPhone) booking.customerPhone = customerPhone;
      if (serviceType) booking.serviceType = serviceType;
      if (packageType) booking.package = packageType;
      if (date) booking.date = new Date(date);
      if (time) booking.time = time;
      if (duration) booking.duration = duration;
      if (location) booking.location = location;
      if (specialRequirements !== undefined) booking.specialRequirements = specialRequirements;
      if (numberOfPeople) booking.numberOfPeople = numberOfPeople;
      if (price) booking.price = price;
      if (status) booking.status = status;
      if (paymentStatus) booking.paymentStatus = paymentStatus;
      if (photographer) booking.photographer = photographer;

      await booking.save();

      res.json({
        success: true,
        message: 'Booking updated successfully',
        data: booking
      });

    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Delete booking
  // @route   DELETE /api/bookings/:id
  // @access  Private
  static async deleteBooking(req, res) {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await Booking.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Booking deleted successfully'
      });

    } catch (error) {
      console.error('Delete booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Update booking status
  // @route   PATCH /api/bookings/:id/status
  // @access  Private
  static async updateStatus(req, res) {
    try {
      const { status, cancellationReason } = req.body;

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      booking.status = status;
      if (status === 'cancelled' && cancellationReason) {
        booking.cancellationReason = cancellationReason;
      }

      await booking.save();

      res.json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking
      });

    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Assign photographer to booking
  // @route   PATCH /api/bookings/:id/assign-photographer
  // @access  Private
  static async assignPhotographer(req, res) {
    try {
      const { photographerId } = req.body;

      // Check if photographer exists
      const photographer = await Admin.findById(photographerId);
      if (!photographer) {
        return res.status(404).json({
          success: false,
          message: 'Photographer not found'
        });
      }

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      booking.photographer = photographerId;
      await booking.save();

      res.json({
        success: true,
        message: 'Photographer assigned successfully',
        data: booking
      });

    } catch (error) {
      console.error('Assign photographer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign photographer',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Add note to booking
  // @route   POST /api/bookings/:id/notes
  // @access  Private
  static async addNote(req, res) {
    try {
      const { content } = req.body;

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      booking.notes.admin.push({
        content,
        createdBy: req.adminId
      });

      await booking.save();

      res.json({
        success: true,
        message: 'Note added successfully',
        data: booking.notes.admin[booking.notes.admin.length - 1]
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

  // @desc    Get booking statistics
  // @route   GET /api/bookings/stats/overview
  // @access  Private
  static async getStats(req, res) {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Total bookings
      const totalBookings = await Booking.countDocuments();
      
      // Monthly bookings
      const monthlyBookings = await Booking.countDocuments({
        date: { $gte: startOfMonth, $lte: endOfMonth }
      });

      // Status breakdown
      const statusStats = await Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$price.amount' }
          }
        }
      ]);

      // Service type breakdown
      const serviceStats = await Booking.aggregate([
        {
          $group: {
            _id: '$serviceType',
            count: { $sum: 1 },
            revenue: { $sum: '$price.amount' }
          }
        }
      ]);

      // Today's bookings
      const todayBookings = await Booking.countDocuments({
        date: {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lt: new Date(today.setHours(23, 59, 59, 999))
        }
      });

      // Upcoming bookings (next 7 days)
      const upcomingBookings = await Booking.countDocuments({
        date: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        status: { $in: ['pending', 'confirmed'] }
      });

      res.json({
        success: true,
        data: {
          totalBookings,
          monthlyBookings,
          todayBookings,
          upcomingBookings,
          statusStats,
          serviceStats
        }
      });

    } catch (error) {
      console.error('Get booking stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get available time slots
  // @route   GET /api/bookings/available-slots
  // @access  Public
  static async getAvailableSlots(req, res) {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date is required'
        });
      }

      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getDay();

      // Define business hours (9 AM to 6 PM)
      const businessHours = {
        start: 9,
        end: 18,
        interval: 60 // 1 hour intervals
      };

      // Check if it's a weekend (0 = Sunday, 6 = Saturday)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.json({
          success: true,
          data: {
            date: selectedDate,
            availableSlots: [],
            message: 'No bookings available on weekends'
          }
        });
      }

      // Get booked slots for the date
      const bookedSlots = await Booking.find({
        date: selectedDate,
        status: { $nin: ['cancelled'] }
      }).select('time duration');

      // Generate all possible time slots
      const allSlots = [];
      for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      }

      // Filter out booked slots
      const availableSlots = allSlots.filter(slot => {
        return !bookedSlots.some(booking => {
          const bookingHour = parseInt(booking.time.split(':')[0]);
          const slotHour = parseInt(slot.split(':')[0]);
          return slotHour >= bookingHour && slotHour < bookingHour + booking.duration;
        });
      });

      res.json({
        success: true,
        data: {
          date: selectedDate,
          availableSlots,
          businessHours
        }
      });

    } catch (error) {
      console.error('Get available slots error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get available slots',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Reschedule booking
  // @route   PATCH /api/bookings/:id/reschedule
  // @access  Private
  static async rescheduleBooking(req, res) {
    try {
      const { newDate, newTime, reason } = req.body;

      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check for conflicts with new date/time
      const conflictingBooking = await Booking.findOne({
        date: new Date(newDate),
        time: newTime,
        status: { $nin: ['cancelled'] },
        _id: { $ne: req.params.id }
      });

      if (conflictingBooking) {
        return res.status(400).json({
          success: false,
          message: 'Time slot is already booked for the new date'
        });
      }

      // Create rescheduled booking
      const rescheduledBooking = new Booking({
        ...booking.toObject(),
        _id: undefined,
        date: new Date(newDate),
        time: newTime,
        status: 'pending',
        rescheduledFrom: booking._id
      });

      // Mark original booking as rescheduled
      booking.status = 'rescheduled';
      booking.cancellationReason = reason || 'Rescheduled by admin';

      await Promise.all([booking.save(), rescheduledBooking.save()]);

      res.json({
        success: true,
        message: 'Booking rescheduled successfully',
        data: {
          originalBooking: booking,
          newBooking: rescheduledBooking
        }
      });

    } catch (error) {
      console.error('Reschedule booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reschedule booking',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = BookingController;
