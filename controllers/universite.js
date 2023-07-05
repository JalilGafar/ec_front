var con = require('../db');
var SQL = require('sql-template-strings');

exports.creatUniv = (req, res, next) => {
    var uForm = req.body
    con.query(SQL
                `INSERT INTO universites
                (nom_univ, sigle_univ, type_univ, ville_univ, tel_univ, email_univ, siteweb_univ, recteur_univ, mot_du_recteur, descriptif_univ) 
                VALUES (${uForm.nom_univ}, ${uForm.sigle_univ}, ${uForm.type_univ}, ${uForm.ville_univ}, ${uForm.tel_univ}, ${uForm.email_univ}, ${uForm.siteweb_univ}, ${uForm.recteur_univ}, ${uForm.mot_du_recteur}, ${uForm.descriptif_univ});`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    res.sendStatus(200);
                    console.log('record inserted');
                }
            );
};

exports.getAllUniv = (req, res, next) => {
    con.query("SELECT * FROM universites;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
           // console.log('Chargement des Universités');
            res.status(200).json(result);
            return;
        }
    );
};

exports.updateUniv = (req, res, next)=>{
    var editForm = req.body;
    con.query(SQL
                `UPDATE universites 
                SET 
                    nom_univ = ${editForm.nom_univ},
                    sigle_univ = ${editForm.sigle_univ},
                    type_univ = ${editForm.type_univ},
                    ville_univ = ${editForm.ville_univ},
                    tel_univ = ${editForm.tel_univ},
                    email_univ = ${editForm.email_univ},
                    siteweb_univ = ${editForm.siteweb_univ},
                    recteur_univ = ${editForm.recteur_univ},
                    mot_du_recteur = ${editForm.mot_du_recteur},
                    descriptif_univ = ${editForm.descriptif_univ} 
                WHERE (id_univ = ${editForm.id_univ});
                `,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    res.sendStatus(200);
                    console.log(editForm.nom_univ + ' Mis à jour !');
                }
            );
};

exports.deletUniv = (req, res) => {
    var idUniv = req.query.idUniv;    
    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('we wan to delet UNIV with ID : '+ idUniv);
    con.query(`DELETE FROM universites WHERE (id_univ = ${idUniv} )`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(200);
            console.log('Univ DELETED !');
        }
        );
};