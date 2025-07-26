let taskName, taskDate, taskPriority, taskId;
const taskNameElem = document.querySelector("#task-name");
const taskDateElem = document.querySelector("#task-date")
const taskPriorityElem = document.querySelector("#task-priority");
const taskAction = document.getElementById("task-action-button");
const addTaskForm = document.getElementById("add-task-modal");
const deleteTaskForm = document.getElementById("delete-task-modal");
const task = document.getElementById("add-task");
const closeIcon = document.getElementById("close-icon");
const mainpageContainer = document.getElementById("mainpage-container");
const cancelButton = document.getElementById("cancel-button");
const confirmButton = document.getElementById("confirm-button")
import { formatDate, getCategoryLabel, showPopupMessage, displayNoTasks } from "./helper.js"
import { v4 as uuidv4 } from "https://cdn.skypack.dev/uuid@11.1.0";

let isEditing = false; // Add tasks by default
let selectedTaskId = null; // Task to be edited/deleted
let retrievedTasks = localStorage.getItem("taskDetails");
let updatedTasks = JSON.parse(retrievedTasks);

// To show task modal when add icon is clicked
task.addEventListener("click", function() {
  addTaskForm.style.display = "flex"
  taskAction.innerText = "Add Task"
  mainpageContainer.style.pointerEvents = "none"
})

// To hide task modal when close icon is clicked
// Form resets
closeIcon.addEventListener("click", function() {
  addTaskForm.style.display = "none"
  mainpageContainer.style.pointerEvents = "auto"
  mainpageContainer.style.cursor = "pointer"
  addTaskForm.reset();
})

// To hide delete task modal when cancel button is clicked
cancelButton.addEventListener("click", function() {
  deleteTaskForm.style.display = "none"
  mainpageContainer.style.pointerEvents = "auto"
  mainpageContainer.style.cursor = "pointer"
})

// Performs when add/edit task button is clicked
taskAction.addEventListener("click", function(e) {
  e.preventDefault();

  taskId = uuidv4();
  taskName = taskNameElem.value;
  taskDate = taskDateElem.value; 
  taskPriority = taskPriorityElem.value;

  let taskDetails = [{
    taskId,
    taskName,
    taskDate,
    taskPriority,
  }]

  // Validate input fields 
  // Do not send when empty
  if (taskId === "" || taskName === "" || taskDate === "" || taskPriority === "") { 
    if (!document.getElementById("error-message")){
      let errorMessage = document.createElement("p");
      errorMessage.setAttribute("id", "error-message");
      errorMessage.innerText = "Please fill in all fields to proceed."

      taskAction.parentNode.insertBefore(errorMessage, taskAction.nextSibling);

      setTimeout(function(){
        document.getElementById("error-message").remove();
      }, 3000);
    } 
    return;
  } 

  if (!isEditing) {
    // For saving of added tasks
    // Retrieve tasks before adding a new task
    const tasks = [...(updatedTasks ?? []), ...taskDetails];
    localStorage.setItem("taskDetails", JSON.stringify(tasks));
  } else {
    // Update and save existing task
    let selectedTask = updatedTasks.find(task => task.taskId === selectedTaskId)
    if (selectedTask) {
      selectedTask.taskName = taskName;
      selectedTask.taskDate = taskDate;
      selectedTask.taskPriority = taskPriority;
    }
    localStorage.setItem("taskDetails", JSON.stringify(updatedTasks));
  }

  // Check if the new tasks are successfully saved
  if (localStorage.getItem("taskDetails") !== null) {
    addTaskForm.style.display = "none"
    mainpageContainer.style.pointerEvents = "auto"
    mainpageContainer.style.cursor = "pointer"
    addTaskForm.reset();

    isEditing ? showPopupMessage("Task updated successfully.") : showPopupMessage("Task added successfully.")
  } 
})

// Once window is loaded, show the task display in real-time
window.addEventListener("load", function() {
  // Contain the task lists into one container
  let taskContainerWrapper = document.createElement("div");
  taskContainerWrapper.classList.add("task-container-wrapper");
  
  // Objects are used for grouping because we categorize them using the key attribute
  let groupedTasks = {
    dueToday: {},
    upcoming: {},
    pastDue: {}
  };
  /* Has the format
  { 
    "Due Today": { "2024-05-15": [ { taskName: "", ... }, ... ]},
    "Upcoming": { "2024-05-16": [ ... ]},
    "Past Due": { "2024-05-13": [ ... ]}
  }*/

  // To display the tasks in the mainpage according to its specified category and dates
  if(updatedTasks !== null) {
    if(updatedTasks.length !== 0) {
        // Sort the tasks by date before displaying to the main page
      updatedTasks.sort((first, next) => new Date(first.taskDate) - new Date(next.taskDate)); 

      // Group tasks by category and date before displaying
      updatedTasks?.forEach(item => {
        let taskDate = new Date(item.taskDate);
        let dateToday = new Date()

        if(formatDate(taskDate) === formatDate(dateToday)) {
          groupedTasks.dueToday[item.taskDate] ? groupedTasks.dueToday[item.taskDate].push(item) : groupedTasks.dueToday[item.taskDate] = [item]
        } else if (taskDate < dateToday) {
          groupedTasks.pastDue[item.taskDate] ? groupedTasks.pastDue[item.taskDate].push(item) : groupedTasks.pastDue[item.taskDate] = [item]
        } else {
          groupedTasks.upcoming[item.taskDate] ? groupedTasks.upcoming[item.taskDate].push(item) : groupedTasks.upcoming[item.taskDate] = [item]
        }
      })

      // Get the key category and create heading for each category
      Object.keys(groupedTasks).forEach(category => {
        let categoryList = document.createElement("div");
        categoryList.className = "category"
        
        // If a category is empty
        if (Object.keys(groupedTasks[category]).length === 0) {
          categoryList.style.display = "none"
        } 

        categoryList.innerText = getCategoryLabel(category)
        document.getElementById("mainpage-title").appendChild(taskContainerWrapper);
        taskContainerWrapper.appendChild(categoryList);

        // Get the key (dates) and create heading for the dates
        Object.keys(groupedTasks[category]).forEach(date => {
          let mainpageDate = document.createElement("div");
          mainpageDate.classList.add("mainpage-date");

          mainpageDate.innerText = formatDate(new Date(date));

          taskContainerWrapper.appendChild(mainpageDate)

          // Create separate containers for each task by date and display them accordingly
          for (let key in groupedTasks[category][date]) {
            let taskContainer = document.createElement("div"); 
            taskContainer.setAttribute("id", "task-container");
            taskContainerWrapper.appendChild(taskContainer);

            taskContainer.innerHTML += 
            `<div class="task-list">
              <input type="checkbox" data-task-id="${groupedTasks[category][date][key].taskId}" id="complete-task-icon" alt="Complete Task">
              <div>
                <h1>${groupedTasks[category][date][key].taskName}</h1>
                <h3>${groupedTasks[category][date][key].taskPriority}</h3>
              </div>
            </div>
            <div class="task-icons">
              <img src="../assets/icons/edit-task-icon.svg" 
                data-task-id="${groupedTasks[category][date][key].taskId}"
                data-task-name="${groupedTasks[category][date][key].taskName}"
                data-task-priority="${groupedTasks[category][date][key].taskPriority}"
                data-task-date="${groupedTasks[category][date][key].taskDate}"
                id="edit-task-icon" alt="Edit Task">
              <img src="../assets/icons/delete-task-icon.svg" 
              data-task-id="${groupedTasks[category][date][key].taskId}"
              id="delete-task-icon" alt="Delete Task">
            </div>
            `
          }
        });
      });
  
      // Perform the edit task functionality
      const editTask = document.querySelectorAll("#edit-task-icon");
      editTask.forEach(editTaskIcon => {
        editTaskIcon.addEventListener("click", function() {
          isEditing = true;
          selectedTaskId = editTaskIcon.getAttribute("data-task-id");
          addTaskForm.style.display = "flex"
          mainpageContainer.style.pointerEvents = "none"
          taskAction.innerText = "Edit Task"

          const existingTask = updatedTasks.find(task => task.taskId === selectedTaskId)

          if (existingTask) {
            document.getElementById("task-name").value = editTaskIcon.getAttribute("data-task-name");
            document.getElementById("task-date").value = editTaskIcon.getAttribute("data-task-date");
            document.getElementById("task-priority").value = editTaskIcon.getAttribute("data-task-priority");
          }
        })
      })

      // Perform the delete task functionality
      const deleteTask = document.querySelectorAll("#delete-task-icon");
      deleteTask.forEach(deleteTaskIcon => {
        deleteTaskIcon.addEventListener("click", function() {
          selectedTaskId = deleteTaskIcon.getAttribute("data-task-id");
          deleteTaskForm.style.display = "flex"
          mainpageContainer.style.pointerEvents = "none"

          confirmButton.addEventListener("click", function() {
            updatedTasks = updatedTasks.filter((task) => task.taskId !== selectedTaskId)
            localStorage.setItem("taskDetails", JSON.stringify(updatedTasks));
            deleteTaskForm.style.display = "none"
            showPopupMessage("Task deleted successfully.")
          })
        })
      })

      // Perform the complete task functionality
      const completeTask = document.querySelectorAll("#complete-task-icon");
      completeTask.forEach(completeTaskIcon => {
        completeTaskIcon.addEventListener("click", function() {
          selectedTaskId = completeTaskIcon.getAttribute("data-task-id");
          mainpageContainer.style.pointerEvents = "none"
          
          updatedTasks = updatedTasks.filter((task) => task.taskId !== selectedTaskId)
          localStorage.setItem("taskDetails", JSON.stringify(updatedTasks));
          showPopupMessage("Task completed successfully.")
        })
      })
    } else {
      displayNoTasks();
    }
  } else {
    displayNoTasks();
  }
})

