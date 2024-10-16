const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

//** Vue des Diplomes depuis Admin */
router.get('/', (req, res, next) => {
    con.query(SQL 
                `select * 
                from 
                    diplomes
                    join 
                        categories
                        on (categories.id_cat = diplomes.categorie_id) ` , 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
           // console.log('Chargement des Diplomes');
            res.status(200).json(result);
            return;
        }
    );
});

/**Ajout d'un nouveau Diplome */
router.post('/', (req, res, next) => {
    var diplomeForm = req.body
    con.query(SQL
                `CALL add_diplome_procedure (${diplomeForm.nom_dip},
                                            ${diplomeForm.descriptif_dip},
                                            ${diplomeForm.niveau},
                                            ${diplomeForm.categorie_id},
                                            ${diplomeForm.domaine_id},
                                            ${diplomeForm.domaine_id2},
                                            ${diplomeForm.domaine_id3})`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    res.sendStatus(200);
                    console.log('New Diplome Insert !');
                }
            );
});

/**Modification d'un Diplome */
router.put('/', (req, res) =>{
    var editForm = req.body;
    con.query(SQL
        `UPDATE diplomes 
        SET 
            nom_dip = ${editForm.nom_dip},
            niveau = ${editForm.niveau},
            descriptif_dip = ${editForm.descriptif_dip},
            categorie_id = ${editForm.categorie_id}
        WHERE (id_dip = ${editForm.id_dip});
        `,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            //res.sendStatus(200);
            //console.log('DIPLOME 1/2 record Update ');
        }
    );
    con.query(SQL
        `CALL update_diplomes_procedure (${editForm.id_dip},
                                        ${editForm.domaine_id},
                                        ${editForm.domaine_id2},
                                        ${editForm.domaine_id3})`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(200);
            console.log(editForm.id_dip+'  Update');
        }
    );
})

//** DELET DIPLOME  */
router.delete('/', (req, res) => {
    var idDiplome = req.query.idDiplome;    
    con.query(`DELETE FROM diplomes WHERE (id_dip = ${idDiplome} )`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(200);
            console.log('Diplome DELETED !');
        }
        );
});
module.exports = router;