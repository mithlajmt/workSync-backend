const Department = require('./../../models/department');

const getDepartment = async (req, res) => {
  try {
    // Extract department ID from the request parameters
    const departmentID = req.params.ID;

    // Get today's date at the beginning of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Use aggregation pipeline to fetch department data with additional details
    const departmentData = await Department.aggregate([
      // Stage 1: Match department by ID
      {$match: {departmentID}},

      // Stage 2: Left outer join with employees collection
      {
        $lookup: {
          from: 'employees',
          localField: 'departmentName',
          foreignField: 'department',
          as: 'employees',
        },
      },

      // Stage 3: Left outer join with attendances collection
      {
        $lookup: {
          from: 'attendances',
          let: {departmentName: '$departmentName'},
          pipeline: [
            // Sub-pipeline: Match attendance records today's date of department
            {
              $match: {
                $expr: {
                  $and: [
                    {$eq: ['$department', '$$departmentName']},
                    {$gte: ['$date', today]}, // Filter for today's date orlater
                  ],
                },
              },
            },
          ],
          as: 'attendance',
        },
      },

      // Stage 4: Project department details and counts
      {
        $project: {
          _id: 0,
          departmentName: 1,
          departmentID: 1,
          description: 1,
          budget: 1,
          totalEmployees: {$size: '$employees'},
          attendancesToday: {$size: '$attendance'},
        },
      },
    ]);

    // Send the department data along with success status
    res.json({
      success: true,
      data: departmentData,
    });
  } catch (error) {
    // Handle any errors that occur during the execution
    console.error('Error fetching department data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

module.exports = {
  getDepartment,
};
