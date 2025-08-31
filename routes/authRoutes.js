const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../controller/AdminController');

const router = express.Router();

// Validation middleware
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateRegistration = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'super_admin'])
    .withMessage('Role must be either admin or super_admin'),
  body('phone')
    .optional()
    .trim(),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array')
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
