const todos = [];


const RENDER_EVENT = "render-todo";
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';


function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}


function saveData(){
  if(isStorageExist()){
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}


function loadDataFromStorage(){
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if(data !== null){
    for(const todo of data){
      todos.push(todo)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}



function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

function findTodo(todoId) {
  for(const item of todos){
    if(item.id === todoId){
      return item
    }
  }
  return null;  
}

function findTodoIndex(todoId){
  for (const index in todos){
    // console.log(index)
    if(todos[index].id === todoId){
      return index;
    }
  }

  return -1
}


function addTaskToCompleted(todoId){
  const todoTarget = findTodo(todoId);
  
  if (todoTarget == null) return;
  
  // console.log(todoTarget);
  todoTarget.isCompleted = true;

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData();
}


function removeTaskFromCompleted(todoId){
  const todoTarget = findTodoIndex(todoId)
  if (todoTarget === -1) return;

  todos.splice(todoTarget,1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

}

function undoTaskFromCompleted(todoId /* HTMLELement */) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData()
}


function makeTodo(todoObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  
  return container;
}

function addTodo() {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    timestamp,
    false
  );
  todos.push(todoObject);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}



document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos)

  const unDoneTodos = document.getElementById("todos");
  const finishedTodos = document.getElementById("completed-todos");

  unDoneTodos.innerHTML = '';
  finishedTodos.innerHTML ='';

  todos.map((item) => {
    const todoItem = makeTodo(item);

    if(!item.isCompleted){
      unDoneTodos.append(todoItem);
    }else{
      finishedTodos.append(todoItem)
    }
  })

  // for (const item of todos) {
  //   const todoItem = makeTodo(item);


    
  // }
});


document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
  // alert("data disimpan")
});