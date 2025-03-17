// Validate date format before displaying
export default function formatDate(date) {
  let day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let month = ["January","February","March","April","May","June","July","August", "September", "October", "November", "December"]

  let year = date.getFullYear();
  let monthIndex = month[date.getMonth()];
  let dayIndex = day[date.getDay()];
  let dateIndex = date.getDate()

  return `${dayIndex} - ${monthIndex} ${dateIndex}, ${year}`
}