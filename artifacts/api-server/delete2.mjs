import mongoose from 'mongoose';

async function run() {
  try {
    await mongoose.connect('mongodb://localhost:27017/learning-hub');
    console.log('Connected to DB');
    
    const AssignmentSchema = new mongoose.Schema({ title: String }, { strict: false });
    const Assignment = mongoose.model('Assignment', AssignmentSchema, 'assignments');
    
    const assignments = await Assignment.find({});
    console.log('All Assignments:', assignments.map(a => a.title));
    
    const res = await Assignment.deleteMany({ title: /Assignment.*3/i });
    console.log('Deleted:', res.deletedCount);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
