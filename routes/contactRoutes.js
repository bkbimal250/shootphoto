const express = require('express');
const { body } = require('express-validator');
const ContactController = require('../controller/contactController');

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('subject').notEmpty(),
  body('message').notEmpty(),
  body('phone').optional(),
  body('serviceType').optional().isIn([
    'wedding', 'portrait', 'event', 'commercial', 'family', 
    'engagement', 'maternity', 'newborn', 'graduation', 'corporate', 'other', 'general_inquiry'
  ])
];

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', validateContact, ContactController.createContact);

module.exports = router;
