const mongoose = require('mongoose');
require('dotenv').config();
const seedData = require('./seedHelper');

const seedDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shoppers-stop';
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    } catch (e) {
      console.log('⚠️ Local MongoDB connection failed. Starting MongoMemoryServer for seed...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({ instance: { port: 27017, dbName: 'shoppers-stop' } });
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
    }

    await seedData();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
