const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');



const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const mentorListRouter = require('./routes/mentorList');
const mentorMIList = require('./routes/mentorMI-List');
const mentorProfileRouter = require('./routes/mentorProfile');
const mentorRegistrationRouter =require('./routes/mentorRegistration');
const miFormRouter = require('./routes/miForm');
const registerRouter = require('./routes/register');
const studentListRouter = require('./routes/studentList');
const studentMIListRouter = require('./routes/studentMI-List');
const studentProfileRouter = require('./routes/studentProfile');
const studentRegistrationRouter = require('./routes/studentRegistration');
const studentTrainingSessionListRouter = require('./routes/studentTrainingSessionList');
const trainingListRouter = require('./routes/trainingList');
const trainingRegistrationRouter = require('./routes/trainingRegistration');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login',loginRouter);
app.use('/Admin-MentorList',mentorListRouter);
app.use('/Mentor-MiList',mentorMIList);
app.use('/Mentor-Profile',mentorProfileRouter);
app.use('/mentorRegistration',mentorRegistrationRouter);
app.use('/Student-miForm',miFormRouter);
app.use('/register',registerRouter);
app.use('/Admin-studentList',studentListRouter);
app.use('/Student-miList',studentMIListRouter);
app.use('/Student-Profile',studentProfileRouter);
app.use('/studentRegistration',studentRegistrationRouter);
app.use('/Student-TrainingList',studentTrainingSessionListRouter);
app.use('/Admin-trainingList',trainingListRouter);
app.use('/Admin-trainingRegistration',trainingRegistrationRouter);

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
