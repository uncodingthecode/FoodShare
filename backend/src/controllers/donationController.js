import Donation from '../models/Donation.js';
import { createNotification } from '../utils/notifications.js';

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private (Donor only)
export const createDonation = async (req, res, next) => {
  try {
    const { foodType, quantity, unit, expiryHours, location, description, images } = req.body;

    // Calculate expiry time
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + Number(expiryHours));

    // Validate expiry time is in future
    if (expiryTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Expiry time must be in the future'
      });
    }

    const donation = await Donation.create({
      donor: req.user.id,
      foodType,
      quantity,
      unit,
      expiryTime,
      location,
      description,
      images: images || []
    });

    // Populate donor details
    await donation.populate('donor', 'name email phone');

    res.status(201).json({
      success: true,
      data: donation,
      message: 'Donation created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available donations
// @route   GET /api/donations/available
// @access  Private
export const getAvailableDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({
      status: 'available',
      expiryTime: { $gt: new Date() }
    })
      .populate('donor', 'name email phone organization')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private
export const getDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone organization')
      .populate('claimedBy', 'name email phone organization');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my donations (for donors)
// @route   GET /api/donations/my-donations
// @access  Private (Donor only)
export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('claimedBy', 'name email phone organization')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private (Donor only - owner)
export const updateDonation = async (req, res, next) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this donation'
      });
    }

    // Check if donation can be edited
    if (!donation.canBeEdited()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit donation that is already claimed or expired'
      });
    }

    // Update fields
    const allowedUpdates = ['foodType', 'quantity', 'unit', 'location', 'description', 'images'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Handle expiry time update
    if (req.body.expiryHours) {
      const newExpiryTime = new Date();
      newExpiryTime.setHours(newExpiryTime.getHours() + Number(req.body.expiryHours));
      
      if (newExpiryTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Expiry time must be in the future'
        });
      }
      
      updates.expiryTime = newExpiryTime;
    }

    donation = await Donation.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('donor', 'name email phone');

    res.status(200).json({
      success: true,
      data: donation,
      message: 'Donation updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private (Donor only - owner)
export const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this donation'
      });
    }

    // Check if donation can be deleted
    if (donation.status === 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete donation that has been claimed'
      });
    }

    await donation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search donations
// @route   GET /api/donations/search
// @access  Private
export const searchDonations = async (req, res, next) => {
  try {
    const { foodType, status, minQuantity, maxQuantity } = req.query;
    
    const query = {};
    
    if (foodType) {
      query.foodType = { $regex: foodType, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    } else {
      query.status = 'available';
      query.expiryTime = { $gt: new Date() };
    }
    
    if (minQuantity) {
      query.quantity = { ...query.quantity, $gte: Number(minQuantity) };
    }
    
    if (maxQuantity) {
      query.quantity = { ...query.quantity, $lte: Number(maxQuantity) };
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name email phone organization')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};
