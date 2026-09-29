const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from root or server
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// HTTP Request Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopEase Unified API Server is operational',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// REST API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// -------------------------------------------------------------
// SERVE PRODUCTION REACT BUILD & SPA FALLBACK (Single Service)
// -------------------------------------------------------------
const fs = require('fs');
const distPath = fs.existsSync(path.join(__dirname, '../frontend/dist'))
  ? path.join(__dirname, '../frontend/dist')
  : path.join(__dirname, '../dist');
app.use(express.static(distPath));

// API 404 handler (only for unhandled /api requests)
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Wildcard SPA Fallback handler for all customer & admin React routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>ShopEase Backend API Server</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>ShopEase Unified Server is Running</h2>
          <p>The frontend has not been built yet.</p>
          <p>Run <code>npm run build</code> to compile the React frontend into <code>dist/</code>, or run <code>npm run dev</code> for full-stack live reloading.</p>
          <p><a href="/api/health">Check API Health</a></p>
        </body>
      </html>
    `);
  }
});

// Centralized Error Handler
app.use(errorHandler);

// Use Railway-provided PORT or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ShopEase Unified E-Commerce Server Running`);
  console.log(` Port: ${PORT} (process.env.PORT compliant for Railway)`);
  console.log(` Serving API: http://localhost:${PORT}/api`);
  console.log(` Serving Frontend from: ${distPath}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`=======================================================`);
});

module.exports = app;
