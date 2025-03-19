let taskName, taskDate, taskPriority;
const taskNameElem = document.querySelector("#task-name");
const taskDateElem = document.querySelector("#task-date")
const taskPriorityElem = document.querySelector("#task-priority");
const addTask = document.getElementById("add-task-button");
const form = document.getElementById("add-task-modal");
const task = document.getElementById("add-task");
const closeIcon = document.getElementById("close-icon");
const mainpageContainer = document.getElementById("mainpage-container");
import formatDate from "./helper.js"

let retrievedTasks = localStorage.getItem("taskDetails");
let updatedTasks = JSON.parse(retrievedTasks);

addTask.addEventListener("click", function(e) {
  e.preventDefault();

  // Get the values of the input fields
  taskName = taskNameElem.value;
  taskDate = taskDateElem.value; 
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
  
  // Objects are used for grouping because we categorize them using the key attribute
  let groupedTasks = {
    dueToday: {},
    upcoming: {},
    pastDue: {}
  };
  /* Has the format
  {
    "Due Today": {
      "2024-05-15": [ { taskName: "", ... }, ... ]
    },
    "Upcoming": {
      "2024-05-16": [ ... ]
    },
    "Past Due": {
      "2024-05-13": [ ... ]
    }
  }
  */

  if(updatedTasks !== null) {
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
      } else {
        if (category === "dueToday") {
          categoryList.innerText = "Today's Quest"
        } else if (category === "upcoming") {
          categoryList.innerText = "Coming Up!"
        } else {
          categoryList.innerText = "Uh-oh! You Missed This..."
        }
      }
      
      document.getElementById("mainpage-title").appendChild(taskContainerWrapper);
      taskContainerWrapper.appendChild(categoryList);

      // Get the key (dates) and create heading for the dates
      Object.keys(groupedTasks[category]).forEach(date => {
        let mainpageDate = document.createElement("div");
        mainpageDate.classList.add("mainpage-date");

        mainpageDate.innerText = formatDate(new Date(date));

        // document.getElementById("mainpage-title").appendChild(taskContainerWrapper);
        taskContainerWrapper.appendChild(mainpageDate)

        // Create separate containers for each task by date and display them accordingly
        for (let key in groupedTasks[category][date]) {
          let taskContainer = document.createElement("div"); 
          taskContainer.setAttribute("id", "task-container");
          taskContainerWrapper.appendChild(taskContainer);

          taskContainer.innerHTML += 
          `<div class="task-list">
            <h1>${groupedTasks[category][date][key].taskName}</h1>
            <h3>${groupedTasks[category][date][key].taskPriority}</h3>
          </div>
          <div class="task-icons">
            <img src="../todo-list/assets/icons/edit-task-icon.svg" id="edit-task-icon" alt="Edit Task">
            <img src="../todo-list/assets/icons/delete-task-icon.svg" id="delete-task-icon" alt="Delete Task">
          </div>
          `
        }
      });
    });
  } else {
    // Display that there are no tasks 
    let noTasksContainer = document.createElement("div");
    noTasksContainer.setAttribute("id", "no-tasks-container");

    noTasksContainer.innerHTML = `<h1>No tasks available. </h1>`;
    document.getElementById("mainpage-date").appendChild(noTasksContainer);
  }
})