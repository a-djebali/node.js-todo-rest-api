var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//Anytime a json request comes in express will parse it, so we can access it 
app.use(bodyParser.json());

// Advanced search : // GET /todos?completed=true&q=expression
app.get('/todos', function(req, res) {
  var queryParams = req.query;
  var filteredTodos = todos;

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.filter(filteredTodos, function(todo) {
      if (todo.completed == true) {
        return todo;
      }
    });
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.filter(filteredTodos, function(todo) {
      if (todo.completed == false) {
        return todo;
      }
    });
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, function(todo) {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    });
  }
  res.json(filteredTodos);
});

// Get a todo by id : // GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.findById(todoId).then(function(todo) {
    if(!!todo){
      res.json(todo.toJSON());
    }else{
      res.status(404).send(); //Not found  
    }
  }, function(error) {
    res.status(500).send(); //Something went wrong in the server  
  });

  /*Use todos array in case you don't use database
  var matchedtodo = _.findWhere(todos, {
    id: todoId
  });
  (matchedtodo) ? res.send(matchedtodo.description): res.status(404).send();*/
});

// POST /todos
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
  }, function(error) {
    res.status(404).json(error);
  });


  /*Use todos array in case you don't use database
  //Handle bad requests
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    res.status(400).send();
  } else {
    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
  }*/
});


// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  /*Use todos array in case you don't use database
  var matchedtodo = _.findWhere(todos, {
    id: todoId
  });
  if (!matchedtodo) {
    res.status(404).json({
      "error": "no todo found with that id"
    });
  } else {
    todos = _.without(todos, matchedtodo);
    res.json(matchedtodo);
  }*/
});

// PUT /todos/:id 
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedtodo = _.findWhere(todos, {
    id: todoId
  });
  var body = _.pick(req.body, 'description', 'completed');

  //Store values that will be updated on the item
  var validAttributes = {};

  if (!matchedtodo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description.trim();
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(matchedtodo, validAttributes);
  res.json(matchedtodo);

});


db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Here we go! http://localhost:3000');
  });
  //So now CRUD actions can be started : GET, POST, PUT, DELETE 
});
//app.use(express.static(__dirname + '/public'));