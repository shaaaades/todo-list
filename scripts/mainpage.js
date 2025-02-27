let taskName, taskDate, taskPriority;
const taskNameElem = document.querySelector("#task-name");
const taskDateElem = document.querySelector("#task-date")
const taskPriorityElem = document.querySelector("#task-priority");
const addTask = document.getElementById("add-task-button");
const form = document.getElementById("add-task-modal");
const task = document.getElementById("add-task");
const closeIcon = document.getElementById("close-icon");
const mainpageContainer = document.getElementById("mainpage-container");

addTask.addEventListener("click", function(e) {
  e.preventDefault();

  // Get the values of the input fields
  taskName = taskNameElem.value;
  taskDate = taskDateElem.value;
  taskPriority = taskPriorityElem.value;

  let taskDetails = [{
    taskName,
    taskDate,
    taskPriority
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
  } 

  // Retrieve tasks before adding a new task
  let retrievedTasks = localStorage.getItem("taskDetails");
  let updatedTasks = JSON.parse(retrievedTasks);

  if(retrievedTasks !== null) {
    let tasks = [...updatedTasks, ...taskDetails];
    localStorage.setItem("taskDetails", JSON.stringify(tasks));
  } else {
    localStorage.setItem("taskDetails", JSON.stringify(taskDetails));
  }

  // Check if the tasks are successfully saved
  if (retrievedTasks) {
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