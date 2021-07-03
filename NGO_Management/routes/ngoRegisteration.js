var express = require('express');
const bcrypt = require('bcrypt');
const database = require("../Database/database");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Home/ngoRegistration',{
        err :" "
    });
});

router.post('/',(req, res) => {
    let data =  {
        ngoName,
        classification,
        category,
        contact,
        description,
        ngoLink,
        password,
        confirmPassword,
        type,
        area,
        city,
        state
    } = req.body
let ngoStatus = "pending";
    console.log("NGO - >",data)
    console.log("NGO category- >",req.body.category)
    if(password !== confirmPassword){
        console.log("Password !== confirmPassword")

            res.render('Home/ngoRegistration', {
                err: "Password and Confirm password not matched"
            })

    }else {
        console.log("ngoRegister -> ", data)
        bcrypt.hash(password,5,(err,hashedPassword)=>{
            database.signUpNgo(ngoName, classification,category, contact, description,ngoLink, hashedPassword, type,area, city, state,ngoStatus)
                .then((sl_no) => {
                    console.log("login page")

                    res.render('home/login', {
                        err: null
                    })

                })
                .catch(err => {
                    console.log("redirected to register page")
                    if (req.body.type === "NGO") {
                        console.log("ngo")
                        res.render('Home/ngoRegistration', {
                            err: err
                        })
                    }
                })
        })
    }
})

module.exports = router;
