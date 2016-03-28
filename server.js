var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos =[{
  id: 1,
  description: 'Meet mom for lunch',
  completed: false
}, {
  id: 2,
  description: 'Go to market',
  completed: false
},{
  id: 3,
  description: 'Finish your last project',
  completed: false
},];

app.get('/about', function (req, res) {
  res.send('Hello Ahmed in about page');
});

// Get all todos
app.get('/todos', function (req, res) {
  //Convert todos list to json format, then send it back to the caller 
  res.json(todos);
});

// Get todo by id 
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




app.use(express.static(__dirname+'/public'));

app.listen(PORT, function () {
   console.log('Here we go! http://localhost:3000');
});
