var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
app.get('/about', function (req, res) {
  res.send('Hello Ahmed in about page');
});

app.use(express.static(__dirname+'/public'));

app.listen(PORT, function () {
   console.log('Here we go! http://localhost:3000');
});
