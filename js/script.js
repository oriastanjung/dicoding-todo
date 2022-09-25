const todos = [];
const RENDER_EVENT = "render-todo"



function generateId(){
    return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted){
    return {
        id,
        task,
        timestamp,
        isCompleted
      }
}


function makeTodo(todoObject){
    const textTitle = document.createElement('h2')
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
}




document.addEventListener(RENDER_EVENT, function(){
    console.log(todos)
})


document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo();
  });
});
