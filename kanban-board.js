// Mini Kanban Board – IPI Student Fun Zone

const STORAGE_KEY = "kanbanBoardTasks";

// liste kolona
const lists = {
  todo: document.getElementById("todoList"),
  inprogress: document.getElementById("inprogressList"),
  done: document.getElementById("doneList"),
};

// toolbar btn
const addTaskBtn = document.getElementById("addTaskBtn");
const savePngBtn = document.getElementById("savePngBtn");
const clearBoardBtn = document.getElementById("clearBoardBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");

// add task modal
const taskModal = document.getElementById("taskModal");
const taskModalClose = document.getElementById("taskModalClose");
const taskText = document.getElementById("taskText");
const taskStatus = document.getElementById("taskStatus");
const taskCreateBtn = document.getElementById("taskCreateBtn");
const taskCancelBtn = document.getElementById("taskCancelBtn");
const taskError = document.getElementById("taskError");

// clear modal
const clearModal = document.getElementById("clearModal");
const clearYesBtn = document.getElementById("clearYesBtn");
const clearNoBtn = document.getElementById("clearNoBtn");

// stanje taskova
let tasks = [];

// --------- Helpers ----------
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function createTaskElement(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.textContent = task.text;
  div.draggable = true;
  div.dataset.id = task.id;

  div.addEventListener("dragstart", () => {
    div.classList.add("dragging");
  });

  div.addEventListener("dragend", () => {
    div.classList.remove("dragging");
  });

  return div;
}

function renderBoard() {
  Object.values(lists).forEach((l) => (l.innerHTML = ""));

  tasks.forEach((task) => {
    const el = createTaskElement(task);
    lists[task.status].appendChild(el);
  });
}

// --------- Drag & Drop ----------
document.querySelectorAll(".column").forEach((col) => {
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  col.addEventListener("drop", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".task.dragging");
    if (!dragging) return;

    const id = dragging.dataset.id;
    const newStatus = col.dataset.status;

    tasks = tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));

    saveToStorage();
    renderBoard();
  });
});

// --------- Add Task Modal ----------
function openTaskModal() {
  taskModal.classList.add("visible");
  taskText.value = "";
  taskError.style.display = "none";
  taskText.style.borderColor = "#d1d5db";
  taskText.focus();
}

function closeTaskModal() {
  taskModal.classList.remove("visible");
}

addTaskBtn.addEventListener("click", openTaskModal);
taskModalClose.addEventListener("click", closeTaskModal);
taskCancelBtn.addEventListener("click", closeTaskModal);

taskCreateBtn.addEventListener("click", () => {
  const text = taskText.value.trim();
  if (!text) {
    taskError.style.display = "block";
    taskText.style.borderColor = "#dc2626";
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    text,
    status: taskStatus.value,
  };

  tasks.push(newTask);
  saveToStorage();
  renderBoard();
  closeTaskModal();
});

// --------- Clear Board ----------
function openClearModal() {
  clearModal.classList.add("visible");
}
function closeClearModal() {
  clearModal.classList.remove("visible");
}

clearBoardBtn.addEventListener("click", openClearModal);
clearNoBtn.addEventListener("click", closeClearModal);

clearYesBtn.addEventListener("click", () => {
  tasks = [];
  saveToStorage();
  renderBoard();
  closeClearModal();
});

// --------- Save as PNG ----------
savePngBtn.addEventListener("click", async () => {
  const area = document.getElementById("kanbanPrintArea");

  const canvas = await html2canvas(area, { backgroundColor: "#ffffff" });
  const image = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = image;
  link.download = "kanban-board.png";
  link.click();
});

// --------- Save as PDF ----------
exportPdfBtn.addEventListener("click", () => {
  window.print();
});

// --------- Init ----------
tasks = loadFromStorage();
renderBoard();
