const express = require('express');
const ServiceRequest = require('../models/ServiceRequest');
const { protect, authorize, isStaffOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Create a new service request
// @route   POST /api/services
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      serviceType,
      title,
      description,
      priority,
      serviceDetails
    } = req.body;

    // Get user's location from their profile
    const location = {
      block: req.user.hostelBlock,
      roomNumber: req.user.roomNumber
    };

    const serviceRequest = await ServiceRequest.create({
      user: req.user._id,
      serviceType,
      title,
      description,
      priority,
      location,
      serviceDetails
    });

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      data: serviceRequest
    });
  } catch (error) {
    console.error('Create service request error:', error);
    
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
      message: 'Server error while creating service request'
    });
  }
});

// @desc    Get all service requests for a user
// @route   GET /api/services/my-requests
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, serviceType } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;

    const serviceRequests = await ServiceRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('assignedTo', 'name email');

    const total = await ServiceRequest.countDocuments(query);

    res.json({
      success: true,
      data: serviceRequests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
});

// @desc    Get service statistics for dashboard
// @route   GET /api/services/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await ServiceRequest.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRequests = await ServiceRequest.countDocuments({ user: req.user._id });
    const pendingRequests = await ServiceRequest.countDocuments({ 
      user: req.user._id, 
      status: 'pending' 
    });

    res.json({
      success: true,
      data: {
        totalRequests,
        pendingRequests,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @desc    Get a specific service request
// @route   GET /api/services/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
      .populate('user', 'name email hostelBlock roomNumber')
      .populate('assignedTo', 'name email');

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Check if user owns the request or is staff/admin
    if (serviceRequest.user._id.toString() !== req.user._id.toString() && 
        !['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: serviceRequest
    });
  } catch (error) {
    console.error('Get service request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching request'
    });
  }
});

// @desc    Update service request status (staff/admin only)
// @route   PUT /api/services/:id/status
// @access  Private (Staff/Admin)
router.put('/:id/status', protect, isStaffOrAdmin, async (req, res) => {
  try {
    const { status, estimatedCompletion, assignedTo } = req.body;

    const serviceRequest = await ServiceRequest.findById(req.params.id);
    
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    if (status) serviceRequest.status = status;
    if (estimatedCompletion) serviceRequest.estimatedCompletion = estimatedCompletion;
    if (assignedTo) serviceRequest.assignedTo = assignedTo;

    // If completed, set actual completion time
    if (status === 'completed') {
      serviceRequest.actualCompletion = Date.now();
    }

    const updatedRequest = await serviceRequest.save();

    res.json({
      success: true,
      message: 'Service request updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status'
    });
  }
});

// @desc    Add feedback to completed service request
// @route   POST /api/services/:id/feedback
// @access  Private
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    const serviceRequest = await ServiceRequest.findById(req.params.id);
    
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Check if user owns the request
    if (serviceRequest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if request is completed
    if (serviceRequest.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only add feedback to completed requests'
      });
    }

    serviceRequest.rating = rating;
    serviceRequest.feedback = feedback;

    const updatedRequest = await serviceRequest.save();

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding feedback'
    });
  }
});

// @desc    Generate OTP for cleaning verification
// @route   POST /api/services/:id/generate-otp
// @access  Private (Staff/Admin)
router.post('/:id/generate-otp', protect, isStaffOrAdmin, async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    if (serviceRequest.serviceType !== 'cleaning') {
      return res.status(400).json({
        success: false,
        message: 'OTP can only be generated for cleaning services'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    serviceRequest.verificationOTP = otp;
    serviceRequest.otpExpiry = otpExpiry;

    await serviceRequest.save();

    res.json({
      success: true,
      message: 'OTP generated successfully',
      data: {
        otp,
        expiresAt: otpExpiry
      }
    });
  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating OTP'
    });
  }
});

// @desc    Verify OTP for cleaning completion
// @route   POST /api/services/:id/verify-otp
// @access  Private
router.post('/:id/verify-otp', protect, async (req, res) => {
  try {
    const { otp } = req.body;

    const serviceRequest = await ServiceRequest.findById(req.params.id);
    
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Check if user owns the request
    if (serviceRequest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (serviceRequest.serviceType !== 'cleaning') {
      return res.status(400).json({
        success: false,
        message: 'OTP verification is only for cleaning services'
      });
    }

    if (!serviceRequest.verificationOTP) {
      return res.status(400).json({
        success: false,
        message: 'No OTP generated for this request'
      });
    }

    if (serviceRequest.verificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (new Date() > serviceRequest.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Mark as completed
    serviceRequest.status = 'completed';
    serviceRequest.actualCompletion = Date.now();
    serviceRequest.verificationOTP = null;
    serviceRequest.otpExpiry = null;

    await serviceRequest.save();

    res.json({
      success: true,
      message: 'OTP verified and service marked as completed',
      data: serviceRequest
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
    });
  }
});

module.exports = router;
