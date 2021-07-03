var express = require('express');
var router = express.Router();
const  database  = require('../Database/database');
const {isUserLoggedIn} = require('../isUserLoggedIn');


/* GET home page. */
router.get('/', isUserLoggedIn,(req, res, next) =>{
    if(req.session.user.type !== "Sponsor"){
        console.log("not a sponsor")
        res.redirect('/login');
    }

    database.getAllAcceptedNgo()
        .then(rows=>{
           // console.log("Sponsor Homepage")
            res.render('Sponsor/home',{
                rows : rows,
                err : ' ',
                message : req.session.message,
                messageType : req.session.messageType
            });
            req.session.message = null
            req.session.messageType = null
        })
        .catch((err)=>{
            console.log(err);
        })
});

router.post('/',isUserLoggedIn,((req, res) => {
    let data ={
        ngoId,
        ngoName,
        category,
        classification,
        contact,
        ngoLink,
        ngoDescription,
        area,
        city,
        state,
        description
    } =  req.body
let sponsorStatus = "NGO has not viewed your application"
   // console.log("ngo details ->",data)
    database.sponsorApply(req.session.user.spon_id,ngoId,description,sponsorStatus)
        .then((rows)=>{
            console.log("data entered to sponsors table");
            req.session.message = "Applied Successfully....."
            req.session.messageType = "Success"
            res.redirect('/S-home');
        })
        .catch(err=>{
            console.log("err");
            req.session.message = "You have Already Applied"
            req.session.messageType = "Fail"
            err:err
        })
}))


module.exports = router;
