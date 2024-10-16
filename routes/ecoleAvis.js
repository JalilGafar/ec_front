const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');


////////////***** Vue d'ensemble des écoles avec le nombre d'avis et la note moyenne par école***** */

router.get('/', (req, res, next) => {
    con.query(SQL 
        `SELECT id_ecol, sigle_e, nom_e, logo_e, round(AVG(note), 1) AS notes_moy, count(*) AS occurence
        FROM
            (SELECT * 
                FROM 
                    ecoles
                    join
                        avis
                        on (ecoles.id_ecol = avis.id_ecole)
                        )avisEcole
        group by id_ecol, sigle_e, nom_e, logo_e;`, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    });
    res.status(200);
    }
);

router.get('/notes', (req, res, next) => {
    var idSchool = req.query.idSchool;
    con.query(SQL 
        `SELECT id_ecol, sigle_e, nom_e, logo_e, round(AVG(note), 1) AS notes_moy, count(*) AS occurence
        FROM
            (SELECT * 
                FROM 
                    ecoles
                    join
                        avis
                        on (ecoles.id_ecol = avis.id_ecole)
                        where (id_ecol = ${idSchool})
                        )avisEcole
        group by id_ecol, sigle_e, nom_e, logo_e;`, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
        console.log(result)
    });
    res.status(200);
    }
);


router.get('/school', (req, res, next) => {
    var idSchool = req.query.idSchool; 
    con.query(`SELECT * FROM ecolecamerdb.avis where (id_ecole = ${idSchool})`, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    });
    res.status(200);
    }
);

module.exports = router;