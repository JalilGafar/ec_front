const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

router.get('/', (req, res, next) => {
    var domaineDegree = req.query.DomaineDegree;
    var domaineCyti = req.query.DomaineCyti;
    if (domaineCyti === undefined && domaineDegree === undefined) {
        return;
    } else if (domaineDegree !== 'tous' && domaineDegree !== undefined && domaineCyti === undefined) {
        con.query(SQL
            `select distinct nom_dom, branche_dom
            from 	
                domaines
                join
                    domaines_formations
                    on (domaines.id_dom = domaines_formations.domaines_id)
                Join
                    (	
                        select * 
                        from 
                            formations
                            Join
                                (	select * 
                                    from 
                                        diplomes
                                        join 
                                            categories
                                            on (categories.id_cat = diplomes.categorie_id)
                                        where (categories.nom_cat LIKE ${domaineDegree})
                                ) dc
                                on (dc.id_dip = formations.diplom_id)
                    ) ev
                    on (ev.id_form = domaines_formations.formations_id)`, 
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
    } else if (domaineDegree === 'tous') {
        con.query(SQL 
            `SELECT distinct id_dom, nom_dom, branche_dom 
            FROM domaines
                join 
                    domaines_formations
                    on (domaines.id_dom = domaines_formations.domaines_id)
                join 
                    formations
                    on (formations.id_form = domaines_formations.formations_id);`, 
            function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                };
            // console.log(JSON.stringify(result));
                res.status(200).json(result);
                return;
            });
        return;
    } else if (domaineCyti !== undefined) {
        con.query(SQL
            `select distinct nom_dom, branche_dom
            from 	
                domaines
                join
                    domaines_formations
                    on (domaines.id_dom = domaines_formations.domaines_id)
                Join
                    (	
                        select * 
                        from 
                            formations f
                            inner join 
                                (	select * 
                                    from 
                                        ecoles
                                    JOIN 
                                        campus_ecoles
                                        ON (ecoles.id_ecol = campus_ecoles.ecole_id)
                                    JOIN 
                                        campus
                                        ON (campus.id_camp = campus_ecoles.campus_id)
                                    WHERE 
                                        (campus.ville_cam LIKE ${domaineCyti})
                                ) ev
                                On f.ecole_f_id = ev.id_ecol
                            Join
                                (	select * 
                                    from 
                                        diplomes
                                        join 
                                            categories
                                            on (categories.id_cat = diplomes.categorie_id)
                                        where (categories.nom_cat LIKE ${domaineDegree})
                                ) dc
                                on (dc.id_dip = f.diplom_id)
                    ) ev
                    on (ev.id_form = domaines_formations.formations_id)`, 
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