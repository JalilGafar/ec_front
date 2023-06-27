const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');


/**Ajout d'une nouvelle Ecole */
router.post('/', (req, res, next) => {
    var etsForm = req.body;
    console.log(etsForm);
    con.query(SQL
                `INSERT INTO enregistrements
                (nom_regis, prenom_regis, ets_regis, ville_regis, comment_regis, email_regis, phone_regis) 
                VALUES (${etsForm.nom}, ${etsForm.prenom}, ${etsForm.etablissement}, ${etsForm.ville}, ${etsForm.comment}, ${etsForm.email}, ${etsForm.phone});`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    console.log('Proposition d\'établissement reçu !');
                }
            );
});

module.exports = router;