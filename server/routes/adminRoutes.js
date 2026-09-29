const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAnalytics,
  getInventoryReport
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.use(admin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/inventory', getInventoryReport);

// Image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename
  });
});

module.exports = router;
