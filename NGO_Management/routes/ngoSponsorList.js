var express = require('express');
var router = express.Router();
const database = require('../Database/database')
const {isUserLoggedIn} = require('../isUserLoggedIn');

/* GET users listing. */
router.get('/',isUserLoggedIn, function(req, res, next) {
console.log("ngo id=>",req.session.user.ngo_id);
    database.getNgoSponsors(req.session.user.ngo_id)
        .then((rows)=>{
            res.render('Ngo/Sponsors',{
                rows:rows
            });
        })
        .catch(err=>{
            err:err
        })

});
router.post('/',isUserLoggedIn,function(req, res,next){
    let Message = {
        sponsorId,
        ngoMessage
    } = req.body
    console.log(Message);
    console.log("ngo id ->",req.session.user.ngo_id);
    database.setSponsorStatus(sponsorId, ngoMessage,req.session.user.ngo_id)
        .then((rows)=>{
            console.log(rows)
            res.redirect('/N-sponsor')
        })
        .catch(err=>{
            err :err
        })
})

module.exports = router;
