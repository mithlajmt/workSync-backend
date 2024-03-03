/* eslint-disable max-len */
const cron = require('node-cron');
const Attendance = require('./../models/attendance');

const checkOutEmployees = async () => {
    console.log('hi');
  try {

    // Find overdue employees without checking out
    const overdueEmployees = await Attendance.find({checkOut: {$exists: false}});

    // Update the identified employees in the database
    if (overdueEmployees.length > 0) {
      const employeeIds = overdueEmployees.map((employee) => employee.employeeID);
      await Attendance.updateMany(
          {employeeID: {$in: employeeIds}, checkOut: {$exists: false}},
          {$set: {checkOut: new Date(), isLate: true}},
      );

      console.log(`Checked out employees with IDs: ${employeeIds.join(', ')}`);
    } else {
      console.log('No overdue employees found.');
    }
  } catch (error) {
    console.error('Error during check-out:', error);
  }
};

// Schedule the cron job to run every day at 3 AM
// cron.schedule('*/1 * * * * *', async () => {
//     // await checkOutEmployees();
//     console.log('jo');
// });

cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
  });