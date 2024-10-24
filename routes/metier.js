const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');


router.get('/list', (req, res, next) => {
    con.query(SQL
        `select id_metier, titre
        from(SELECT id_metier, titre FROM ecolecamerdb.metier) AA order by rand()
        limit 10`, 
        function (err, result, fields) {
        if (err) throw err;
        //console.log(JSON.stringify(result));
        res.status(200).json(result);
    });
    res.status(200);
    //console.log("acces à TopNewsSlides !")
    }
);

router.get('/longlist', (req, res, next) => {
    con.query(SQL
        `select id_metier, titre
        from(SELECT id_metier, titre FROM ecolecamerdb.metier) AA order by rand()`, 
        function (err, result, fields) {
        if (err) throw err;
        //console.log(JSON.stringify(result));
        res.status(200).json(result);
    });
    res.status(200);
    //console.log("acces à TopNewsSlides !")
    }
);

// Lire un Metier pour une ID 

router.get('/', (req, res, next) => {
    var idMetier = req.query.idMetier; 
    con.query(SQL
        `SELECT * FROM metier
        WHERE (id_metier = ${idMetier} )`, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    });
    res.status(200);
    }
);

module.exports = router;