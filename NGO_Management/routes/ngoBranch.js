var express = require('express');
const bcrypt = require('bcrypt');
const database = require("../Database/database");
var router = express.Router();

const {isUserLoggedIn} = require('../isUserLoggedIn');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Ngo/ngoBranch',{
        err :" ",
        message : req.session.message,
        messageType : req.session.messageType
    });
    req.session.message = null
    req.session.messageType = null

});

router.post('/',(req, res) => {
    let data =  {
        area,
        city,
        state
    } = req.body
    database.addBranch(req.session.user.ngo_id,area,city,state)
        .then((rows)=>{
            console.log("data entered to ngo_address table");
            req.session.message = "Ngo Branch added Successfully....."
            req.session.messageType = "Success"
            res.redirect('/N-addBranch');
        })
        .catch(err=>{
            console.log("err");
            req.session.message = "Ngo Branch is not added"
            req.session.messageType = "Fail"
            err:err
        })
    console.log("NGO - >",data)

})
module.exports = router;
