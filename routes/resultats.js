const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

//** Enregistrement des informations clients */
router.post('/', (req, res, next) => {
    var requestForm = req.body;
    console.log('UserInfo arrive ici !')
    console.log(JSON.stringify(requestForm))
    con.query(SQL
        `CALL save_client_procedure (${requestForm.name}, ${requestForm.surname}, 
                                  ${requestForm.statuts}, ${requestForm.level}, 
                                  ${requestForm.bornDate}, ${requestForm.email},
                                  ${requestForm.tel}, ${requestForm.country},
                                  ${requestForm.city}, ${requestForm.degree}, ${requestForm.field}  );`, 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Enregistrement de client');
            res.status(200).json(result);
            return;
        }
    );
});

//** Requete des formations qui repondent aux critères de recherche **/
router.get('/', (req, res, next) => {
    var ville = req.query.city;
    var diplome = req.query.diplome;
    var domaine = req.query.domaine;
    //console.log('ville =' + ville + ' diplome ='+ diplome + 'et domaine ='+ domaine);
    con.query(SQL
        `CALL serch_result_procedure (${ville}, ${diplome}, ${domaine})`, 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Envoie des RESULTATS !');
            res.status(200).json(result[0]);
            //console.log(result[0]);
            return;
        }
    );
});

module.exports = router;