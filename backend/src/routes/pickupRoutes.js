import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import {
  getAvailablePickups,
  acceptPickup,
  updatePickupStatus,
  getMyPickups,
  getPickup,
  getAllPickups
} from '../controllers/pickupController.js';
import { protect, authorize, checkApproval } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const statusValidation = [
  body('status')
    .isIn(['picked_up', 'in_transit', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
];

// Admin routes
router.get('/all', protect, authorize('admin'), getAllPickups);

// Volunteer routes
router.get('/available', protect, authorize('volunteer'), checkApproval, getAvailablePickups);
router.post('/:id/accept', protect, authorize('volunteer'), checkApproval, acceptPickup);
router.put('/:id/status', protect, authorize('volunteer'), checkApproval, statusValidation, validate, updatePickupStatus);
router.get('/my-pickups/list', protect, authorize('volunteer'), getMyPickups);

// Shared routes
router.get('/:id', protect, getPickup);

export default router;
