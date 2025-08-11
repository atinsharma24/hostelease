const express = require('express');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const { protect, isOwnerOrStaff } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, hostelBlock, roomNumber, roomType, acType, hostelType } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (hostelBlock) user.hostelBlock = hostelBlock;
    if (roomNumber) user.roomNumber = roomNumber;
    if (roomType) user.roomType = roomType;
    if (acType) user.acType = acType;
    if (hostelType) user.hostelType = hostelType;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @desc    Get user's service requests
// @route   GET /api/users/requests
// @access  Private
router.get('/requests', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, serviceType } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;

    const requests = await ServiceRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('assignedTo', 'name email');

    const total = await ServiceRequest.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
});

// @desc    Get user's service request by ID
// @route   GET /api/users/requests/:id
// @access  Private
router.get('/requests/:id', protect, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Check if user owns the request
    if (request.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get user request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching request'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalRequests = await ServiceRequest.countDocuments({ user: req.user._id });
    const pendingRequests = await ServiceRequest.countDocuments({ 
      user: req.user._id, 
      status: 'pending' 
    });
    const completedRequests = await ServiceRequest.countDocuments({ 
      user: req.user._id, 
      status: 'completed' 
    });

    // Service type breakdown
    const serviceTypeStats = await ServiceRequest.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly request trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await ServiceRequest.aggregate([
      {
        $match: { 
          user: req.user._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalRequests,
          pendingRequests,
          completedRequests
        },
        serviceTypeStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @desc    Get users by block (for roommates)
// @route   GET /api/users/block/:block
// @access  Private
router.get('/block/:block', protect, async (req, res) => {
  try {
    const { block } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find({ 
      hostelBlock: block,
      _id: { $ne: req.user._id } // Exclude current user
    })
      .select('name roomNumber roomType acType hostelType')
      .sort({ roomNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ 
      hostelBlock: block,
      _id: { $ne: req.user._id }
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get block users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching block users'
    });
  }
});

// @desc    Search users (for staff/admin)
// @route   GET /api/users/search
// @access  Private (Staff/Admin)
router.get('/search', protect, async (req, res) => {
  try {
    const { q, block, role } = req.query;
    
    if (!q && !block && !role) {
      return res.status(400).json({
        success: false,
        message: 'At least one search parameter is required'
      });
    }

    const query = {};
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { roomNumber: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (block) query.hostelBlock = block;
    if (role) query.role = role;

    const users = await User.find(query)
      .select('name email hostelBlock roomNumber role isActive')
      .limit(20);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching users'
    });
  }
});

module.exports = router;
