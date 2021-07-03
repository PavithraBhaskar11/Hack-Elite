var express = require('express');
var router = express.Router();
const {isUserLoggedIn} = require('../isUserLoggedIn');
const database = require('../Database/database');

/* GET home page. */
router.get('/',isUserLoggedIn, function(req, res, next) {
   if(req.session.user.type !== "Volunteer"){
       console.log("not a volunteer")
       res.redirect('/login')
   }
   console.log(req.session.user.vol_id)
   database.getPreferredCityNgo(req.session.user.vol_id)
       .then(rows=>{
          // console.log(rows)
           res.render('Volunteer/home',{
               rows : rows,
               err : ' ',
               message : req.session.message,
               messageType : req.session.messageType
           });
           req.session.message = null
           req.session.messageType = null
       })
       .catch(err=>{
           console.log(err);
           err: err
       })

});

router.post('/',isUserLoggedIn,(((req, res) => {
    let data ={
        ngoId,
        ngoName,
        category,
        classification,
        contact,
        ngoLink,
        description,
        area,
        city,
        state
    } =  req.body
let volunteerStatus = "NGO has not viewed your application yet"
    console.log(data)
    console.log(req.session.user.u_id);
    database.volunteerApply(req.session.user.vol_id,ngoId,volunteerStatus)
        .then((rows)=>{
            console.log("data entered to volunteers table");
            req.session.message = "Applied Successfully.."
            req.session.messageType = "Success"
            res.redirect('/V-home')
        })
        .catch(err=>{
            console.log("err", err)
            req.session.message = "You have already applied.."
            req.session.messageType = "Fail"
            res.redirect('/V-home')

        })
})))

module.exports = router;
