const express = require('express');
const router =express.Router();
var con = require('../db');
var SQL = require('sql-template-strings');


router.get('/', (req, res, next) => {
    con.query(SQL
        `select id_form, nom_e, sigle_e, logo_e, duree_f, cout_f, diplom_id, nom_dip, filiere_dip, descriptif_dip, ville_cam
            from
                (ecolecamerdb.campus
                join
                (select *
                from 
                    (
                    Select *
                    from 
                    ecolecamerdb.diplomes
                    join
                        (SELECT *
                        from 
                            ecolecamerdb.ecoles
                            join
                            ecolecamerdb.formations
                            on (ecoles.id_ecol = formations.ecole_f_id)
                            where (formations.advers like 'on')
                        ) AA
                        on (diplomes.id_dip = AA.diplom_id)
                        )BB
                    join 
                        ecolecamerdb.campus_ecoles
                        on (BB.id_ecol = campus_ecoles.ecole_id)
                    ) AA
                    on (campus.id_camp = AA.campus_id)
                    ) order by rand()
                limit 4`, 
        function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    });
    res.status(200);
    }
);


module.exports = router;