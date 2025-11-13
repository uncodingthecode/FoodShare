import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodType: {
    type: String,
    required: [true, 'Food type is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be positive']
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'grams', 'liters', 'pieces', 'plates', 'boxes'],
    default: 'kg'
  },
  expiryTime: {
    type: Date,
    required: [true, 'Expiry time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Expiry time must be in the future'
    }
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    latitude: {
      type: Number,
      default: 0
    },
    longitude: {
      type: Number,
      default: 0
    }
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'expired', 'cancelled'],
    default: 'available'
  },
  images: [{
    type: String
  }],
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
donationSchema.index({ status: 1, expiryTime: 1 });
donationSchema.index({ donor: 1 });
donationSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

// Virtual for checking if donation is expired
donationSchema.virtual('isExpired').get(function() {
  return this.expiryTime < new Date();
});

// Method to check if donation can be edited
donationSchema.methods.canBeEdited = function() {
  return this.status === 'available' && !this.isExpired;
};

// Automatically update status to expired
donationSchema.pre('save', function(next) {
  if (this.expiryTime < new Date() && this.status === 'available') {
    this.status = 'expired';
  }
  next();
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
