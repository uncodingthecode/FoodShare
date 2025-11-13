import express from 'express';
import {
  claimDonation,
  getMyClaims,
  getClaim,
  updateClaimStatus,
  getAllClaims
} from '../controllers/claimController.js';
import { protect, authorize, checkApproval } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/all', protect, authorize('admin'), getAllClaims);

// NGO routes
router.post('/claim/:donationId', protect, authorize('ngo'), checkApproval, claimDonation);
router.get('/my-claims', protect, authorize('ngo'), getMyClaims);
router.put('/:id/status', protect, authorize('ngo', 'admin'), updateClaimStatus);

// Shared routes
router.get('/:id', protect, getClaim);

export default router;
