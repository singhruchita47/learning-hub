const fs = require('fs');

const dbPath = 'local_memory_db.json';
let data = {};

try {
  data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (err) {
  console.error("Error reading DB:", err);
}

// Keep the default admin user, clear everything else
const resetData = {
  users: data.users ? data.users.filter(u => u.role === 'admin' || u.id === 'usr_admin_default') : [
    {
      "id": "usr_admin_default",
      "name": "System Admin",
      "email": "admin@learning.hub",
      "role": "admin",
      "passwordHash": "778e00ab2cb1228db160a62ac6a5b757:cca8032ec5b37d0b55b8829d6394612d92fb50f8ee896f71ee8de2fc79c0a373719fbe119e20a0c1c9cae190ac1e940967bf8a8bd1221b349bd08e0381c442f4"
    }
  ],
  assignments: [],
  assignmentSubmissions: [],
  quizAttempts: [],
  notifications: [],
  codingQuestions: [],
  classes: [],
  attendance: [],
  feedback: [],
  liveClasses: [],
  resources: [],
  courses: [],
  enrollments: []
};

try {
  fs.writeFileSync(dbPath, JSON.stringify(resetData, null, 2), 'utf8');
  console.log("Database reset successfully. Only admin users kept.");
} catch (err) {
  console.error("Error writing DB:", err);
}
