let taskName, taskDate, taskPriority;
const taskNameElem = document.querySelector("#task-name");
const taskDateElem = document.querySelector("#task-date")
const taskPriorityElem = document.querySelector("#task-priority");
const addTask = document.getElementById("add-task-button");

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
    } 
    return;
  } else {
    // Remove the error message if it exists
    let errorMessage = document.getElementById("error-message");
    errorMessage.remove();
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
})

// // To show add task modal when clicking add task icon
// function addTask() {
//   let task = document.getElementById("add-task");
//   task.addEventListener("click", function() {
//     let addTaskModal = document.getElementById("add-task-modal");
//     if (addTaskModal.style.display === "none") {
//       addTaskModal.style.display = "block";
//     } 
//     else {
//       addTaskModal.style.display = "none";
//     }
//   })
// }

// export default addTask();