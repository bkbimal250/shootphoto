const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');

const router = express.Router();

// Validation middleware
const validateBooking = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').trim().isLength({ min: 6, max: 6 }).withMessage('PIN code must be 6 digits'),
  body('service').isIn(['Family Portraits', 'Couples & Engagement', 'Kids & Newborns', 'Solo Portraits', 'Product Photography']).withMessage('Valid service is required'),
  body('package').isIn(['Essential Package', 'Premium Package', 'Deluxe Package']).withMessage('Valid package is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').trim().notEmpty().withMessage('Time is required'),
  body('totalAmount').isNumeric().withMessage('Valid amount is required')
];

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', validateBooking, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      service,
      package: packageType,
      date,
      time,
      addOns,
      totalAmount,
      notes
    } = req.body;

    // Create new booking
    const booking = new Booking({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      service,
      package: packageType,
      date: new Date(date),
      time,
      addOns: addOns || [],
      totalAmount,
      notes: notes || ''
    });

    await booking.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: booking._id,
        customerName: booking.fullName,
        service: booking.service,
        date: booking.formattedDate,
        time: booking.time,
        amount: booking.totalAmount
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (with pagination and filters)
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, service, date } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (service) filter.service = service;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get bookings with pagination
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count
    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private (Admin only)
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).select('-__v');
    
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
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking'
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update fields
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

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
      message: 'Failed to update booking'
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking'
    });
  }
});

module.exports = router;
