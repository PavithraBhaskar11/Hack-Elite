var express = require('express');
var router = express.Router();
const database = require('../Database/database')
const {isUserLoggedIn} = require('../isUserLoggedIn');

/* GET users listing. */
router.get('/',isUserLoggedIn, function(req, res, next) {

   database.getNgoDetails(req.session.user.ngo_id)
       .then(rows=>{
           res.render('Ngo/home',{
               rows:rows
           });
       })
       .catch(err=>{
           err:err
       })

});

module.exports = router;
