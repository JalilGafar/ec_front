const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

//** Vue des Campus depuis Admin */
router.get('/', (req, res, next) => {
    con.query("SELECT * FROM campus;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Chargement des Campus');
            res.status(200).json(result);
            return;
        }
    );
});



//** EDITER UN CAMPUS */
router.put('/', (req, res) =>{
    var editForm = req.body;
    con.query(SQL
        `UPDATE campus 
        SET 
            nom_camp = ${editForm.nom_camp},
            ville_cam = ${editForm.ville_cam},
            principal_camp = ${editForm.principal_camp},
            descriptif_camp = ${editForm.descriptif_camp},
            lon_camp = ${editForm.lon_camp},
            lat_camp = ${editForm.lat_camp}
        WHERE (id_camp = ${editForm.id_camp});
        `,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('CAMPUS record Update');
        }
    );
})


/**Ajout d'un nouveau Campus */
router.post('/', (req, res) => {
    var campForm = req.body
    console.log('begining Campus insertion !');
    con.query(SQL
                `INSERT INTO campus
                (nom_camp, ville_cam, quartier_camp, principal_camp, descriptif_camp, lon_camp, lat_camp) 
                VALUES (${campForm.nom_camp}, ${campForm.ville_cam}, ${campForm.quartier_camp}, ${campForm.principal_camp}, ${campForm.descriptif_camp}, ${campForm.lon_camp}, ${campForm.lat_camp});
                `,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    console.log('record of Campus inserted');
                }
            );
});

//** DELET CAMPUS */
router.delete('/', (req, res) => {
    var idCamp = req.query.idCamp;    
    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('we wan to delet CAMPUS with ID : '+ idCamp);
    con.query(`DELETE FROM campus WHERE (id_camp = ${idCamp} )`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Campus DELETED !');
        }
        );
})

module.exports = router;