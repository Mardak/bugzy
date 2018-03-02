const {DateTime} = require("luxon");

// TODO: calculate holidays etc
const ONTARIO_HOLIDAYS = [
  new DateTime.local(01, 01), // New Years
  new DateTime.local(02, 19), // Family day, 3rd month in Feb
  new DateTime.local(03, 30), // Good Friday
  new DateTime.local(04, 02), // Easter Monday
  new DateTime.local(05, 21), // Victoria Day
  new DateTime.local(07, 02), // Canada Day
  new DateTime.local(08, 06), // Civic Holiday
  new DateTime.local(09, 03), // Labour Day
  new DateTime.local(10, 08), // Thanksgiving
  new DateTime.local(11, 12), // Rememberance Day
  new DateTime.local(12, 25), // Christmas
  new DateTime.local(12, 26), // Boxing Day
];

const REFERENCE_ITERATION = {
  start: new DateTime.local(2018, 01, 15),
  major: 60,
  minor: 1
};

const MAJOR_IN_WEEKS = 8;
const MINOR_IN_WEEKS = 2;

function getDatesForIteration(iteration) {
  const [major, minor] = iteration.split(".");
  const weeksToAdd = (+major - REFERENCE_ITERATION.major) * MAJOR_IN_WEEKS + (minor - 1) * MINOR_IN_WEEKS;
  const start = REFERENCE_ITERATION.start.plus({weeks: weeksToAdd});
  return {
    start,
    due: start.plus({weeks: 2})
  }
}

function getIteration(date) {
  const actualDate = date ? new DateTime.fromISO(date): DateTime.local();
  // set to monday of this week
  const monday = actualDate.minus({days: actualDate.weekday - 1});
  const timeSinceReference = monday.diff(REFERENCE_ITERATION.start, ["weeks"]).toObject();
  const result = {
    major: REFERENCE_ITERATION.major + (Math.floor(timeSinceReference.weeks / MAJOR_IN_WEEKS) || 0),
    minor: (Math.floor((timeSinceReference.weeks % 8) / MINOR_IN_WEEKS) || 0) + 1
  };
  const number = `${result.major}.${result.minor}`;
  const {start, due} = getDatesForIteration(number);
  return {
    number,
    start: start.toString(),
    due: due.toString(),
  };
}

module.exports = {
  getIteration
};

