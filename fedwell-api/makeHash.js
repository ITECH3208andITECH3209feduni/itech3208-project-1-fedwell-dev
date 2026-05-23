const bcrypt = require('bcryptjs');

const staffHash = bcrypt.hashSync('fedwell2026', 10);
const teacherHash = bcrypt.hashSync('teacher2026', 10);

console.log('STAFF_HASH=' + staffHash);
console.log('TEACHER_HASH=' + teacherHash);