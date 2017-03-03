/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();

router.get('/greeting', function (req, res) {
	var qs = req.query;
	res.json({greeting: 'Hello ' + qs.name + '!'});
	res.end();
});

module.exports = router;

/*ule.exports = function (app) {
	app.use(bodyParser.json());
	
	app.get('/greeting', function (req, res) {
		var qs = req.query;
		res.json({greeting: 'Hello ' + qs.name + '!'});
		res.end();
	});
};*/