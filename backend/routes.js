'use strict';

var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
var dbm = require('./dbm');
var sessions = {};

function isAuthenticated (name, sessionID) {
	if (name === 'Guest' || sessions[sessionID] === name) {
		return true;
	} else {
		return false;
	}
}

function loginSuccess (req, res) {
	sessions[req.sessionID] = req.body.name;
	res.json({success: true, name: req.body.name});
	res.end();
}

router.post('/login', function (req, res) {
	dbm.getUser(req.body.name).then(function (user) {
		if (user === null) {
			res.json({success: false});
			res.end();
		} else if(user.hash === '' && req.body.password === '') {
			loginSuccess(req, res);
		} else {
			bcrypt.compare(req.body.password, user.hash, function (err, success) {
				if(success) {
					loginSuccess(req, res);
				} else {
					res.json({success: false});
					res.end();
				}
			});
		}
	});
});

router.post('/update-recipe', function (req, res) {
	if(isAuthenticated(req.body.name, req.sessionID)) {
		//TODO: do the actual update.
		res.json({success: true});
	} else {
		res.json({success: false});
	}
});

router.get('/usernames', function (req, res) {
	dbm.getUsernames().then(function (list) {
		res.json(list);
		res.end();
	});
});

router.get('/recipes', function (req, res) {
	dbm.getRecipes().then(function (list) {
		res.json(list);
		res.end();
	});
});

router.get('/recipe/:id', function (req, res) {
	dbm.getRecipe(req.params.id).then(function (recipe) {
		res.json(recipe);
		res.end();
	});
});

router.get('/comments/:id', function (req, res) {
	dbm.getComments(req.params.id).then(function (list) {
		res.json(list);
		res.end();
	});
});

module.exports = router;