const express = require ('express');
const app = express();
var cors = require('cors');
var con = require('./db')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', function(req, res){
    con.query("SELECT * FROM top_news;", function (err, result, fields) {
        if (err) throw err;
        //console.log(JSON.stringify(result));
        res.status(200).json(result);
    });
    res.status(200);
    console.log("acces à TopNewsSlides !")
   // res.set('Content-Type', 'text/html; charset=utf-8');
   // res.send("<h1>Hello from Jalil APP</h1>")
})

module.exports = app;