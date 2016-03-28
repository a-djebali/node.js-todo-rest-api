var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//Anytime a json request comes in express will parse it, so we can access it 
app.use(bodyParser.json());

// Get all todos : // GET /todos
app.get('/todos', function (req, res) {
  //Convert todos list to json format, then send it back to the caller 
  res.json(todos);
});

// Get a todo by id : // GET /todos/:id
app.get('/todos/:id', function (req, res) { 
  var todoId = parseInt(req.params.id, 10);
  var matchedtodo = _.findWhere(todos, {id: todoId});
  (matchedtodo)? res.send(matchedtodo.description) : res.status(404).send() ;
}); 

// POST /todos
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed'); 

  //In case of bad request
  if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    res.status(400).send();
  }else{
    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body); 
    res.json(body);
  }
});




app.use(express.static(__dirname+'/public'));

app.listen(PORT, function () {
   console.log('Here we go! http://localhost:3000');
});
