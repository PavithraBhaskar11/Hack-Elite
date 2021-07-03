const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const database = require('./Database/database');
const session = require('express-session');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config({path:"/.env"})

const {
  isUserLoggedIn
} = require('./isUserLoggedIn');

let indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let sponsorRegistrationRouter = require('./routes/sponsorRegistration');
let volunteerRegistrationRouter = require('./routes/volunteerRegistration');
let ngoRegistrationRouter = require('./routes/ngoRegisteration');
let sponsorHomepageRouter = require('./routes/sponsorHomepage');
let sponsorProfileRouter = require('./routes/sponsorProfile');
let volunteerHomepageRouter = require('./routes/volunteerHomepage');
let volunteerProfileRouter = require('./routes/volunteerProfile');
let ngoListRouter = require('./routes/ngoList');
let logoutRouter = require('./routes/logout');
let adminNgoRouter = require('./routes/adminNgoList');
let adminSponsorRouter = require('./routes/adminSponsorList');
let adminVolunteerRouter = require('./routes/adminVolunteerList');
let ngoHomepageRouter = require('./routes/ngoHomepage');
let ngoVolunteerRouter = require('./routes/ngoVolunteerList');
let ngoSponsorRouter = require('./routes/ngoSponsorList');
let testformRouter = require('./routes/testform');
let ngoBranch = require('./routes/ngoBranch');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'NGO',
  secret: "Secret",
  resave: false,
  saveUninitialized: false,
}));

app.use('/testform',testformRouter);
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/spo_Register',sponsorRegistrationRouter);
app.use('/vol_Register',volunteerRegistrationRouter);
app.use('/S-home',sponsorHomepageRouter);
app.use('/V-home',volunteerHomepageRouter);
app.use('/S-profile',sponsorProfileRouter);
app.use('/V-profile',volunteerProfileRouter);
app.use('/ngoList',ngoListRouter);
app.use('/logout',logoutRouter);
app.use('/admin-ngoList',adminNgoRouter);
app.use('/admin-sponsorList',adminSponsorRouter);
app.use('/admin-volunteerList',adminVolunteerRouter);
app.use('/ngoRegistration',ngoRegistrationRouter);
app.use('/N-home',ngoHomepageRouter);
app.use('/N-sponsor',ngoSponsorRouter);
app.use('/N-volunteer',ngoVolunteerRouter);
app.use('/N-addBranch',ngoBranch);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// app.listen(3000,function(){
// console.log("server 3000");
// });
