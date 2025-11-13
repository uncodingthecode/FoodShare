import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import {
  createDonation,
  getAvailableDonations,
  getDonation,
  getMyDonations,
  updateDonation,
  deleteDonation,
  searchDonations
} from '../controllers/donationController.js';
import { protect, authorize, checkApproval } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const donationValidation = [
  body('foodType').notEmpty().withMessage('Food type is required'),
  body('quantity').isFloat({ min: 0.1 }).withMessage('Quantity must be a positive number'),
  body('unit').isIn(['kg', 'grams', 'liters', 'pieces', 'plates', 'boxes']).withMessage('Invalid unit'),
  body('expiryHours').isFloat({ min: 0.1 }).withMessage('Expiry hours must be a positive number'),
  body('location.address').notEmpty().withMessage('Address is required')
];

// Public routes (with authentication)
router.get('/available', protect, getAvailableDonations);
router.get('/search', protect, searchDonations);
router.get('/:id', protect, getDonation);

// Donor only routes
router.post('/', protect, authorize('donor'), checkApproval, donationValidation, validate, createDonation);
router.get('/my-donations/list', protect, authorize('donor'), getMyDonations);
router.put('/:id', protect, authorize('donor'), checkApproval, updateDonation);
router.delete('/:id', protect, authorize('donor'), checkApproval, deleteDonation);

export default router;
