var express = require('express');
var router = express.Router();
const {isUserLoggedIn} = require('../isUserLoggedIn');
const database = require('../Database/database')

/* GET users listing. */
router.get('/',isUserLoggedIn,async function(req, res, next) {
    let type = "Sponsor"
    // let users = await database.getAllUsers(type)
    // console.log("Users -> ", users)
    // == Fetch Store ==
    let sponsors = await database.getAllSponsors()
    console.log("Sponsors -> ", sponsors)
    let sponsorsFor = await database.getAllSponsorsFor()
    console.log("Sponsors -> ", sponsors)

    res.render('Admin/sponsorList',{
        sponsors :sponsors,
        sponsorsFor : sponsorsFor
    })
});

module.exports = router;