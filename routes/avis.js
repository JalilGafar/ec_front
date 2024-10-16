const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');


router.get('/', (req, res, next) => {
    con.query("SELECT * FROM avis;", function (err, result, fields) {
        if (err) throw err;
        //console.log(JSON.stringify(result));
        res.status(200).json(result);
        console.log('see all avis !')
    });
    res.status(200);
    //console.log("acces à TopNewsSlides !")
    }
);

/**Ajout d'un nouvel Avis */
router.post('/', (req, res) => {
    var actuForm = req.body
    console.log('begining Actualite insertion !');
    con.query(SQL
                `INSERT INTO actualite
                (title, auteur, createdDate, visible, summary, illustration, sujets, content) 
                VALUES (${actuForm.title}, ${actuForm.auteur}, now(), ${actuForm.visible}, ${actuForm.summary}, ${actuForm.illustration}, ${actuForm.sujets}, ${actuForm.content});
                `,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    res.sendStatus(200);
                    console.log('record of Article inserted');
                }
            );
});


module.exports = router;