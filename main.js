// Create the initial state object
let state = {
  tasks: []
};

// Select the new task button
const btn = document.querySelector('.new-task-btn');

// Select the download button
const downloadBtn = document.querySelector('.dwnld-btn');

// Add a click event listener to the button with class 'plain-txt'
const plaintextBtn = document.querySelector('.plain-txt');
plaintextBtn.addEventListener('click', downloadPlaintext);

downloadBtn.addEventListener('click', downloadState);

function downloadState() {
  const filename = 'to-do.json';
  const data = JSON.stringify(state);

  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Select the upload button
const uploadBtn = document.querySelector('.upld-btn');

uploadBtn.addEventListener('click', uploadState);

function uploadState() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const parsedState = JSON.parse(content);

      if (parsedState && typeof parsedState === 'object') {
        state = parsedState;
        ulEl.innerHTML = ''; // Clear the existing tasks
        state.tasks.forEach(renderTask);
        saveState(); // Save the updated state to local storage
      } else {
        console.log('Invalid file format');
      }
    };

    reader.readAsText(file);
  });

  input.click();
}

function downloadPlaintext() {
  // Filter out objects with style 'line-through'
  const filteredTasks = state.tasks.filter(item => item.isCompleted !== true);

  // Convert filtered JSON state to plain text
  const plainText = filteredTasks.map(item => item.text).join('\n');

  // Create a new Blob object with the plain text
  const blob = new Blob([plainText], { type: 'text/plain' });

  // Create a temporary anchor element
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);

  // Set the filename for the download
  anchor.download = 'to-do.txt';

  // Programmatically trigger the download
  anchor.click();

  // Clean up the temporary anchor element
  URL.revokeObjectURL(anchor.href);
}


// Cached elements
const inputEl = document.querySelector('input');
const ulEl = document.querySelector('ul');
const body = document.querySelector('body');

// Load the state from local storage
const savedState = localStorage.getItem('taskState');
if (savedState) {
  state = JSON.parse(savedState);
  // Render the tasks from state
  state.tasks.forEach(renderTask);
}

btn.addEventListener('click', addTask);

function addTask() {
  if (inputEl.value === '') {
    return;
  }

  const newTask = {
    text: inputEl.value,
    isCompleted: false
  };

  state.tasks.push(newTask);
  renderTask(newTask);
  inputEl.value = '';

  // Save the updated state to local storage
  saveState();
}

function deleteTask(evt) {
  const listItem = evt.target.parentElement;
  const index = Array.from(ulEl.children).indexOf(listItem);
  state.tasks.splice(index, 1);
  ulEl.removeChild(listItem);

  // Save the updated state to local storage
  saveState();
}

function strikeTask(evt) {
  const listItem = evt.target.parentElement;
  const index = Array.from(ulEl.children).indexOf(listItem);
  const task = state.tasks[index];

  if (task.isCompleted) {
    listItem.style.textDecoration = 'none';
    task.isCompleted = false;
  } else {
    listItem.style.textDecoration = 'line-through';
    task.isCompleted = true;
  }

  // Save the updated state to local storage
  saveState();
}

function renderTask(task) {
  const newTaskEl = document.createElement('li');
  newTaskEl.innerText = task.text;

  if (task.isCompleted) {
    newTaskEl.style.textDecoration = 'line-through';
  }

  const strikeButton = document.createElement('button');
  strikeButton.className = 'strikebtn'
  strikeButton.innerText = 'Strike';
  strikeButton.addEventListener('click', strikeTask);
  newTaskEl.appendChild(strikeButton);

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.className = 'delbtn'
  deleteButton.addEventListener('click', deleteTask);
  newTaskEl.appendChild(deleteButton);

  ulEl.appendChild(newTaskEl);
}

function saveState() {
  localStorage.setItem('taskState', JSON.stringify(state));
}

// Listen to the body for the Enter key, for a new to-do
body.addEventListener('keydown', function (evt) {
  if (evt.code === 'Enter') {
    addTask();
  }
});
