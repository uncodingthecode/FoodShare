import Claim from '../models/Claim.js';
import Donation from '../models/Donation.js';
import PickupRequest from '../models/PickupRequest.js';
import { notifyDonationClaimed } from '../utils/notifications.js';

// @desc    Claim a donation
// @route   POST /api/claims/claim/:donationId
// @access  Private (NGO only)
export const claimDonation = async (req, res, next) => {
  try {
    const { donationId } = req.params;
    const { notes } = req.body;

    // Find donation
    const donation = await Donation.findById(donationId).populate('donor', 'name email phone');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check if donation is available
    if (donation.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'This donation is no longer available'
      });
    }

    // Check if donation is expired
    if (donation.expiryTime <= new Date()) {
      donation.status = 'expired';
      await donation.save();
      
      return res.status(400).json({
        success: false,
        message: 'This donation has expired'
      });
    }

    // Check if NGO already claimed this donation
    const existingClaim = await Claim.findOne({
      donation: donationId,
      ngo: req.user.id
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You have already claimed this donation'
      });
    }

    // Create claim
    const claim = await Claim.create({
      donation: donationId,
      ngo: req.user.id,
      notes
    });

    // Update donation status
    donation.status = 'claimed';
    donation.claimedBy = req.user.id;
    donation.claimedAt = new Date();
    await donation.save();

    // Create pickup request automatically
    const pickupRequest = await PickupRequest.create({
      claim: claim._id,
      donation: donation._id,
      ngo: req.user.id,
      pickupLocation: donation.location,
      deliveryLocation: {
        address: req.user.address || 'NGO Location',
        latitude: 0,
        longitude: 0
      }
    });

    // Notify donor
    await notifyDonationClaimed(donation.donor._id, donationId, req.user.name);

    // Populate claim
    await claim.populate([
      { path: 'donation', populate: { path: 'donor', select: 'name email phone' } },
      { path: 'ngo', select: 'name email phone organization' }
    ]);

    res.status(201).json({
      success: true,
      data: {
        claim,
        pickupRequest
      },
      message: 'Donation claimed successfully. Pickup request created.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my claims (for NGO)
// @route   GET /api/claims/my-claims
// @access  Private (NGO only)
export const getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ ngo: req.user.id })
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone organization' }
      })
      .populate('ngo', 'name email phone organization')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claim by ID
// @route   GET /api/claims/:id
// @access  Private
export const getClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone' }
      })
      .populate('ngo', 'name email phone organization');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check authorization (only claim owner or admin can view)
    if (claim.ngo._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this claim'
      });
    }

    res.status(200).json({
      success: true,
      data: claim
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update claim status
// @route   PUT /api/claims/:id/status
// @access  Private (NGO - owner or Admin)
export const updateClaimStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    let claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // Check authorization
    if (claim.ngo.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this claim'
      });
    }

    claim.status = status;
    await claim.save();

    // If claim is cancelled, update donation status
    if (status === 'cancelled') {
      await Donation.findByIdAndUpdate(claim.donation, {
        status: 'available',
        $unset: { claimedBy: 1, claimedAt: 1 }
      });
    }

    await claim.populate([
      { path: 'donation', populate: { path: 'donor', select: 'name email phone' } },
      { path: 'ngo', select: 'name email phone organization' }
    ]);

    res.status(200).json({
      success: true,
      data: claim,
      message: 'Claim status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims (Admin only)
// @route   GET /api/claims
// @access  Private (Admin)
export const getAllClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find()
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone' }
      })
      .populate('ngo', 'name email phone organization')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    next(error);
  }
};
