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
  var query = req.query; //queryParams in case you wanna use todos array
  var where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false;
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: '%' + query.q + '%'
    };
  }

  db.todo.findAll({
    where: where
  }).then(function(todos) {
    if (!!todos) {
      res.json(todos);
    } else {
      res.status(404).send(); //Not found  
    }
  }).catch(function(error) {
    res.status(500).send();
  });
});

// Get a todo by id : // GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.findById(todoId).then(function(todo) {
    if (!!todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).send(); //Not found  
    }
  }, function(error) {
    res.status(500).send(); //Something went wrong in the server  
  });
});

// POST /todos
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
  }, function(error) {
    res.status(400).json(error);
  });
});


// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var where = {
    id: todoId
  };
  db.todo.destroy({
    where: where
  }).then(function(rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: "No todo with " + todoId + ""
      });
    } else {
      res.status(204).send(); //Everything went well, but nothing to send back :) 
    }
  }).catch(function(error) {
    res.status(500).send();
  });
});

// PUT /todos/:id 
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description.trim();
  }

  db.todo.findById(todoId).then(function(todo) {

    if (todo) {
      todo.update(attributes).then(function(todo) {
        /* Success update... */
        res.json(todo.toJSON());
      }, function(error) {
        /* Update failed... */
        res.status(400).json(error);
      });
    } else {
      res.status(404).send();
    }
  }, function() {
    /* if find by id failed... */
    res.satatus(500).send();
  });
});

//POST /users 
app.post('/users', function (req, res) {
  var body = _.pick(req.body, 'email', 'password');

  db.user.create(body).then(function (user) {
    res.json(user.toJSON());
  }, function (error) {
     res.status(400).json(error); //bad request
  });
});

//GET /users/:id
app.get('/users/:id', function (req, res) {
  var userId = parseInt(req.params.id, 10);
  db.user.findById(userId).then(function (user) {
    if(!!user){
      res.json(user.toJSON());
    }else{
      res.status(404).send();
    }
  }, function (error) {
     res.status(500).json(error); //error in the server side 
  });
});
//GET /users
/*app.get('/users', function () {
  var userId = parseInt(req.params.id, 10);
});*/
//DELETE /users/:id
//PUT /users/:id


db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Here we go! http://localhost:3000');
  });
});