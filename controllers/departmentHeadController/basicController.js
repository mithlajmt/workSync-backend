
const Department = require('./../../models/department');
const Employees = require('./../../models/employee');

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
            // Sub-pipeline: Match attendance records for today's date of department
            {
              $match: {
                $expr: {
                  $and: [
                    {$eq: ['$department', '$$departmentName']},
                    {$gte: ['$date', today]}, // Filter for today's date or later
                  ],
                },
              },
            },
            // Stage 4: Facet to separate present and leave statuses
            {
              $facet: {
                present: [
                  {$match: {status: 'present'}},
                  {$count: 'count'},
                ],
                leave: [
                  {$match: {status: 'leave'}},
                  {$count: 'count'},
                ],
              },
            },
          ],
          as: 'attendanceStats',
        },
      },

      // Stage 5: Project department details and counts
      {
        $project: {
          _id: 0,
          departmentName: 1,
          departmentID: 1,
          description: 1,
          budget: 1,
          totalEmployees: {$size: '$employees'},
          attendancesToday: {
            $ifNull: [{$arrayElemAt: ['$attendanceStats.present.count', 0]}, 0],
          },
          leaveToday: {
            $ifNull: [{$arrayElemAt: ['$attendanceStats.leave.count', 0]}, 0],
          },
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


const getDepId = async (req, res) => {
  const {companyID, employeeID} = req.user;
  try {
    const ID = await Employees.aggregate([
      {
        $match: {
          companyID,
          employeeID,
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: 'departmentName',
          as: 'dept',
        },
      },
      {
        $project: {
          'departmentID': {$arrayElemAt: ['$dept.departmentID', 0]},
          '_id': 0,
        },
      },
    ]);
    console.log(ID);
    res.json({
      data: ID[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
};


module.exports = {
  getDepartment,
  getDepId,
};
