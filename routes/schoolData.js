const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

//** Obtenir toutes les info d'une école **/
router.get('/', (req, res, next) => {
    var school = req.query.school;
    console.log(school)
    con.query(SQL
        `CALL shoolData_procedure (${school});`, 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Chargement des SchoolDATA');
            res.status(200).json(result[0]);
            console.log(result[0]);
            return;
        }
    );
});

module.exports = router;