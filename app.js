const express = require ('express');

var cors = require('cors');
var mysql = require('mysql');
var SQL = require('sql-template-strings')
var app = express();

app.use(cors());
app.use(express.json());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Orange2023@BROWN",
    database: 'ecolecamerdb'
});
  
con.connect(function(err) {
	if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    };
});


app.get('/topNewsSlide', (req, res, next) => {
    const stuff = [
        {
            id: 1,
            title:'Archibald',
            description:'Mon meilleur ami depuis tout petit !',
            imageUrl:'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
            createdDate: new Date()
        },
        {
            id: 2,
            title:'Dexter',
            description:'Mon meilleur ami depuis tout petit !',
            imageUrl:'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
            createdDate: new Date()
        },
        {
            id: 3,
            title:'Phuitone',
            description:'Mon meilleur ami depuis tout petit !',
            imageUrl:'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
            createdDate: new Date()
        },
        {
            id: 5,
            title:'Jiraya',
            description:'Mon meilleur ami depuis tout petit !',
            imageUrl:'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
            createdDate: new Date()
        },
        {
            id: 6,
            title:'Sakura',
            description:'Mon meilleur ami depuis tout petit !',
            imageUrl:'https://cdn.pixabay.com/photo/2015/05/31/16/03/teddy-bear-792273_1280.jpg',
            createdDate: new Date()
        },
    ];
    con.query("SELECT * FROM top_news;", function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.status(200).json(result);
    });
    
    //res.status(200).json(stuff);
    }
);






app.get('/partCyties', (req, res, next) => {
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
                                    domaines
                                    join
                                        domaines_formations
                                        on (domaines.id_dom = domaines_formations.domaines_id)
                                    join 
                                        (	select * 
                                            from 
                                                formations
                                                Join
                                                    (	select * 
                                                        from 
                                                            diplomes
                                                            join 
                                                                categories
                                                                on (categories.id_cat = diplomes.categorie_id)
                                                            where (categories.nom_cat LIKE ${degree})
                                                    ) dc
                                                    on (dc.id_dip = formations.diplom_id)
                                        ) ev
                                        on (ev.id_form = domaines_formations.formations_id)
                                    where (domaines.nom_dom like ${domaine})
                            ) jk
                            on (ecoles.id_ecol = jk.ecole_f_id)
                ) jl
                on (campus_ecoles.ecole_id = jl.id_ecol)`, 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        }
    );
}

});

//**Appel de toutes les villes ayant un campus */
app.get('/cyties', (req, res, next) => {
    con.query("SELECT distinct ville_cam FROM campus;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        }
    );
});


//** Vue des université depuis Admin */
app.get('/universites', (req, res, next) => {
    con.query("SELECT * FROM universites;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        }
    );
});

//** Vue des Ecoles depuis Admin */
app.get('/ecoles', (req, res, next) => {
    con.query("SELECT * FROM ecoles;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        }
    );
});


//** Vue des Campus depuis Admin */
app.get('/campus', (req, res, next) => {
    con.query("SELECT * FROM campus;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        }
    );
});
//**Appel sous Admin de toutes les formation avec leur université, école, campus, ville, catégorie de diplome */
app.get('/formations', (req, res, next) => {
    con.query(SQL 
                `select id_form as id, nom_f, nom_cat as categorie, ville_cam as ville, nom_univ as universite, nom_camp as campus 
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
            console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        }
    );
});



app.get('/field', (req, res, next) => {
    var domaineDegree = req.query.DomaineDegree;
    console.log('recherche des domaines disponible pour le diplome '+ domaineDegree);
    if (domaineDegree === undefined) {
            
    } else if (domaineDegree !== 'tous' && domaineDegree !== undefined) {
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
                console.log(JSON.stringify(result));
                res.status(200).json(result);
                return;
            }
        );
    } else if (domaineDegree === 'tous') {
        con.query("SELECT nom_dom, branche_dom FROM domaines;", function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        });
    }

});
/*
  app.get('/degree', (req, res, next) => {
    console.dir(req.originalUrl);
        con.query("SELECT nom_cat, groupe FROM categories order by groupe;", 
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    console.log(JSON.stringify(result));
                    res.status(200).json(result);
                    return;
                }
        ); 
    });
*/
    app.get('/degree', (req, res, next)=>{
        //console.dir(req.originalUrl);
        var degreeCyti = req.query.DegreeCyti;
        var degreeField = req.query.DegreeField;
        //console.log(degreeCyti);
        //var degreeCyti = 'Foumban';
        //console.log('recherche des diplomes disponible à '+ degreeCyti);
        if (degreeCyti === undefined && degreeField === undefined) {
            
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
                  console.log(JSON.stringify(result));
                  res.status(200).json(result);
                  return;
              }
            );
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
                  console.log(JSON.stringify(result));
                  res.status(200).json(result);
                  return;
              }
            );
        } else if (degreeCyti === 'tous') {
            con.query("SELECT nom_cat, groupe FROM categories order by groupe;", 
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    console.log(JSON.stringify(result));
                    res.status(200).json(result);
                    return;
                }
        );
        }
        
    })

module.exports = app;