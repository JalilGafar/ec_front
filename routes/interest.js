const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

//** Vue des Ecoles depuis Admin */
router.get('/', (req, res, next) => {
    var page = req.query.Page;
    con.query(SQL
        `CALL interest_procedure (${page});`, 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Chargement des interests');
            res.status(200).json(result[0]);
           // console.log(result);
            return;
        }
    );
});

module.exports = router;