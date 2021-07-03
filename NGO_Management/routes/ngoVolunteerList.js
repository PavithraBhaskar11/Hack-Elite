var express = require('express');
var router = express.Router();
const database = require('../Database/database')
const {isUserLoggedIn} = require('../isUserLoggedIn');

/* GET users listing. */
router.get('/',isUserLoggedIn, function(req, res, next) {
database.getNgoVolunteers(req.session.user.ngo_id)
    .then((rows)=>{
        res.render('Ngo/Volunteers',{
            rows:rows
        });
    })
    .catch(err=>{
        err:err
    })

});
router.post('/',isUserLoggedIn,function(req, res,next){
    let Message = {
        volunteerId,
        ngoMessage
    } = req.body
    console.log(Message);
    console.log("ngo id ->",req.session.user.ngo_id);
    database.setVolunteerStatus(volunteerId, ngoMessage,req.session.user.ngo_id)
        .then((rows)=>{
            console.log(rows)
            res.redirect('/N-volunteer')
        })
        .catch(err=>{
            err :err
        })
})

module.exports = router;
