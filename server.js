const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: "Shopper's Stop API is running 🛍️" });
});

// Error handling middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5005;

const startServer = async () => {
  let connected = false;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shoppers-stop';

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to MongoDB:', mongoUri);
    connected = true;
  } catch (err) {
    console.log('⚠️ Local MongoDB connection failed. Starting MongoMemoryServer fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { port: 27017, dbName: 'shoppers-stop' }
      });
      console.log('✅ In-Memory MongoDB running at:', mongod.getUri());
      await mongoose.connect(mongod.getUri());
      connected = true;
    } catch (memErr) {
      console.error('❌ In-memory MongoDB failed:', memErr.message);
    }
  }

  if (!connected) {
    console.error('❌ Could not connect to any MongoDB instance.');
    process.exit(1);
  }

  // Auto-seed DB if empty
  try {
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('🌱 Empty database detected. Auto-seeding products...');
      const seedFunc = require('./seedHelper');
      await seedFunc();
    }
  } catch (seedErr) {
    console.error('⚠️ Auto-seed notice:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
  });
};

startServer();

module.exports = app;
