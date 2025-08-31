const express = require('express');
const { body } = require('express-validator');
const BookingController = require('../controller/bookinController');

const router = express.Router();

// Validation middleware
const validateBooking = [
  body('customerName').notEmpty(),
  body('customerEmail').isEmail(),
  body('customerPhone').notEmpty(),
  body('serviceType').isIn([
    'wedding', 'portrait', 'event', 'commercial', 'family', 
    'engagement', 'maternity', 'newborn', 'graduation', 'corporate', 'other'
  ]),
  body('package').isIn(['basic', 'standard', 'premium', 'custom']),
  body('date').isISO8601(),
  body('time').notEmpty(),
  body('duration').isNumeric(),
  body('location.address').notEmpty(),
  body('location.city').notEmpty(),
  body('location.state').notEmpty(),
  body('location.zipCode').notEmpty(),
  body('price.amount').isNumeric(),
  body('numberOfPeople').optional().isNumeric(),
  body('specialRequirements').optional()
];

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', validateBooking, BookingController.createBooking);

// @route   GET /api/bookings/available-slots
// @desc    Get available time slots for a date
// @access  Public
router.get('/available-slots', BookingController.getAvailableSlots);

module.exports = router;
