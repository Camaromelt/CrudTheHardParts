const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Todo = require('./models/todo');

const url = 'mongodb://ben:test1234@ds019826.mlab.com:19826/junior-assessment';

// app config
const app = express();
const PORT = 3000;
app.use('/public', express.static(path.join(__dirname, 'public')));

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// db connection
mongoose.connect(url, () => {
  console.log('You are connected to the DB...');
});

// home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// add todo
app.post('/todo', (req, res) => {
  const newTodo = req.body;
  Todo.create(newTodo, (err, newlyCreated) => {
    if (err) {
      console.log(err, '<--- error from add todo');
      res.status(500).json(err);
    } else {
      res.json(newlyCreated);
    }
  });
});

// get all todos
app.get('/todo', (req, res) => {
  Todo.find({}, (err, allTodos) => {
    if (err) res.status(500).json(err);
    res.json(allTodos);
  });
});

// delete a todo
app.delete('/todo/:id', (req, res) => {
  const deleted = { _id: req.params.id };
  Todo.findByIdAndRemove(deleted, (err, response) => {
    if (err) res.status(500).json(err);
    res.json(response);
  });
});

// update one todo

app.patch('/todo/:id', (req, res) => {
  const update = {
    todo: req.body.todo,
    date: Date.now(),
  };

  Todo.findByIdAndUpdate({ _id: req.params.id }, update, (err, response) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(response);
    }
  });
});

app.listen(PORT, () => console.log(`I am running on ${PORT} ........💩`));
