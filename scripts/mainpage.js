let taskName, taskDate, taskPriority;
const taskNameElem = document.querySelector("#task-name");
const taskDateElem = document.querySelector("#task-date")
const taskPriorityElem = document.querySelector("#task-priority");
const addTask = document.getElementById("add-task-button");
const form = document.getElementById("add-task-modal");
const task = document.getElementById("add-task");
const closeIcon = document.getElementById("close-icon");
const mainpageContainer = document.getElementById("mainpage-container");

let retrievedTasks = localStorage.getItem("taskDetails");
let updatedTasks = JSON.parse(retrievedTasks);

addTask.addEventListener("click", function(e) {
  e.preventDefault();

  // Get the values of the input fields
  taskName = taskNameElem.value;
  taskDate = new Date(taskDateElem.value); // recheck
  taskPriority = taskPriorityElem.value;

  let taskDetails = [{
    taskName,
    taskDate,
    taskPriority,
  }]

  // Validate input fields when empty
  if (taskName === "" || taskDate === "" || taskPriority === "") {
    if (!document.getElementById("error-message")){
      let errorMessage = document.createElement("p");
      errorMessage.setAttribute("id", "error-message");
      errorMessage.innerText = "Please fill in all fields to proceed."

      addTask.parentNode.insertBefore(errorMessage, addTask.nextSibling);

      setTimeout(function(){
        document.getElementById("error-message").remove();
      }, 3000);
    } 
    return;
  } else if (taskDate) {
    // Validate date format
    // 2025-02-25 => Tuesday, February 25, 2025
    let day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let month = ["January","February","March","April","May","June","July","August", "September", "October", "November", "December"]

    let year = taskDate.getFullYear();
    let monthIndex = month[taskDate.getMonth()];
    let dayIndex = day[taskDate.getDay()];
    let dateIndex = taskDate.getDate()

    console.log("Task Date format: ", day[taskDate.getDay()])
    console.log("Month: ", month[taskDate.getMonth()])
    console.log("Date: ", taskDate.getDate())
    console.log("Year: ", taskDate.getFullYear())

    taskDate = `${dayIndex}, ${monthIndex} ${dateIndex} ${year}`
  }



  // Retrieve tasks before adding a new task
  const tasks = [...(updatedTasks ?? []), ...taskDetails];
  localStorage.setItem("taskDetails", JSON.stringify(tasks));
  
  // Check if the new tasks are successfully saved
  if (localStorage.getItem("taskDetails") !== null) {
    form.style.display = "none"
    form.reset();

    // To show confirmation message once task is added successfully
    let popupMessage = document.createElement("p");
    popupMessage.setAttribute("id", "popup-message")
    popupMessage.innerText = "Task added successfully.";
    mainpageContainer.style.cursor = "not-allowed"

    form.parentNode.insertBefore(popupMessage, form.nextSibling);

    setTimeout(function(){
      document.getElementById("popup-message").remove();
      mainpageContainer.style.cursor = "pointer"
      window.location.reload();
    }, 3000);
  } 

})

task.addEventListener("click", function() {
  form.style.display = "flex"
})

closeIcon.addEventListener("click", function() {
  form.style.display = "none"
  form.reset();
})

window.addEventListener("load", function() {
  // Contain the task lists into one container
  let taskContainerWrapper = document.createElement("div");
  taskContainerWrapper.classList.add("task-container-wrapper");
  let groupedTasks = {};
  /* Has the format:
      { "2024-05-14": [{ taskName: "Study", taskDate: "2024-05-14",taskPriority: "High" }] } */

  if(updatedTasks !== null) {
    // Sort the tasks by date before displaying to the main page
    updatedTasks.sort((first, next) => new Date(first.taskDate) - new Date(next.taskDate)); //recheck

    // Group tasks by date before displaying
    updatedTasks?.forEach(item => {
      groupedTasks[item.taskDate] ? groupedTasks[item.taskDate].push(item) : groupedTasks[item.taskDate] = [item]
    })

    // Get the key (dates) from the array and create heading for the dates
    Object.keys(groupedTasks).forEach(date => {
      let taskDate = document.createElement("div");
      taskDate.classList.add("mainpage-date");

      taskDate.innerText = date;

      document.getElementById("mainpage-subtitle").appendChild(taskContainerWrapper);
      taskContainerWrapper.appendChild(taskDate)

      // Create separate containers for each task by date and display them accordingly
      for (let key in groupedTasks[date]) {
        let taskContainer = document.createElement("div"); 
        taskContainer.setAttribute("id", "task-container");
        taskContainerWrapper.appendChild(taskContainer);

        taskContainer.innerHTML += 
        `<div class="task-list">
          <h1>${groupedTasks[date][key].taskName}</h1>
          <h3>${groupedTasks[date][key].taskPriority}</h3>
        </div>
        <div class="task-icons">
          <img src="../todo-list/assets/icons/edit-task-icon.svg" id="edit-task-icon" alt="Edit Task">
          <img src="../todo-list/assets/icons/delete-task-icon.svg" id="delete-task-icon" alt="Delete Task">
        </div>
        `
      }
    });

  } else {
    // Display that there are no tasks 
    let noTasksContainer = document.createElement("div");
    noTasksContainer.setAttribute("id", "no-tasks-container");

    noTasksContainer.innerHTML = `<h1>No tasks available. </h1>`;
    document.getElementById("mainpage-date").appendChild(noTasksContainer);
  }
})