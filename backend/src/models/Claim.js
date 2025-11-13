import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
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
  claimedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
claimSchema.index({ donation: 1 });
claimSchema.index({ ngo: 1 });
claimSchema.index({ status: 1 });

// Prevent duplicate claims on same donation
claimSchema.index({ donation: 1, ngo: 1 }, { unique: true });

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
