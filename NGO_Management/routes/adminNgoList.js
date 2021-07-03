var express = require('express');
var router = express.Router();
const database = require('../Database/database');
const {isUserLoggedIn} = require('../isUserLoggedIn');

/* GET users listing. */
router.get('/',isUserLoggedIn, function(req, res, next) {

    database.getAllNgo()
        .then((rows)=>{
            res.render('Admin/ngoList',{
                rows:rows
            });
        })
        .catch(err=>{
            err:err
        })

});
router.post('/',function (req,res,next){
    let data = {
        ngoId,
        status
    } = req.body

    console.log(data);
    database.setStatus(ngoId,status)
        .then((rows)=>{
            //console.log(rows);
            res.redirect('/admin-ngoList')
        })
        .catch(err=>{
            console.log("err in updating")
            err:err
        })

})

module.exports = router;