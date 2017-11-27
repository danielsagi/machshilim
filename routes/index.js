var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var router = express.Router();

var User = require('../models/user');

// Passport
passport.use(new LocalStrategy( function(username, password, done) {
  	User.getUserByUsername(username, function(err, user) {
  		if (err) throw err;
  		if (!user) 
  			return done(null, false, {message: 'המכשיל לא זוהה'});


  		User.comparePassword(password, user.password, function(err, isMatch) {
			if (err) throw err;
	  		if (isMatch) {
	  			return done(null, user);
	  		} else {
	  			return done(null, false, {message: 'המכשיל לא זוהה'});
	  		}
  		});
  	});
}));
// Cookies
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.getUserByID(id, function(err, user) {
    done(err, user);
  });
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', "אנא התחבר");
		res.redirect('/login');
	}
}

//---------GET-------------

// Login Is The Main Page
router.get('/', function(req, res) {
	res.redirect('/login');
});
// login page
router.get('/login', function(req, res) {
	res.render('login');
});
// Register page
router.get('/register', function(req, res) {
	res.render('register');
});
router.get('/profile', ensureAuthenticated, function(req, res) {
	res.render('profile', {layout: 'profile'});
});
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success_msg', "התנתקת מהמערכת בהצלחה");
	res.redirect('/login');
});

//---------POST-------------
router.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var password_v = req.body.password_verify;
	var edu_name = req.body.edu_name;

	req.checkBody('username', 'שם משתמש ריק').notEmpty();
	req.checkBody('password', 'סיסמא ריקה').notEmpty();
	req.checkBody('password_verify', 'הסיסמאות אינן תואמות').equals(req.body.password);
	req.checkBody('edu_name', 'שם באדיו חסר').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {errors: errors});
	}
	else {
		var newUser = new User({
			username: username,
			password: password,
			edu_name: edu_name
		});
		User.createUser(newUser, function(err, user) {
			if (err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'נרשמת למכשילים בהצלחה! אנא התחבר');
		res.redirect('/login');
	}
});

// Authenticate login
router.post('/login', passport.authenticate('local', {successRedirect:'/profile', failureRedirect:'/login', failureFlash: true}), 
	function(req, res) {
    	res.redirect('/profile');
});


module.exports = router;