import PickupRequest from '../models/PickupRequest.js';
import Claim from '../models/Claim.js';
import Donation from '../models/Donation.js';
import { notifyPickupAccepted, notifyPickupStatusUpdate, notifyDonorPickupDelivered } from '../utils/notifications.js';

// @desc    Get available pickup requests (for volunteers)
// @route   GET /api/pickups/available
// @access  Private (Volunteer only)
export const getAvailablePickups = async (req, res, next) => {
  try {
    const pickups = await PickupRequest.find({
      status: 'pending'
    })
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone' }
      })
      .populate('ngo', 'name email phone organization address')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept pickup request
// @route   POST /api/pickups/:id/accept
// @access  Private (Volunteer only)
export const acceptPickup = async (req, res, next) => {
  try {
    let pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    if (pickup.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This pickup request is no longer available'
      });
    }

    pickup.volunteer = req.user.id;
    pickup.status = 'accepted';
    pickup.acceptedAt = new Date();
    await pickup.save();

    // Notify NGO
    await notifyPickupAccepted(pickup.ngo, pickup._id, req.user.name);

    await pickup.populate([
      {
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone' }
      },
      { path: 'ngo', select: 'name email phone organization address' },
      { path: 'volunteer', select: 'name email phone' }
    ]);

    res.status(200).json({
      success: true,
      data: pickup,
      message: 'Pickup request accepted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pickup status
// @route   PUT /api/pickups/:id/status
// @access  Private (Volunteer - assigned only)
export const updatePickupStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    // Check authorization
    if (!pickup.volunteer || pickup.volunteer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this pickup request'
      });
    }

    // Validate status transition
    const validTransitions = {
      accepted: ['picked_up', 'cancelled'],
      picked_up: ['in_transit', 'cancelled'],
      in_transit: ['delivered', 'cancelled']
    };

    if (!validTransitions[pickup.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${pickup.status} to ${status}`
      });
    }

    pickup.status = status;

    if (status === 'picked_up') {
      pickup.pickedUpAt = new Date();
    } else if (status === 'delivered') {
      pickup.deliveredAt = new Date();
      
      // Update claim status
      await Claim.findByIdAndUpdate(pickup.claim, { status: 'completed' });
    }

    await pickup.save();

    // Notify NGO about status update
    await notifyPickupStatusUpdate(pickup.ngo, pickup._id, status);

    // Notify donor when delivered
    if (status === 'delivered') {
      const donation = await Donation.findById(pickup.donation);
      if (donation) {
        await notifyDonorPickupDelivered(donation.donor, donation._id);
      }
    }

    await pickup.populate([
      {
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone' }
      },
      { path: 'ngo', select: 'name email phone organization address' },
      { path: 'volunteer', select: 'name email phone' }
    ]);

    res.status(200).json({
      success: true,
      data: pickup,
      message: `Pickup status updated to ${status}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my pickup requests (for volunteers)
// @route   GET /api/pickups/my-pickups
// @access  Private (Volunteer only)
export const getMyPickups = async (req, res, next) => {
  try {
    const pickups = await PickupRequest.find({
      volunteer: req.user.id
    })
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone' }
      })
      .populate('ngo', 'name email phone organization address')
      .populate('volunteer', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pickup by ID
// @route   GET /api/pickups/:id
// @access  Private
export const getPickup = async (req, res, next) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id)
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone' }
      })
      .populate('ngo', 'name email phone organization address')
      .populate('volunteer', 'name email phone');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found'
      });
    }

    // Check authorization
    const isAuthorized = 
      req.user.role === 'admin' ||
      (pickup.volunteer && pickup.volunteer._id.toString() === req.user.id) ||
      pickup.ngo._id.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this pickup request'
      });
    }

    res.status(200).json({
      success: true,
      data: pickup
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pickup requests (Admin only)
// @route   GET /api/pickups
// @access  Private (Admin)
export const getAllPickups = async (req, res, next) => {
  try {
    const pickups = await PickupRequest.find()
      .populate({
        path: 'donation',
        populate: { path: 'donor', select: 'name email phone' }
      })
      .populate('ngo', 'name email phone organization')
      .populate('volunteer', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups
    });
  } catch (error) {
    next(error);
  }
};
