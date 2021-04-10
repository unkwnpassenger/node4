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


// add => add.jade
app.get('/topic/add', function(req, res){
    // id, title 값 가져와서 add.jade에 topics parameter
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('add', {topics:topics});
    });
  });

// /topic/add => add a new file by using post method from the form by user
app.post('/topic/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
    conn.query(sql, [title, description, author], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/topic/'+result.insertId);
      }
    });
  })

// /topic/id/edit => db에서 기존 data가져와서 뿌려줌
app.get('/topic/:id/edit', function(req, res){
  var sql = 'SELECT id,title FROM topic';
  // 전체 data select
  conn.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if(id) {
      var sql = 'SELECT * FROM topic WHERE id=?';
      // 해당 data만 select
      conn.query(sql, [id], function(err, topic, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('edit', {topics:topics, topic:topic[0]});
        }
      });
    } else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
});

// /topic/:id/edit => post로 data받아와서 update
app.post(['/topic/:id/edit'], function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
  conn.query(sql, [title, description, author, id], function(err, result, fields){
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/'+id);
    }
  })
});

// delete 기능 구현
app.get('/topic/:id/delete', function(req, res){
  var sql = 'SELECT id,title FROM topic';
  var id = req.params.id;
  conn.query(sql, function(err, topics, fields){
    var sql = 'SELECT * FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, topic){
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        if(topic.length == 0) {
          console.log('There is no record.');
          res.status(500).send('Internal Server Error');
        } else {
          res.render('delete', {topics:topics, topic:topic[0]});
        }
      }
    })
  })
});

// delete => post
app.post(['/topic/:id/delete'], function(req, res){
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE id=?';
  conn.query(sql, [id], function(err, result) {
    res.redirect('/topic/');
  })
});

// /topic => db에서 data가져와서 뿌려줌 : startPoint[1] => db는 id값으로 저장
app.get(['/topic', '/topic/:id'], function(req, res){
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, function(err, topics, fields){
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('view', {topics:topics, topic:topic[0]});
          }
        });
      } else {
        res.render('view', {topics:topics});
      }
    });
  });

app.listen(3000, function(){
console.log('Connected, 3000 port!');
});