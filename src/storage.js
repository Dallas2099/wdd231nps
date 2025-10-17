const USER_KEY = "todo-user";
const TASKS_KEY = "todo-tasks";

let tasks = [];

function taskTemplate(task) {
  return `
    <li ${task.completed ? 'class="strike"' : ""}>
      <p>${task.detail}</p>
      <div>
        <span data-action="delete">❎</span>
        <span data-action="complete">✅</span>
      </div>
    </li>`;
}

function renderTasks(taskList) {
  const listElement = document.querySelector("#todoList");
  if (!listElement) return;
  const html = taskList.map(taskTemplate).join("");
  listElement.innerHTML = html;
}

function renderUser(name = "") {
  const userElement = document.querySelector(".user");
  if (!userElement) return;
  userElement.textContent = name || "[user name here]";
}

function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(key) {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) return null;
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Unable to parse localStorage value for ${key}`, error);
    return null;
  }
}

function addTask(taskDetail) {
  tasks.push({ detail: taskDetail, completed: false });
  setLocalStorage(TASKS_KEY, tasks);
  renderTasks(tasks);
}

function newTask() {
  const todoInput = document.querySelector("#todo");
  if (!todoInput) return;
  const task = todoInput.value.trim();
  if (!task) return;
  addTask(task);
  todoInput.value = "";
  todoInput.focus();
}

function removeTask(taskElement) {
  const detail = taskElement.querySelector("p")?.innerText;
  tasks = tasks.filter((task) => task.detail !== detail);
  setLocalStorage(TASKS_KEY, tasks);
  taskElement.remove();
}

function completeTask(taskElement) {
  const detail = taskElement.querySelector("p")?.innerText;
  const taskIndex = tasks.findIndex((task) => task.detail === detail);
  if (taskIndex === -1) return;
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  setLocalStorage(TASKS_KEY, tasks);
  taskElement.classList.toggle("strike");
}

function manageTasks(e) {
  const parent = e.target.closest("li");
  if (!parent || !e.target.dataset.action) return;
  if (e.target.dataset.action === "delete") {
    removeTask(parent);
  }
  if (e.target.dataset.action === "complete") {
    completeTask(parent);
  }
}

function handleUserSave() {
  const input = document.querySelector("#userName");
  if (!input) return;
  const name = input.value.trim();
  if (!name) return;
  localStorage.setItem(USER_KEY, name);
  renderUser(name);
  input.value = "";
}

function setUser() {
  const storedName = localStorage.getItem(USER_KEY);
  if (storedName) {
    renderUser(storedName);
  } else {
    renderUser();
  }
}

function init() {
  document
    .querySelector("#submitTask")
    ?.addEventListener("click", newTask);
  document
    .querySelector("#todoList")
    ?.addEventListener("click", manageTasks);
  document
    .querySelector("#setUserButton")
    ?.addEventListener("click", handleUserSave);

  setUser();

  const storedTasks = getLocalStorage(TASKS_KEY);
  if (Array.isArray(storedTasks)) {
    tasks = storedTasks;
  }
  renderTasks(tasks);
}

document.addEventListener("DOMContentLoaded", init);
