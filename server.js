var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');

var passport = require('passport');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');

// ==================================
// APP CONFIG
// ==================================

//set view engine to ejs
app.set('view engine', 'ejs');
//set public directory for assets
app.use(express.static('public'));
//use bodyParser to get values from forms
app.use(bodyParser.urlencoded({extended: true}));
//use method-override to update form methods
app.use(methodOverride("_method"));
//use moment.js for date handling via app.locals
app.locals.moment = require('moment');
//log requests to the console
app.use(morgan('dev'));


// ====================================
// AUTHENTICATION CONFIG
// ====================================

//require passport config
require('./config/passport')(passport);
// required for passport
app.use(session({
                  secret: 'thisisthesessionsecrettoserialiseuserdetailsfornewsletter',
                  saveUninitialized: true,
                  resave: true
                })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// ====================================
// DB SETUP
// ====================================
var dburl = process.env.DATABASEURL || 'mongodb://localhost/newsletter_app';
//Set up Mongoose
mongoose.connect(dburl);

// =========================================
// ROUTES SETUP
// =========================================

//Import routes
require('./routes.js')(app, passport);

// =========================================
// SET PORT AND RUN SERVER
// =========================================

var port = process.env.PORT || 8080;
app.listen(port);
console.log("Looks like we're cooking on port " + port);
