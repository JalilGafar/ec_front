const express = require ('express');

var cors = require('cors');
const cookieSession = require("cookie-session");
var con = require('./db')
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

const topNewsSlideRoutes = require('./routes/topNewsSlide');
const universiteRoutes = require('./routes/universite');
const ecolesRoutes = require('./routes/ecoles');
const diplomesRoutes = require('./routes/diplomes');
const campusRoutes = require ('./routes/campus');
const formationsRoutes = require ('./routes/formation');
const interestRoutes = require ('./routes/interest');
const resultatsRoutes = require ('./routes/resultats');
const schoolDataRoutes = require ('./routes/schoolData');
const enregistrementRoutes = require ('./routes/enregistrement');

db.sequelize.sync(/*{force: true}*/).then(() => {
    console.log('Drop and Resync Db');
   // initial();
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




app.use('/api/topNewsSlide', topNewsSlideRoutes);


//*********** GET DOMAINE AND CATEGORIES ***************** */
app.get('/api/domaine', (req, res, next) => {
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

app.get('/api/categ', (req, res, next) => {
    con.query("SELECT * FROM categories;", 
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


app.get('/api/partCyties', (req, res, next) => {
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
           // console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        }
    );
}

});

//**Appel de toutes les villes ayant un campus */
app.get('/api/cyties', (req, res, next) => {
    con.query("SELECT distinct ville_cam FROM campus;", 
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
});


//********** GET POST DELET.... UNIVERSITES ****************/
app.use('/api/universites', universiteRoutes);


//**!!!!!!!!!!!!!!!!! ECOLE REQUES !!!!!!!!!!!!!!!!!!!!!!!!!! */
app.use('/api/ecoles', ecolesRoutes);


//**!!!!!!!!!!!!!!!!! DIPLOME REQUES !!!!!!!!!!!!!!!!!!!!!!!!!! */
app.use('/api/diplomes', diplomesRoutes);


//***!!!!!!!!!!!!!!!!!! CAMPUS REQUEST !!!!!!!!!!!!!!!!!!!!! */
app.use('/api/campus', campusRoutes);


//**************** FORMATION REQUEST ********************/
app.use('/api/formations', formationsRoutes);


//**************** INTEREST REQUEST ********************/
app.use('/api/interest', interestRoutes);


//****************  SERCH RESULT REQUEST ********************/
app.use('/api/result', resultatsRoutes);

//**************** SCHOOL DATA REQUEST ********************/
app.use('/api/shoolData', schoolDataRoutes);

//**************** SAVE NEW ETABLISSEMENT ********************/
app.use('/api/ets', enregistrementRoutes);


/**recherche des domaines disponible pour un diplome défini */
app.get('/api/field', (req, res, next) => {
    var domaineDegree = req.query.DomaineDegree;
    var domaineCyti = req.query.DomaineCyti;
    if (domaineCyti === undefined && domaineDegree === undefined) {
        
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
    } else if (domaineDegree === 'tous') {
        con.query("SELECT nom_dom, branche_dom FROM domaines;", function (err, result, fields) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            };
           // console.log(JSON.stringify(result));
            res.status(200).json(result);
            return;
        });
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
    }

});

app.get('/api/degree', (req, res, next)=>{
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
               // console.log(JSON.stringify(result));
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
        console.log('proton !')
        con.query("SELECT nom_cat, groupe FROM categories order by groupe;", 
            function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                };
                console.log(JSON.stringify(result));
               //console.log('zapos !')
                res.status(200).json(result);
                return;
            }
    );
    }
    
})

module.exports = app;