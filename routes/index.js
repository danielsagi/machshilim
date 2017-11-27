var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Login Main Page
router.get('/', function(req, res) {
	res.redirect('/login');
});


router.get('/login', function(req, res) {
	res.render('login');
});

// Register
router.get('/register', function(req, res) {
	res.render('register');
});

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

router.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var password_v = req.body.password_verify;
	var edu_name = req.body.edu_name;

	req.checkBody('username', 'שם משתמש ריק').notEmpty();
	req.checkBody('password', 'סיסמא ריקה').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('login', {errors: errors});
	}
	else {

	}
});




module.exports = router;