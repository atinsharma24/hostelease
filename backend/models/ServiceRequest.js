const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['cleaning', 'laundry', 'electrical', 'carpenter', 'wifi', 'mess', 'room-allocation'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    block: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T'],
      required: true
    },
    roomNumber: {
      type: String,
      required: true
    }
  },
  // Service-specific fields
  serviceDetails: {
    // For laundry
    numberOfClothes: {
      type: Number,
      min: 1,
      max: 25,
      required: function() { return this.serviceType === 'laundry'; }
    },
    pickupTime: {
      type: Date,
      required: function() { return this.serviceType === 'laundry'; }
    },
    // For cleaning
    cleaningType: {
      type: String,
      enum: ['room', 'bathroom', 'common-area'],
      required: function() { return this.serviceType === 'cleaning'; }
    },
    // For room allocation
    requestedRoomType: {
      type: String,
      enum: ['1-bedded', '2-bedded', '3-bedded', '4-bedded', '6-bedded', '8-bedded'],
      required: function() { return this.serviceType === 'room-allocation'; }
    },
    requestedAcType: {
      type: String,
      enum: ['AC', 'Non-AC'],
      required: function() { return this.serviceType === 'room-allocation'; }
    },
    requestedHostelType: {
      type: String,
      enum: ['Men\'s', 'Women\'s'],
      required: function() { return this.serviceType === 'room-allocation'; }
    }
  },
  // Tracking fields
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  estimatedCompletion: {
    type: Date,
    default: null
  },
  actualCompletion: {
    type: Date,
    default: null
  },
  // OTP for verification (for cleaning services)
  verificationOTP: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  // Feedback
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedback: {
    type: String,
    trim: true,
    default: null
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
serviceRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
serviceRequestSchema.index({ user: 1, serviceType: 1, status: 1 });
serviceRequestSchema.index({ status: 1, priority: 1, createdAt: 1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
