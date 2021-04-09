var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage })
var fs = require('fs');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '98089808',
    database: 'testdb'
});
conn.connect();
var app = express();
app.use(express.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views', './views_mysql');
app.set('view engine', 'jade');
// upload?

// need to work on
app.get(['/topic', '/topic:id'], function(req, res){
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, function(err, topics, fields){
      res.render('view', {topics:topics})
  })
});


// got it
app.post('/topic', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, function(err){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.redirect('/topic/'+title);
    });
  })
  app.listen(3000, function(){
    console.log('Connected, 3000 port!');
  })