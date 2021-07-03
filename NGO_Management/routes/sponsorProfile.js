var express = require('express');
var router = express.Router();
const {isUserLoggedIn} = require('../isUserLoggedIn');
const database = require('../Database/database');

/* GET home page. */
router.get('/',isUserLoggedIn,async function(req, res, next) {

    // database.getSponsorDetails(req.session.user.u_id)
    //     .then((rows)=>{
    //         console.log(rows);
    //
    //         res.render('Sponsor/profile',{
    //             Name :req.session.user.u_name,
    //             address :req.session.user.address,
    //             contact :req.session.user.phone_no,
    //             uid :req.session.user.u_id,
    //             preferredCity:req.session.user.pref_city,
    //             rows:rows
    //         });
    //     })
    //     .catch(err=>{
    //         console.log("err");
    //         err:err
    //     })

    console.log(req.session.user.spon_id);
    let sponsorsProfile = await database.getSponsorDetails(req.session.user.spon_id)
   // console.log("sponsorsProfile ->",sponsorsProfile)

    let sponsorsNgo = await database.getSponsorsNgo(req.session.user.spon_id)
   // console.log("sponsorsNgo ->",sponsorsNgo)

    res.render('Sponsor/profile',{
        sponsorsProfile : sponsorsProfile,
        sponsorsNgo : sponsorsNgo
    });


});


module.exports = router;
