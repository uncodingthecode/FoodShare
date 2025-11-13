import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema({
  claim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
    required: true
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  pickupLocation: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  deliveryLocation: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  acceptedAt: {
    type: Date
  },
  pickedUpAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
pickupRequestSchema.index({ volunteer: 1, status: 1 });
pickupRequestSchema.index({ status: 1 });
pickupRequestSchema.index({ donation: 1 });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);

export default PickupRequest;
