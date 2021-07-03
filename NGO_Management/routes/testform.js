var express = require('express');
const bcrypt = require('bcrypt');
const database = require("../Database/database");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Home/testform',{
        err :" "
    });
});

router.post('/',(req, res) => {

    let b = [
        {
            name : customElements,
            id : '1',
            catogory : [{
                catogory : "Education"
            }, {
                catogory : "Sprots"
            }, {
                catogory : 'Sometyhinf'
            }]
        },
        {
            name : "asis",
            id : '2',
            catogory : [{
                catogory : "Education"
            }, {
                catogory : "Sprots"
            }, {
                catogory : 'Sometyhinf'
            }]
        },
        {
            name : "sdfbsd",
            id : '3',
            catogory : [{
                catogory : "Education"
            }, {
                catogory : "Sprots"
            }, {
                catogory : 'Sometyhinf'
            }]
        }
    ]

    b.forEach(e =>{
        e.catogory = getAllcategory(e.id)

        e.catogory.forEach(e =>{
            e.catogory.catogory
        })
    })

})



module.exports = router;
