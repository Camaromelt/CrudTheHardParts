//  variables
const noteList = document.querySelector('#notes');
const edit = document.querySelector('#edit');
const form = document.querySelector('#todo_add');
const inputBox = document.querySelector('#todo');
const base = 'http://localhost:3000/todo';
// Getting Todos
const getTodos = () => {
  fetch(base)
    .then(res => res.json())
    .then((todos) => {
      noteList.innerHTML = todos.map(todo => `<li>${todo.todo}<button class='delete' data-id=${todo._id}>Delete</button><button class='edit' data-id=${todo._id}>Edit</button></li>`).join('');
    })
    .catch(err => console.log('You broke it 💩', err));
};
// Deleting Todos
function deleteTodo(id) {
  fetch(`${base}/${id}`, {
    method: 'delete'
  })
    .then(res => res.json())
    .then(() => getTodos());
}
function triggerDelete(e) {
  const item = e.target;
  if (!item.matches('.delete')) return;
  deleteTodo(e.target.dataset.id);
}
// Adds Edit Form at bottom opf Page
function addInput(id) {
  edit.innerHTML = `<input class='editItem' type='text'/><button class='save' data-id=${id} >Save Update</button>`;
}
//  Button Click of Edit Button
function triggerEdit(e) {
  const item = e.target;
  if (!item.matches('.edit')) return;
  addInput(item.dataset.id);
}
// Updating a todo
function updateTodo(id, todo) {
  fetch(`${base}/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ todo })
  })
    .then(res => res.json())
    .then(() => {
      getTodos();
      edit.innerHTML = '';
    })

    .catch(err => console.log(err));
}
function saveEdit(e) {
  const item = e.target;
  if (!item.matches('.save')) return;
  updateTodo(item.dataset.id, item.previousElementSibling.value);
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
    .then(() => getTodos())
    .catch(err => console.log(err));
};
// Listener for a save click
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
});
document.addEventListener('DOMContentLoaded', () => {
  getTodos();
});
