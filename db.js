var mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Orange2023@BROWN",
    database: 'ecolecamerdb',
    multipleStatements: true
});
  
  
con.connect(function(err) {
	if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    };
});

module.exports = con;