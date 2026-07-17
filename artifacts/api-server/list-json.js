const fs = require('fs');
const data = JSON.parse(fs.readFileSync('local_memory_db.json', 'utf8'));
console.log(data.assignments ? data.assignments.map(a => ({ id: a._id, title: a.title })) : 'No assignments array');
