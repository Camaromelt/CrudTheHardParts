// variables 
const noteList = document.querySelector('#notes');
const edit = document.querySelector('#edit');
const form = document.querySelector('#todo_add');
const inputBox = document.querySelector('#todo');
const base = 'http://localhost:3000/todo';
////helper functions////
function triggerDelete(e){
  let item = e.target;
  if(!item.matches('.delete')) return;
   let id = e.target.dataset.id;
   deleteTodo(id);
  }
  //Button Click of Edit Button
  function triggerEdit(e){
    let item = e.target;
    if(!item.matches('.edit')) return;
    let id = e.target.dataset.id;
    addInput(id);
    
  }
  function saveEdit(e){
    let item = e.target;
    if(!item.matches('.save')) return;
    let id = e.target.dataset.id;
    let todo = item.previousElementSibling.value;
    updateTodo(id, todo);
  }
  //Adds Edit Form at bottom opf Page
  function addInput(id){
    edit.innerHTML = `<input class="editItem" type="text"/><button class="save" data-id=${id} >Save Update</button>`;
  }
  // adding item
const addTodo = (todo) => {
  fetch(base, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ todo })
  })
  .then(res => res.json())
  .then(result => {
    console.log(result);
    getTodos();
  })
  .catch(err => console.log(err));
}
// Getting Todos
const getTodos = () => {
  fetch(base)
  .then(res => res.json())
  .then(todos => {
    console.log(todos);
    noteList.innerHTML = todos.map(todo => `<li>${todo.todo}<button class="delete" data-id=${todo._id}>Delete</button><button class="edit" data-id=${todo._id}>Edit</button></li>`).join('');
  })
  .catch(err => console.log('You broke it 💩'));
}
// Deleting Todos
function deleteTodo(id){
  fetch(base + '/'+ id, {
    method: 'delete'
  })
  .then(res => res.json())
  .then(status =>
    {
      getTodos();
    })
  }
  //Updating a todo
  function updateTodo(id, todo){
    fetch(base + '/' + id, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ todo })
    }).then(res => res.json()).then(result => {
      console.log(result);
      getTodos();
      edit.innerHTML = '';
    })

    .catch(err => console.log(err));
  }
  //Listener for a save click
edit.addEventListener('click', (e) => {
  saveEdit(e);
});
noteList.addEventListener('click', (e) => {
  triggerDelete(e);
  triggerEdit(e);
});
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(inputBox.value);
  form.reset();
})
document.addEventListener('DOMContentLoaded', () => {
  getTodos();
});


