var express = require('express');
const database = require("../Database/database");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    database.getAllAcceptedNgo()
        .then(rows=>{
            res.render('Home/ngoList',{
                rows : rows
            });
    })
        .catch(err=>{
            console.log(err)
            err :err
        })

});
router.post('/',function (req,res,next){
    res.redirect('/register');
})

module.exports = router;
