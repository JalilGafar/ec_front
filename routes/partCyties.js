const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

router.get('/', (req, res, next) => {
    var degree = req.query.Degree;
    var domaine = req.query.Domaine;
    if (domaine && degree) {
        con.query(SQL
            `select distinct ville_cam
            from
                campus
                join
                    campus_ecoles
                    on (campus.id_camp = campus_ecoles.campus_id)
                join
                    (	select *
                        from 
                            ecoles
                            join
                            (	select * 
                                from 
                                    formations
                                    Join
                                    (	select * 
                                        from 
                                            domaines
                                            join
                                                domaines_diplomes
                                                on (domaines.id_dom = domaines_diplomes.domaines_id)
                                            join 
                                                (	select * 
                                                    from 
                                                        diplomes
                                                        join 
                                                            categories
                                                            on (categories.id_cat = diplomes.categorie_id)
                                                        where (categories.nom_cat LIKE ${degree})
                                                ) dipCateg
                                                on (dipCateg.id_dip = domaines_diplomes.diplomes_id)
                                            where (domaines.nom_dom like ${domaine})
                                    ) dipCatDom
                                    on (dipCatDom.id_dip = formations.diplom_id)
                            ) dipCatDomForm
                            on (ecoles.id_ecol = dipCatDomForm.ecole_f_id)
                    ) dipCatDomFormEc
                    on (campus_ecoles.ecole_id = dipCatDomFormEc.id_ecol)`, 
            function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                };
               // console.log(JSON.stringify(result));
                res.status(200).json(result);
                return;
            }
        );
        return;
    }
    
});
module.exports = router;