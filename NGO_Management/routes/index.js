var express = require('express');
var router = express.Router();
const database = require('../Database/database');

/* GET home page. */
router.get('/', function(req, res, next) {

    database.getAllAcceptedNgo()
      .then(rows=>{
        res.render('Home/index', {
          title: 'Express' ,
          rows : rows
        });
      })
      .catch(err=>{
        console.log(err)
      })

});


module.exports = router;
