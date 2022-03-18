const connection = require('../config/connection');
const { Course, Student } = require('../models');
const { getRandomName, getThought } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing courses
  await Course.deleteMany({});

  // Drop existing students
  await Student.deleteMany({});

  // Create empty array to hold the students
  const Users = [];

  // Get some random assignment objects using a helper function that we imported from ./data
  const thoughts = getThought(20);

  // Loop 20 times -- add students to the students array
  for (let i = 0; i < 20; i++) {
    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
   

    Users.push({
      first,
      last,
      thoughts,
    });
  }

  // Add students to the collection and await the results
  await User.collection.insertMany(users);

  // Add courses to the collection and await the results
  await Course.collection.insertOne({
    courseName: 'UCLA',
    inPerson: false,
    students: [...students],
  });

  // Log out the seed data to indicate what should appear in the database
  console.table(students);
  console.table(assignments);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
