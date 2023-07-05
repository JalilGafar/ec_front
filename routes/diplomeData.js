const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

//** Obtenir toutes les info d'ue diplome **/
router.get('/', (req, res, next) => {
    var diplome = req.query.diplome;
    //console.log(school)
    con.query(SQL
        `CALL diplomeData_procedure (${diplome});`, 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Chargement des DiplomelDATA');
            res.status(200).json(result[0]);
            //console.log(result[0]);
            return;
        }
    );
});

module.exports = router;