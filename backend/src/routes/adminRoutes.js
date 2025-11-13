import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  approveUser,
  toggleUserStatus,
  deleteUser,
  getAllDonations,
  deleteDonation,
  generateReports
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin only
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);
router.get('/reports', generateReports);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/activate', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Donation management
router.get('/donations', getAllDonations);
router.delete('/donations/:id', deleteDonation);

export default router;
