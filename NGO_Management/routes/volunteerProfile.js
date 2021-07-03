var express = require('express');
var router = express.Router();
const {isUserLoggedIn} = require('../isUserLoggedIn');
const database = require('../Database/database');

/* GET home page. */
router.get('/',isUserLoggedIn,async function(req, res, next) {

    // database.getVolunteerDetails(req.session.user.u_id)
    //     .then((rows)=>{
    //         console.log(rows)
    //         console.log("username",req.session.user.u_name);
    //         console.log("username",req.session.user.u_id);
    //         res.render('Volunteer/profile',{
    //             Name :req.session.user.u_name,
    //             address :req.session.user.address,
    //             contact :req.session.user.phone_no,
    //             uid :req.session.user.u_id,
    //             preferredCity:req.session.user.pref_city,
    //             rows:rows
    //         });
    //     })
    //     .catch(err=>{
    //         console.log("err")
    //     })

    let volunteersProfile = await database.getVolunteerDetails(req.session.user.vol_id)
   // console.log("volunteersProfile ->",volunteersProfile)

    let volunteersNgo = await database.getVolunteersNgo(req.session.user.vol_id)
   // console.log("volunteersNgo ->",volunteersNgo)

    res.render('Volunteer/profile',{

       volunteersProfile : volunteersProfile,
        volunteersNgo : volunteersNgo
    });


});


module.exports = router;
