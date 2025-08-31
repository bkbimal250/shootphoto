const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class AdminController {
  // @desc    Register new admin
  // @route   POST /api/auth/register
  // @access  Public (but should be protected in production)
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, email, password, role = 'admin', phone, permissions } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findByEmail(email);
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email already exists'
        });
      }

      // Create new admin
      const admin = new Admin({
        name,
        email,
        password,
        role,
        phone,
        permissions: permissions || []
      });

      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: admin._id,
          email: admin.email,
          role: admin.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: {
          token,
          admin: admin.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Admin registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Admin login
  // @route   POST /api/auth/login
  // @access  Public
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find admin by email
      const admin = await Admin.findByEmail(email);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if admin is active
      if (!admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Check password
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: admin._id,
          email: admin.email,
          role: admin.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: admin.toPublicJSON()
        }
      });

    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get current admin profile
  // @route   GET /api/admin/profile
  // @access  Private
  static async getProfile(req, res) {
    try {
      const admin = await Admin.findById(req.adminId).select('-password');
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.json({
        success: true,
        data: admin
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Update admin profile
  // @route   PUT /api/admin/profile
  // @access  Private
  static async updateProfile(req, res) {
    try {
      const { name, phone, profileImage } = req.body;

      const admin = await Admin.findById(req.adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Update fields
      if (name) admin.name = name;
      if (phone) admin.phone = phone;
      if (profileImage) admin.profileImage = profileImage;

      await admin.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: admin.toPublicJSON()
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Change password
  // @route   PUT /api/admin/change-password
  // @access  Private
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      const admin = await Admin.findById(req.adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      admin.password = newPassword;
      await admin.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get all admins (for super admin)
  // @route   GET /api/admin/admins
  // @access  Private (Super Admin)
  static async getAllAdmins(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const role = req.query.role || '';

      const skip = (page - 1) * limit;

      // Build query
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      if (role) {
        query.role = role;
      }

      const admins = await Admin.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Admin.countDocuments(query);

      res.json({
        success: true,
        data: {
          admins,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get all admins error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get admins',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get admin by ID
  // @route   GET /api/admin/admins/:id
  // @access  Private (Super Admin)
  static async getAdminById(req, res) {
    try {
      const admin = await Admin.findById(req.params.id).select('-password');
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.json({
        success: true,
        data: admin
      });

    } catch (error) {
      console.error('Get admin by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get admin',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Update admin (for super admin)
  // @route   PUT /api/admin/admins/:id
  // @access  Private (Super Admin)
  static async updateAdmin(req, res) {
    try {
      const { name, email, role, isActive, permissions, phone } = req.body;

      const admin = await Admin.findById(req.params.id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Update fields
      if (name) admin.name = name;
      if (email) admin.email = email;
      if (role) admin.role = role;
      if (typeof isActive === 'boolean') admin.isActive = isActive;
      if (permissions) admin.permissions = permissions;
      if (phone) admin.phone = phone;

      await admin.save();

      res.json({
        success: true,
        message: 'Admin updated successfully',
        data: admin.toPublicJSON()
      });

    } catch (error) {
      console.error('Update admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update admin',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Delete admin (for super admin)
  // @route   DELETE /api/admin/admins/:id
  // @access  Private (Super Admin)
  static async deleteAdmin(req, res) {
    try {
      const admin = await Admin.findById(req.params.id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Prevent deleting self
      if (admin._id.toString() === req.adminId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      await Admin.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Admin deleted successfully'
      });

    } catch (error) {
      console.error('Delete admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete admin',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Get admin statistics
  // @route   GET /api/admin/stats
  // @access  Private (Admin)
  static async getStats(req, res) {
    try {
      const totalAdmins = await Admin.countDocuments();
      const activeAdmins = await Admin.countDocuments({ isActive: true });
      const superAdmins = await Admin.countDocuments({ role: 'super_admin' });
      const regularAdmins = await Admin.countDocuments({ role: 'admin' });

      const recentLogins = await Admin.find({ lastLogin: { $exists: true } })
        .sort({ lastLogin: -1 })
        .limit(5)
        .select('name email lastLogin');

      res.json({
        success: true,
        data: {
          totalAdmins,
          activeAdmins,
          superAdmins,
          regularAdmins,
          recentLogins
        }
      });

    } catch (error) {
      console.error('Get admin stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // @desc    Logout (client-side token removal)
  // @route   POST /api/admin/logout
  // @access  Private
  static async logout(req, res) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // But we can log the logout event for audit purposes
      
      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = AdminController;
