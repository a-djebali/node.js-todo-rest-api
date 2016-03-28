var express = require('express');
var bodyParser = require('body-parser');

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
  var matchedtodo;

  todos.forEach( function(todo) {
    
    if(todoId == todo.id)
      matchedtodo=todo
  });

  if(matchedtodo){
    res.send('Todo description is ' + matchedtodo.description);
  }else{
    res.status(404).send();
  } 
}); 

// POST /todos
app.post('/todos', function (req, res) {
  var body = req.body;
  body.id = todoNextId++;
  todos.push(body); 
  res.json(body);
});




app.use(express.static(__dirname+'/public'));

app.listen(PORT, function () {
   console.log('Here we go! http://localhost:3000');
});
