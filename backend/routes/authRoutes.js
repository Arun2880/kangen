const express = require('express');
const { registerDealer, login, forgotPassword, resetPassword,createDefaultAdmin,logout } = require('../controllers/authController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register and login
router.post('/register/dealer', protect, adminOnly, registerDealer);
router.post('/login', login);
router.post('/registeradmin',createDefaultAdmin);
router.post('/logout',logout);

// Forgot and Reset Password
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

module.exports = router;
