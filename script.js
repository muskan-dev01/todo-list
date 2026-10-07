const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const clearBtn = document.getElementById("clearBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";


// SAVE TASKS
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


// DISPLAY TASKS
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });


    // EMPTY MESSAGE
    if (filteredTasks.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";

        if (tasks.length === 0) {
            message.textContent =
                "No tasks yet — add something to get started ✨";
        } else if (currentFilter === "active") {
            message.textContent = "No active tasks ✨";
        } else if (currentFilter === "completed") {
            message.textContent = "No completed tasks yet ✨";
        }

        taskList.appendChild(message);
    }


    // CREATE TASKS
    filteredTasks.forEach(task => {

    const originalIndex = tasks.indexOf(task);

    const li = document.createElement("li");

    if (task.completed) {
        li.classList.add("completed");
    }


    const taskText = document.createElement("span");

    taskText.className = "task-text";
    taskText.textContent = task.text;


    const actions = document.createElement("div");

    actions.className = "task-actions";


    // EDIT BUTTON
    const editBtn = document.createElement("button");

    editBtn.className = "edit-btn";
    editBtn.title = "Edit Task";
    editBtn.textContent = "✎";


    editBtn.addEventListener("click", () => {

        const newText = prompt("Edit your task:", task.text);

        if (newText !== null && newText.trim() !== "") {

            tasks[originalIndex].text = newText.trim();

            saveTasks();
            displayTasks();
        }
    });


    // COMPLETE BUTTON
    const completeBtn = document.createElement("button");

    completeBtn.className = "complete-btn";
    completeBtn.title = "Complete Task";
    completeBtn.textContent = "✓";


    // DELETE BUTTON
    const deleteBtn = document.createElement("button");

    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Delete Task";
    deleteBtn.textContent = "✕";


    // COMPLETE
    completeBtn.addEventListener("click", () => {

        tasks[originalIndex].completed =
            !tasks[originalIndex].completed;

        saveTasks();
        displayTasks();
    });


    // DELETE
    deleteBtn.addEventListener("click", () => {

        tasks.splice(originalIndex, 1);

        saveTasks();
        displayTasks();
    });


    // ADD BUTTONS TO TASK
    actions.appendChild(editBtn);
    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);


    li.appendChild(taskText);
    li.appendChild(actions);

    taskList.appendChild(li);

});

    updateCounter();
}

// ADD TASK
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }


    tasks.push({
        text: text,
        completed: false
    });


    saveTasks();

    taskInput.value = "";

    taskInput.focus();

    displayTasks();
}


// TASK COUNTER
function updateCounter() {

    const remainingTasks =
        tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        remainingTasks === 1
            ? "1 task remaining"
            : `${remainingTasks} tasks remaining`;
}


// ADD BUTTON
addBtn.addEventListener("click", addTask);


// ENTER KEY
taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }

});


// FILTER BUTTONS
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();
    });

});


// CLEAR ALL
clearBtn.addEventListener("click", () => {

    if (tasks.length === 0) {
        return;
    }

    const confirmation =
        confirm("Are you sure you want to delete all tasks?");

    if (confirmation) {

        tasks = [];

        saveTasks();

        displayTasks();
    }
});


// LOAD SAVED TASKS
displayTasks();