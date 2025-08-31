const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireAdmin, requireSuperAdmin } = require('../middleware/authMiddleware');
const AdminController = require('../controller/AdminController');
const BookingController = require('../controller/bookinController');
const ContactController = require('../controller/contactController');

const router = express.Router();

// Apply authentication to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Admin Profile Routes
// @route   GET /api/admin/profile
// @desc    Get current admin profile
// @access  Private
router.get('/profile', AdminController.getProfile);

// @route   PUT /api/admin/profile
// @desc    Update admin profile
// @access  Private
router.put('/profile', AdminController.updateProfile);

// @route   PUT /api/admin/change-password
// @desc    Change admin password
// @access  Private
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], AdminController.changePassword);

// @route   POST /api/admin/logout
// @desc    Admin logout
// @access  Private
router.post('/logout', AdminController.logout);

// Admin Management Routes (Super Admin Only)
// @route   GET /api/admin/admins
// @desc    Get all admins
// @access  Private (Super Admin)
router.get('/admins', requireSuperAdmin, AdminController.getAllAdmins);

// @route   GET /api/admin/admins/:id
// @desc    Get admin by ID
// @access  Private (Super Admin)
router.get('/admins/:id', requireSuperAdmin, AdminController.getAdminById);

// @route   PUT /api/admin/admins/:id
// @desc    Update admin
// @access  Private (Super Admin)
router.put('/admins/:id', requireSuperAdmin, AdminController.updateAdmin);

// @route   DELETE /api/admin/admins/:id
// @desc    Delete admin
// @access  Private (Super Admin)
router.delete('/admins/:id', requireSuperAdmin, AdminController.deleteAdmin);

// Admin Statistics
// @route   GET /api/admin/stats
// @desc    Get admin statistics
// @access  Private (Admin)
router.get('/stats', AdminController.getStats);

// Booking Management Routes
// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Private (Admin)
router.get('/bookings', BookingController.getAllBookings);

// @route   GET /api/admin/bookings/:id
// @desc    Get booking by ID
// @access  Private (Admin)
router.get('/bookings/:id', BookingController.getBookingById);

// @route   PUT /api/admin/bookings/:id
// @desc    Update booking
// @access  Private (Admin)
router.put('/bookings/:id', BookingController.updateBooking);

// @route   DELETE /api/admin/bookings/:id
// @desc    Delete booking
// @access  Private (Admin)
router.delete('/bookings/:id', BookingController.deleteBooking);

// @route   PATCH /api/admin/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin)
router.patch('/bookings/:id/status', BookingController.updateStatus);

// @route   PATCH /api/admin/bookings/:id/assign-photographer
// @desc    Assign photographer to booking
// @access  Private (Admin)
router.patch('/bookings/:id/assign-photographer', BookingController.assignPhotographer);

// @route   POST /api/admin/bookings/:id/notes
// @desc    Add note to booking
// @access  Private (Admin)
router.post('/bookings/:id/notes', BookingController.addNote);

// @route   PATCH /api/admin/bookings/:id/reschedule
// @desc    Reschedule booking
// @access  Private (Admin)
router.patch('/bookings/:id/reschedule', BookingController.rescheduleBooking);

// Booking Statistics
// @route   GET /api/admin/bookings/stats/overview
// @desc    Get booking statistics
// @access  Private (Admin)
router.get('/bookings/stats/overview', BookingController.getStats);

// Contact Management Routes
// @route   GET /api/admin/contacts
// @desc    Get all contacts
// @access  Private (Admin)
router.get('/contacts', ContactController.getAllContacts);

// @route   GET /api/admin/contacts/:id
// @desc    Get contact by ID
// @access  Private (Admin)
router.get('/contacts/:id', ContactController.getContactById);

// @route   PUT /api/admin/contacts/:id
// @desc    Update contact
// @access  Private (Admin)
router.put('/contacts/:id', ContactController.updateContact);

// @route   DELETE /api/admin/contacts/:id
// @desc    Delete contact
// @access  Private (Admin)
router.delete('/contacts/:id', ContactController.deleteContact);

// @route   PATCH /api/admin/contacts/:id/mark-read
// @desc    Mark contact as read
// @access  Private (Admin)
router.patch('/contacts/:id/mark-read', ContactController.markAsRead);

// @route   PATCH /api/admin/contacts/:id/mark-replied
// @desc    Mark contact as replied
// @access  Private (Admin)
router.patch('/contacts/:id/mark-replied', ContactController.markAsReplied);

// @route   PATCH /api/admin/contacts/:id/assign
// @desc    Assign contact to admin
// @access  Private (Admin)
router.patch('/contacts/:id/assign', ContactController.assignContact);

// @route   POST /api/admin/contacts/:id/notes
// @desc    Add note to contact
// @access  Private (Admin)
router.post('/contacts/:id/notes', ContactController.addNote);

// @route   PATCH /api/admin/contacts/bulk-update
// @desc    Bulk update contacts
// @access  Private (Admin)
router.patch('/contacts/bulk-update', ContactController.bulkUpdateContacts);

// Contact Statistics
// @route   GET /api/admin/contacts/stats/overview
// @desc    Get contact statistics
// @access  Private (Admin)
router.get('/contacts/stats/overview', ContactController.getStats);

// @route   GET /api/admin/contacts/unread
// @desc    Get unread contacts
// @access  Private (Admin)
router.get('/contacts/unread', ContactController.getUnreadContacts);

// @route   GET /api/admin/contacts/follow-up
// @desc    Get contacts needing follow-up
// @access  Private (Admin)
router.get('/contacts/follow-up', ContactController.getFollowUpContacts);

module.exports = router;
