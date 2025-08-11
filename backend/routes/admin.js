const express = require('express');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const { protect, isAdmin, isStaffOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, block, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (block) query.hostelBlock = block;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

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
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @desc    Get user by ID (admin only)
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
router.get('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @desc    Update user (admin only)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
router.put('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, role, isActive, hostelBlock, roomNumber, roomType, acType, hostelType, phone } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (hostelBlock) user.hostelBlock = hostelBlock;
    if (roomNumber) user.roomNumber = roomNumber;
    if (roomType) user.roomType = roomType;
    if (acType) user.acType = acType;
    if (hostelType) user.hostelType = hostelType;
    if (phone) user.phone = phone;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    
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
      message: 'Server error while updating user'
    });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has active service requests
    const activeRequests = await ServiceRequest.countDocuments({
      user: req.params.id,
      status: { $in: ['pending', 'in-progress'] }
    });

    if (activeRequests > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user with ${activeRequests} active service requests`
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
});

// @desc    Get all service requests (admin/staff)
// @route   GET /api/admin/requests
// @access  Private (Admin/Staff)
router.get('/requests', protect, isStaffOrAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, serviceType, priority, block, assignedTo } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (priority) query.priority = priority;
    if (block) query['location.block'] = block;
    if (assignedTo) query.assignedTo = assignedTo;

    const requests = await ServiceRequest.find(query)
      .populate('user', 'name email hostelBlock roomNumber')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

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
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
});

// @desc    Get service request by ID (admin/staff)
// @route   GET /api/admin/requests/:id
// @access  Private (Admin/Staff)
router.get('/requests/:id', protect, isStaffOrAdmin, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('user', 'name email hostelBlock roomNumber phone')
      .populate('assignedTo', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching request'
    });
  }
});

// @desc    Update service request (admin/staff)
// @route   PUT /api/admin/requests/:id
// @access  Private (Admin/Staff)
router.put('/requests/:id', protect, isStaffOrAdmin, async (req, res) => {
  try {
    const { status, priority, assignedTo, estimatedCompletion, title, description } = req.body;

    const request = await ServiceRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    if (status) request.status = status;
    if (priority) request.priority = priority;
    if (assignedTo) request.assignedTo = assignedTo;
    if (estimatedCompletion) request.estimatedCompletion = estimatedCompletion;
    if (title) request.title = title;
    if (description) request.description = description;

    // If completed, set actual completion time
    if (status === 'completed' && !request.actualCompletion) {
      request.actualCompletion = Date.now();
    }

    const updatedRequest = await request.save();

    res.json({
      success: true,
      message: 'Service request updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating request'
    });
  }
});

// @desc    Get dashboard statistics (admin only)
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRequests = await ServiceRequest.countDocuments();
    const pendingRequests = await ServiceRequest.countDocuments({ status: 'pending' });
    const completedRequests = await ServiceRequest.countDocuments({ status: 'completed' });

    // Service type breakdown
    const serviceTypeStats = await ServiceRequest.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Status breakdown
    const statusStats = await ServiceRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Block-wise user distribution
    const blockStats = await User.aggregate([
      {
        $match: { hostelBlock: { $exists: true } }
      },
      {
        $group: {
          _id: '$hostelBlock',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Recent requests
    const recentRequests = await ServiceRequest.find()
      .populate('user', 'name hostelBlock roomNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalRequests,
          pendingRequests,
          completedRequests
        },
        serviceTypeStats,
        statusStats,
        blockStats,
        recentRequests
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// @desc    Bulk assign requests to staff
// @route   POST /api/admin/requests/bulk-assign
// @access  Private (Admin)
router.post('/requests/bulk-assign', protect, isAdmin, async (req, res) => {
  try {
    const { requestIds, assignedTo } = req.body;

    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request IDs array is required'
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user ID is required'
      });
    }

    // Verify assigned user exists and is staff
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !['staff', 'admin'].includes(assignedUser.role)) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must be staff or admin'
      });
    }

    // Update all requests
    const result = await ServiceRequest.updateMany(
      { _id: { $in: requestIds } },
      { 
        assignedTo,
        status: 'in-progress',
        updatedAt: Date.now()
      }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} requests assigned successfully`,
      data: {
        assignedCount: result.modifiedCount,
        assignedTo: assignedUser.name
      }
    });
  } catch (error) {
    console.error('Bulk assign error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while bulk assigning requests'
    });
  }
});

module.exports = router;
