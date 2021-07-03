let express = require('express');
const database = require("../Database/database");
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Home/login',{
        err: ''
    });
});

router.post('/', (req, res, next) => {
    let {
        uid,
        password
    } = req.body
    console.log(`uid=>${uid}, password->${password}`)
    if(!uid || !password){
        return res.status(400).render('Home/login',{
            err:"Please provide uid and password!!"
        })
    }

    database.loginUser(uid, password)
        .then((user) => {
            console.log("simply");
            req.session.isUserLoggedIn = true;
            req.session.user = user;
            if(user.type === "Sponsor"){
                console.log("type = Sponsor")
                res.redirect('/S-home')
            }else if(user.type === "Volunteer") {
                console.log("type = volunteer")
                res.redirect('/V-home')
            }else if (user.type === "Admin"){
                console.log("admin")
                res.redirect('/admin-ngoList')
            }else{
                console.log("ngo");
                res.redirect('/N-home')
            }
        })
        .catch(err => {
            console.log("err", err);
            res.render('home/login', {
                err: err
            })
        }) // Render Login Page
  //  https://www.js-tutorials.com/nodejs-tutorial/node-js-user-authentication-using-mysql-express-js/
})
module.exports = router;
