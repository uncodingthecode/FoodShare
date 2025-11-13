import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Claim from '../models/Claim.js';
import PickupRequest from '../models/PickupRequest.js';
import { createNotification } from '../utils/notifications.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalNGOs = await User.countDocuments({ role: 'ngo' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const pendingApprovals = await User.countDocuments({ isApproved: false });

    const totalDonations = await Donation.countDocuments();
    const availableDonations = await Donation.countDocuments({ 
      status: 'available',
      expiryTime: { $gt: new Date() }
    });
    const claimedDonations = await Donation.countDocuments({ status: 'claimed' });
    const expiredDonations = await Donation.countDocuments({ status: 'expired' });

    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    const completedClaims = await Claim.countDocuments({ status: 'completed' });

    const totalPickups = await PickupRequest.countDocuments();
    const pendingPickups = await PickupRequest.countDocuments({ status: 'pending' });
    const activePickups = await PickupRequest.countDocuments({ 
      status: { $in: ['accepted', 'picked_up', 'in_transit'] }
    });
    const completedPickups = await PickupRequest.countDocuments({ status: 'delivered' });

    // Calculate total food saved (in kg)
    const foodSavedResult = await Donation.aggregate([
      { $match: { status: { $in: ['claimed', 'expired'] } } },
      { 
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);
    const totalFoodSaved = foodSavedResult.length > 0 ? foodSavedResult[0].totalQuantity : 0;

    // Recent activities
    const recentDonations = await Donation.find()
      .populate('donor', 'name email')
      .sort('-createdAt')
      .limit(5);

    const recentClaims = await Claim.find()
      .populate('ngo', 'name organization')
      .populate({
        path: 'donation',
        select: 'foodType quantity',
        populate: { path: 'donor', select: 'name' }
      })
      .sort('-createdAt')
      .limit(5);

    // User growth over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Donation trends (last 6 months)
    const donationTrends = await Donation.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          donors: totalDonors,
          ngos: totalNGOs,
          volunteers: totalVolunteers,
          pendingApprovals
        },
        donations: {
          total: totalDonations,
          available: availableDonations,
          claimed: claimedDonations,
          expired: expiredDonations
        },
        claims: {
          total: totalClaims,
          pending: pendingClaims,
          completed: completedClaims
        },
        pickups: {
          total: totalPickups,
          pending: pendingPickups,
          active: activePickups,
          completed: completedPickups
        },
        impact: {
          totalFoodSaved: Math.round(totalFoodSaved * 100) / 100,
          nGOsServed: totalNGOs,
          activeVolunteers: totalVolunteers
        },
        recentActivities: {
          donations: recentDonations,
          claims: recentClaims
        },
        trends: {
          userGrowth,
          donationTrends
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, isApproved, isActive } = req.query;
    
    const query = {};
    
    if (role) query.role = role;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    let stats = {};

    if (user.role === 'donor') {
      const donations = await Donation.countDocuments({ donor: user._id });
      const activeDonations = await Donation.countDocuments({ 
        donor: user._id,
        status: 'available'
      });
      stats = { totalDonations: donations, activeDonations };
    } else if (user.role === 'ngo') {
      const claims = await Claim.countDocuments({ ngo: user._id });
      const completedClaims = await Claim.countDocuments({ 
        ngo: user._id,
        status: 'completed'
      });
      stats = { totalClaims: claims, completedClaims };
    } else if (user.role === 'volunteer') {
      const pickups = await PickupRequest.countDocuments({ volunteer: user._id });
      const completedPickups = await PickupRequest.countDocuments({ 
        volunteer: user._id,
        status: 'delivered'
      });
      stats = { totalPickups: pickups, completedPickups };
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Disapprove user
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin only)
export const approveUser = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Notify user
    await createNotification(
      user._id,
      'user_approved',
      isApproved ? 'Account Approved' : 'Account Disapproved',
      isApproved 
        ? 'Your account has been approved by admin'
        : 'Your account approval has been revoked',
      user._id,
      'User'
    );

    res.status(200).json({
      success: true,
      data: user,
      message: `User ${isApproved ? 'approved' : 'disapproved'} successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate/Deactivate user
// @route   PUT /api/admin/users/:id/activate
// @access  Private (Admin only)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Notify user
    await createNotification(
      user._id,
      'user_blocked',
      isActive ? 'Account Activated' : 'Account Deactivated',
      isActive 
        ? 'Your account has been activated'
        : 'Your account has been deactivated by admin',
      user._id,
      'User'
    );

    res.status(200).json({
      success: true,
      data: user,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (Admin)
// @route   GET /api/admin/donations
// @access  Private (Admin only)
export const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email phone organization')
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

// @desc    Delete donation (Admin)
// @route   DELETE /api/admin/donations/:id
// @access  Private (Admin only)
export const deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    await donation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Donation removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate reports
// @route   GET /api/admin/reports
// @access  Private (Admin only)
export const generateReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchFilter = Object.keys(dateFilter).length > 0 
      ? { createdAt: dateFilter }
      : {};

    // Donations report
    const donationsReport = await Donation.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    // Claims report
    const claimsReport = await Claim.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Pickups report
    const pickupsReport = await PickupRequest.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top donors
    const topDonors = await Donation.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$donor',
          donationCount: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { donationCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'donor'
        }
      },
      { $unwind: '$donor' },
      {
        $project: {
          name: '$donor.name',
          email: '$donor.email',
          donationCount: 1,
          totalQuantity: 1
        }
      }
    ]);

    // Top NGOs
    const topNGOs = await Claim.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$ngo',
          claimCount: { $sum: 1 }
        }
      },
      { $sort: { claimCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'ngo'
        }
      },
      { $unwind: '$ngo' },
      {
        $project: {
          name: '$ngo.name',
          organization: '$ngo.organization',
          claimCount: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        donations: donationsReport,
        claims: claimsReport,
        pickups: pickupsReport,
        topDonors,
        topNGOs
      }
    });
  } catch (error) {
    next(error);
  }
};
