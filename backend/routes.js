'use strict';

var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
var dbm = require('./dbm');
var sessions = {};
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');


/**
 * Checks if the session with the specified ID is authenticated as the user with the provided name.
 * @return A boolean stating if the authentication is valid.
 */
function isAuthenticated (name, sessionID) {
	if (name === 'Guest' || sessions[sessionID] === name) {
		return true;
	} else {
		return false;
	}
}

/**
 * A function that should be called upon successful login.
 * Adds the user to the list of authenticated users and sends a confirmation to the authenticatee.
 */
function loginSuccess (req, res) {
	sessions[req.sessionID] = req.body.name;
	res.json({success: true, name: req.body.name});
	res.end();
}

/**
 * Used to perform a login attempt.
 */
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

/**
 * Used to perform an image upload.
 */
router.post('/upload', multipartMiddleware, function (req, res) {
	var path = req.files.file.path;
	var fileName = path.substring(5);
	fs.createReadStream(path).pipe(fs.createWriteStream('./images/'+fileName));
	res.json({image: fileName});
	res.end();
});

/**
 * Used to update a recipe.
 * The function will make sure the requester is authorized to perform the action.
 */
router.post('/update-recipe', function (req, res) {
	if(isAuthenticated(req.body.user, req.sessionID)) {
		dbm.getRecipe(req.body.id).then( function (recipe) {
			dbm.getUserFromId(recipe.authorId).then(function (user) {
				if(user.name === req.body.user) {
					dbm.updateRecipe(req.body.id, req.body.name, req.body.image, req.body.freetext, req.body.tags, req.body.deleteImage).then(
						function () {
							res.json({success: true});
							res.end();
						}
					);
				} else {
					res.json({success: false});
					res.end();
				}
			});
		});
	} else {
		res.json({success: false});
		res.end();
	}
});

/**
 * Used to create a new recipe.
 * The function will make sure the requester is authorized to perform the action.
 */
router.post('/new-recipe', function (req, res) {
	if(isAuthenticated(req.body.username, req.sessionID)) {
		dbm.getUser(req.body.username).then( function (user) {
			dbm.addRecipe(user.id, req.body.name, null, '', []).then( function (recipe) {
				res.json({success: true, id: recipe.id});
				res.end();
			});
		});
	} else {
		res.json({success: false});
		res.end();
	}
});

/**
 * Used to create a new comment.
 * The function will make sure the requester is authorized to perform the action.
 */
router.post('/new-comment', function (req, res) {
	if(isAuthenticated(req.body.username, req.sessionID)) {
		dbm.getUser(req.body.username).then( function (user) {
			dbm.addComment(req.body.recipeId, user.id, req.body.freetext).then( function (comment) {
				res.json({success: true, comment: comment});
				res.end();
			});
		});
	} else {
		res.json({success: false});
		res.end();
	}
});

/**
 * Used to retrieve a list of all users on the system.
 */
router.get('/usernames', function (req, res) {
	dbm.getUsernames().then(function (list) {
		res.json(list);
		res.end();
	});
});

function filterList (list, search) {
	var res = [],
		searchTerms = search.split(" ");
	if(search === '') { //If nothing was specified, show all recipes.
		return list;
	}
	label:
	for(var counter = 0; counter < list.length; counter++) {
		for(var innerCounter = 0; innerCounter < searchTerms.length; innerCounter++) {
			if(list[counter].tags.indexOf(searchTerms[innerCounter].toLowerCase()) !== -1 || list[counter].name.toLowerCase().includes(searchTerms[innerCounter].toLowerCase())) {
				res.push(list[counter]);
				continue label;
			}
		}
	}
	return res;
}

router.get('/recipes', function (req, res) {
	dbm.getRecipes().then(function (list) {
		res.json(filterList(list, req.query.search));
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