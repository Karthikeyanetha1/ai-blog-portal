import './overrideMongoose.js';
import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';
import { setUseMock } from './overrideMongoose.js';

const connectDB = async () => {
  try {
    // Attempt connecting to database with a short timeout (2s)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto seed database if empty
    await seedDatabase();
  } catch (error) {
    console.warn(`\n⚠️  MongoDB connection failed: ${error.message}`);
    console.warn(`⚙️   FALLING BACK to local JSON-based mock database at /backend/data/\n`);
    setUseMock(true);
    
    // Trigger seeding on the mock database
    await seedDatabase();
  }
};

export default connectDB;
