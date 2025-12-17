const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireSuperAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.get('/profile', authenticateToken, adminController.getProfile);
router.put('/profile', authenticateToken, adminController.updateProfile);

// Super admin only routes
router.post('/register', authenticateToken, requireSuperAdmin, adminController.register);
router.get('/all', authenticateToken, requireSuperAdmin, adminController.getAllAdmins);
router.delete('/:id', authenticateToken, requireSuperAdmin, adminController.deleteAdmin);

module.exports = router;
