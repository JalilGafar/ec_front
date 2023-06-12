const express = require('express');
const router =express.Router();
var con = require('../db')

router.get('/', (req, res, next) => {
    con.query("SELECT * FROM top_news;", function (err, result, fields) {
        if (err) throw err;
        //console.log(JSON.stringify(result));
        res.status(200).json(result);
    });
    console.log("acces à TopNewsSlides !")
    }
);

module.exports = router;