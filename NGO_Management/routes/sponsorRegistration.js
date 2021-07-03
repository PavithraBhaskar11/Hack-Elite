var express = require('express');
const database = require("../Database/database");
const bcrypt = require('bcrypt');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Home/sponsorRegistration',{
        err :" "
    });
});

router.post('/',(req, res) => {
    let data =  {
        uid,
        username,
        address,
        phoneNumber,
        email,
        password,
        confirmPassword,
        type
    } = req.body

    if(password !== confirmPassword){
        console.log("Password !== confirmPassword")

        // if(type === "Volunteer"){
        //     console.log("Type -> Volunteer")
        //     res.render('Home/volunteerRegistration', {
        //         err: "Password and Confirm password not matched"
        //     })
        // }
        if (type === "Sponsor"){
            console.log("Type -> Sponsor")
            res.render('Home/sponsorRegistration',{
                err : "Password and Confirm password not matched"
            })
         }

    }else {

        console.log("Sponsor Register -> ", data)
        bcrypt.hash(password,5,(err,hashedPassword)=>{
            database.signUpSponsor(uid, username, address, phoneNumber, email, hashedPassword, type)
                .then((sl_no) => {
                    console.log("login page")

                    res.render('home/login', {
                        err: null
                    })

                })
                .catch(err => {
                    console.log("redirected to register page")
                    // if (req.body.type === "Volunteer") {
                    //     console.log("Volunteer")
                    //     res.render('Home/volunteerRegistration', {
                    //         err: err
                    //     })
                    //     //return reject("User already registered");
                    // }
                     if (req.body.type === "Sponsor") {
                        console.log("Sponsor")
                        res.render('Home/sponsorRegistration', {
                            err: err
                        })
                    }
                })
        })
    }
})

module.exports = router;
