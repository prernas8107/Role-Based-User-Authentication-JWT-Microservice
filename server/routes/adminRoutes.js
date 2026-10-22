const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');


router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.route('/users').get(getAllUsers).post(createUser);
router.route('/users/:id').patch(updateUser).delete(deleteUser);

module.exports = router;
