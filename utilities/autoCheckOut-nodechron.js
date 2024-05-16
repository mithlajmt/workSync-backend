/* eslint-disable max-len */
const cron = require('node-cron');
const Attendance = require('./../models/attendence');
const Employees = require('./../models/employee');

const checkOutEmployees = async () => {
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


const markLeave = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeEmployees = await Employees.find({isActive: true});

    // Iterate over active employees
    for (const employee of activeEmployees) {
      const existingAttendance = await Attendance.findOne({
        employeeID: employee.employeeID,
        date: today,
      });

      if (!existingAttendance) {
        const attendance = new Attendance({
          companyID: employee.companyID,
          employeeID: employee.employeeID,
          date: today,
          status: 'leave',
          department: employee.department,
        });

        await attendance.save();
        // console.log(`Marked leave for employee ${employee.employeeID}`);
      }
    }
  } catch (error) {
    console.error('Error marking leave:', error);
  }
};


cron.schedule('0 23 * * 1-6', async () => {
  await checkOutEmployees();
});


// Schedule the cron job to run at 11:30 AM every day except Sunday
cron.schedule('30 11 * * 1-6', async () => {
  await markLeave();
});


// cron.schedule('* * * * *', () => {
//     console.log('running a task every minute');
//   });


module.exports = cron;
