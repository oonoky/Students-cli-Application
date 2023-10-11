#!/usr/bin/env node

const program = require('commander');
const mongoose = require('mongoose');
const Student = require('./models/student');

mongoose.connect('mongodb://127.0.0.1:27017/university', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

program
  .version('1.0.0')
  .description('Student CLI Application');

program
  .command('add <name> <age> <grade>')
  .description('Add a new student')
  .action(async (name, age, grade) => {
    try {
      const student = new Student({ name, age, grade });
      await student.save();
      console.log('Student added successfully!');
    } catch (err) {
      console.error('Error:', err.message);
    }
    mongoose.connection.close();
  });

program
  .command('list')
  .description('List all students')
  .action(async () => {
    try {
      const students = await Student.find();
      students.forEach((student) => {
        console.log(`${student.name} - Age: ${student.age}, Grade: ${student.grade}`);
      });
    } catch (err) {
      console.error('Error:', err.message);
    }
    mongoose.connection.close();
  });

  program
  .command('get <id>')
  .description('Get a student by ID')
  .action(async (id) => {
    try {
      const student = await Student.findById(id);
      if (student) {
        console.log(`Name: ${student.name}, Age: ${student.age}, Grade: ${student.grade}`);
      } else {
        console.log('Student not found.');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
    mongoose.connection.close();
  });

program
  .command('remove <id>')
  .description('Remove a student by ID')
  .action(async (id) => {
    try {
      const student = await Student.findByIdAndRemove(id);
      if (student) {
        console.log(`Removed student: ${student.name}`);
      } else {
        console.log('Student not found.');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
    mongoose.connection.close();
  });

program
  .command('update <id> <name> <age> <grade>')
  .description('Update a student by ID')
  .action(async (id, name, age, grade) => {
    try {
      const updatedStudent = await Student.findByIdAndUpdate(id, { name, age, grade }, { new: true });
      if (updatedStudent) {
        console.log(`Updated student: ${updatedStudent.name}`);
      } else {
        console.log('Student not found.');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
    mongoose.connection.close();
  });

program.parse(process.argv);
