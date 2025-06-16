const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🚀 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log('─'.repeat(50));
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`🔥 Error Message: ${error.message}`);
    console.error(`📋 Full Error:`, error);
    console.log('─'.repeat(50));
    process.exit(1);
  }

  // Connection event listeners for additional logging
  mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected from MongoDB');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed through app termination');
    process.exit(0);
  });
};

module.exports = connectDB;
