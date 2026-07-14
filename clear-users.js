const mongoose = require('mongoose');

async function clearUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/learning-hub');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Clear users collection
    const result = await db.collection('users').deleteMany({});
    console.log(`Deleted ${result.deletedCount} users.`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

clearUsers();
