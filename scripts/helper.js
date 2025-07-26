// Validate date format before displaying
export function formatDate(date) {
  let day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let month = ["January","February","March","April","May","June","July","August", "September", "October", "November", "December"]

  let year = date.getFullYear();
  let monthIndex = month[date.getMonth()];
  let dayIndex = day[date.getDay()];
  let dateIndex = date.getDate()

  return `${dayIndex} - ${monthIndex} ${dateIndex}, ${year}`
}

export function getCategoryLabel (category) {
  const labels = {
    dueToday: "TODAY'S QUEST",
    upcoming: "UPCOMING TASKS",
    pastDue: "UH-OH! YOU MISSED THIS..."
  }
  return labels[category];
}

// To show confirmation message once task is added or updated successfully
export function showPopupMessage(message) {
  const mainpageContainer = document.getElementById("mainpage-container");
  const addTaskForm = document.getElementById("add-task-modal");
  let popupMessage = document.createElement("p");

  popupMessage.setAttribute("id", "popup-message")
  popupMessage.innerText = message;
  mainpageContainer.style.pointerEvents = "none"
  addTaskForm.parentNode.insertBefore(popupMessage, addTaskForm.nextSibling);

  setTimeout(function(){
    document.getElementById("popup-message").remove();
    mainpageContainer.style.cursor = "pointer"
    window.location.reload();
  }, 3000);
}

// To display if no tasks are available
export function displayNoTasks() {
  // Display that there are no tasks 
  const noTasksContainer = document.createElement("div");
  noTasksContainer.setAttribute("id", "no-tasks-container");

  noTasksContainer.innerHTML = `<h1>No tasks available. </h1>`;
  document.getElementById("mainpage-title").appendChild(noTasksContainer);
}