var express = require('express');
var router = express.Router();

// Login Main Page
router.get('/', function(req, res) {
	res.render('login');
});

// Register
router.get('/register', function(req, res) {
	res.render('register');
});


module.exports = router;