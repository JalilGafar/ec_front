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
const diplomeDataRoutes = require ('./routes/diplomeData');
const enregistrementRoutes = require ('./routes/enregistrement');
const someDegreeRoutes = require ('./routes/someDegree');
const partCytiesRoutes = require ('./routes/partCyties');
const fieldRoutes = require ('./routes/field');
const degreeRoutes = require ('./routes/degree');
const actualiteRoutes = require ('./routes/actualite');
const avisRoutes = require ('./routes/avis');
const ecoleAvisRoutes = require ('./routes/ecoleAvis');
const adversRoutes = require ('./routes/advers');
const metierRoutes = require ('./routes/metier');

db.sequelize.sync(/*{force: true}*/).then(() => {
   // console.log('Drop and Resync Db');
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
    res.json({ message: "Welcome toJalil Node App." });
});


// Count all formations
app.get("/api/countFomration", (req, res) => {
    con.query("SELECT COUNT(*) as cont FROM formations;", 
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


/************************************** */
/******* ROUTE REDIRECTION ************/
/************************************** */

app.use('/api/topNewsSlide', topNewsSlideRoutes);

app.use('/api/someDegree', someDegreeRoutes);


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


//**************** Diplome DATA REQUEST ********************/
app.use('/api/diplomeData', diplomeDataRoutes);

//**************** SAVE NEW ETABLISSEMENT ********************/
app.use('/api/ets', enregistrementRoutes);

/************ REQUETTE QUI RENVOIE LES VILLES POUR UN DIPLOME ET UN DOMAINE DEFINI ***********/
app.use('/api/partCyties', partCytiesRoutes);

/**recherche des domaines disponible pour un diplome défini */
app.use('/api/field', fieldRoutes);

/** Recherche de dipllome pour une ville ou un domaine définit **********/
app.use('/api/degree', degreeRoutes);

/** Module des actualités **********/
app.use('/api/actualite', actualiteRoutes);

/** Module des avis depuis admin **********/
app.use('/api/avis', avisRoutes);

/** Module des avis depuis USER **********/
 app.use('/api/ecoleavis', ecoleAvisRoutes);

 /** Module des publicité **********/
 app.use('/api/advers', adversRoutes);

 /** Module des metiers **********/
 app.use('/api/metier', metierRoutes);


module.exports = app;