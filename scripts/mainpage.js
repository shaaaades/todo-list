function addTask() {
  let task = document.getElementById("add-task");
  task.addEventListener("click", function() {
    console.log("Clicked")
    let addTaskModal = document.getElementById("add-task-modal");
    if (addTaskModal.style.display === "none") {
      addTaskModal.style.display = "block";
    } 
    else {
      addTaskModal.style.display = "none";
    }
  })
}

export default addTask();