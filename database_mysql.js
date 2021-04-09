var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '98089808',
    database: 'testdb'
});
conn.connect();

var sql = 'SELECT * FROM topic';
conn.query(sql, function(err, rows, fields) {
    if(err) {
        console.log(err);
    } else {
       for(var i=0; i<rows.length; i++) {
           console.log(rows[i].title);
       }
    }
})
