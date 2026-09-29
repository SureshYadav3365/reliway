const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserDetails,
  toggleUserStatus
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.use(admin);

router.get('/', getAllUsers);
router.get('/:id', getUserDetails);
router.patch('/:id/status', toggleUserStatus);

module.exports = router;
