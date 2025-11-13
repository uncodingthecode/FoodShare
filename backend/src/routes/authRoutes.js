import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').isIn(['donor', 'ngo', 'volunteer']).withMessage('Invalid role'),
  body('phone').notEmpty().withMessage('Phone number is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update', protect, updateDetails);
router.put('/update-password', protect, updatePassword);

export default router;
