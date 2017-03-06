'use strict';

var express = require('express');
var router = express.Router();
var dbm = require('./dbm');

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