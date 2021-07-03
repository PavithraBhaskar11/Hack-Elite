var express = require('express');
var router = express.Router();
const database = require('../Database/database')
const {isUserLoggedIn} = require('../isUserLoggedIn');

/* GET users listing. */
router.get('/',isUserLoggedIn, async function (req, res, next) {
let type = "Volunteer"
    // let users = await database.getAllUsers(type)
    // console.log("Users -> ", users)
    // == Featch Store ==
    let volunteers = await database.getAllVolunteers()
    console.log("Volunteers -> ", volunteers)
    let volunteersFor = await database.getAllVolunteersFor()
    console.log("Volunteers for -> ", volunteersFor)

    res.render('Admin/volunteerList',{
        volunteers : volunteers,
        volunteersFor : volunteersFor
    })
});

module.exports = router;
