const fs = require('fs');

try {
  const dbPath = 'local_memory_db.json';
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  if (data.assignments) {
    const initialLen = data.assignments.length;
    data.assignments = data.assignments.filter(a => !/assignment.*3/i.test(a.title));
    const deletedCount = initialLen - data.assignments.length;
    
    // Also remove related submissions and notifications if needed (optional)
    
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Deleted ${deletedCount} assignments matching 'Assignment 3'`);
  } else {
    console.log('No assignments found in DB');
  }
} catch (err) {
  console.error(err);
}
