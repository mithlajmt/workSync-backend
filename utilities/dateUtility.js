const getDatesBetween = function(start, end) {
  const datesBetween = []; // Initialize an array to store dates

  const startDate = new Date(start);
  const endDate = new Date(end);
  const filteredLeaves = [];

  while (startDate <= endDate) {
    // Convert start and end strings to Date objects
    // Add a day to startDate
    //   const nextDay = new Date(startDate);

    // Push the current date into the array
    datesBetween.push(new Date(startDate));

    // Update startDate to the next day
    startDate.setDate(startDate.getDate() + 1);

    // Convert startDate to a more readable format (optional)
  }


  datesBetween.map((data, i)=>{
    const day = data.getDay();
    // console.log(day);
    if (day===0) {

    } else {
      filteredLeaves[i]=data;
    }
  });

  return filteredLeaves;
};


// const skipHolidays = function skipper(req,res)

module.exports = {
  getDatesBetween,
};


