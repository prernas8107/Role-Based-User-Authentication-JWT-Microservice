const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');


router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/profile', protect, getUserProfile);


router.get('/users', protect, authorizeRoles('admin'), getAllUsers);

module.exports = router;
