module.exports.isUserLoggedIn = (req, res, next) => {
    console.log("Req.session.isUserLoggedIn", req.session.isUserLoggedIn)
    if (req.session.isUserLoggedIn === undefined) {
        console.log("user undefined")
        res.redirect('/login');
        return
    }
    if (req.session.isUserLoggedIn === true) {
        next()
    }
}