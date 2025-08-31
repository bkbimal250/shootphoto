const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../controller/AdminController');

const router = express.Router();

// Validation middleware
const validateLogin = [
  body('email').isEmail(),
  body('password').notEmpty()
];

const validateRegistration = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'super_admin']),
  body('phone').optional(),
  body('permissions').optional().isArray()
];

// @route   POST /api/auth/register
// @desc    Register new admin
// @access  Public (but should be protected in production)
router.post('/register', validateRegistration, AdminController.register);

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', validateLogin, AdminController.login);

module.exports = router;
