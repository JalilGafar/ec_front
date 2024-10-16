const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

//**Appel sous Admin de toutes les formation avec leur université, école, campus, ville, catégorie de diplome */
router.get('/', (req, res, next) => {
    con.query(SQL 
                `select id_form , nom_f, nom_e, nom_dip, diplom_id AS diplome_id, categorie_id, ecole_f_id, nom_cat, ville_cam, admission_f AS admission_diplome, descriptif_dip, conditions_f AS condition_diplome, niveau AS niveau_diplome, nom_univ, nom_camp, date_debut_f, duree_f, cout_f, programme_f, descriptif_f 
                from
                    campus
                    join
                        campus_ecoles
                        on (campus.id_camp = campus_ecoles.campus_id)
                    join
                        (	select *
                            from 
                                universites
                                join
                                    (	select *
                                        from ecoles
                                            Join
                                                (	select * 
                                                    from 
                                                        formations
                                                        Left Join
                                                            (	select * 
                                                                from 
                                                                    diplomes
                                                                    join 
                                                                        categories
                                                                        on (categories.id_cat = diplomes.categorie_id)
                                                            ) dc
                                                            on (dc.id_dip = formations.diplom_id)
                                                ) cdf
                                                on (ecoles.id_ecol = cdf.ecole_f_id)
                                    )cdfe
                                    on (universites.id_univ = cdfe.universites_id)
                                )cdfeu
                                on (cdfeu.id_ecol = campus_ecoles.ecole_id )`, 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            //console.log('Chargement des Formations avec Liaison au campus et Univ');
            res.status(200).json(result);
            return;
        }
    );
});

/***** Ajout d'une nouvelle formation *********************/

router.post('/', (req, res, next) => {
    var FormationForm = req.body
    console.log (FormationForm.nom_f)
    con.query(SQL
                `CALL add_formation_procedure (${FormationForm.nom_f}, 
                                                ${FormationForm.date_debut_f}, 
                                                ${FormationForm.duree_f}, 
                                                ${FormationForm.cout_f}, 
                                                ${FormationForm.programme_f}, 
                                                ${FormationForm.descriptif_f}, 
                                                ${FormationForm.ecole_id}, 
                                                ${FormationForm.diplom_id},
                                                ${FormationForm.condition_diplome},
                                                ${FormationForm.admission_diplome})
                `,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    res.sendStatus(200);
                    console.log(FormationForm.nom_f+' Enregistré dans la table FORMATION !');
                }
            );
});

//*************MODIFIER UNE FORMATION EXISTANTE ******************///
router.put('/', (req, res) =>{
    var editForm = req.body;
    con.query(SQL
        `UPDATE formations 
        SET 
            nom_f = ${editForm.nom_f},
            date_debut_f = ${editForm.date_debut_f},
            duree_f = ${editForm.duree_f},
            cout_f = ${editForm.cout_f},
            programme_f = ${editForm.programme_f},
            descriptif_f = ${editForm.descriptif_f},
            conditions_f = ${editForm.condition_diplome},
            admission_f = ${editForm.admission_diplome},
            ecole_f_id =${editForm.ecole_f_id},
            diplom_id = ${editForm.diplome_id}
        WHERE (id_form = ${editForm.id_form});
        `,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(200);
            console.log('FORMATION record Update');
        }
    )
})

//*********** SUPRIMER UNE FORMATION *********************/

router.delete('/', (req, res) => {
    var idForm = req.query.idForm;    
    con.query(`DELETE FROM formations WHERE (id_form = ${idForm} )`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(200);
            console.log('Formation DELETED !');
        }
        );
})


module.exports = router;