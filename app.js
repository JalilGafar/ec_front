const express = require ('express');

var cors = require('cors');
const cookieSession = require("cookie-session");
var mysql = require('mysql');
var SQL = require('sql-template-strings')
var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
})
);

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const db = require("./models");
const Role = db.role;

db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
});



function initial() {
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });
}

//db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Orange2023@BROWN",
    database: 'ecolecamerdb',
    multipleStatements: true
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


//*********** GET DOMAINE AND CATEGORIES ***************** */
app.get('/domaine', (req, res, next) => {
    con.query("SELECT id_dom, nom_dom FROM domaines;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200).json(result);
            return;
        }
    );
});

app.get('/categ', (req, res, next) => {
    con.query("SELECT id_cat, nom_cat FROM categories;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200).json(result);
            return;
        }
    );
});


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
            console.log('Chargement des Universités');
            res.status(200).json(result);
            return;
        }
    );
});

/**Ajout d'une nouvelle Université */
app.post('/newUniversites', (req, res, next) => {
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
                    console.log('record inserted');
                }
            );
});

/**Mise a jour d'une université */
app.put('/editUniversite', (req, res, next)=>{
    console.log('!!!!!!!!!!!!!!!!!!!!!!!');
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
                    console.log('record Update');
                }
            );
});

/** Supression d'une Université */

app.delete('/deletUniversite', (req, res) => {
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
            console.log('Univ DELETED !');
        }
        );
})

//**!!!!!!!!!!!!!!!!! ECOLE REQUES !!!!!!!!!!!!!!!!!!!!!!!!!! */


//** Vue des Ecoles depuis Admin */
app.get('/ecoles', (req, res, next) => {
    con.query("SELECT * FROM ecoles;", 
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Chargement des Ecoles');
            res.status(200).json(result);
            return;
        }
    );
});

/**Ajout d'une nouvelle Ecole */
app.post('/newEcole', (req, res, next) => {
    var ecoleForm = req.body
    con.query(SQL
                `INSERT INTO ecoles
                (nom_e, sigle_e, logo_e, niveau_e, langue_e, date_creation, tel_1_e, email_e, bp_e, directeur_e, photo_directeur, mot_directeur, stat_e, descriptif_e, image_e, universites_id) 
                VALUES (${ecoleForm.nom_e}, ${ecoleForm.sigle_e}, ${ecoleForm.logo_e}, ${ecoleForm.niveau_e}, ${ecoleForm.langue_e}, ${ecoleForm.date_creation}, ${ecoleForm.tel_1_e}, ${ecoleForm.email_e}, ${ecoleForm.bp_e}, ${ecoleForm.directeur_e}, ${ecoleForm.photo_directeur}, ${ecoleForm.mot_directeur}, ${ecoleForm.stat_e}, ${ecoleForm.descriptif_e}, ${ecoleForm.image_e}, ${ecoleForm.universites_id});
                SELECT LAST_INSERT_ID() INTO @mysql_variable;
                INSERT INTO campus_ecoles 
                (campus_id, ecole_id) 
                VALUES (${ecoleForm.campus_id}, @mysql_variable);`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    console.log('record inserted');
                }
            );
});


/**Modification d'une Ecole */
app.put('/editEcole', (req, res) =>{
    var editForm = req.body;
    con.query(SQL
        `UPDATE ecoles 
        SET 
            nom_e = ${editForm.nom_e},
            sigle_e = ${editForm.sigle_e},
            logo_e = ${editForm.logo_e},
            niveau_e = ${editForm.niveau_e},
            langue_e = ${editForm.langue_e},
            tel_1_e = ${editForm.tel_1_e},
            email_e = ${editForm.email_e},
            bp_e = ${editForm.bp_e},
            directeur_e = ${editForm.directeur_e},
            photo_directeur = ${editForm.photo_directeur},
            mot_directeur = ${editForm.mot_directeur},
            stat_e = ${editForm.stat_e},
            descriptif_e = ${editForm.descriptif_e},
            image_e = ${editForm.image_e},
            Universites_id = ${editForm.universites_id}
        WHERE (id_ecol = ${editForm.id_ecol});
        `,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('ECOLE record Update 1/2');
        }
    );
    con.query(SQL
        `CALL galager_procedure (${editForm.id_ecol},${editForm.campus_id});`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('ECOLE record Update 2/2');
        }
    );
})


//** DELET ECOLE  */
app.delete('/deletEcole', (req, res) => {
    var idEcole = req.query.idEcole;    
    con.query(`DELETE FROM ecoles WHERE (id_ecol = ${idEcole} )`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Ecole DELETED !');
        }
        );
})

//***!!!!!!!!!!!!!!!!!! CAMPUS REQUEST !!!!!!!!!!!!!!!!!!!!! */

//** Vue des Campus depuis Admin */
app.get('/campus', (req, res, next) => {
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
app.put('/editCampus', (req, res) =>{
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
app.post('/newCampus', (req, res) => {
    var campForm = req.body
    con.query(SQL
                `INSERT INTO campus
                (nom_camp, ville_cam, principal_camp, descriptif_camp, lon_camp, lat_camp) 
                VALUES (${campForm.nom_camp}, ${campForm.ville_cam}, ${campForm.principal_camp}, ${campForm.descriptif_camp}, ${campForm.lon_camp}, ${campForm.lat_camp});
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
app.delete('/deletCampus', (req, res) => {
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


//**************** FORMATION REQUEST ********************/


//**Appel sous Admin de toutes les formation avec leur université, école, campus, ville, catégorie de diplome */
app.get('/formations', (req, res, next) => {
    con.query(SQL 
                `select id_form , nom_f, nom_dip, diplom_id AS diplome_id, categorie_id, ecole_f_id, nom_cat, ville_cam, admission AS admission_diplome, descriptif_dip, conditions AS condition_diplome, niveau AS niveau_diplome, nom_univ, nom_camp, date_debut_f, duree_f, cout_f, programme_f, descriptif_f 
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
            console.log('Chargement des Formations avec Liaison au campus et Univ');
            res.status(200).json(result);
            return;
        }
    );
});

/***** Ajout d'une nouvelle formation *********************/

app.post('/newFormation', (req, res, next) => {
    var FormationForm = req.body
    con.query(SQL
                `INSERT INTO diplomes
                (nom_dip, admission, descriptif_dip, categorie_id, conditions, niveau)
                VALUES (${FormationForm.nom_dip}, ${FormationForm.admission_diplome}, ${FormationForm.descriptif_diplome}, ${FormationForm.categ_id}, ${FormationForm.condition_diplome}, ${FormationForm.niveau_diplome});
                SELECT LAST_INSERT_ID() INTO @mysql_variable;
                INSERT INTO formations
                (nom_f, date_debut_f, duree_f, cout_f, programme_f, descriptif_f, ecole_f_id, diplom_id) 
                VALUES (${FormationForm.nom_f}, ${FormationForm.date_debut_f}, ${FormationForm.duree_f}, ${FormationForm.cout_f}, ${FormationForm.programme_f}, ${FormationForm.descriptif_f}, ${FormationForm.ecole_id}, @mysql_variable);
                SELECT LAST_INSERT_ID() INTO @mysql_variable;
                INSERT INTO domaines_formations
                (domaines_id, formations_id) 
                VALUES (${FormationForm.domaine_id}, @mysql_variable);`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    console.log('record inserted');
                }
            );
});

//*************MODIFIER UNE FORMATION EXISTANTE ******************///
app.put('/editformation', (req, res) =>{
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
            ecole_f_id =${editForm.ecole_id}
        WHERE (id_form = ${editForm.id_form});
        `,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('FORMATION 1 record Update');
        }
    );
    con.query(SQL
        `UPDATE diplomes
        SET
            nom_dip = ${editForm.nom_dip},
            admission = ${editForm.admission_diplome},
            descriptif_dip = ${editForm.descriptif_diplome},
            conditions = ${editForm.condition_diplome},
            niveau = ${editForm.niveau_diplome},
            categorie_id = ${editForm.categ_id}
        WHERE (id_dip = ${editForm.diplome_id});`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('FORMATION 2 record Update');
        }
    );
    con.query(SQL
        `UPDATE IGNORE domaines_formations
        SET
            domaines_id = ${editForm.domaine_id}
        WHERE (formations_id = ${editForm.id_form})
        `,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('FORMATION 3 record Update');
        }
    );
})

//*********** SUPRIMER UNE FORMATION *********************/

app.delete('/deletFormation', (req, res) => {
    var idForm = req.query.idForm;    
    con.query(`DELETE FROM formations WHERE (id_form = ${idForm} )`,
        function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
            console.log('Formation DELETED !');
        }
        );
})

/**recherche des domaines disponible pour un diplome défini */
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

    app.get('/degree', (req, res, next)=>{
        var degreeCyti = req.query.DegreeCyti;
        var degreeField = req.query.DegreeField;
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