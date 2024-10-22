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


// **** Requette qui pour une école permet de donnet la note moyenne et le nombre d'avis sur cette école
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
    con.query(`SELECT * FROM avis where (id_ecole = ${idSchool})`, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    });
    res.status(200);
    }
);

//*** Requette pour voir les différents campus d'une école durant la redaction d'un avis */
router.get('/campus', (req, res, next) => {
    var idSchool = req.query.idSchool; 
    con.query(SQL
        `
        select id_camp, id_ecol, nom_e, sigle_e, nom_camp, ville_cam
        from
            campus
            join
            (select id_ecol, nom_e, sigle_e, campus_id, ecole_id 
            from 
                ecoles
                join 
                    campus_ecoles
                    on (ecoles.id_ecol = campus_ecoles.ecole_id)
                where (ecoles.id_ecol = ${idSchool})
                ) AA
                on (campus.id_camp = AA.campus_id)
        `, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    });
    res.status(200);
    }
);

// ****** Requette pour visualiser toutes les formation qu'offre une école ****//
router.get('/cursus', (req, res, next) => {
    var idSchool = req.query.idSchool; 
    con.query(SQL
        `select id_dip, nom_dip
            from
            diplomes
            join
            (select *
            from 
                formations
                join 
                    ecoles
                    on (formations.ecole_f_id = ecoles.id_ecol)
                where (ecoles.id_ecol = ${idSchool})
                ) AA
                on (diplomes.id_dip = AA.diplom_id)
        `, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    });
    res.status(200);
    }
);

//** Pour voir le diplome d'un avis précis *****/
router.get('/diplo', (req, res, next) => {
    var idDip = req.query.idDip; 
    con.query(SQL
        `select id_dip, nom_dip
        from diplomes
        where (id_dip = ${idDip})                                                                                
        `, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
        console.log(result);
    });
    res.status(200);
    }
);

module.exports = router;