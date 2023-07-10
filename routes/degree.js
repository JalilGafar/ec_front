const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');

router.get('/', (req, res, next)=>{
    var degreeCyti = req.query.DegreeCyti;
    var degreeField = req.query.DegreeField;
    if (degreeCyti === undefined && degreeField === undefined) {
        return;
    } else if (degreeCyti !== 'tous' && degreeCyti !== undefined ) {
        con.query(SQL
            `SELECT distinct nom_cat, groupe
            FROM 
                categories
                Join 
                (	SELECT *
                    FROM 
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
                                (campus.ville_cam LIKE ${degreeCyti})
                        ) ev
                        On f.ecole_f_id = ev.id_ecol
                    join 
                        diplomes
                        On (f.diplom_id = diplomes.id_dip)
                    ) titus
                On categories.id_cat = titus.categorie_id
            
            `, 
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
    } else if (degreeField !== undefined) {
        con.query(SQL
            `SELECT distinct nom_cat, groupe
            FROM 
                categories
                Join 
                    (	select *
                        from 
                            diplomes
                            join
                                (	select *
                                    from 
                                        domaines
                                        join 
                                            domaines_formations
                                            on (domaines.id_dom = domaines_formations.domaines_id)
                                        join 
                                            formations
                                            on (formations.id_form = domaines_formations.formations_id)
                                        where (domaines.nom_dom like ${degreeField})
                                ) df
                                on (df.diplom_id = diplomes.id_dip)
                    ) dfd
                    on (dfd.categorie_id = categories.id_cat)
            `, 
            function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                };
                //console.log(JSON.stringify(result));
                res.status(200).json(result);
                return;
            }
        );
        return;
    } else if (degreeCyti === 'tous') {
        console.log('proton !')
        con.query("SELECT nom_cat, groupe FROM categories order by groupe;", 
            function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                };
                //console.log(JSON.stringify(result));
               //console.log('zapos !')
                res.status(200).json(result);
                return;
            }
    );
    return;
    }
    
})

module.exports = router;