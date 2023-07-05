const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

router.get('/', (req, res, next) => {
        var degree = req.query.Degree;
        if (degree === 'BTS') {
            con.query(SQL
                `SELECT * FROM ecolecamerdb.diplomes AS t1 
                    JOIN (SELECT id_dip FROM ecolecamerdb.diplomes where (categorie_id = 5) ORDER BY RAND() LIMIT 9) as t2 
                    ON t1.id_dip=t2.id_dip;`
                , function (err, result, fields) {
                if (err) throw err;
                //console.log(JSON.stringify(result));
                res.status(200).json(result);
            });
            res.status(200);
        } else if (degree === 'Licence') {
            con.query(SQL
                `SELECT * FROM ecolecamerdb.diplomes AS t1 
                    JOIN (SELECT id_dip FROM ecolecamerdb.diplomes where (categorie_id = 17 OR categorie_id = 18 ) ORDER BY RAND() LIMIT 9) as t2 
                    ON t1.id_dip=t2.id_dip;`
                , function (err, result, fields) {
                if (err) throw err;
                //console.log(JSON.stringify(result));
                res.status(200).json(result);
            });
            res.status(200);
        }
        
    }
);

module.exports = router;